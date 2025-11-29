const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/", adminController.dashboard);

// Login form
router.get("/login", (req, res) => {
  res.render("adminLogin", { error: null });
});

// Login POST
router.post("/login", adminController.login);

// Export CSV
router.get("/export", adminController.exportCSV);

// Delete a user (ID passed from EJS correctly now)
router.get("/delete/:uniqueId", adminController.deleteUser);

module.exports = router;
