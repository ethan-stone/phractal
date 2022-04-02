import Ajv, { DefinedError } from "ajv";
import { ErrorCodes, ValidationError, ValidationErrorData } from "./responses";
export { JSONSchemaType, DefinedError } from "ajv";

export function handleValidationError(
  errors: DefinedError[]
): ValidationErrorData {
  const validationErrors: Array<ValidationError> = [];
  for (const err of errors) {
    validationErrors.push({
      field: err.instancePath,
      message: err.message
    });
  }
  return {
    code: ErrorCodes.ValidationError,
    info: validationErrors
  };
}

export const ajv = new Ajv();
