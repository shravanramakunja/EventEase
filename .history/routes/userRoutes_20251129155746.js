// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Show registration page
router.get("/", userController.showRegister);

router.get("/register", (req, res) => {
  res.render("index");  // or "registerPage" depending on your file name
});


// Handle registration form
router.post("/register", userController.registerUser);

// Success page
router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
