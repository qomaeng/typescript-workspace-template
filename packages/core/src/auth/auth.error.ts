import { BaseError } from '@/common/common.error.js';

export abstract class AuthError extends BaseError {}

export class AuthenticationError extends AuthError {
  static readonly CODE = 'UNAUTHENTICATED';
  static readonly MESSAGE = 'Authentication error';
  static readonly HTTP_STATUS = 401; // Unauthorized
}

export class UnauthorizedError extends AuthError {
  static readonly CODE = 'UNAUTHORIZED';
  static readonly MESSAGE = 'Unauthorized error';
  static readonly HTTP_STATUS = 403; // Forbidden
}

export class ExpiredCredentialError extends AuthError {
  static readonly CODE = 'INVALID_CREDENTIAL';
  static readonly MESSAGE = 'Expired credential';
  static readonly HTTP_STATUS = 401; // Unauthorized
}

export class InvalidCredentialError extends AuthError {
  static readonly CODE = 'UNAUTHORIZED';
  static readonly MESSAGE = 'Invalid credential';
  static readonly HTTP_STATUS = 401; // Unauthorized
}
