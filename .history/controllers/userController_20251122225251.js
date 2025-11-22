const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

exports.registerUser = async (req, res) => {
  
  // your code for saving user, generating QR etc.

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
        filename: "qr.png",
        path: qrPath,
        cid: "qrImage",
      },
    ],
  });

  res.redirect("/success");
};
