import { SQSEvent } from "aws-lambda";
import { ProcessMeal } from "../queues/ProcessMeal";

export async function handler(event: SQSEvent) {
  console.log(JSON.stringify(event, null, 2));

  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const body = JSON.parse(record.body);
        await ProcessMeal.process(body);
      })
    );
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
}
