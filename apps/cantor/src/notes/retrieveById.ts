import { Prisma, PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { response, StatusCode } from "../utils/responses";
import pino from "pino";
import { Logger } from "../utils/logger";
import { AuthorizerClaims } from "../types";
import { getObject } from "../utils/s3";

const logger = new Logger(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  }),
  {
    service: "notes",
    functionName: "retrieveById"
  }
);

const s3 = new S3Client({ region: "us-east-1" });

const prisma = new PrismaClient();

interface Event extends APIGatewayProxyEventV2WithJWTAuthorizer {
  pathParameters: {
    id: string;
  };
}

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  const { id } = event.pathParameters;

  try {
    const note = await prisma.note.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true
      }
    });

    if (!note)
      return response({
        statusCode: StatusCode.NotFound,
        body: {}
      });

    const noteContent = await getObject(
      s3,
      new GetObjectCommand({
        Key: `${userId}/${note.id}.md`,
        Bucket: process.env.NOTES_BUCKET_NAME
      })
    );

    logger.info(`Note ${note.id} retrieved for user ${userId}`);

    return response({
      statusCode: StatusCode.Success,
      body: {
        data: {
          note: {
            content: noteContent,
            ...note
          }
        }
      }
    });
  } catch (e: unknown) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
