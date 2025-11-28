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

    return res.json({
      success: true,
      message: `${result.row.Name} checked in successfully`,
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
