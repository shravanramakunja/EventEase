const excelHandler = require("../utils/excelHandler");
const csvExporter = require("../utils/csvExporter");
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
    console.log('DELETE request received. req.params:', req.params);

    if (!uniqueId) {
      console.log('No uniqueId provided in URL.');
      return res.status(400).send("Invalid delete request (no id).");
    }

    // Attempt Mongo delete
    const mongoDelete = await Registration.deleteOne({ uniqueId });
    console.log('Mongo delete result:', mongoDelete);

    // Attempt Excel delete
    const excelDelete = excelHandler.deleteUser(uniqueId);
    console.log('Excel delete result:', excelDelete);

    if (mongoDelete.deletedCount === 0 && !excelDelete) {
      return res.status(404).send("User not found in MongoDB or Excel.");
    }

    return res.redirect("/admin");

  } catch (err) {
    console.error("❌ Delete Error:", err);
    return res.status(500).send("Error deleting user.");
  }
};
