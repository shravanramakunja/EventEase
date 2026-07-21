# ✅ Phase 06 — Deployment & Verification

> **Goal:** Deploy the app to Render and run smoke tests to verify everything works.

---

## 🚀 6.1 Trigger the Deployment

### If using Blueprint (Phase 04, Option A):
- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] You should see your "Blueprint" listed
- [ ] Click on it → click **"Apply"** or **"Sync"**
- [ ] Wait for the status to show **"Live"** ✅

### If using Manual Web Service (Phase 04, Option B):
- [ ] Push your latest code to GitHub:
  ```bash
  git push origin main
  ```
- [ ] Render auto-deploys (if `autoDeploy: true`)
- [ ] Alternatively, in Render Dashboard, click **"Manual Deploy"** → **"Deploy Latest Commit"**
- [ ] Wait for the status to show **"Live"** ✅

### Monitor the Build:
- [ ] Click on your service → **Events** tab
- [ ] Watch the deployment logs in real-time
- [ ] Look for these successful log lines:
  ```
  ==> Cloning repository...
  ==> Installing dependencies... (npm install)
  ==> Starting service... (npm start)
  🚀 Server running on http://localhost:8080
  📌 Connected to DB: eventease
  ```
- [ ] If you see errors, check the [Troubleshooting](#-65-troubleshooting) section below

---

## 🔍 6.2 Get the Live URL

- [ ] Copy your Render URL from the dashboard:
  ```
  https://eventease.onrender.com
  ```
  *(or whatever name you chose)*
- [ ] Open the URL in your browser
- [ ] ✅ **The EventEase landing page should load**

---

## ✅ 6.3 Smoke Tests

Run these tests in order. Tick each one as it passes.

### Test 1: Homepage Loads
- [ ] Visit `https://eventease.onrender.com/`
- [ ] ✅ See the EventEase landing page with navigation buttons

### Test 2: Registration Page Loads
- [ ] Click **"Register Now"** (or visit `/register`)
- [ ] ✅ Registration form loads with department dropdown

### Test 3: Submit a Registration
- [ ] Fill in the form with **your own email address**
- [ ] Click **Submit**
- [ ] ✅ Redirected to `/success` page with registration details
- [ ] ✅ Check Render **Logs** tab for:
  ```
  ✔ MongoDB Save Successful
  ✔ QR Generated
  ✔ Excel Updated
  📧 Email sent to your@email.com
  ```

### Test 4: Email Received
- [ ] Check your email inbox (and spam folder)
- [ ] ✅ Email received from Resend with subject "Your Registration – Seat XXX"
- [ ] ✅ Email contains the QR code image
- [ ] ✅ Email contains registration details (name, seat, department)
- [ ] ⚠️ *If using Resend sandbox:* Only `delivered@resend.dev` will receive the email
  - Change the test email to `delivered@resend.dev` temporarily

### Test 5: Admin Login Page Loads
- [ ] Visit `/admin` or click **"Admin Login"**
- [ ] ✅ Login form displays

### Test 6: Admin Login Works
- [ ] Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in Render
- [ ] ✅ Redirected to admin dashboard
- [ ] ✅ Dashboard shows registered users

### Test 7: CSV Export Works
- [ ] In admin dashboard, click **"Export CSV"**
- [ ] ✅ CSV file downloads
- [ ] ✅ Open it — contains the test registration data

### Test 8: Check-in Page Loads
- [ ] Visit `/checkin`
- [ ] ✅ Check-in interface loads (scanner or manual input)

---

## 📋 6.4 Verify Render Logs

From Render Dashboard → Your Service → **Logs**:

- [ ] No `Error:` or `❌` messages
- [ ] No `ECONNREFUSED`, `ECONNRESET`, or timeout errors
- [ ] MongoDB connection successful:
  ```
  📌 Connected to DB: eventease
  ```
- [ ] Email send logged:
  ```
  📧 Email sent to test@example.com
  ```
- [ ] No unhandled promise rejections or stack traces

---

## 🔧 6.5 Troubleshooting

### 🛑 Issue: "MongoDB Connection Error"

**Check:**
- [ ] `MONGO_URI` is correctly set in Render Environment Variables
- [ ] Password is URL-encoded (special chars like `@#%` encoded as `%40%23%25`)
- [ ] Network Access allows `0.0.0.0/0` in MongoDB Atlas
- [ ] Database user has correct permissions
- [ ] Try: In Render Dashboard, go to **Shell** tab and run:
  ```bash
  node -e "mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('OK')).catch(e => console.log(e))"
  ```

### 🛑 Issue: "Email not sending"

**Check:**
- [ ] `RESEND_API_KEY` is correctly set in Render
- [ ] If using sandbox, you can ONLY send to `delivered@resend.dev`
- [ ] If using verified domain, DNS records have propagated
- [ ] Check Resend Dashboard → **Emails** tab for delivery status
- [ ] Check Render logs for any Resend error responses

### 🛑 Issue: "App keeps crashing / restarting"

**Check:**
- [ ] Render Logs → look for the crash reason
- [ ] Common: Port binding issue → ensure `process.env.PORT` is used
- [ ] Common: Missing env var → check all env vars are set
- [ ] Common: Module not found → `npm install` may have failed
- [ ] Try: In Render Dashboard → **Manual Deploy** → **Clear build cache & deploy**

### 🛑 Issue: "Blank page / 502 Bad Gateway"

**Check:**
- [ ] Wait 1–2 minutes (app might still be starting up)
- [ ] Free tier sleeps after 15 min → first request takes 30–60 sec to wake up
- [ ] Check logs for the actual error

### 🛑 Issue: "Session expired / can't stay logged in"

**Check:**
- [ ] `SESSION_SECRET` is set in Render
- [ ] Session cookie is using secure settings (Render uses HTTPS)

---

## ✅ Phase 06 Checklist

| # | Task | Done? |
|---|---|---|
| 6.1 | App deployed to Render (status: **Live**) | ☐ |
| 6.2 | Live URL opens in browser | ☐ |
| 6.3 | Test 1: Homepage loads | ☐ |
| 6.3 | Test 2: Registration page loads | ☐ |
| 6.3 | Test 3: Registration submission works | ☐ |
| 6.3 | Test 4: Email received with QR code | ☐ |
| 6.3 | Test 5: Admin login page loads | ☐ |
| 6.3 | Test 6: Admin login works | ☐ |
| 6.3 | Test 7: CSV export works | ☐ |
| 6.3 | Test 8: Check-in page loads | ☐ |
| 6.4 | No errors in Render logs | ☐ |

---

**▶ Next Step:** → [Phase 07 — Production Hardening](./07-production-hardening.md)
