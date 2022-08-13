import middy from "@middy/core";
import { verify } from "jsonwebtoken";
import { ssmMiddleware, SSMParamsContext } from "@middlewares/ssm";

type Token = {
  sub: string;
  email: string;
};
type Event = AWSLambda.APIGatewayRequestAuthorizerEventV2;
type Context = SSMParamsContext<{ jwtsecret: string }>;
type Result =
  AWSLambda.APIGatewaySimpleAuthorizerWithContextResult<Phractal.AuthorizerClaims>;

export const handler = async (event: Event, ctx: Context): Promise<Result> => {
  try {
    if (!event.headers) throw new Error("Missing authorization header");

    const authHeader = event.headers["authorization"];

    if (!authHeader) throw new Error("Missing authorization header");

    const [prefix, bearerToken] = authHeader.split(" ");

    if (prefix !== "Bearer") throw new Error("Invalid authorization header");

    const token = verify(bearerToken, ctx.ssmParams.jwtsecret, {
      algorithms: ["HS256"]
    }) as Token;

    return {
      isAuthorized: true,
      context: {
        uid: token.sub,
        email: token.email
      }
    };
  } catch (error) {
    return {
      isAuthorized: false,
      context: {
        uid: "",
        email: ""
      }
    };
  }
};

export const main = middy(handler);

main.use(
  ssmMiddleware({
    ssmClientConfig: {},
    ssmParams: {
      jwtsecret: process.env.JWT_SECRET_PARAM_NAME
    }
  })
);
