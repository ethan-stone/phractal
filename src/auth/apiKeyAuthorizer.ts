import {
  APIGatewaySimpleAuthorizerResult,
  APIGatewayRequestAuthorizerEventV2
} from "aws-lambda";
import { hash } from "../utils/hash";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Event = APIGatewayRequestAuthorizerEventV2;

export async function main(
  event: Event
): Promise<APIGatewaySimpleAuthorizerResult> {
  const headers = event.headers;
  if (!headers) {
    return {
      isAuthorized: false
    };
  }
  const apiHeader = headers["x-api-key"];

  if (!apiHeader) {
    return {
      isAuthorized: false
    };
  }

  const apiKeyParams = apiHeader.split(".");

  if (apiKeyParams.length !== 2) {
    return {
      isAuthorized: false
    };
  }

  const [apiId, apiKey] = apiKeyParams;

  const retrievedApiKey = await prisma.apiKey.findUnique({
    where: { id: apiId },
    select: { key: true, salt: true }
  });

  if (!retrievedApiKey) {
    return {
      isAuthorized: true
    };
  }

  const hashedKey = hash(apiKey, retrievedApiKey.salt);

  if (hashedKey !== retrievedApiKey.key) {
    return {
      isAuthorized: false
    };
  }

  return {
    isAuthorized: true
  };
}
