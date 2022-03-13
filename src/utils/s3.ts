import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function getObject(
  s3: S3Client,
  getObjectCommand: GetObjectCommand
): Promise<string> {
  const obj = await s3.send(getObjectCommand);

  return new Promise((resolve, reject) => {
    const responseDataChunks: string[] = [];

    const body = obj.Body as Readable;

    body.once("error", (err) => reject(err));

    body.on("data", (chunk) => responseDataChunks.push(chunk));

    body.once("end", () => resolve(responseDataChunks.join("")));
  });
}
