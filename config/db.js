// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 🔥 Log to verify WHICH database you're connected to
    mongoose.connection.on("connected", () => {
      console.log("📌 Connected to DB:", mongoose.connection.name);
    });

    console.log("MongoDB Connected (Local)");

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
