// controllers/checkinController.js
const excelHandler = require("../utils/excelHandler");

/*
  QR Payload sent from scanner will contain:
  {
      name: "",
      usn: "",
      seat: "",
      department: "",
      uniqueId: ""
  }
*/

exports.submitCheckin = (req, res) => {
  try {
    const { uniqueId } = req.body;

    if (!uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR — missing uniqueId"
      });
    }

    // Update check-in in Excel
    const success = excelHandler.updateCheckin(uniqueId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "User not found — check QR again"
      });
    }

    // Fetch full user after updating
    const userList = excelHandler.getAll();
    const user = userList.find(u => u.UniqueID === uniqueId);

    return res.status(200).json({
      success: true,
      message: `${user.Name} (USN: ${user.USN}) checked in successfully`,
      data: user
    });

  } catch (err) {
    console.error("Check-in Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during check-in"
    });
  }
};
