//Add logging middleware in Express
import express from 'express'
import requestLogger from './middelware/loggerMiddelware.js';
import logger from './logger.js';

const app = express();
// app.use(express.json());

app.use(requestLogger);

app.get('/', (req, res) => {
  res.send("hii with logging ");
})

app.get("/error", (req, res) => {
  try {
    throw new Error('Something went wrong');
  } catch (err) {
    logger.error({ message: err.message, stack: err.stack });
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => logger.info('Server running on port 3000'));
