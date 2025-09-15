import Joi from 'joi'

export const blogSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  content: Joi.string().min(20).required(),
  author: Joi.string().min(3).required()
});

