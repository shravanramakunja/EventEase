const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Landing Page (Home)
router.get("/", (req, res) => {
  res.render("index");
});

// Show Registration Form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle Registration Submit (POST)
router.post("/register", userController.registerUser);

// FIXED SUCCESS PAGE (GET - NO SAVING HAPPENS HERE)
router.get("/success", (req, res) => {
  res.render("success", {
    name: req.query.name,
    usn: req.query.usn,
    department: req.query.department,
    seat: req.query.seat,
    parents: req.query.parents,
    email: req.query.email
  });
});

module.exports = router;
