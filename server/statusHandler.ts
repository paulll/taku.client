// le codes
const statusCodes: { [key: string]: string } = {
  '"username" must only contain alpha-numeric characters': "username.nonAlphaNumeric",
  '"email" must be a valid email': "email.invalid",
  '"email" is not allowed':        "email.notAllowed",
  '"repeatPassword" is not allowed':        "repeatPassword.notAllowed",
  '"repeatPassword" must be [ref:password]': "password.mismatch",
  '"username" is required': "username.required",
  '"password" is required': "password.required",
  '"email" is required': "email.required",
  '"repeatPassword" is required': "repeatPassword.required",
  '"value" must be a valid GUID': "uuid.invalid",
};

export const statusCodeResolver = (message: string): string => {
  return statusCodes[message] || message;
};
