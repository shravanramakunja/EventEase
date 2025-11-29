const excelHandler = require("../utils/excelHandler");
const path = require("path");
const fs = require("fs");
const csvWriter = require("csv-writer").createObjectCsvWriter;
const { DEPARTMENTS } = require("../utils/constants"); // <-- added

// ==============================
// ADMIN LOGIN
// ==============================
exports.login = (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect("/admin");
  }

  return res.render("adminLogin", { error: "Invalid credentials" });
};

// ==============================
// ADMIN DASHBOARD (UPDATED)
// ==============================
exports.dashboard = (req, res) => {
  const data = excelHandler.getAll();

  return res.render("adminDashboard", {
    data,
    departments: Object.keys(DEPARTMENTS)  // <-- send department list to EJS
  });
};

// ==============================
// EXPORT CSV
// ==============================
exports.exportCSV = (req, res) => {
  const rows = excelHandler.getAll();
  const filePath = path.join(__dirname, "../data/export.csv");

  const writer = csvWriter({
    path: filePath,
    header: [
      { id: "Name", title: "Name" },
      { id: "USN", title: "USN" },
      { id: "Email", title: "Email" },
      { id: "Department", title: "Department" },
      { id: "Seat", title: "Seat" },
      { id: "Parents", title: "Parents" },
      { id: "CheckedIn", title: "CheckedIn" },
      { id: "uniqueId", title: "UniqueID" }
    ]
  });

  writer.writeRecords(rows).then(() => {
    res.download(filePath, (err) => {
      if (!err) fs.unlinkSync(filePath);
    });
  });
};

// ==============================
// DELETE USER
// ==============================
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  const deleted = excelHandler.deleteUser(id);

  if (!deleted) {
    console.log("User not found:", id);
  }

  return res.redirect("/admin");
};

// ==============================
// QR CHECK-IN
// ==============================
exports.submitCheckin = (req, res) => {
  try {
    const { uniqueId } = req.body;

    if (!uniqueId) {
      return res.status(400).json({ success: false, message: "Invalid QR Data" });
    }

    const result = excelHandler.updateCheckin(uniqueId);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (result.reason === "already_checked_in") {
        return res.status(409).json({
          success: false,
          message: "Already checked in",
          data: result.row
        });
      }
    }

    return res.json({
      success: true,
      redirect: "/admin?fromCheckin=true",
      data: result.row
    });

  } catch (err) {
    console.error("Check-in Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==============================
// MANUAL CHECK-IN
// ==============================
exports.manualCheckin = (req, res) => {
  try {
    const { seat, email } = req.body;

    if (!seat || !email) {
      return res.status(400).json({ success: false, message: "Seat + Email/Name required" });
    }

    const rows = excelHandler.getAll();

    const user = rows.find(r =>
      r.Seat?.toString() === seat.toString() &&
      (r.Email === email || r.Name === email)
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.CheckedIn === "Yes") {
      return res.status(409).json({
        success: false,
        message: "Already checked in",
        data: user
      });
    }

    const result = excelHandler.updateCheckin(user.uniqueId);

    return res.json({
      success: true,
      redirect: "/admin?fromCheckin=true",
      message: `${user.Name} (Seat ${user.Seat}) checked in successfully`,
      data: result.row
    });

  } catch (err) {
    console.error("Manual Check-in Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
