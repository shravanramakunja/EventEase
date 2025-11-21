// routes/checkinRoutes.js
const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/checkinController");

// Check-in page (scanner UI)
router.get("/", (req, res) => {
  res.render("checkinPage");
});

// Handle QR form submit
router.post("/submit", checkinController.submitCheckin);

module.exports = router;
