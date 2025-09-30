import express from "express";
import db from "../db.js";
import authMiddelware, { adminMiddleware } from "../Middelware/authMiddelware.js";
import { orderSchema } from "../Schema/orderSchema.js";
import { validate } from "../Middelware/schemaValidation.js";

const orderRouter = express.Router();

/**
 * 🛒 Create an Order from Cart Items
 * Only authenticated users can place orders
 */
orderRouter.post("/", authMiddelware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    // Fetch cart items for this user
    const cartItems = await db("cart_items").where({ user_id: userId }).join("products", "cart_items.product_id", "products.id")
      .select(
        "cart_items.id as cart_item_id",
        "cart_items.product_id",
        "cart_items.quantity",
        "products.price"
      );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Insert order
    const [order] = await db("orders")
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
      })
      .returning("*");

    // Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db("order_items").insert(orderItems);

    // Clear the cart
    await db("cart_items").where({ user_id: userId }).del();

    res.status(201).json({
      message: "Order placed successfully",
      order,
      items: orderItems,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

/**
 * 📌 Get All Orders for a User
 */
orderRouter.get("/", authMiddelware, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await db("orders").where({ user_id: userId }).orderBy("created_at", "desc");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * 🔄 Update Order Status (Admin only)
 */
orderRouter.patch("/:id/status", authMiddelware, adminMiddleware, validate(orderSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [updatedOrder] = await db("orders")
      .where({ id })
      .update({ status }, ["id", "status", "updated_at"]);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

/**
 * ❌ Delete an Order (Admin only)
 */
orderRouter.delete("/:id", authMiddelware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete order items first (FK constraint)
    await db("order_items").where({ order_id: id }).del();

    const deleted = await db("orders").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default orderRouter;
