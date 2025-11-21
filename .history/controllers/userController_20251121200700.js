const path=require("path");
const express = require("express");
const router = express.Router();
const{v4:uuidv4}=require("uuid");
const excelHandler=require("../utils/excelHandler");
const mailer=require("../config/mailer");

exports.registerUser = async (req, res) => {
  try {
    const { name, usn, email, food } = req.body;

    // Generate seat number randomly (1–200)
    const seat = Math.floor(Math.random() * 200) + 1;
    const uniqueId = uuidv4();

    const qrData = { name, usn, email, food, seat, uniqueId };

    // Generate QR code (base64)
    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    // Save to Excel
    excelHandler.addRow({
      Name: name,
      USN: usn,
      Email: email,
      Food: food,
      Seat: seat,
      UniqueID: uniqueId,
      CheckedIn: "No",
    });

    // Send Email with Embedded QR
    await mailer.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Event Registration QR Code",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your registration is successful!</p>
        <p><b>Seat:</b> ${seat}</p>
        <p><b>Food:</b> ${food}</p>
        <p>Show this QR at the entry:</p>
        <img src="${qrImage}" width="200"/>
      `,
    });

    res.render("success", { name, seat });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
};