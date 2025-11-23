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

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.admin = true;
    return res.redirect("/admin");
  }

  res.render("adminLogin", { error: "Invalid credentials" });
};

exports.exportCSV = async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");

  const success = await csvExporter.exportCSV();
  if (!success) return res.send("CSV export failed");

  const filePath = path.join(__dirname, "../data/registrations.csv");
  res.download(filePath, "registrations.csv");
};

exports.deleteUser = (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");

  const { uniqueId } = req.params;
  const success = excelHandler.deleteUser(uniqueId);

  if (!success) return res.send("User not found or cannot delete");

  res.redirect("/admin");
};
