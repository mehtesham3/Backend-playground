//Extend Blog API with login using Google OAuth
import "dotenv/config";
import express from "express"
import session from 'express-session'
import mongoose from 'mongoose'
// import dotenv from "dotenv";
import passport from "./passportconfig.js";

// dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 10000
}).then(() => {
  console.log("MongoDB connected Successfully")
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
  })
})
  .catch((err) => console.error(err));

app.use(express.json());

//session middelware
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("Blog API home 🚀🚀"));

//googelAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, user: req.user });
  }
);

app.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ message: "Your profile", user: req.user });
});

const port = process.env.PORT;
