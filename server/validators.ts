import Joi from "joi";

export const validators = {
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+$]{3,30}")).required(),
  repeatPassword: Joi.ref("password"),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  uuid: Joi.string().uuid(),
};
