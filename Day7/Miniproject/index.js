//Build a full mini project: Blog API
/*
Features:

User signup/login (JWT)
CRUD posts (title, content, author)
Authenticated users can create/edit/delete posts
*/

import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/User.js";
import dotenv from "dotenv";
import blogRoute from "./Routes/Blog.js";
import { errorLogger, requestLogger } from "../../Day17/MinorProject/middelware/loggerMiddelware.js";
dotenv.config({ path: './.env' });

mongoose.connect("mongodb://localhost:27017/Blog")
  .then(console.log("MongoDB is running successfully"))
  .catch(err => { console.log(`Error occured due to : ${err.message}`) });

const app = express();
app.use(express.json());

app.use("/", userRoute);
app.use("/blog", blogRoute);
app.use(requestLogger);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
})

// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found:`
//   });
// });
app.use(errorLogger);

export default app;

app.listen(process.env.PORT || "8080", () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || "8080"}/`);
})

