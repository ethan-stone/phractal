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

type RequestBody = {
  skip?: number;
  take?: number;
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    skip: { type: "number", nullable: true },
    take: { type: "number", nullable: true }
  }
};

const validate = ajv.compile(schema);

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    if (!validate(parsedBody)) {
      logger.error(validate.errors);
      const validationErrorData = handleValidationError(
        validate.errors as DefinedError[]
      );
      return errorResponse<ValidationErrorData>({
        statusCode: StatusCode.BadRequest,
        errorData: validationErrorData
      });
    }

    const { skip, take } = parsedBody;

    const notes = await prisma.note.findMany({
      where: {
        permissions: {
          some: {
            userId
          }
        }
      },
      skip: skip || 0,
      take: take || 50
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
