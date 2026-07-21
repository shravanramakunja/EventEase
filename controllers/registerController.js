const Registration = require("../models/Registration");
const excelHandler = require("../utils/excelHandler");
const resend = require("../config/mailer");

exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // 1️⃣ Save to Excel File
    await excelHandler.addUserToExcel(userData);

    // 2️⃣ Save to MongoDB
    const savedUser = await Registration.create(userData);

    // 3️⃣ Send Confirmation Email (optional)
    await resend.emails.send({
      from: '"EventEase" <noreply@buildercentral.in>',
      to: [userData.email],
      subject: "Registration Successful",
      text: `Hello ${userData.name}, your seat is ${userData.seat}.`,
    });

    res.status(200).json({
      message: "Registered Successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
