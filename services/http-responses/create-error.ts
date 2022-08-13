type ErrorOpts = {
  statusCode: 400 | 404 | 500;
  message?: string;
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
    body: opts.message || getDefaultMessage(opts.statusCode)
  };
};
