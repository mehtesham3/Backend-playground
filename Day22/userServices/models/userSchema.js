import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  googleId: { type: String },  //for googleAuth
})

const userAuth = mongoose.model("UserAuth", userSchema);
export default userAuth;
