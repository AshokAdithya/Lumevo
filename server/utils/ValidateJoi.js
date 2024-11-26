import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  });
  return schema.validate(data);
};

export const validateProfile = (profile) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(""),
    portfolioLink: Joi.string().uri().allow(""),
  });
  return schema.validate(profile);
};

export const validateSignIn = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

export const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().label("email"),
  });
  return schema.validate(data);
};

export const validatePassword = (data) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("password"),
  });
  return schema.validate(data);
};

export const validateRefreshTokenScheme = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("refreshToken"),
  });
  return schema.validate(body);
};

export const validateExpertRequests = (profile) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(""),
    phoneNumber: Joi.string(),
  });
  return schema.validate(profile);
};
