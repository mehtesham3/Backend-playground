// validation/userSchema.js
import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).max(100).required(),
});
