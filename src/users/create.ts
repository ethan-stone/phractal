import { Prisma, PrismaClient } from "@prisma/client";
import { ValidationError } from "apollo-server-lambda";
import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import Joi from "joi";
import pino from "pino";
import { Logger } from "../utils/logger";
import { response, StatusCode } from "../utils/responses";

const logger = new Logger(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  }),
  {
    service: "notes",
    functionName: "create"
  }
);

const prisma = new PrismaClient();

type RequestBody = {
  id: string;
  email: string;
};

const bodySchema = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().email().required()
}).required();

type Event = APIGatewayProxyEventV2WithLambdaAuthorizer<Record<string, never>>;

export async function main(event: Event) {
  try {
    const parsedBody = JSON.parse(event.body || "");

    await bodySchema.validateAsync(parsedBody);

    const { id, email } = parsedBody as RequestBody;

    await prisma.user.create({
      data: {
        id,
        email
      }
    });

    logger.info(`User with id ${id} created`);

    return response({
      statusCode: StatusCode.Success,
      body: {
        data: {}
      }
    });
  } catch (e: unknown) {
    logger.error(e);

    if (e instanceof ValidationError || Prisma.PrismaClientKnownRequestError) {
      return response({
        statusCode: StatusCode.BadRequest,
        body: {
          error: {
            message: "Improper request parameters"
          }
        }
      });
    } else {
      return response({
        statusCode: StatusCode.InternalError,
        body: {
          error: {
            message: "Something went wrong"
          }
        }
      });
    }
  }
}
