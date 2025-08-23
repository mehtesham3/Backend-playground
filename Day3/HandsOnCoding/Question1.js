//Create routes with Express (GET, POST)
import express, { json } from "express";

const app = express();

app.use(express.json());

app.get("/getuser", (req, res) => {
  res.send("Request is from getuser section ");
})

app.post("/postuser", (req, res) => {
  const { body } = req.body;
  res.send("Request is coming from POST section");
  console.log(JSON.stringify(body));
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/ ");
})