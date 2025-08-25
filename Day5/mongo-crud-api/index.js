//API with user registration and fetching users
import express from "express"
import mongoose from 'mongoose'
const { Schema } = mongoose;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/")
  .then(console.log("MongoDB is connected "))
  .catch(err => console.error(err));

const UserDetails = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
})

const user = mongoose.model("UserDetail", UserDetails);

app.post("/users", async (req, res) => {
  const newUser = await user.create(req.body);
  res.json(newUser);
})

app.get("/users", async (req, res) => {
  const getAllUser = await user.find();
  res.json(getAllUser);
})
app.get("/users/:id", async (req, res) => {
  const findUserById = await user.findById(req.params.id);
  res.json(findUserById);
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
})