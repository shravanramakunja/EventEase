const express = require("express");
const router = express.Router();

// Temporary route (so no error)
router.get("/", (req, res) => {
  res.render("adminDashboard");
});

module.exports = router;
