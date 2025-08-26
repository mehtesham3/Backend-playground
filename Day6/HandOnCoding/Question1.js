//Implement signup + login
import express from "express"
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import user from "./Schema.js";


const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/auth")
  .then(console.log("MongoDB is connected"))
  .catch((err) => { console.error(err) });

app.post("/user", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ email: email, password: hashPassword });
    res.json(newUser);
  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(400).send("Invalid request format/syntax");
  }
})

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
    res.status(200).send("User login Successfully !");
  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(500).json({ message: "Internal server error during login" });
  }
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/")
})