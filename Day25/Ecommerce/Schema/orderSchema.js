import Joi from "joi";

// ==========================
// Order Validation
// ==========================
export const orderSchema = Joi.object({
  // user_id: Joi.string()
  //   .uuid({ version: "uuidv4" })
  //   .required()
  //   .messages({
  //     "string.guid": "user_id must be a valid UUID",
  //     "any.required": "user_id is required",
  //   }),

  // total_amount: Joi.number()
  //   .precision(2)
  //   .min(0)
  //   .required()
  //   .messages({
  //     "number.base": "total_amount must be a number",
  //     "number.min": "total_amount cannot be negative",
  //     "any.required": "total_amount is required",
  //   }),

  status: Joi.string()
    .valid("pending", "shipped", "delivered", "cancelled")
    .default("pending")
    .messages({
      "any.only": "status must be one of pending, shipped, delivered, cancelled",
    }),

  idempotency_key: Joi.string().optional().max(255),
});

// ==========================
// Order Item Validation
// ==========================
export const orderItemSchema = Joi.object({
  order_id: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.guid": "order_id must be a valid UUID",
      "any.required": "order_id is required",
    }),

  product_id: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.guid": "product_id must be a valid UUID",
      "any.required": "product_id is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "quantity must be a number",
      "number.integer": "quantity must be an integer",
      "number.min": "quantity must be at least 1",
      "any.required": "quantity is required",
    }),

  price: Joi.number()
    .precision(2)
    .positive()
    .required()
    .messages({
      "number.base": "price must be a number",
      "number.positive": "price must be greater than 0",
      "any.required": "price is required",
    }),
});
