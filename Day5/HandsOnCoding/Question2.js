//Perform CRUD operations on a User model
import express from "express"
import mongoose from 'mongoose'
const { Schema } = mongoose;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/TestNew")
  .then(console.log("MongoDB is connected successfully"))
  .catch(err => { console.error(err) });

//User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true }
})
const user = mongoose.model("User", userSchema);

//Create

const newUser = await user.create({
  "name": "Intiaz",
  "email": "ehteshamm595@gmali.com",
  "age": 20
})

console.log(newUser);

//Read
const FindAllUser = await user.find();
console.log(FindAllUser)

const FindUserById = await user.findById("68aca1a370a9fdf1e6a69db3");
console.log(FindUserById)

const FindOneUser = await user.findOne({ "name": "Ehtesham" });
console.log(FindOneUser);

//Update
const UpdateUser = await user.findByIdAndUpdate("68aca1a370a9fdf1e6a69db3", { "age": 19 }, { new: true });
console.log(UpdateUser);

//Delete
await user.findByIdAndDelete("68aca1a370a9fdf1e6a69db3")
console.log(DeletUser);
