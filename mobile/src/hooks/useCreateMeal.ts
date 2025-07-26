import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../services/httpClient";

import * as FileSystem from "expo-file-system";
import { router } from "expo-router";

type CreateMealResponse = {
  uploadURL: string;
  mealId: string;
};

type CreateMealParams = {
  fileType: "image/jpeg" | "audio/m4a";
  onSuccess(mealId: string): void;
};

export function useCreateMeal({ fileType, onSuccess }: CreateMealParams) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (uri: string) => {
      const { data } = await httpClient.post<CreateMealResponse>("/meals", {
        fileType,
      });

      await FileSystem.uploadAsync(data.uploadURL, uri, {
        httpMethod: "PUT",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      return { mealId: data.mealId };
    },
    onSuccess: ({ mealId }) => {
      onSuccess(mealId);
    },
  });
  return {
    createMeal: mutateAsync,
    isLoading: isPending,
  };
}
