export type AuthorizerClaims = {
  uid: string;
  email: string;
};

export type APIGatewayProxyEventV2WithLambdaAuthorizer<
  T extends Record<string, any> = {}
> = AWSLambda.APIGatewayProxyEventV2WithLambdaAuthorizer<T & AuthorizerClaims>;

export as namespace Phractal;
