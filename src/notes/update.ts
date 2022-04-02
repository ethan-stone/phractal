import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCode,
  errorResponse,
  InternalErrorData,
  NotFoundErrorData,
  StatusCode,
  successResponse,
  ValidationErrorData
} from "../utils/responses";
import { PrismaClient, Prisma } from "@prisma/client";
import { createLogger } from "../utils/logger";
import { EmptyObject, Visibility } from "../types";
import {
  ajv,
  DefinedError,
  handleValidationError,
  JSONSchemaType
} from "../utils/validator";

type PathParameters = {
  id: string;
};

type RequestBody = {
  name?: string;
  description?: string;
  content?: string;
  visibility?: Visibility;
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    name: { type: "string", nullable: true },
    description: { type: "string", nullable: true },
    content: { type: "string", nullable: true },
    visibility: {
      type: "string",
      enum: ["PUBLIC", "PRIVATE"],
      nullable: true
    }
  }
};

const validate = ajv.compile(schema);

const logger = createLogger({
  service: "notes",
  functionName: "update"
});

const prisma = new PrismaClient();

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const { id } = event.pathParameters as PathParameters;

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

    const updates = parsedBody as RequestBody;

    const note = await prisma.note.update({
      where: {
        id
      },
      data: {
        name: updates.name,
        description: updates.description,
        content: updates.content,
        visibility: updates.visibility
      }
    });

    /**
     * Rather than logging the entire content if content was updated
     * we log whether or not the content was updated
     */
    logger.info(
      `Note ${note.id} updated with updates ${JSON.stringify({
        ...updates,
        content: updates.content ? true : false
      })}`
    );

    return successResponse<EmptyObject>({
      statusCode: StatusCode.Success,
      successData: {}
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse<NotFoundErrorData>({
          statusCode: StatusCode.NotFound,
          errorData: {
            code: ErrorCode.NotFoundError,
            message: `Note with id=${id} not found`
          }
        });
      }
    }
    return errorResponse<InternalErrorData>({
      statusCode: StatusCode.InternalError,
      errorData: {
        code: ErrorCode.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
