import Joi from "joi";

export const cartItemSchema = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "any.required": "Product ID is required",
      "string.guid": "Product ID must be a valid UUID"
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1"
    }),
});

export const updateCartItemSchema = Joi.object({
  product_id: Joi.string()
    .uuid()
    .messages({
      "string.guid": "Product ID must be a valid UUID"
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1"
    }),
});
