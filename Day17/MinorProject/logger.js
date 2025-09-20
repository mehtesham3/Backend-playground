import winston, { format } from "winston"
const { combine, timestamp, json, errors, metadata } = winston.format;


const errorStackFormat = winston.format(info => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message
    };
  }
  return info;
})

//Create a logger
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'Blog-api' },
  format: combine(
    errors({ stack: true }),
    errorStackFormat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    json()
  ),
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info'
    }),
    // Write errors to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // Write all logs to console in development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
})


export default logger;