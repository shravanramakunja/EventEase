const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: String,
  usn: String,
  email: String,
  department: String,
  food: String,
  seat: String,
  parentCount: Number,
  qrCode: String,
}, { timestamps: true });

module.exports = mongoose.model("Registration", RegistrationSchema);
