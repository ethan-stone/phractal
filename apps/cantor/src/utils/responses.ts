import { APIGatewayProxyResultV2 } from "aws-lambda";

export enum StatusCode {
  Success = 200,
  BadRequest = 400,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500
}

type GenericObect = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

type ResponseBody = {
  data?: GenericObect;
  error?: GenericObect;
};

type ResponseOptions = {
  statusCode: StatusCode;
  body: ResponseBody;
};

export function response({
  statusCode,
  body
}: ResponseOptions): APIGatewayProxyResultV2 {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
}
