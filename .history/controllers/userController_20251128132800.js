const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mailer");
const excelHandler = require("../utils/excelHandler");
const { pickRandomSeatForDepartment } = require("../utils/seatAllocator");
const { DEPARTMENTS } = require("../utils/constants");

const 
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
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));

    // save local QR file
    const qrFolder = path.join(__dirname, "..", "public", "qr");
    if (!fs.existsSync(qrFolder)) fs.mkdirSync(qrFolder, { recursive: true });
    const qrPath = path.join(qrFolder, `${uniqueId}.png`);
    await QRCode.toFile(qrPath, JSON.stringify(qrPayload));

    // save to excel
    excelHandler.saveRegistration({
      Name: name,
      USN: usn,
      Email: email,
      Department: department,
      Seat: seat,
      Parents: parents,
      UniqueID: uniqueId,
      CheckedIn: "No"
    });

    // prepare email
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

    // send email
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

    // show success
    res.render("success", { name, usn, department, seat, parents, email });

  } catch (err) {
    console.error(err);
    res.render("index", {
      departments: Object.keys(DEPARTMENTS),
      error: "Registration failed"
    });
  }
};
