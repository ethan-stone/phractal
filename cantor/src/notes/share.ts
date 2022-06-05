import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { AuthorizerClaims, EmptyObject, Visibility, Role } from "../types";
import {
  successResponse,
  errorResponse,
  StatusCode,
  NotFoundData,
  ErrorCode,
  ForbiddenData,
  ValidationErrorData,
  InternalErrorData
} from "../utils/responses";
import { PrismaClient } from "@prisma/client";
import {
  ajv,
  DefinedError,
  handleValidationError,
  JSONSchemaType
} from "../utils/validator";
import { createLogger } from "../utils/logger";

const prisma = new PrismaClient();

type RequestBody = {
  email: string;
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    email: { type: "string" }
  },
  required: ["email"]
};

const validate = ajv.compile(schema);

const logger = createLogger({
  service: "notes",
  functionName: "share"
});
interface Event extends APIGatewayProxyEventV2WithJWTAuthorizer {
  pathParameters: {
    id: string;
  };
}

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const { sub: userId } = claims;
  const { id: noteId } = event.pathParameters;

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

    const { email } = parsedBody;

    const note = await prisma.note.findUnique({
      where: {
        id: noteId
      }
    });

    if (!note) {
      return errorResponse<NotFoundData>({
        statusCode: StatusCode.NotFound,
        errorData: {
          code: ErrorCode.NotFound,
          message: `Note with id=${noteId} not found`
        }
      });
    }

    const permission = await prisma.permission.findUnique({
      where: {
        userId_noteId: {
          userId,
          noteId
        }
      }
    });

    if (note.visibility === Visibility.PRIVATE) {
      if (!permission) {
        return errorResponse<NotFoundData>({
          statusCode: StatusCode.NotFound,
          errorData: {
            code: ErrorCode.NotFound,
            message: `Note with id=${noteId} not found`
          }
        });
      }
      if (permission.role !== Role.ADMIN) {
        return errorResponse<ForbiddenData>({
          statusCode: StatusCode.Forbidden,
          errorData: {
            code: ErrorCode.Forbidden,
            message: "Not allowed to edit this resource"
          }
        });
      }
    } else {
      if (!permission || permission.role !== Role.ADMIN) {
        return errorResponse<ForbiddenData>({
          statusCode: StatusCode.Forbidden,
          errorData: {
            code: ErrorCode.Forbidden,
            message: "Not allowed to edit this resource"
          }
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return successResponse<EmptyObject>({
        statusCode: StatusCode.Success,
        successData: {}
      });
    }

    await prisma.permission.create({
      data: {
        noteId,
        userId: user.id,
        role: Role.VIEWER
      }
    });

    return successResponse<EmptyObject>({
      statusCode: StatusCode.Success,
      successData: {}
    });
  } catch (error) {
    return errorResponse<InternalErrorData>({
      statusCode: StatusCode.InternalError,
      errorData: {
        code: ErrorCode.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
