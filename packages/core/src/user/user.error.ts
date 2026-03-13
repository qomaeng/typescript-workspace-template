import { BaseError } from '@/common/common.error.js';

export abstract class UserError extends BaseError {}

export class NotFoundUserError extends UserError {
  static readonly CODE = 'NOT_FOUND_USER';
  static readonly MESSAGE = 'Not found user';
  static readonly HTTP_STATUS = 404; // Not Found
}

export class DuplicatedUserError extends UserError {
  static readonly CODE = 'DUPLICATED_USER';
  static readonly MESSAGE = 'Duplicated user';
  static readonly HTTP_STATUS = 409; // Conflict
}

export class DeletedUserError extends UserError {
  static readonly CODE = 'DELETED_USER';
  static readonly MESSAGE = 'Deleted user';
  static readonly HTTP_STATUS = 400; // Bad Request
}
