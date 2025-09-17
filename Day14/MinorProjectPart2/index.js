import express from "express";
import 'dotenv/config';
import cartRoute from "./Routes/cart.js";
import orderRouter from "./Routes/Orders.js";
import orederItemsRouter from "./Routes/OrderItems.js";
import db from "./db.js";

const app = express();

app.use(express.json());

app.use("/cart", cartRoute);
app.use("/orders", orderRouter);
app.use("/", orederItemsRouter);

app.get("/", (req, res) => {
  res.send("Your server for E-commerce part2 is running well ");
})
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.raw("SELECT NOW() as current_time");
    res.json({
      success: true,
      message: "Database is connected",
      time: result.rows[0].current_time,
    });
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
})
