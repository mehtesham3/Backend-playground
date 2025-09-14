import "dotenv/config";
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import user from "./Schema.js";

// import dotenv from "dotenv"
// dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // try {
  let User = await user.findOne({ googleId: profile.id });
  if (!User) {
    User = new user({
      username: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    });
    await User.save();
  }
  return done(null, User);
  // } catch (error) {
  //   return done(error, null);
  // }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
})
passport.deserializeUser(async (id, done) => {
  try {
    const User = await user.findById(id);
    done(null, User);
  } catch (error) {
    done(error, null);
  }
})

export default passport;