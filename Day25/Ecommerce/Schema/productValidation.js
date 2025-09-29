import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow("", null), // optional
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category_name: Joi.string(),    //category_id
  // .guid({ version: "uuidv4" }),
  brand_name: Joi.string()        //brand_id
  // .guid({ version: "uuidv4" })
});

export const productPatchSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  description: Joi.string().allow("", null),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  category_id: Joi.string().guid({ version: "uuidv4" }),
  brand_id: Joi.string().guid({ version: "uuidv4" }),
});
