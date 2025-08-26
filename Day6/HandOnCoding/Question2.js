//Generate and verify JWT tokens
import jwt from 'jsonwebtoken'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from "bcrypt";
import user from './Schema.js';
import authMiddelware from './Middelware.js';

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/auth")
  .then(console.log("MongoDB connected successfully in question2"))
  .catch(err => { console.log(err.message) });

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    const userDetail = await user.findOne({ email: email });
    if (!userDetail) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userDetail.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { id: userDetail._id, email: userDetail.email },
      process.env.JWT_SECRET || "mysecretkey", // secret key
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.log("Error occured due to : ", error.message);
  }
})

app.get("/profile", authMiddelware, async (req, res) => {
  try {
    const userDetail = await user.findById(req.user.id).select("-password"); // exclude password
    res.json({ message: "Profile data", userDetail });
  } catch (error) {
    console.log("Error occured in profile due to : ", error.message);
  }
});



app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000/")
})