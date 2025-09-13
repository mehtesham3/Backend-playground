//Connect Express app to PostgreSQL
import express from 'express';
import { Pool } from 'pg'

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "e_commerce",
  password: "Angelica1!",
  port: 5432,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established

});

pool.on("connect", () => {
  console.log('Connected to PostgreSQL database');
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

app.get('/', async (req, res) => {
  try {
    // Test query to verify connection works
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      message: 'Express + PostgreSQL connected successfully!',
      database_time: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  console.log('Database pool closed');
  process.exit(0);
});



app.listen(3000, () => {
  console.log("Server is running http://localhost:3000")
})