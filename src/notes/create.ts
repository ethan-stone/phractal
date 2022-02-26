import { PrismaClient, Prisma } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import Joi, { ValidationError } from "joi";
import { response, StatusCode } from "../utils/responses";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

const prisma = new PrismaClient();

type RequestBody = {
  name: string;
  description?: string;
};

const bodySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string()
}).required();

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const userId = event.requestContext.authorizer.jwt.claims[
    "cognito:username"
  ] as string;

  try {
    const parsedBody = JSON.parse(event.body || "");

    await bodySchema.validateAsync(parsedBody);

    const { name, description } = parsedBody as RequestBody;

    const newNote = await prisma.note.create({
      data: {
        name,
        description,
        ownerId: userId as string
      }
    });

    const putObjectCommand = new PutObjectCommand({
      Key: `${userId}/${newNote.id}.md`,
      Body: "# Hello World",
      Bucket: process.env.NOTES_BUCKET_NAME
    });

    await s3.send(putObjectCommand);

    return response({
      statusCode: StatusCode.Success,
      body: {
        data: {
          id: newNote.id
        }
      }
    });
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          message: e.message
        }
      });
    } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          message: e.message
        }
      });
    } else if (e instanceof Error) {
      return response({
        statusCode: StatusCode.InternalError,
        body: {
          message: e.message
        }
      });
    } else {
      return response({
        statusCode: StatusCode.InternalError,
        body: {}
      });
    }
  }
}
