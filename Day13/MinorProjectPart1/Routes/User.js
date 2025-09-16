import "dotenv/config"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "../db.js"
import { validate } from "../Middelware/schemaValidation.js";
import { loginSchema, signupSchema } from "../Schema/userValidation.js";
import authMiddelware from "../Middelware/authMiddelware.js"

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // now value contains validated data
    const { name, email, password, role } = value;

    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exist"
      });
    }
    const HashPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db("users")
      .insert({
        name,
        email,
        password: HashPassword,
        role
      }).returning(["id", "email", "name", "role"]);

    return res.status(201).json({
      success: true,
      message: "User created successfully ",
      user: newUser
    });
  } catch (error) {
    console.error("Error : ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

userRouter.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    // if (!email || !password) {
    //   return res.status(400).send("Invalid request format/syntax");
    // }

    const userInfo = await db("users").where({ email }).first();
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials "
      })
    }

    const isMatch = await bcrypt.compare(password, userInfo.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials "
      })
    }
    const token = jwt.sign({ id: userInfo.id, role: userInfo.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "User login successfully ", token });

  } catch (error) {
    console.error("Error : ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
})

userRouter.get("/profile", authMiddelware, (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User profile fetched successfully",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Error : ", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
})

export default userRouter;