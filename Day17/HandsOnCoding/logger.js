import winston from "winston";

//Define your custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

//Crete the logger
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    //Write all logs to a file 
    new winston.transports.File({ filename: 'logs/combine.log' }),
    //Write all errors to a seprate file 
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],

})

export default logger;