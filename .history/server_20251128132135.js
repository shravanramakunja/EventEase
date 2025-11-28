// server.js

require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const connectDB = require("./config/db");

const app = express();

// =====================
//  CONNECT DATABASE
// =====================
connectDB();

// =====================
//  MIDDLEWARE
// =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "somesecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

// =====================
//  VIEW ENGINE
// =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =====================
//  ROUTES
// =====================
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/checkin", checkinRoutes);

// ❌ REMOVE THIS — old and not needed
// app.use("/api", registerRoutes);

// =====================
//  START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
