import { PrismaClient, Prisma } from "@prisma/client";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWithCognitoAuthorizerEvent
} from "aws-lambda";
import Joi, { ValidationError } from "joi";
import { response, StatusCode } from "../utils/responses";

const prisma = new PrismaClient();

type RequestBody = {
  name: string;
  description?: string;
};

const bodySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string()
}).required();

export async function main(
  event: APIGatewayProxyWithCognitoAuthorizerEvent
): Promise<APIGatewayProxyResultV2> {
  try {
    const parsedBody = JSON.parse(event.body || "");

    await bodySchema.validateAsync(parsedBody);

    const { name, description } = parsedBody as RequestBody;

    await prisma.note.create({
      data: {
        name,
        description
      }
    });

    return response({
      statusCode: StatusCode.Success,
      body: {}
    });
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          message: e.message
        }
      });
    } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          message: e.message
        }
      });
    } else if (e instanceof Error) {
      return response({
        statusCode: StatusCode.InternalError,
        body: {
          message: e.message
        }
      });
    } else {
      return response({
        statusCode: StatusCode.InternalError,
        body: {}
      });
    }
  }
}
