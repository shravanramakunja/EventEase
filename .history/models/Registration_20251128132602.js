const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: String,
  usn: String,
  email: String,
  department: String,
  seat: String,
  parents: Number,         // ✔ MATCHES CONTROLLER
  uniqueId: String,        // ✔ required for QR scanning
  checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Registration", RegistrationSchema);
