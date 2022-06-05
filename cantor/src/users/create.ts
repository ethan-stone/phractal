import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { EmptyObject } from "../types";
import { createLogger } from "../utils/logger";
import {
  ErrorCode,
  errorResponse,
  InternalErrorData,
  StatusCode,
  successResponse,
  ValidationErrorData
} from "../utils/responses";
import {
  ajv,
  JSONSchemaType,
  DefinedError,
  handleValidationError
} from "../utils/validator";

const logger = createLogger({
  service: "notes",
  functionName: "create"
});

const prisma = new PrismaClient();

type RequestBody = {
  id: string;
  email: string;
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    id: { type: "string" },
    email: { type: "string" }
  },
  required: ["id", "email"]
};

const validate = ajv.compile(schema);

type Event = APIGatewayProxyEventV2WithLambdaAuthorizer<Record<string, never>>;

export async function main(event: Event) {
  try {
    const parsedBody = JSON.parse(event.body || "");

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

    const { id, email } = parsedBody as RequestBody;

    await prisma.user.create({
      data: {
        id,
        email
      }
    });

    logger.info(`User with id ${id} created`);

    return successResponse<EmptyObject>({
      statusCode: StatusCode.Success,
      successData: {}
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
