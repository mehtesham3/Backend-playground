//Implement refresh tokens with JWT
import express from 'express'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import User from './Schema/User.js';
import Token from './Schema/Token.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then((() => console.log("Connected successfully with mongo")))
  .catch(err => console.error(err));


const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_SECRET, { expiresIn: "15m" });
};

//Check all the connection
app.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    status: "OK",
    uptime: process.uptime() + "s",
    timestamp: new Date(),
    database: dbStatus,
  })
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).send("Enter proper detials");
  }
  const user = await User.findOne({ username: username });
  if (user) return res.status(404).send("User already exists");
  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    username: username,
    password: hashed
  });
  res.json({ message: "User registered", });
})

app.get("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).send("Enter proper detials");
  }
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await Token.create({ userId: user._id, token: refreshToken });

  res.json({ accessToken, refreshToken });
})

app.post("/refresh", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  const storedToken = await Token.findOne({ token });
  if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  })
})

app.post("/logout", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  await Token.findOneAndDelete({ token });
  res.json({ message: "Logged out successfully" });
})

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
};

app.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`)
})