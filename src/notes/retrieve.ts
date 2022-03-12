import { PrismaClient, Prisma } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { response, StatusCode } from "../utils/responses";
import pino from "pino";
import { Logger } from "../utils/logger";
import { AuthorizerClaims } from "../types";

const logger = new Logger(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  }),
  {
    service: "notes",
    functionName: "retrieve"
  }
);

const prisma = new PrismaClient();

type Event = APIGatewayProxyEventV2WithJWTAuthorizer;

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  try {
    const notes = await prisma.notes.findMany({
      where: {
        permissions: {
          some: {
            userId
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true
      }
    });

    logger.info(`Notes retrieved for user ${userId}`);

    return response({
      statusCode: StatusCode.Success,
      body: {
        data: {
          notes
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
