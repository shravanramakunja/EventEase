// controllers/checkinController.js
const excelHandler = require("../utils/excelHandler");

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

    // SUCCESS → Send redirect command
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
exports.manualCheckin = async (req, res) => {
  try {
    const { seat, email } = req.body;

    const workbook = excelHandler.readExcel();
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = excelHandler.sheetToJson(sheet);

    let foundUser = null;

    rows.forEach((user, idx) => {
      if (
        (user.Seat && user.Seat.toString() === seat.toString()) &&
        (user.Email === email || user.Name === email)
      ) {
        foundUser = { user, idx };
      }
    });

    if (!foundUser) {
      return res.json({ success: false, message: "User not found." });
    }

    // Update CheckedIn = Yes
    rows[foundUser.idx].CheckedIn = "Yes";

    // Save it back
    excelHandler.writeJsonToSheet(rows);

    res.json({
      success: true,
      message: `${foundUser.user.Name} (Seat: ${foundUser.user.Seat}) checked in successfully!`,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Manual check-in failed." });
  }
};
