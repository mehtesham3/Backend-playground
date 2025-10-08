import jwt from "jsonwebtoken"
import "dotenv/config"
import db from "../../db.js";

const authMiddelware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Access denied . No token" });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await db("users")
      .where({ id: decode.id })
      .select("id", "name", "email", "role")
      .first();
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
  } catch (error) {
    console.log("Error occured in middelware due to : ", error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
  next();
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

export default authMiddelware;