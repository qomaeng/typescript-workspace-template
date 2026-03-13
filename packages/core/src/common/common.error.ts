export interface BaseErrorOptions {
  httpStatus?: number;
}

export abstract class BaseError extends Error {
  readonly code: string;
  readonly options: BaseErrorOptions;

  constructor(message?: string, options?: BaseErrorOptions) {
    const ctor = new.target as typeof BaseError & {
      CODE: string;
      MESSAGE: string;
      HTTP_STATUS: number;
    };

    super(message ?? ctor.MESSAGE);

    this.name = ctor.name;
    this.code = ctor.CODE;
    this.options = { httpStatus: ctor.HTTP_STATUS, ...options };
  }
}

export abstract class CommonError extends BaseError {}

export class UnknownError extends CommonError {
  static readonly CODE = 'UNKNOWN_ERROR';
  static readonly MESSAGE = 'Unknown error';
  static readonly HTTP_STATUS = 500; // Internal Server Error
}

export class UnsupportedError extends CommonError {
  static readonly CODE = 'UNSUPPORTED_ERROR';
  static readonly MESSAGE = 'Unsupported error';
  static readonly HTTP_STATUS = 501; // Not Implemented
}

export class InvalidArgumentsError extends CommonError {
  static readonly CODE = 'INVALID_ARGS';
  static readonly MESSAGE = 'Invalid arguments error';
  static readonly HTTP_STATUS = 400; // Bad Request
}
