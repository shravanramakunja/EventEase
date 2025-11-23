const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/", adminController.dashboard);

// Login form (GET)
router.get("/login", (req, res) => {
  res.render("adminLogin", { error: null });
});

// Login submit (POST)
router.post("/login", adminController.login);

// ✅ Correct export route → GET, not POST
router.get("/export", adminController.exportCSV);
router.get("/delete/:uniqueId", adminController.deleteUser);

module.exports = router;
