import express from "express"
import "dotenv/config"
import authMiddelware, { adminMiddleware } from "../Middelware/authMiddelware.js";
import { productPatchSchema, productSchema } from "../Schema/productValidation.js";
import db from "../db.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  authMiddelware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { error, value } = productSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.details[0].message });

      const { name, description, price, stock, category_name, brand_name } = value;

      // --- Find or Create Category ---
      let category = await db("categories").where({ name: category_name }).first();
      if (!category) {
        [category] = await db("categories")
          .insert({ name: category_name })
          .returning("*");
      }

      // --- Find or Create Brand ---
      let brand = await db("brands").where({ name: brand_name }).first();
      if (!brand) {
        [brand] = await db("brands")
          .insert({ name: brand_name })
          .returning("*");
      }

      // --- Create Product ---
      const [newProduct] = await db("products")
        .insert({
          name,
          description,
          price,
          stock,
          category_id: category.id,
          brand_id: brand.id,
        })
        .returning("*");

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error creating product:", err.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);


// Update Product (Admin only)
productRouter.patch(
  "/:id",
  authMiddelware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { error, value } = productPatchSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.details[0].message });

      const [updatedProduct] = await db("products")
        .where({ id })
        .update(value)
        .returning("*");

      if (!updatedProduct)
        return res.status(404).json({ success: false, message: "Product not found" });

      return res.json({ success: true, product: updatedProduct });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// Delete Product (Admin only)
productRouter.delete(
  "/:id",
  authMiddelware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db("products").where({ id }).del();
      if (!deleted)
        return res.status(404).json({ success: false, message: "Product not found" });

      return res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// Get Products (Anyone can view)
productRouter.get("/", async (req, res) => {
  try {
    const products = await db("products").select("*");
    res.json({ success: true, products });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default productRouter;