import { APIGatewayProxyResultV2 } from "aws-lambda";

export enum StatusCode {
  Success = 200,
  BadRequest = 400,
  InternalError = 500
}

type ResponseBody = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
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
