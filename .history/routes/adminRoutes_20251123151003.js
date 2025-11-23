const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/", adminController.dashboard);

// Login form (GET)
router.get("/login", (req, res) => {
  res.render("adminLogin", { error: null }); // FIX ADDED
});

// Login submit (POST)
router.post("/login", adminController.login);
router.post("/export",adminController.export)

module.exports = router;
