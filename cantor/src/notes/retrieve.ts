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
  successResponse,
  ValidationErrorData
} from "../utils/responses";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims, Note } from "../types";
import {
  ajv,
  DefinedError,
  handleValidationError,
  JSONSchemaType
} from "../utils/validator";

const logger = createLogger({
  service: "notes",
  functionName: "retrieve"
});

const prisma = new PrismaClient();

type QueryStringParams = {
  withTags?: "true" | "false";
  withContent?: "true" | "false";
};

const schema: JSONSchemaType<QueryStringParams> = {
  type: "object",
  properties: {
    withTags: { type: "string", enum: ["true", "false"], nullable: true },
    withContent: { type: "string", enum: ["true", "false"], nullable: true }
  }
};

const validate = ajv.compile(schema);

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
    const queryStringParams = event.queryStringParameters || {};

    if (!validate(queryStringParams)) {
      logger.error(validate.errors);
      const validationErrorData = handleValidationError(
        validate.errors as DefinedError[]
      );
      return errorResponse<ValidationErrorData>({
        statusCode: StatusCode.BadRequest,
        errorData: validationErrorData
      });
    }

    const { withTags, withContent } = queryStringParams as QueryStringParams;

    const note = await prisma.note.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        visibility: true,
        content: withContent === "true",
        NoteTagJunction:
          withTags === "true"
            ? {
                select: {
                  tag: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            : false,
        createdAt: true,
        updatedAt: true
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
