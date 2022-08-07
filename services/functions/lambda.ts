import middy from "@middy/core";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { prismaMiddleware, PrismaContext } from "../middlewares/prisma";
import { uuid } from "../utils/uuid";

type Event = AWSLambda.APIGatewayProxyEventV2;
type Context = PrismaContext;
type Result = AWSLambda.APIGatewayProxyResultV2;

export const handler = async (event: Event, ctx: Context): Promise<Result> => {
  console.log(event);

  const user = await ctx.prisma.profile.create({
    data: {
      uid: uuid(),
      email: `${uuid()}@phractal.xyz`
    }
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };
};

export const main = middy(handler);

main.use(
  prismaMiddleware({
    ssmCLientConfig: {},
    paramName: process.env.DB_PARAM_NAME || ""
  })
);
