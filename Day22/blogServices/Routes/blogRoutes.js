import express from "express";
import axios from "axios";
import { blog } from "../models/blogSchema.js";

const blogRoute = express.Router();

// Middleware: Verify token via User Service
async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  console.log("Sending token to verification:", token); // Debug log

  try {
    const response = await axios.get("http://localhost:5001/verify", {
      headers: {
        authorization: `Bearer ${token}` // Always send with Bearer prefix
      }
    });

    if (response.data.valid) {
      req.userId = response.data.userId;
      next();
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err.response?.data || err.message);
  }
}

// Create post
blogRoute.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blogCreate = await blog.create({ title, content, author, createdAt: new Date() });
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blogCreate
    });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all posts
blogRoute.get("/posts", async (req, res) => {
  const posts = await blog.find();
  res.json(posts);
});

export default blogRoute;