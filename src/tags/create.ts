import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
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
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const logger = createLogger({
  service: "tags",
  functionName: "create"
});

type RequestBody = {
  name: string;
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    name: { type: "string" }
  },
  required: ["name"]
};

const validate = ajv.compile(schema);

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
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

    const { name } = parsedBody as RequestBody;

    const newTag = await prisma.tag.create({ data: { name } });

    logger.info(`New ${newTag.id} created`);

    return successResponse<{ id: string }>({
      statusCode: StatusCode.Success,
      successData: {
        id: newTag.id
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
