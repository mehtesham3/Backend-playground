import express from "express"
import db from "../db.js"
import { validate } from "../Middelware/schemaValidation.js";
import { cartItemSchema, updateCartItemSchema } from "../Schema/cartSchema.js";
import authMiddelware from "../Middelware/authMiddelware.js";

const cartRoute = express.Router();

cartRoute.post("/items", authMiddelware, validate(cartItemSchema), async (req, res) => {
  try {
    const userId = req.user.id; // 👈 from JWT
    const { product_id, quantity } = req.body;

    // Check if item already exists for this user
    const existingItem = await db("cart_items")
      .where({ user_id: userId, product_id })
      .first();

    if (existingItem) {
      const [updated] = await db("cart_items")
        .where({ id: existingItem.id })
        .update({ quantity: existingItem.quantity + quantity })
        .returning("*");

      return res.json({ message: "Cart updated", item: updated });
    }

    // Insert new item
    const [item] = await db("cart_items")
      .insert({ user_id: userId, product_id, quantity })
      .returning("*");

    res.status(201).json({ message: "Item added to cart", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

cartRoute.patch("/items/:itemId", authMiddelware, validate(updateCartItemSchema), async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const { quantity } = req.body;

    // Ensure the cart item belongs to the user
    const cartItem = await db("cart_items")
      .where({ id: itemId, user_id: userId })
      .first();

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    const [updated] = await db("cart_items")
      .where({ id: itemId })
      .update({ quantity })
      .returning("*");

    res.json({ message: "Cart item updated", item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// ✅ Get all items in user's cart
cartRoute.get("/", authMiddelware, async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await db("cart_items")
      .where({ user_id: userId })
      .join("products", "cart_items.product_id", "products.id")
      .select(
        "cart_items.id",
        "products.name",
        "products.price",
        "cart_items.quantity"
      );

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

cartRoute.delete("/items/:itemId", authMiddelware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id; // from JWT

    // Ensure the cart item belongs to the authenticated user
    const cartItem = await db("cart_items")
      .where({ id: itemId, user_id: userId })
      .first();

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    await db("cart_items").where({ id: itemId }).del();

    res.json({ message: "Cart item removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

export default cartRoute;