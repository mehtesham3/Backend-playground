//Extend Blog API with login using Google OAuth
import "dotenv/config";
import express from "express"
import session from 'express-session'
import mongoose from 'mongoose'
// import dotenv from "dotenv";
import passport from "./passportconfig.js";
import jwt from "jsonwebtoken"

// dotenv.config();

const app = express();
const port = process.env.PORT;


mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 10000
}).then(() => {
  console.log("MongoDB connected Successfully")
})
  .catch((err) => console.error(err));


app.use(express.json());

//session middelware
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("Blog API home 🚀🚀"));

app.get("/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    status: "OK",
    uptime: process.uptime() + "s",
    timestamp: new Date(),
    database: dbStatus,
  })
})

//googelAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const payload = {
      id: req.user._id,
      email: req.user.email
    }
    const token = jwt.sign(payload, "MySecret", { expiresIn: "1h" });
    res.json({ message: `Welcome ${req.user.username} from googleAuth`, token });
  }
);

app.get("/profile", (req, res) => {
  console.log(req.user);
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ message: "Your profile", user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
})