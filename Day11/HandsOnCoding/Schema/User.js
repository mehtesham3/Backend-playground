import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  googleId: String, // for Google OAuth
});

export default mongoose.model("User", userSchema);
