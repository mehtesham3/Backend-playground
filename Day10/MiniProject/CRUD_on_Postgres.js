//Build routes for products (CRUD with SQL queries)
import express from "express";
import { Pool } from 'pg'

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "express_db",
  password: "Angelica1!",
  port: 5432
})

pool.on("connect", () => {
  console.log("Postgres connected sucessfully");
})

//Check connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      message: "Express + PostgreSQL connected successfully! and working question 2",
      database_time: result.rows[0].current_time
    })
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
})

//Get all users
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
})

//Create new user
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || !description || !price || !stock) {
      res.json("Something is left to enter ");
      return;
    }
    const result = await pool.query("INSERT INTO PRODUCTS (name, description, price, stock) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, description, price, stock]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
})

//Update user
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const result = await pool.query("UPDATE PRODUCTS SET name=$1, description=$2,price=$3,stock=$4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *", [name, description, price, stock, id]);

    if (result.rows.length === 0) {


      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

//Delete user
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
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
  console.log("Server is running on http://localhost:3000/");
})