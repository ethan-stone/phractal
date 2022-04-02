import { PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  ErrorCodes,
  errorResponse,
  InternalErrorData,
  StatusCode,
  successResponse
} from "../utils/responses";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims, EmptyObject, NoteWithContent } from "../types";
import { getObject } from "../utils/s3";

const logger = createLogger({
  service: "notes",
  functionName: "retrieveById"
});

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
      }
    });

    if (!note)
      return errorResponse<EmptyObject>({
        statusCode: StatusCode.NotFound,
        errorData: {}
      });

    const noteContent = await getObject(
      s3,
      new GetObjectCommand({
        Key: `${userId}/${note.id}.md`,
        Bucket: process.env.NOTES_BUCKET_NAME
      })
    );

    logger.info(`Note ${note.id} retrieved for user ${userId}`);

    return successResponse<{ note: NoteWithContent }>({
      statusCode: StatusCode.Success,
      successData: {
        note: {
          content: noteContent,
          ...note
        }
      }
    });
  } catch (e: unknown) {
    logger.error(e);

    return errorResponse<InternalErrorData>({
      statusCode: StatusCode.InternalError,
      errorData: {
        code: ErrorCodes.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
