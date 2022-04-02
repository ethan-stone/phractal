import { APIGatewayProxyResultV2 } from "aws-lambda";

export enum StatusCode {
  Success = 200,
  BadRequest = 400,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500
}

export enum ErrorCode {
  InternalError = "INTERNAL_ERROR",
  ValidationError = "VALIDATION_ERROR",
  NotFoundError = "NOT_FOUND_ERROR"
}

interface ErrorData {
  code: ErrorCode;
}

export type ValidationError = {
  field: string;
  message?: string;
};

export interface ValidationErrorData extends ErrorData {
  info: Array<ValidationError>;
}

export interface InternalErrorData extends ErrorData {
  message: "Something went wrong";
}

export interface NotFoundErrorData extends ErrorData {
  message: string;
}

type ErrorResponseData<T> = {
  statusCode: StatusCode;
  errorData: T;
};

export function errorResponse<T>({
  statusCode,
  errorData
}: ErrorResponseData<T>): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify({
      error: errorData
    })
  };
}

type SuccessResponseData<T> = {
  statusCode: StatusCode;
  successData: T;
};

export function successResponse<T>({
  statusCode,
  successData
}: SuccessResponseData<T>): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify({
      data: successData
    })
  };
}
