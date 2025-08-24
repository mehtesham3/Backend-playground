//Build CRUD routes for a Task resource
import express from "express";
import { v4 as uuidv4 } from "uuid"

const app = express();
app.use(express.json());

//In-memory database;
let tasks = [];

//Create task
app.post("/tasks", (req, res) => {
  const task = {
    id: uuidv4(),
    title: req.body.title,
    status: req.body.status || 'Pending'
  }
  tasks.push(task);
  res.status(201).send("Task created successfully ");
})

//Read task
app.get("/tasks", (req, res) => {
  res.json(tasks);
})

//Read one task
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) res.status(404).json({ message: "Task not found" })
  res.status(200).json(task);
})

//Update via put
app.put("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  //Replace the entire object 
  tasks[index] = { id: req.params.id, ...req.body };
  res.json(tasks[index]);
})

//Update via Patch
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) res.status(404).json({ message: "Task not found" })

  //Update only assign field
  Object.assign(task, req.body);
  res.json(task);
})

//Delete via Delete
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) res.status(404).json({ message: "Task not found" })

  tasks.splice(index, 1);
  res.json("Task is deleted successfully");
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" })
})

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000/")
})