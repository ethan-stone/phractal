import { Note, PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCodes,
  errorResponse,
  InternalErrorData,
  StatusCode,
  successResponse
} from "../utils/responses";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims } from "../types";

const logger = createLogger({
  service: "notes",
  functionName: "retrieve"
});

const prisma = new PrismaClient();

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  try {
    const notes = await prisma.note.findMany({
      where: {
        permissions: {
          some: {
            userId
          }
        }
      }
    });

    logger.info(`Notes retrieved for user ${userId}`);

    return successResponse<{
      notes: Array<Note>;
    }>({
      statusCode: StatusCode.Success,
      successData: {
        notes
      }
    });
  } catch (e) {
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
