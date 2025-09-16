import "dotenv/config";
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import db from "../db.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // try {
  let User = await db("users").where({ google_id: profile.id }).first();
  if (!User) {
    const [newUser] = await db("users").insert({
      name: profile.displayName,
      email: profile.emails[0].value,
      google_id: profile.id,
    }).returning('*');
    User = newUser;
  }
  return done(null, User);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
  try {
    const User = await db("users").where({ id }).first();
    done(null, User);
  } catch (error) {
    done(error, null);
  }
})

export default passport;