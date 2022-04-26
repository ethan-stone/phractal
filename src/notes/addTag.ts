import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import { AuthorizerClaims, EmptyObject } from "../types";
import { StatusCode, successResponse } from "../utils/responses";

type RequestBody = {
  name: string;
};

interface Event extends APIGatewayProxyEventV2WithJWTAuthorizer {
  pathParameters: {
    id: string;
  };
}

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  const claims = event.requestContext.authorizer.jwt.claims as AuthorizerClaims;
  const userId = claims.sub;

  const { id } = event.pathParameters;

  // TODO: check if user has permissions for this resource

  return successResponse<EmptyObject>({
    statusCode: StatusCode.Success,
    successData: {}
  });
}
