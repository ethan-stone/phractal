type ErrorOpts<T extends Record<string, any> = {}> = {
  statusCode: 400 | 404 | 500;
  body?: T;
};

const getDefaultMessage = (statusCode: ErrorOpts["statusCode"]) => {
  if (statusCode === 400) return "Bad Request";
  if (statusCode === 404) return "Not Found";
  else return "Internal Server Error";
};

export const createError = (
  opts: ErrorOpts
): AWSLambda.APIGatewayProxyResultV2 => {
  return {
    statusCode: opts.statusCode,
    body:
      JSON.stringify(opts.body) ||
      JSON.stringify({ message: getDefaultMessage(opts.statusCode) }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
