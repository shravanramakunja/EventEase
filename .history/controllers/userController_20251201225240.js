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

exports.registerUser = async (req, res) => {
  try {
    const { name, usn, email, department, parents } = req.body;

    if (!name || !usn || !email || !department || parents === "") {
      return res.render("index", {
        departments: Object.keys(DEPARTMENTS),
        error: "Please fill all fields",
      });
    }

    // Create seat and unique ID
    const seat = pickRandomSeatForDepartment(department);
    const uniqueId = uuidv4();

    // Save to MongoDB
    await Registration.create({
      name,
      usn,
      email,
      department,
      seat,
      parents,
      uniqueId,
      checkedIn: false,
    });

    console.log("✔ MongoDB Save Successful");

    // Send success page immediately
    res.redirect(
      `/success?name=${encodeURIComponent(name)}&usn=${encodeURIComponent(
        usn
      )}&department=${encodeURIComponent(
        department
      )}&seat=${encodeURIComponent(
        seat
      )}&parents=${encodeURIComponent(
        parents
      )}&email=${encodeURIComponent(email)}`
    );

    // -------------------------------------
    // BACKGROUND TASK: QR + Excel + Email
    // -------------------------------------
    setImmediate(async () => {
      try {
        // Create QR payload
        const qrPayload = { name, usn, department, seat, parents, uniqueId };
        const qrJson = JSON.stringify(qrPayload);

        // Generate QR as buffer (Cloud Run safe)
        const qrBuffer = await QRCode.toBuffer(qrJson);
        console.log("✔ QR Generated");

        // Update Excel
        excelHandler.saveRegistration({
          Name: name,
          USN: usn,
          Email: email,
          Department: department,
          Seat: seat,
          Parents: parents,
          uniqueId,
          CheckedIn: "No",
        });

        console.log("✔ Excel Updated");

        // Load HTML email template
        const templatePath = path.join(
          __dirname,
          "..",
          "templates",
          "emailTemplate.html"
        );

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
          year: new Date().getFullYear(),
        });

        // Send Email
        await transporter.sendMail({
          from: `"EventEase" <${process.env.MAIL_USER}>`,
          to: email,
          subject: `Your Registration – Seat ${seat}`,
          html,
          attachments: [
            {
              filename: "qrcode.png",
              content: qrBuffer,
              cid: "qrImage"
            },
            {
              filename: "eventease-logo.png",
              path: path.join(__dirname, "..", "public", "uploads", "eventease-logo.png"),
              cid: "eventLogo"
            }
          ],
        });

        console.log(`📧 Email sent to ${email}`);

      } catch (bgErr) {
        console.error("Background Task Error:", bgErr);
      }
    });

  } catch (err) {
    console.error(err);
    res.render("index", {
      departments: Object.keys(DEPARTMENTS),
      error: "Registration failed",
    });
  }
};
