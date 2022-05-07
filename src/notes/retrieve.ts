import { PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCode,
  errorResponse,
  InternalErrorData,
  NotFoundData,
  StatusCode,
  successResponse
} from "../utils/responses";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims, Note } from "../types";

const logger = createLogger({
  service: "notes",
  functionName: "retrieve"
});

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
      return errorResponse<NotFoundData>({
        statusCode: StatusCode.NotFound,
        errorData: {
          code: ErrorCode.NotFound,
          message: `Note with id=${id} not found`
        }
      });

    logger.info(`Note ${note.id} retrieved for user ${userId}`);

    return successResponse<{ note: Note }>({
      statusCode: StatusCode.Success,
      successData: {
        note
      }
    });
  } catch (e: unknown) {
    logger.error(e);

    return errorResponse<InternalErrorData>({
      statusCode: StatusCode.InternalError,
      errorData: {
        code: ErrorCode.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
