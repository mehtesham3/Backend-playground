// test-connect.js
import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
    await mongoose.disconnect();
    console.log("✅ Disconnected");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1);
  }
})();
