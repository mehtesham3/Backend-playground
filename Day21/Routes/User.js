import express from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from '../Schema.js';
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });


const userRoute = express.Router(); // Create a mini-app (Router object)

userRoute.post("/signup", async (req, res) => {      //SignUP for a user
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Invalid request format/syntax");
    }
    const findEmail = await user.findOne({ email: email });
    if (findEmail) return res.status(409).json({
      success: false,
      message: "Email address is already registered"
    });

    const HashPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ email: email, password: HashPassword });
    res.status(200).send(newUser);
  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
})

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Invalid request format/syntax");
    }

    const userInfo = await user.findOne({ email: email });
    if (!userInfo) {
      return res.status(401).send("Invalid email or password");
    }
    const isAvailable = await bcrypt.compare(password, userInfo.password);
    if (!isAvailable) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ id: userInfo._id, email: userInfo.email }, process.env.SECRET_KEY || "MySecret", { expiresIn: "1h" });
    res.json({ message: "User Login Successfully ", token });

  } catch (error) {
    console.log("Error occured due to ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
})

export default userRoute;