

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

// Handle login
router.post("/login", adminController.login);

// Admin Dashboard (protected)
router.get("/", ensureAdminOrFromCheckin, adminController.dashboard);

// Export CSV (protected)
router.get("/export", ensureAdminOrFromCheckin, adminController.exportCSV);

// Manual check-in (POST) — FIXED
router.post(
  "/manual-checkin",
  ensureAdminOrFromCheckin,
  adminController.manualCheckin
);

// Approve user (protected)
router.get("/approve/:uniqueId", ensureAdminOrFromCheckin, adminController.approveUser);

// Delete user (protected)
router.get("/delete/:id", ensureAdminOrFromCheckin, adminController.deleteUser);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/admin/login");
  });
});

module.exports = router;
