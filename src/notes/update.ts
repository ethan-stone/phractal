import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import {
  ErrorCodes,
  errorResponse,
  InternalErrorData,
  StatusCode,
  successResponse,
  ValidationErrorData
} from "../utils/responses";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { createLogger } from "../utils/logger";
import { AuthorizerClaims, EmptyObject } from "../types";
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
};

const schema: JSONSchemaType<RequestBody> = {
  type: "object",
  properties: {
    name: { type: "string", nullable: true },
    description: { type: "string", nullable: true },
    content: { type: "string", nullable: true }
  }
};

const validate = ajv.compile(schema);

const logger = createLogger({
  service: "notes",
  functionName: "update"
});

const prisma = new PrismaClient();

const s3 = new S3Client({ region: "us-east-1" });

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

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

    /**
     * this will reject if no Note record is found
     * doing this before updating the s3 object prevents
     * creating an object for a Note that doesn't exist
     */
    const note = await prisma.note.update({
      where: {
        id
      },
      data: {
        name: updates.name,
        description: updates.description
      }
    });

    if (updates.content) {
      const putObjectCommand = new PutObjectCommand({
        Key: `${userId}/${note.id}.md`,
        Body: updates.content,
        Bucket: process.env.NOTES_BUCKET_NAME
      });

      await s3.send(putObjectCommand);
    }

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
    logger.error(e);
    return errorResponse<InternalErrorData>({
      statusCode: StatusCode.InternalError,
      errorData: {
        code: ErrorCodes.InternalError,
        message: "Something went wrong"
      }
    });
  }
}
