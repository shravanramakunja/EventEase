const express = require("express");
const router = express.Router();

// Temporary route (so no error)
router.get("/", (req, res) => {
  res.send("Admin route works");
});

module.exports = router;
