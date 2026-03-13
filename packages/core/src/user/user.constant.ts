export namespace UserConstant {
  export const USERNAME_MIN_LENGTH = 2;
  export const USERNAME_MAX_LENGTH = 50;
  export const USERNAME_REGEX = /^[a-zA-Z0-9-_]{2,50}$/;

  export const PASSWORD_MIN_LENGTH = 9;
  export const PASSWORD_MAX_LENGTH = 30;

  export const PASSWORD_HASH_MIN_LENGTH = 30;
  export const PASSWORD_HASH_MAX_LENGTH = 200;

  export const NAME_MIN_LENGTH = 1;
  export const NAME_MAX_LENGTH = 50;

  export const EMAIL_MIN_LENGTH = 3;
  export const EMAIL_MAX_LENGTH = 100;

  export const PHONE_MIN_LENGTH = 3;
  export const PHONE_MAX_LENGTH = 100;
}
