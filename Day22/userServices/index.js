import express from "express"
import userRoute from "./Routes/userRoutes.js";
import mongoose from 'mongoose'

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/userdb')
  .then(console.log("MongoDB is running successfully"))
  .catch(err => { console.log(`Error occured due to : ${err.message}`) });

app.use('/', userRoute);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "user-service", // change to post-service in that service
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error in userServices" });
})


app.listen("5001", () => {
  console.log("Server is running on port http://localhost:5001/");
})