// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/", adminController.dashboard);

// Login form (GET)
router.get("/login", (req, res) => {
  res.render("adminLogin");
});

// Login submit (POST)
router.post("/login", adminController.login);

module.exports = router;
