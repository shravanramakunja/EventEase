const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mailer");   // your nodemailer transporter
const excelHandler = require("../utils/excelHandler");

exports.registerUser = async (req, res) => {
  try {

    // 1️⃣ Get form data
    const { name, usn, email, food } = req.body;

    // 2️⃣ Generate seat number (random)
    const seat = Math.floor(100 + Math.random() * 900);

    // 3️⃣ Generate unique ID
    const uniqueId = uuidv4();

    // 4️⃣ Generate QR JSON data
    const qrData = JSON.stringify({
      name,
      usn,
      seat,
      uniqueId,
    });

    // 5️⃣ Generate QR image file
    const qrPath = path.join(__dirname, "..", "public", "qr", `${uniqueId}.png`);
    await QRCode.toFile(qrPath, qrData);

    // 6️⃣ Save to Excel file
    excelHandler.saveRegistration({
      Name: name,
      USN: usn,
      Email: email,
      Food: food,
      Seat: seat,
      UniqueID: uniqueId,
      CheckedIn: "No",
    });

    // 7️⃣ Load & render HTML email template
    const templatePath = path.join(__dirname, "..", "templates", "emailTemplate.html");
    const emailHTML = fs.readFileSync(templatePath, "utf8");

    const finalHTML = ejs.render(emailHTML, {
      name,
      usn,
      seat,
      food,
      year: new Date().getFullYear(),
    });

    // 8️⃣ Send email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Event Registration & QR Code",
      html: finalHTML,
      attachments: [
        {
          filename: "qrcode.png",
          path: qrPath,
          cid: "qrImage", // must match <img src="cid:qrImage">
        },
      ],
    });

    // 9️⃣ Redirect to success page
    res.redirect("/success");

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Error processing registration");
  }
};
