//Connect Express app with MongoDB
import express from "express"
import mongoose from "mongoose"

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/TestNew")
  .then(() => { console.log("MongoDB is connected successfully"); })
  .catch(err => { console.error(err) });

