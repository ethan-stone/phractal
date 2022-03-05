import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { response, StatusCode } from "../utils/responses";
import Joi, { ValidationError } from "joi";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Prisma, PrismaClient } from "@prisma/client";
import pino from "pino";
import { Logger } from "../utils/logger";
import { AuthorizerClaims } from "../types";

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

const logger = new Logger(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  }),
  {
    service: "notes",
    functionName: "update"
  }
);

const prisma = new PrismaClient();

const s3 = new S3Client({ region: "us-east-1" });

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

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

    /**
     * Rather than logging the entire content if content was updated
     * we log whether or not the content was updated
     */
    logger.info(
      `Note ${note.id} updated with updates ${JSON.stringify({
        ...updates,
        content: updates.content ? true : false
      })}`
    );

    return response({
      statusCode: StatusCode.Success,
      body: {}
    });
  } catch (e) {
    logger.error(e);
    if (
      e instanceof ValidationError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          error: {
            message: "Improper request parameters"
          }
        }
      });
    } else {
      return response({
        statusCode: StatusCode.InternalError,
        body: {
          error: {
            message: "Something went wrong"
          }
        }
      });
    }
  }
}
