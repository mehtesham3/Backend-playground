// Implement middleware (logging, validation)

import express from "express";
import { logging, validate } from "./Middleware/middleware.js";

const app = express();

app.use(express.json());
app.use(logging);

app.get("/", (req, res) => {
  res.send("Request is coming from get section");
})
const users = [
  { id: 1, name: "Ehtesham", email: "e@example.com" },
  { id: 2, name: "Ali", email: "a@example.com" }
];


app.post("/", validate, (req, res) => {
  const { email, password } = req.body;
  const id = users.at(-1)?.id + 1 || 1;
  users.push({ id, password, email });
  res.status(201).json({ message: "created", id });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server error" });

})

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000/")
})