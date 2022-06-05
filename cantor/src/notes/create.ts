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
import { AuthorizerClaims } from "../types";
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
  name: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string", nullable: true },
    visibility: { type: "string", enum: ["PUBLIC", "PRIVATE"] }
  },
  required: ["name", "visibility"]
};

const validate = ajv.compile(schema);

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

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

    const { name, description, visibility } = parsedBody as RequestBody;

    const newNote = await prisma.note.create({
      data: {
        name,
        description,
        content: "",
        ownerId: userId as string,
        visibility,
        permissions: {
          create: [
            {
              userId: userId,
              role: "ADMIN"
            }
          ]
        }
      }
    });

    logger.info(`Note ${newNote.id} created`);

    return successResponse<{ id: string }>({
      statusCode: StatusCode.Success,
      successData: {
        id: newNote.id
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
