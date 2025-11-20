// server.js

require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const checkinRoutes = require("./routes/checkinRoutes");

const app = express();

// ----------------------
//  MIDDLEWARE SETUP
// ----------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Session configuration (for admin login)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "somesecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ----------------------
//  VIEW ENGINE SETUP
// ----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----------------------
//  ROUTES
// ----------------------
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/checkin", checkinRoutes);

// Home redirect (optional)
app.get("/", (req, res) => {
  res.render("index"); // Registration page
});







// ----------------------
//  SERVER START
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
