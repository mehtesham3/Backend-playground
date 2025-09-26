import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, require: true },
  content: { type: String, require: true },
  author: { type: String, require: true },
  createdAt: { type: Date }
})

export const blog = mongoose.model("blogDetail", blogSchema);

