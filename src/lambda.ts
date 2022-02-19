import { APIGatewayProxyResultV2 } from "aws-lambda";

export async function main(): Promise<APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    body: JSON.stringify("Hello World!")
  };
}
