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
module.exports = router;
