const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mailer");
const excelHandler = require("../utils/excelHandler");
const { pickRandomSeatForDepartment } = require("../utils/seatAllocator");
const { DEPARTMENTS } = require("../utils/constants");
const Registration = require("../models/Registration");

exports.showRegister = (req, res) => {
  res.render("index", { departments: Object.keys(DEPARTMENTS), error: null });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, usn, email, department, parents } = req.body;

    if (!name || !usn || !email || !department || parents === "") {
      return res.render("index", {
        departments: Object.keys(DEPARTMENTS),
        error: "Please fill all fields"
      });
    }

    const seat = pickRandomSeatForDepartment(department);
    const uniqueId = uuidv4();

    const qrPayload = { name, usn, department, seat, parents, uniqueId };
    const qrBase64 = await QRCode.toDataURL(JSON.stringify(qrPayload));

    const qrFolder = path.join(__dirname, "..", "public", "qr");
    if (!fs.existsSync(qrFolder)) fs.mkdirSync(qrFolder, { recursive: true });

    const qrPath = path.join(qrFolder, `${uniqueId}.png`);
    await QRCode.toFile(qrPath, JSON.stringify(qrPayload));

    // SAVE TO EXCEL
    excelHandler.saveRegistration({
      Name: name,
      USN: usn,
      Email: email,
      Department: department,
      Seat: seat,
      Parents: parents,
      uniqueId,
      CheckedIn: "No"
    });

    // SAVE TO MONGODB
    try {
      await Registration.create({
        name, usn, email, department, seat, parents, uniqueId, checkedIn: false
      });
      console.log("✔ MongoDB Save Successful");
    } catch (err) {
      console.error("MongoDB Save Error:", err);
    }

    // Prepare email template
    const templatePath = path.join(__dirname, "..", "templates", "emailTemplate.html");
    const html = ejs.render(fs.readFileSync(templatePath, "utf8"), {
      name,
      usn,
      department,
      seat,
      parents,
      date: "15th NOVEMBER 2024",
      address: "Dr M V Jayaraman Auditorium",
      time: "2:00 PM",
      title: "Event Registration",
      year: new Date().getFullYear()
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: `Your Registration – Seat ${seat}`,
      html,
      attachments: [
        { filename: "qrcode.png", path: qrPath, cid: "qrImage" },
        { filename: "eventease-logo.png", path: "./public/uploads/eventease-logo.png", cid: "eventLogo" }
      ]
    });

    res.render("success", { name, usn, department, seat, parents, email });

  } catch (err) {
    console.error(err);
    res.render("index", {
      departments: Object.keys(DEPARTMENTS),
      error: "Registration failed"
    });
  }
};
