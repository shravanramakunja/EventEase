const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Show registration page with departments + error
router.get("/", userController.showRegister);

// Handle registration submit
router.post("/register", userController.registerUser);

// Success page
router.get("/success", (req, res) => {
  res.render("success", { name: "", usn: "", department: "", seat: "", parents: "", qrDataUrl: "" });
});

module.exports = router;
