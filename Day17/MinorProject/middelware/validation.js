// middleware/validation.js - Input validation middleware
import logger from "../logger.js";

const validateBlogPost = (req, res, next) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    logger.warn('Validation failed: Missing required fields', {
      validationError: 'Title, content, and author are required',
      receivedData: req.body
    });

    return res.status(400).json({
      error: 'Title, content, and author are required fields'
    });
  }

  if (title.length < 5) {
    logger.warn('Validation failed: Title too short', {
      validationError: 'Title must be at least 5 characters',
      receivedTitle: title
    });

    return res.status(400).json({
      error: 'Title must be at least 5 characters'
    });
  }

  next();
};

export default validateBlogPost