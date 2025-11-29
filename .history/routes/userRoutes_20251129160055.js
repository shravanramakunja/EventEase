const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Landing Page (Home)
router.get("/", (req, res) => {
  res.render("index"); 
});

// Show Registration Form
router.get("/register", (req, res) => {
  res.render("register");  // This is the new register.ejs
});

// Handle Registration Submit
router.post("/register", userController.registerUser);

// Success Page
router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
