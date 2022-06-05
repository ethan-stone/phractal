import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { AuthorizerClaims, EmptyObject } from "../types";
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
import { PrismaClient } from "@prisma/client";
import { createLogger } from "../utils/logger";
import {
  ajv,
  JSONSchemaType,
  DefinedError,
  handleValidationError
} from "../utils/validator";
import { PermissionChecker } from "../lib/permissionChecker";

const logger = createLogger({
  service: "notes",
  functionName: "addTag"
});

const prisma = new PrismaClient();

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

interface Event extends APIGatewayProxyEventV2WithJWTAuthorizer {
  pathParameters: {
    id: string;
  };
}

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
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

    const { name } = parsedBody as RequestBody;

    const { id: noteId } = event.pathParameters;

    const note = await prisma.note.findUnique({
      where: {
        id: noteId
      }
    });

    if (!note) {
      console.log("note not found");
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
          userId: userId,
          noteId: noteId
        }
      }
    });

    const permissionChecker = new PermissionChecker(note, permission);
    const permissionResult = permissionChecker.checkPermission();

    if (!permissionResult.canView)
      return errorResponse<NotFoundData>({
        statusCode: StatusCode.NotFound,
        errorData: {
          code: ErrorCode.NotFound,
          message: `Note with id=${noteId} not found`
        }
      });

    if (!permissionResult.canEdit)
      return errorResponse<ForbiddenData>({
        statusCode: StatusCode.Forbidden,
        errorData: {
          code: ErrorCode.Forbidden,
          message: "Not allowed to edit this resource"
        }
      });

    let tag = await prisma.tag.findUnique({
      where: {
        name
      }
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name
        }
      });
    }

    const noteTagJunction = await prisma.noteTagJunction.create({
      data: {
        noteId,
        tagId: tag.id
      }
    });

    logger.info(
      `Tag ${noteTagJunction.tagId} added to ${noteTagJunction.noteId}`
    );

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
