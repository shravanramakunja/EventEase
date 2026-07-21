# ✅ Phase 05 — Code Migration: Nodemailer → Resend

> **Goal:** Update the codebase to use Resend SDK instead of Nodemailer/Gmail SMTP for sending registration emails.

---

## 🔬 5.1 Understanding the Current Email Flow

```
┌────────────────────────────┐
│  userController.js         │
│  ┌──────────────────────┐  │
│  │ setImmediate() {     │  │
│  │   1. Generate QR     │  │
│  │   2. Save to Excel   │  │
│  │   3. transporter     │  │
│  │      .sendMail({     │  │
│  │        from: Gmail,  │  │
│  │        to: user,     │  │
│  │        html,         │  │
│  │        attachments   │  │
│  │      })              │  │
│  └──────────────────────┘  │
└───────────┬────────────────┘
            │
            ▼
┌────────────────────────────┐
│  config/mailer.js          │
│  nodemailer.createTransport│
│  ({ host: smtp.gmail.com })│
└────────────────────────────┘
```

**After migration:**

```
┌────────────────────────────┐
│  userController.js         │
│  ┌──────────────────────┐  │
│  │ transporter.emails   │  │
│  │   .send({            │  │
│  │     from: Domain,    │  │
│  │     to: [user],      │  │
│  │     html,            │  │
│  │     attachments      │  │
│  │   })                 │  │
│  └──────────────────────┘  │
└───────────┬────────────────┘
            │
            ▼
┌────────────────────────────┐
│  config/mailer.js          │
│  new Resend(process.env.   │
│    RESEND_API_KEY)         │
└────────────────────────────┘
```

---

## 📦 5.2 Install Resend SDK

- [ ] Run in terminal:
  ```bash
  npm install resend
  ```
- [ ] Verify it appears in `package.json` under `dependencies`:
  ```json
  "dependencies": {
    ...
    "resend": "^4.x.x",
    ...
  }
  ```
- [ ] Commit the change:
  ```bash
  git add package.json package-lock.json
  git commit -m "feat: add Resend SDK for email delivery"
  ```

---

## ✏️ 5.3 Update `config/mailer.js`

**Current file (`config/mailer.js`):**
```js
const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
```

**Replace with:**
```js
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
module.exports = resend;
```

- [ ] Replaced contents of `config/mailer.js` with Resend initialization
- [ ] Removed `nodemailer` require
- [ ] Removed `MAIL_USER` and `MAIL_PASS` env var references

---

## ✏️ 5.4 Update `controllers/userController.js`

**Find the email sending block** (around line 65–95):

**Current code:**
```js
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
```

**Replace with:**
```js
// Decide which 'from' address to use
const FROM_ADDRESS = process.env.RESEND_DOMAIN
  ? `"EventEase" <noreply@${process.env.RESEND_DOMAIN}>`
  : `"EventEase" <onboarding@resend.dev>`;

await transporter.emails.send({
  from: FROM_ADDRESS,
  to: [email],
  subject: `Your Registration – Seat ${seat}`,
  html,
  attachments: [
    {
      filename: "qrcode.png",
      content: qrBuffer.toString("base64"),
    },
    {
      filename: "eventease-logo.png",
      path: path.join(__dirname, "..", "public", "uploads", "eventease-logo.png"),
    },
  ],
});
```

**Key differences:**

| Nodemailer | Resend |
|---|---|
| `transporter.sendMail({...})` | `transporter.emails.send({...})` |
| `to: email` (string) | `to: [email]` (array) |
| `content: qrBuffer` (Buffer) | `content: qrBuffer.toString("base64")` (base64 string) |
| `cid: "qrImage"` (inline) | Not supported directly — use base64 in HTML |
| `from: "...<${process.env.MAIL_USER}>"` | `from: "Name <domain>"` |

- [ ] Updated `sendMail` → `emails.send`
- [ ] Changed `to` from string to array
- [ ] Converted QR buffer to base64 string
- [ ] Removed `cid` from attachments
- [ ] Updated `from` address to use Resend format

---

## ✏️ 5.5 Update `controllers/registerController.js` (if used)

The same changes apply if this file is still active:

- [ ] Updated `sendMail` → `emails.send`
- [ ] Changed attachment format if needed
- [ ] Removed `cid` fields

---

## ✏️ 5.6 Update Email Template for Inline Images

**Current (`templates/emailTemplate.html`):**
```html
<img src="cid:qrImage" alt="QR Code" class="qr-img" />
<img src="cid:eventLogo" alt="EventEase Logo" />
```

Since Resend doesn't support `cid:` inline images the same way, you have two options:

### Option A: Embed QR as Data URI (Recommended)
Modify the EJS template to accept a base64 QR code directly:
```html
<img src="data:image/png;base64,<%= qrBase64 %>" alt="QR Code" class="qr-img" />
```
Then in `userController.js`, pass `qrBase64` when rendering the template.

### Option B: Use Public URL for Logo
Upload the logo to a public place and use an absolute URL:
```html
<img src="https://eventease.onrender.com/uploads/eventease-logo.png" alt="EventEase Logo" />
```

- [ ] Updated `templates/emailTemplate.html` to use `data:` URI or public URL for images
- [ ] (If using Option A) Added `qrBase64` to the EJS render call in `userController.js`

---

## 🧹 5.7 Clean Up

- [ ] Uninstall Nodemailer:
  ```bash
  npm uninstall nodemailer
  ```
- [ ] Remove `MAIL_USER` and `MAIL_PASS` from any remaining references
- [ ] Remove `GMAIL_USER`, `GMAIL_PASS` from your `.env` file (local)
- [ ] Commit all changes:
  ```bash
  git add .
  git commit -m "feat: migrate email from Nodemailer/Gmail to Resend"
  git push
  ```

---

## 📋 5.8 Summary of Changed Files

| File | Change |
|---|---|
| `config/mailer.js` | Nodemailer → Resend initialization |
| `controllers/userController.js` | Updated API call + attachment format |
| `controllers/registerController.js` | Same update (if active) |
| `templates/emailTemplate.html` | Inline image `cid:` → base64/URL |
| `package.json` | Added `resend`, removed `nodemailer` |
| `.env.example` | Updated env vars |

---

## ✅ Phase 05 Checklist

| # | Task | Done? |
|---|---|---|
| 5.2 | `resend` npm package installed | ☐ |
| 5.3 | `config/mailer.js` updated to use Resend | ☐ |
| 5.4 | `controllers/userController.js` email call updated | ☐ |
| 5.5 | `controllers/registerController.js` updated (if used) | ☐ |
| 5.6 | Email template updated for Resend attachment format | ☐ |
| 5.7 | `nodemailer` uninstalled | ☐ |
| 5.7 | `MAIL_USER` / `MAIL_PASS` removed from `.env` | ☐ |
| 5.7 | All changes committed and pushed to GitHub | ☐ |

---

**▶ Next Step:** → [Phase 06 — Deployment & Verification](./06-deployment.md)
