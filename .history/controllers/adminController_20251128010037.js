const excelHandler = require("../utils/excelHandler");
const csvExporter = require("../utils/csvExporter");
const path = require("path");

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

exports.deleteUser = (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  excelHandler.deleteUser(req.params.uniqueId);
  res.redirect("/admin");
};
