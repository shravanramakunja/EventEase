const express = require("express");
const router = express.Router();

// Temporary route (so no error)
router.get("/admin", (req, res) => {
  res.render("Admin route works");
});

module.exports = router;
