type ResponseOpts<T extends Record<string, any>> = {
  statusCode: 200 | 204;
  body: T;
};

export const createResponse = <T extends Record<string, any> = {}>(
  opts: ResponseOpts<T>
): AWSLambda.APIGatewayProxyResultV2 => {
  return {
    statusCode: opts.statusCode,
    body: JSON.stringify(opts.body)
  };
};
