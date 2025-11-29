const excelHandler = require("../utils/excelHandler");

// QR CHECK-IN
exports.submitCheckin = (req, res) => {
  try {
    const { uniqueId } = req.body;

    if (!uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR Data"
      });
    }

    const result = excelHandler.updateCheckin(uniqueId);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({
          success: false, message: "User not found"
        });
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
      redirect: "/admin",
      data: result.row
    });

  } catch (err) {
    console.error("Check-in Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// MANUAL CHECK-IN
exports.manualCheckin = (req, res) => {
  try {
    const { seat, email } = req.body;

    if (!seat || !email) {
      return res.status(400).json({
        success: false,
        message: "Seat + Email/Name required"
      });
    }

    const rows = excelHandler.getAll();

    let user = rows.find(r =>
      r.Seat?.toString() === seat.toString() &&
      (r.Email === email || r.Name === email)
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.CheckedIn === "Yes") {
      return res.status(409).json({
        success: false,
        message: "Already checked in",
        data: user
      });
    }

    excelHandler.updateCheckin(user.uniqueId);

    return res.json({
      success: true,
      message: `${user.Name} (Seat ${user.Seat}) checked in successfully`,
      data: user
    });

  } catch (err) {
    console.error("Manual Check-in Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
