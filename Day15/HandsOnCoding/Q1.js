import express from 'express'
import { Pool } from 'pg'
import "dotenv/config"
import NodeCache from 'node-cache'

const app = express();
app.use(express.json());
const cache = new NodeCache({ stdTTL: 15 });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecommerce",
  password: process.env.db_pass,
  port: 5432
})

pool.on("connect", () => {
  console.log("Postgres is connected Successfully");
})

const ORDER_QUERY = `
SELECT
  o.id            AS order_id,
  o.total_amount,
  o.status,
  o.created_at,
  u.id            AS user_id,
  u.name          AS user_name,
  u.email         AS user_email,
  jsonb_agg(
    jsonb_build_object(
      'product_id', p.id,
      'product_name', p.name,
      'unit_price',   COALESCE(oi.price, p.price),
      'quantity',     oi.quantity,
      'stock',        p.stock,
      'category',     c.name,
      'brand',        b.name
    ) ORDER BY p.id
  ) AS products
FROM orders o
JOIN users u           ON o.user_id = u.id
JOIN order_items oi    ON oi.order_id = o.id
JOIN products p        ON oi.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b     ON p.brand_id = b.id
GROUP BY o.id, o.total_amount, o.status, o.created_at, u.id, u.name, u.email
ORDER BY o.created_at DESC;
`;

// ------------------ API without cache ------------------
app.get("/orders-no-cache", async (req, res) => {
  try {
    console.time("NoCache");
    const result = await pool.query(ORDER_QUERY);
    console.timeEnd("NoCache");
    res.json({ fromCache: false, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});

// ------------------ API with cache ------------------
app.get("/orders-cache", async (req, res) => {
  try {
    console.time("WithCache");

    // check cache
    const cachedData = cache.get("orders");
    if (cachedData) {
      console.timeEnd("WithCache");
      return res.json({ fromCache: true, data: cachedData });
    }

    // not in cache → query DB
    const result = await pool.query(ORDER_QUERY);
    cache.set("orders", result.rows);

    console.timeEnd("WithCache");
    res.json({ fromCache: false, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("Select now() as current_time");
    res.json({
      message: "Express + postgress is connected successfully",
      databse_time: result.rows[0].current_time
    })
  } catch (err) {
    res.send(err.message);
    console.error(err.message)
  }
})

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