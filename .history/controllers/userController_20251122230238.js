const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mailer");   // your nodemailer transporter
const excelHandler = require("../utils/excelHandler");

exports.registerUser = async (req, res) => {
  try {
    const { name, usn, email, food } = req.body;

    const seat = Math.floor(100 + Math.random() * 900);
    const uniqueId = uuidv4();

    const qrData = JSON.stringify({
      name,
      usn,
      seat,
      uniqueId,
    });

    // ⬇️⬇️⬇️ ADD THIS BLOCK HERE — BEFORE GENERATING QR ⬇️⬇️⬇️

    // Ensure /public/qr exists
    const qrFolder = path.join(__dirname, "..", "public", "qr");
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    // Generate QR file path
    const qrPath = path.join(qrFolder, `${uniqueId}.png`);

    // Generate QR Code file
    await QRCode.toFile(qrPath, qrData);

    // ⬆️⬆️⬆️ END OF BLOCK ⬆️⬆️⬆️

    // Save registration in Excel
    excelHandler.saveRegistration({
      Name: name,
      USN: usn,
      Email: email,
      Food: food,
      Seat: seat,
      UniqueID: uniqueId,
      CheckedIn: "No",
    });

    // Load email template
    const templatePath = path.join(__dirname, "..", "templates", "emailTemplate.html");
    const emailHTML = fs.readFileSync(templatePath, "utf8");

    const finalHTML = ejs.render(emailHTML, {
      name,
      usn,
      seat,
      food,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Event Registration & QR Code",
      html: finalHTML,
      attachments: [
        {
          filename: "qrcode.png",
          path: qrPath,
          cid: "qrImage",
        },
      ],
    });

    res.redirect("/success");
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Something went wrong");
  }
};
