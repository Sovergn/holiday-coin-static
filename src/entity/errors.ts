export enum ValidationErrorCode {
  INVALID_TYPE,
  INVALID_PAYMENT_SOURCE,
  INVALID_STATUS
}

export class ValidationError {
  message: string;
  code: ValidationErrorCode;
  field: string|null;

  constructor(code: ValidationErrorCode, message: string, field?: string) {
    this.code = code;
    this.message = message;
    this.field = field;
  }
}