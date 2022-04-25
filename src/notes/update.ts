import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCode,
  errorResponse,
  ForbiddenData,
  InternalErrorData,
  NotFoundData,
  StatusCode,
  successResponse,
  ValidationErrorData
} from "../utils/responses";
import { PrismaClient, Prisma } from "@prisma/client";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims, EmptyObject, Visibility, Role } from "../types";
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

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const { id } = event.pathParameters as PathParameters;
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

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

    const note = await prisma.note.findUnique({
      where: {
        id
      }
    });

    if (!note) {
      return errorResponse<NotFoundData>({
        statusCode: StatusCode.NotFound,
        errorData: {
          code: ErrorCode.NotFound,
          message: `Note with id=${id} not found`
        }
      });
    }

    const permission = await prisma.permission.findUnique({
      where: {
        userId_noteId: {
          userId: userId,
          noteId: id
        }
      }
    });

    if (note.visibility === Visibility.PRIVATE) {
      if (!permission) {
        return errorResponse<NotFoundData>({
          statusCode: StatusCode.NotFound,
          errorData: {
            code: ErrorCode.NotFound,
            message: `Note with id=${id} not found`
          }
        });
      }
      if (permission.role !== Role.ADMIN && permission.role !== Role.EDITOR) {
        return errorResponse<ForbiddenData>({
          statusCode: StatusCode.Forbidden,
          errorData: {
            code: ErrorCode.Forbidden,
            message: "Not allowed to edit this resource"
          }
        });
      }
    } else {
      if (
        !permission ||
        (permission.role !== Role.ADMIN && permission.role !== Role.EDITOR)
      ) {
        return errorResponse<ForbiddenData>({
          statusCode: StatusCode.Forbidden,
          errorData: {
            code: ErrorCode.Forbidden,
            message: "Not allowed to edit this resource"
          }
        });
      }
    }

    await prisma.note.update({
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
        return errorResponse<NotFoundData>({
          statusCode: StatusCode.NotFound,
          errorData: {
            code: ErrorCode.NotFound,
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
