// controllers/checkinController.js
const excelHandler = require("../utils/excelHandler");

exports.submitCheckin = (req, res) => {
  const { uniqueId } = req.body;

  const success = excelHandler.updateCheckin(uniqueId);

  if (!success) {
    return res.json({ status: "error", message: "Invalid QR or User Not Found" });
  }

  res.json({ status: "success", message: "Checked-in successfully!" });
};
