//Write validation middleware for user input

// routes/user.js
import express from "express";
import { userSchema } from "./userSchema.js";
import { validate } from "./middelware.js";

const app = express();
app.use(express.json());

app.post("/users", validate(userSchema), (req, res) => {
  res.status(201).json({ message: "User created", data: req.body });
});

app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000/`)
})