const express = require("express")
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

let users = []; // temporary in-memory store

// Signup route
app.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const userExists = users.find((u) => u.email === email);
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({ message: "User registered", user: { id: newUser.id, email } });
});

// Login route
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, "secret", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Protected route
app.get("/auth/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secret");
    res.json({ message: "Access granted", user: decoded });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

module.exports = app;
