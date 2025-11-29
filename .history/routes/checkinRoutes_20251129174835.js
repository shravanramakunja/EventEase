const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/checkinController");

// Check-in Scanner Page
router.get("/", (req, res) => {
  res.render("checkinPage");
});

// QR Check-in
router.post("/submit", checkinController.submitCheckin);

// Manual Check-in
router.post("/manual", checkinController.manualCheckin);

module.exports = router;
