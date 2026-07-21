const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: String,
  usn: String,
  email: String,
  department: String,
  seat: String,
  parents: Number,
  uniqueId: { type: String, unique: true },
  checkedIn: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  qrCode: { type: Buffer, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Registration", RegistrationSchema);
