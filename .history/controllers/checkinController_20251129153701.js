const excelHandler = require("../utils/excelHandler");

// QR CHECK-IN
exports.submitCheckin = (req, res) => {
  try {
    const { uniqueId } = req.body;

    if (!uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Missing QR data"
      });
    }

    const result = excelHandler.updateCheckin(uniqueId);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({
          success: false,
          message: "User not found"
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
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// MANUAL CHECK-IN (Seat + Email/Name)
exports.manualCheckin = (req, res) => {
  try {
    const { seat, email } = req.body;

    if (!seat || !email) {
      return res.status(400).json({
        success: false,
        message: "Seat number + Email/Name required"
      });
    }

    const rows = excelHandler.getAll();

    let foundUser = null;

    rows.forEach((user) => {
      const seatMatch = user.Seat?.toString() === seat.toString();
      const emailMatch = user.Email === email;
      const nameMatch = user.Name === email;

      if (seatMatch && (emailMatch || nameMatch)) {
        foundUser = user;
      }
    });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "No matching user found"
      });
    }

    if (foundUser.CheckedIn === "Yes") {
      return res.status(409).json({
        success: false,
        message: "Already checked in",
        data: foundUser
      });
    }

    const result = excelHandler.updateCheckin(foundUser.UniqueID);

    return res.json({
      success: true,
      message: `${foundUser.Name} (Seat ${foundUser.Seat}) checked in successfully`,
      data: foundUser
    });

  } catch (err) {
    console.error("Manual Check-in Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
