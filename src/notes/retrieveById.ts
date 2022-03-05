import { Prisma, PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { response, StatusCode } from "../utils/responses";
import pino from "pino";
import { Readable } from "stream";
import { Logger } from "../utils/logger";
import { AuthorizerClaims } from "../types";

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

type PathParameters = {
  id: string;
};

async function getObject(Key: string): Promise<string> {
  const getObjectCommand = new GetObjectCommand({
    Key,
    Bucket: process.env.NOTES_BUCKET_NAME
  });

  const noteObject = await s3.send(getObjectCommand);

  return new Promise((resolve, reject) => {
    const responseDataChunks: string[] = [];

    const noteBody = noteObject.Body as Readable;

    noteBody.once("error", (err) => reject(err));

    noteBody.on("data", (chunk) => responseDataChunks.push(chunk));

    noteBody.once("end", () => resolve(responseDataChunks.join("")));
  });
}

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  const { id } = event.pathParameters as PathParameters;

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

    const noteContent = await getObject(`${userId}/${note.id}.md`);

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
