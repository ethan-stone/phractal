import { PrismaClient } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCode,
  errorResponse,
  InternalErrorData,
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
  skip?: string;
  take?: string;
};

const schema: JSONSchemaType<QueryStringParams> = {
  type: "object",
  properties: {
    withTags: { type: "string", enum: ["true", "false"], nullable: true },
    withContent: { type: "string", enum: ["true", "false"], nullable: true },
    skip: { type: "string", nullable: true, pattern: "^[0-9]+$" },
    take: { type: "string", nullable: true, pattern: "^[0-9]+$" }
  }
};

const validate = ajv.compile(schema);

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

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

    const { skip, take, withTags, withContent } =
      queryStringParams as QueryStringParams;

    const notes = await prisma.note.findMany({
      where: {
        permissions: {
          some: {
            userId
          }
        }
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
      },
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 50
    });

    logger.info(`Notes retrieved for user ${userId}`);

    return successResponse<{
      notes: Note[];
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
        code: ErrorCode.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
