import { BaseError } from '@/common/common.error.js';

export abstract class AuditError extends BaseError {}

export class NotFoundAuditError extends AuditError {
  static readonly CODE = 'NOT_FOUND_AUDIT';
  static readonly MESSAGE = 'Not found audit';
  static readonly HTTP_STATUS = 404; // Not Found
}
