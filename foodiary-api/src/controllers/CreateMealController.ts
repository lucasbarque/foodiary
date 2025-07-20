import { randomUUID } from "crypto";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { badRequest, created } from "../utils/http";
import z from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../clients/s3Client";

const schema = z.object({
  fileType: z.enum(["audio/m4a", "image/jpeg"]),
});

export class CreateMealController {
  static async handle({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }
    const fileId = randomUUID();
    const ext = data.fileType === "audio/m4a" ? ".m4a" : ".jpg";
    const fileKey = `${fileId}${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    });

    const [meal] = await db
      .insert(mealsTable)
      .values({
        icon: "",
        inputFileKey: fileKey,
        inputType: data.fileType === "audio/m4a" ? "audio" : "picture",
        name: "",
        status: "uploading",
        userId,
        foods: [],
      })
      .returning({ id: mealsTable.id });

    return created({ mealId: meal.id, uploadURL: presignedUrl });
  }
}
