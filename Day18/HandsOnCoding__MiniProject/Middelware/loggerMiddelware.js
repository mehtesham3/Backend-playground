import logger from "../logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log the incoming request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Capture response details when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });
  });

  next();
};

// Error handling middleware
export const errorLogger = (error, req, res, next) => {
  logger.error('Unhandled error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    request: {
      method: req.method,
      url: req.url,
      params: req.params,
      body: req.body
    }
  });

  next(error);
};

