const excelHandler = require("../utils/excelHandler");
const csvExporter = require("../utils/csvExporter");

exports.dashboard = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }

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

// ✅ FIXED — Now properly outside login function
exports.exportCSV = async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }

  const success = await csvExporter.exportCSV();

  if (!success) {
    return res.send("Error exporting CSV");
  }

  const filePath = require("path").join(__dirname, "../data/registrations.csv");

  res.download(filePath, "registrations.csv", (err) => {
    if (err) console.error("CSV Download Error:", err);
  });
};
