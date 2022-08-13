import { createError, createResponse } from "@http-responses";
import { PrismaContext, prismaMiddleware } from "@middlewares/prisma";
import { ssmMiddleware, SSMParamsContext } from "@middlewares/ssm";
import middy from "@middy/core";
import { Profile } from "@prisma/client";

interface Event extends Phractal.APIGatewayProxyEventV2WithLambdaAuthorizer {
  pathParameters: {
    id: string;
  };
}
type Context = SSMParamsContext<{ prisma: string }> & PrismaContext;
type Result = AWSLambda.APIGatewayProxyResultV2;

export const handler = async (event: Event, ctx: Context): Promise<Result> => {
  console.log("wefwefwef");
  const profile = await ctx.prisma.profile.findUnique({
    where: { uid: event.pathParameters.id }
  });

  if (!profile)
    return createError({
      statusCode: 404,
      body: {
        message: "Profile not found"
      }
    });

  return createResponse<Profile>({
    statusCode: 200,
    body: profile
  });
};

export const main = middy(handler);

main
  .use(
    ssmMiddleware({
      ssmClientConfig: {},
      ssmParams: {
        prisma: process.env.DB_PARAM_NAME || ""
      }
    })
  )
  .use(prismaMiddleware());
