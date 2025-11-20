// routes/checkinRoutes.js
const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/checkinController");

// Middleware to protect check-in page
function isAdminLoggedIn(req, res, next) {
  if (req.session.admin) return next();
  return res.redirect("/admin/login");
}

// Check-in scanner page
router.get("/", isAdminLoggedIn, (req, res) => {
  res.render("checkin");
});

// Verify QR request (POST)
router.post("/verify", isAdminLoggedIn, checkinController.verifyCheckin);

module.exports = router;
