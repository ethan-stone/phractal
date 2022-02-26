import { PrismaClient, Prisma } from "@prisma/client";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { response, StatusCode } from "../utils/responses";
import pino from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

const prisma = new PrismaClient();

export async function main(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const userId = event.requestContext.authorizer.jwt.claims[
    "cognito:username"
  ] as string;

  try {
    const notes = await prisma.note.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true
      }
    });

    return response({
      statusCode: StatusCode.Success,
      body: {
        data: {
          notes
        }
      }
    });
  } catch (e) {
    console.log(e);
    return response({
      statusCode: StatusCode.InternalError,
      body: {
        error: {}
      }
    });
  }
}
