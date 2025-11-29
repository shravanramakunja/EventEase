const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Middleware: allow when session admin is present OR when the request includes ?fromCheckin=true
function ensureAdminOrFromCheckin(req, res, next) {
  // If user is logged in as admin, proceed
  if (req.session && req.session.admin) {
    return next();
  }

  // If query param fromCheckin=true, allow access (used for redirect after scanning)
  // Accept several truthy values
  const qc = req.query.fromCheckin;
  if (qc === "true" || qc === "1" || qc === "yes") {
    return next();
  }

  // Otherwise redirect to login
  return res.redirect("/admin/login");
}

// Admin Login (public)
router.get("/login", (req, res) => {
  res.render("adminLogin", { error: null });
});

// Handle login (POST) — assume adminController.login exists
router.post("/login", adminController.login);

// Protected admin dashboard (uses middleware)
router.get("/", ensureAdminOrFromCheckin, adminController.dashboard);

// Export CSV (protected)
router.get("/export", ensureAdminOrFromCheckin, adminController.exportCSV);

// Delete user (protected)
router.get("/delete/:id", ensureAdminOrFromCheckin, adminController.deleteUser);

// Logout (optional)
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/admin/login");
  });
});

module.exports = router;
