//Add Google OAuth login with passport.js
import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./Schema/User.js"
import dotenv from 'dotenv'
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => console.log("Connected sucessfully with mongo"))
  .catch(err => console.error(err));


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Google Oauth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = new User({
      username: profile.displayName,
      googleId: profile.id,
    });
    await user.save();
  }

  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);// store Mongo _id in session
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ googleId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
})

//google login route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

//google callback route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send(`Hey ${req.user.username} , logged in with Google`);
  }
);

app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.send("Logged out!");
  })
})

// Protected route
app.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ message: `Welcome ${req.user.username}` });
});

app.get("/", (req, res) => {
  res.send("Hey, sar server is ruuning well ")
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
})