import express from "express";
import db from "../db.js";
import authMiddelware, { adminMiddleware } from "../Middelware/authMiddelware.js";

const orederItemsRouter = express.Router();

/**
 * 📌 Get all order items
 * - User → only items from their own orders
 * - Admin → all order items
 */
orederItemsRouter.get("/order-items", authMiddelware, async (req, res) => {
  try {
    let items;

    if (req.user.role === "admin") {
      // Admin → all order items with order & user details
      items = await db("order_items")
        .join("orders", "order_items.order_id", "orders.id")
        .join("users", "orders.user_id", "users.id")
        .join("products", "order_items.product_id", "products.id")
        .select(
          "order_items.*",
          "orders.status as order_status",
          "users.email as user_email",
          "products.name as product_name"
        )
        .orderBy("order_items.created_at", "desc");
    } else {
      // User → only their order items
      items = await db("order_items")
        .join("orders", "order_items.order_id", "orders.id")
        .join("products", "order_items.product_id", "products.id")
        .where("orders.user_id", req.user.id)
        .select(
          "order_items.*",
          "orders.status as order_status",
          "products.name as product_name"
        )
        .orderBy("order_items.created_at", "desc");
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
});

/**
 * 📌 Get items of a specific order
 */
orederItemsRouter.get("/orders/:orderId/items", authMiddelware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db("orders").where({ id: orderId }).first();
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only admin or owner of the order can view
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const items = await db("order_items")
      .where({ order_id: orderId })
      .join("products", "order_items.product_id", "products.id")
      .select("order_items.*", "products.name as product_name");

    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
});

/**
 * ❌ Delete an order item (Admin only)
 */
orederItemsRouter.delete("/order-items/:id", authMiddelware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("order_items").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json({ message: "Order item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order item" });
  }
});

export default orederItemsRouter;
