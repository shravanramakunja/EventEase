const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Landing Page (Home)
router.get("/", (req, res) => {
  res.render("index", {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  });
});

// Show Registration Form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle Registration Submit (POST)
router.post("/register", userController.registerUser);

// QR Code Download (by uniqueId)
router.get("/qr/download/:uniqueId", userController.downloadQR);

// Success Page
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
