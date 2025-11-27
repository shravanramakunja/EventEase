const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mailer");
const excelHandler = require("../utils/excelHandler");

exports.registerUser = async (req, res) => {
  try {
    const { name, usn, email, food, parents } = req.body;

    // Generate seat
    const seat = Math.floor(100 + Math.random() * 900);

    // Unique ID for ticket
    const uniqueId = uuidv4();

    // QR Data
    const qrData = JSON.stringify({
      name,
      usn,
      seat,
      uniqueId,
    });

    // Ensure /public/qr folder exists
    const qrFolder = path.join(__dirname, "..", "public", "qr");
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    // Create QR path
    const qrPath = path.join(qrFolder, `${uniqueId}.png`);

    // Generate QR image
    await QRCode.toFile(qrPath, qrData);

    // Save registration to Excel
    excelHandler.saveRegistration({
      Name: name,
      USN: usn,
      Email: email,
      Food: food,
      Seat: seat,
      UniqueID: uniqueId,
      CheckedIn: "No",
    });

    // Load email template HTML
    const templatePath = path.join(__dirname, "..", "templates", "emailTemplate.html");
    const emailHTML = fs.readFileSync(templatePath, "utf8");

    // Render dynamic values
    const finalHTML = ejs.render(emailHTML, {
      name,
      usn,
      seat,
      food,
      parents: parents || 0,
      date: "15th NOVEMBER 2024",
      address: "Dr M V Jayaraman Auditorium",
      time: "2:00 PM",
      title: "XXXVII GRADUATION DAY",
      year: new Date().getFullYear()
    });

    // ------------ EMAIL SENDING ------------
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Event Registration – EventEase",

      html: finalHTML,

      attachments: [
        // EVENTEASE LOGO
        {
          filename: "eventease-logo.png",
          path: "./public/uploads/eventease-logo.png",
          cid: "eventLogo",
        },
        // QR-CODE
        {
          filename: "qrcode.png",
          path: qrPath,
          cid: "qrImage",
        },
      ],
    });

    // Redirect on success
    res.redirect("/success");

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Something went wrong");
  }
};
