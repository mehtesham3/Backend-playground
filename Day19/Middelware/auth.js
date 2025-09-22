import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config({ path: "../.env" })

const authMiddelware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Access denied . No token" });
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY || "MySecret");
    req.user = decode;
  } catch (error) {
    console.log("Error occured in middelware due to : ", error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
  next();
}

export default authMiddelware;