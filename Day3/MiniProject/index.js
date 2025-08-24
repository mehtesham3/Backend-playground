import express from "express"
import { loggingMiddleware } from "./Logging.js";

const app = express();

const dummyJson = {
  "id": "10000293009",
  "name": "Ehtesham",
  "role": "Student",
}

app.use(loggingMiddleware);

// health route
app.get("/status", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/users", (req, res) => {
  res.json({ dummyJson: dummyJson });
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
})