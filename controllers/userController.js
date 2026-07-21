const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const excelHandler = require("../utils/excelHandler");
const { pickRandomSeatForDepartment } = require("../utils/seatAllocator");
const { DEPARTMENTS } = require("../utils/constants");
const Registration = require("../models/Registration");

// ==============================
// QR CODE DOWNLOAD
// ==============================
exports.downloadQR = async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const user = await Registration.findOne({ uniqueId });

    if (!user || !user.qrCode) {
      return res.status(404).send("QR code not found");
    }

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qrcode-${user.usn || user.uniqueId}.png"`,
    });

    return res.send(user.qrCode);

  } catch (err) {
    console.error("QR Download Error:", err);
    return res.status(500).send("Server error");
  }
};

// ==============================
// REGISTER USER
// ==============================
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
    // BACKGROUND TASK: QR + Excel (no email — sent after admin approval)
    // -------------------------------------
    setImmediate(async () => {
      try {
        // Create QR payload
        const qrPayload = { name, usn, department, seat, parents, uniqueId };
        const qrJson = JSON.stringify(qrPayload);

        // Generate QR as buffer (Cloud Run safe)
        const qrBuffer = await QRCode.toBuffer(qrJson);
        console.log("✔ QR Generated");

        // Store QR buffer in MongoDB for later email sending
        await Registration.updateOne(
          { uniqueId },
          { $set: { qrCode: qrBuffer } }
        );
        console.log("✔ QR Stored in DB");

        // Update Excel (with Approved: No)
        excelHandler.saveRegistration({
          Name: name,
          USN: usn,
          Email: email,
          Department: department,
          Seat: seat,
          Parents: parents,
          uniqueId,
          CheckedIn: "No",
          Approved: "No",
        });

        console.log("✔ Excel Updated (pending approval)");

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
