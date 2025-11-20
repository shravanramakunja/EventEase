// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Middleware (protect routes)
function isAdminLoggedIn(req, res, next) {
  if (req.session.admin) return next();
  return res.redirect("/admin/login");
}

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login submit
router.post("/login", adminController.login);

// Dashboard (protected)
router.get("/", isAdminLoggedIn, adminController.dashboard);

// Export CSV
router.get("/export", isAdminLoggedIn, adminController.exportCSV);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
