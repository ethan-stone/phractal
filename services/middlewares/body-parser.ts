import middy from "@middy/core";
import { createError } from "@http-responses";
import { z } from "zod";

type Options = {
  schema: z.ZodType;
};

export type ParsedBodyContext<T extends Record<string, any>> =
  AWSLambda.Context & {
    parsedBody: T;
  };

export const bodyParserMiddleware = (
  opts: Options
): middy.MiddlewareObj<AWSLambda.APIGatewayProxyEventV2> => {
  const before: middy.MiddlewareFn<AWSLambda.APIGatewayProxyEventV2> = (
    request
  ) => {
    let parsedBody;

    try {
      parsedBody =
        request.event.body === undefined || JSON.parse(request.event.body);
    } catch (e) {
      return createError({
        statusCode: 400,
        body: {
          message: "Invalid JSON body"
        }
      });
    }

    const result = opts.schema.safeParse(parsedBody);

    if (!result.success)
      return createError({
        statusCode: 400,
        body: result.error.format()
      });

    Object.assign(request.context, { parsedBody: result.data });

    return;
  };

  return {
    before
  };
};
