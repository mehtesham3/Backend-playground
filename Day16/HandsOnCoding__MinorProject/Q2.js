// Cache product listings in e-commerce API
import express from "express"
import { createClient } from "redis"
import { Pool } from "pg";
import "dotenv/config"

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: process.env.DB_PASS,
  port: 5432
});

const redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
redisClient.on("error", (error) => { console.log('Redis client error : ', error) });
pool.on("connect", () => {
  console.log("postgres is conncected successfully ");
})
await redisClient.connect();

export async function getProductCache() {
  const cacheKey = 'products:all';

  //try to get from cache first
  try {
    console.time("Redis fetch");
    const cachedProduct = await redisClient.get(cacheKey);
    console.timeEnd("Redis fetch");
    if (cachedProduct) {
      console.log('Cache hit');
      return JSON.parse(cachedProduct);
    }
  } catch (error) {
    console.error('Error occured at cache : ', error.message);
  }

  //Cache miss get from db
  try {
    console.time('Db fetch');
    const result = await pool.query("Select * from products;");
    console.timeEnd('Db fetch');
    if (result.rows.length === 0) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify({ notfound: true }));
      return null;
    }
    const products = result.rows;
    await redisClient.setEx(cacheKey, 60, JSON.stringify(products));
    return products;
  } catch (error) {
    console.error('Error occured at DbAccess : ', error.message);
  }
}

app.get('/products', async (req, res) => {
  try {
    const products = await getProductCache();
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
})

app.get("/", (req, res) => {
  res.send("Here, we aregetting expericence with cache by using redis");
})
app.get("/del-redis", async (req, res) => {
  await redisClient.del("products:all");
  res.send("We are deleting old cache");
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
})