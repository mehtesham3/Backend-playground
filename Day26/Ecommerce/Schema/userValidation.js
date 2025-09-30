import Joi from "joi"

export const signupSchema = Joi.object({
  email: Joi.string().email().min(6).required(),
  name: Joi.string().required(),
  password: Joi.string().min(3).required(),
  role: Joi.string().valid("user", "admin").default("user")
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

