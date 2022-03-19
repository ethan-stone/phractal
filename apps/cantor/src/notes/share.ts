import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { AuthorizerClaims } from "../types";
import { response, StatusCode } from "../utils/responses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RequestBody = {
  email: string;
};

interface Event extends APIGatewayProxyEventV2WithJWTAuthorizer {
  pathParameters: {
    id: string;
  };
}

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const { sub: userId, email } = claims;
  const { id: noteId } = event.pathParameters;

  try {
    const permission = await prisma.permission.findUnique({
      where: {
        userId_noteId: {
          userId,
          noteId
        }
      }
    });

    if (!permission || permission.role !== "ADMIN") {
      return response({
        statusCode: StatusCode.Forbidden,
        body: {
          error: {
            message: "You do not have permissions to share this note"
          }
        }
      });
    }

    // await prisma.permission.create({
    //   data: {

    //   }
    // })

    return response({
      statusCode: StatusCode.Success,
      body: {}
    });
  } catch (error) {
    return response({
      statusCode: StatusCode.InternalError,
      body: {}
    });
  }
}
