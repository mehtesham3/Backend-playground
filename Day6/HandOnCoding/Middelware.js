import jwt from "jsonwebtoken"
const authMiddelware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ eror: "Access denied . No token " });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    req.user = decode;
    next();
  }
  catch (error) {
    console.log("Error occured in middelware due to : ", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });

  }
}

export default authMiddelware;