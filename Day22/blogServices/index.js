import express from "express"
import mongoose from 'mongoose'
import blogRoute from "./Routes/blogRoutes.js";

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blogdb')
  .then(console.log("MongoDB is running successfully"))
  .catch(err => { console.log(`Error occured due to : ${err.message}`) });

app.use('/', blogRoute);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "blog-service", // change to post-service in that service
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error in userServices" });
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


app.listen("5002", () => {
  console.log("Server is running on port http://localhost:5002/");
})