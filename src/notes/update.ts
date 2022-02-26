import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { response, StatusCode } from "../utils/responses";
import Joi from "joi";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";

type PathParameters = {
  id: string;
};

type RequestBody = {
  name?: string;
  description?: string;
  content?: string;
};

const bodySchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  content: Joi.string()
});

const prisma = new PrismaClient();

const s3 = new S3Client({ region: "us-east-1" });

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const userId = event.requestContext.authorizer.jwt.claims[
    "cognito:username"
  ] as string;

  const { id } = event.pathParameters as PathParameters;

  try {
    const parsedBody = JSON.parse(event.body || "");

    await bodySchema.validateAsync(parsedBody);

    const updates = parsedBody as RequestBody;

    /**
     * this will reject if no Note record is found
     * doing this before updating the s3 object prevents
     * creating an object for a Note that doesn't exist
     */
    const note = await prisma.note.update({
      where: {
        id
      },
      data: {
        name: updates.name,
        description: updates.description
      }
    });

    if (updates.content) {
      const putObjectCommand = new PutObjectCommand({
        Key: `${userId}/${note.id}.md`,
        Body: updates.content,
        Bucket: process.env.NOTES_BUCKET_NAME
      });

      await s3.send(putObjectCommand);
    }

    return response({
      statusCode: StatusCode.Success,
      body: {}
    });
  } catch (e) {
    console.log(e);
    return response({
      statusCode: StatusCode.InternalError,
      body: {}
    });
  }
}
