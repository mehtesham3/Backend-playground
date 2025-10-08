import "dotenv/config"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import db from "./db.js"
import { validate } from "./src/Middelware/schemaValidation.js";
import { loginSchema, signupSchema } from "./src/userValidation.js";
import authMiddelware from "./src/Middelware/authMiddelware.js"
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import cors from "cors";

// Limit: 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again after a minute.",
});

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post("/signup", async (req, res) => {
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

app.post("/login", validate(loginSchema), loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    // if (!email || !password) {
    //   return res.status(400).send("Invalid request format/syntax");
    // }

    const userInfo = await db("users").where({ email }).first();
    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials "
      })
    }

    const isMatch = await bcrypt.compare(password, userInfo.password);
    if (!isMatch) {
      return res.status(401).json({
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

app.get("/profile", authMiddelware, (req, res) => {
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

app.get("/", (req, res) => {
  res.send("User service is running well ");
})

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.raw("SELECT NOW() as current_time");
    res.json({
      success: true,
      message: "Database is connected",
      time: result.rows[0].current_time,
    });
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`User service is running on port http://localhost:${process.env.PORT}`);
})
