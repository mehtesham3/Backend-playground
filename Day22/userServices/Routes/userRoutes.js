import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import userAuth from "../models/userSchema.js";

const userRoute = express.Router();

// Register
userRoute.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Invalid request format/syntax");
    }
    const findEmail = await userAuth.findOne({ email: email });
    if (findEmail) return res.status(409).json({
      success: false,
      message: "Email address is already registered"
    });
    const hashed = await bcrypt.hash(password, 10);
    const user = await userAuth.create({ email: email, password: hashed })
    res.status(200).send(user);
  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Invalid request format/syntax");
    }
    const user = await userAuth.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email }, "SECRET", { expiresIn: "1h" });
    res.json({
      message: "User Login Successfully",
      token: `Bearer ${token}`  // Include Bearer prefix
    });

  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Verify Token endpoint (for post-service to call)
userRoute.get("/verify", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "Invalid authorization header format" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Received token:", token); // Debug log

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET");
    res.json({ valid: true, userId: decoded.id });
  } catch (e) {
    console.error("Token verification failed:", e.message);

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ valid: false, error: "Invalid token" });
    } else if (e.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, error: "Token expired" });
    } else {
      return res.status(401).json({ valid: false, error: "Token verification failed" });
    }
  }
});

export default userRoute;