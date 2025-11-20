// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Registration page
router.get("/", (req, res) => {
  res.render("index");
});

// Handle form submit
router.post("/register", (req, res) => {
  res.send("Register working");
});


// Success page
router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
