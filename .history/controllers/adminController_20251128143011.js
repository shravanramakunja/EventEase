// controllers/adminController.js
const excelHandler = require("../utils/excelHandler");
const csvExporter = require("../utils/csvExporter");
const path = require("path");
const Registration = require("../models/Registration");   

exports.dashboard = (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const data = excelHandler.getAll();
  res.render("adminDashboard", { data });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.redirect("/admin");
  }
  res.render("adminLogin", { error: "Invalid credentials" });
};

exports.exportCSV = async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const csvPath = await csvExporter.exportCSV();
  return res.download(csvPath, "registrations.csv");
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.session.admin) return res.redirect("/admin/login");

    const uniqueId = req.params.uniqueId;

    // 🔥 1. Delete from MongoDB
    const mongoDelete = await Registration.deleteOne({ uniqueId });

    // 🔥 2. Delete from Excel
    const excelDelete = excelHandler.deleteUser(uniqueId);

    if (mongoDelete.deletedCount === 0 && !excelDelete) {
      return res.send("User not found in MongoDB or Excel.");
    }

    res.redirect("/admin");

  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.send("Error deleting user.");
  }
};
