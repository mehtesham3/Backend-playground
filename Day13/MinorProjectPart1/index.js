import express from "express";
import "dotenv/config";
import userRouter from "./Routes/User.js";
import productRouter from "./Routes/Product.js";
import db from "./db.js";
import session from "express-session";
import passport from './GoogleLogin/passportconfig.js'
import jwt from "jsonwebtoken"

const app = express();
app.use(express.json());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", userRouter);
app.use("/products", productRouter)

//googleAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const payload = {
      id: req.user.id,
      role: req.user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: `Welcome ${req.user.name} from googleAuth`, token });
  }
);

app.get("/profile", (req, res) => {
  console.log(req.user);
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ message: "Your profile", user: req.user });
});


app.get("/", (req, res) => {
  res.send("Your server for E-commerce is running well ");
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
})
