# ✅ Phase 07 — Production Hardening & Going Live

> **Goal:** Secure, monitor, and optimize the app before announcing it to users.

---

## 🔒 7.1 Security Hardening

### Session Security
- [ ] Verify `SESSION_SECRET` is at least 32 random characters (generated in Phase 01)
- [ ] In `server.js`, update session config for HTTPS:
  ```js
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,        // ✅ Set to true on Render (HTTPS)
      httpOnly: true,       // ✅ Prevent XSS access to cookies
      sameSite: 'strict'    // ✅ CSRF protection
    }
  }));
  ```
- [ ] Updated session middleware with security flags

### Admin Endpoint Protection
- [ ] Verify admin routes check `req.session.admin` before allowing access
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` are **not** the same as any personal accounts
- [ ] Set strong admin password (minimum 16 characters, mix of uppercase, lowercase, numbers, symbols)

### MongoDB Security
- [ ] Database user has **only** `Read and Write` privileges (not `dbAdmin` or `clusterAdmin`)
- [ ] (Paid plan) Replace `0.0.0.0/0` with [Render's static IP range](https://render.com/docs/static-ip)

### API Key Safety
- [ ] `RESEND_API_KEY` only exists in Render Dashboard — never in code or git
- [ ] No `.env` file committed to GitHub (verify with `git log --all -- .env`)

---

## 🛡️ 7.2 Add Health Check Endpoint

Render can periodically ping a health endpoint to check if your app is alive.

- [ ] Add to `server.js`:
  ```js
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });
  ```
- [ ] Commit and push:
  ```bash
  git add server.js
  git commit -m "feat: add health check endpoint"
  git push
  ```
- [ ] In Render Dashboard → Settings → **Health Check Path**: `/health`

This helps Render detect and restart the app if it becomes unresponsive.

---

## 👁️ 7.3 Monitoring Setup

### Render Logs
- [ ] Familiarize yourself with Render Dashboard → **Logs** tab
- [ ] Logs persist for ~2 weeks — download if you need to keep them longer

### Render Uptime Monitoring
- [ ] In Render Dashboard → **Sidebar** → **Monitoring**
- [ ] Enable monitoring for your service
- [ ] Set up alerts (email notification if service goes down)

### External Uptime Monitoring (Free Options)
- [ ] [UptimeRobot](https://uptimerobot.com) — Free: 5 monitors at 5-min intervals
  - Monitor URL: `https://eventease.onrender.com/health`
  - Get notified via email if the app goes down
- [ ] [cron-job.org](https://cron-job.org) — Free: scheduled pings
  - Set to ping your Render URL every 10 minutes
  - This **also prevents the free tier from sleeping** 🎉

### Prevent Free Tier Sleep (Keep App Awake)
Free Render apps spin down after 15 minutes of inactivity. To stay awake:

[ ] Set up [cron-job.org](https://cron-job.org) to ping your URL every 10 minutes:
  - URL: `https://eventease.onrender.com/health`
  - Schedule: `Every 10 minutes`
  - ✅ This keeps the app warm AND monitors uptime simultaneously

---

## 🚀 7.4 Performance Optimization

### MongoDB
- [ ] Add **indexes** on frequently queried fields in MongoDB:
  ```js
  // Add to models/Registration.js or a separate migration script
  RegistrationSchema.index({ email: 1 });
  RegistrationSchema.index({ seat: 1 });
  RegistrationSchema.index({ uniqueId: 1 });
  ```
- [ ] Enable **MongoDB Atlas auto-scaling** (if on paid tier)

### Application
- [ ] Set `NODE_ENV=production` (already done in Phase 04)
  - Express enables caching, better error handling, and more
- [ ] Enable **Express trust proxy** (needed behind Render's load balancer):
  ```js
  // In server.js
  app.set('trust proxy', 1);
  ```
- [ ] Ensure static assets are cached by the browser:
  - Render's CDN automatically caches static assets from `public/`

### Database Backups
- [ ] Enable **MongoDB Atlas Backups**:
  - Atlas Dashboard → Clusters → **Backup** tab
  - Free tier: Click **"Activate"** for basic backup
  - Paid plans: Set up continuous backup schedule

---

## 📧 7.5 Resend Production Readiness

- [ ] **Domain verified** — emails send from your own domain (not sandbox)
- [ ] **DNS records propagated** — verify with:
  ```bash
  nslookup -type=TXT _resend.yourdomain.com
  ```
- [ ] **Sending limit** checked — Resend free plan: 100 emails/day, 500 emails/month
  - If you exceed this, upgrade to the **Pro** plan ($20/month for 50,000 emails)
- [ ] **Open tracking** — enabled in Resend dashboard (optional)
- [ ] **Webhooks** — set up to receive bounce/complaint notifications (optional)

---

## 🌐 7.6 Custom Domain (Optional)

- [ ] In Render Dashboard → **Settings** → **Custom Domain**
- [ ] Enter your domain (e.g., `eventease.yourcollege.edu` or `register.myevent.com`)
- [ ] Copy the provided `CNAME` record target (e.g., `eventease.onrender.com`)
- [ ] At your DNS provider, add:
  ```
  Type: CNAME
  Name: eventease (or register, or @)
  Value: eventease.onrender.com
  ```
- [ ] Wait for DNS propagation (5 min to 24 hours)
- [ ] In Render Dashboard, status changes to **"Certificate Issued"** ✅
- [ ] Visit `https://yourdomain.com` → it loads the app

---

## 📢 7.7 Launch Checklist — Going Live

### Pre-Launch — 24 Hours Before
- [ ] Run through **all 8 smoke tests** from Phase 06 one final time
- [ ] Register 5 test users with different departments
- [ ] Verify all 5 emails received with correct QR codes
- [ ] Check-in all 5 users (QR scan + manual check-in)
- [ ] Export CSV → verify data is complete
- [ ] Check Render logs — no errors in the last 24 hours
- [ ] Check MongoDB Atlas — no unexpected connection drops

### Launch Day
- [ ] Announce the registration URL
- [ ] Open registrations to users
- [ ] Keep Render Dashboard **Logs** tab open for first hour
- [ ] Monitor **Resend Dashboard** → **Emails** tab for delivery failures
- [ ] Have a test user register and confirm email delivery

### Post-Launch (First 24 Hours)
- [ ] Check logs once per hour
- [ ] Monitor MongoDB Atlas cluster metrics:
  - Connections
  - Operations per second
  - Storage used
- [ ] Monitor Resend usage (approaching daily limit?)

---

## ✅ Phase 07 Checklist

| # | Task | Done? |
|---|---|---|
| 7.1 | Session security hardened (secure, httpOnly, sameSite) | ☐ |
| 7.1 | Admin credentials are strong and unique | ☐ |
| 7.2 | Health check endpoint added (`/health`) | ☐ |
| 7.3 | Uptime monitoring set up (cron-job.org or UptimeRobot) | ☐ |
| 7.3 | App kept awake via periodic ping | ☐ |
| 7.4 | MongoDB indexes added for performance | ☐ |
| 7.4 | `NODE_ENV=production` and `trust proxy` configured | ☐ |
| 7.4 | MongoDB Atlas backups enabled | ☐ |
| 7.5 | Resend domain verified (for production sending) | ☐ |
| 7.5 | Resend sending limits understood (upgrade if needed) | ☐ |
| 7.6 | (Optional) Custom domain configured | ☐ |
| 7.7 | Pre-launch tests passed | ☐ |
| 7.7 | Launch announcement made | ☐ |
| 7.7 | First-hour monitoring completed | ☐ |

---

## 🎉 Congratulations!

You've successfully deployed **EventEase** to production with:

- ✅ **Render** — Reliable cloud hosting
- ✅ **MongoDB Atlas** — Scalable cloud database
- ✅ **Resend** — Professional email delivery with QR codes

Your app is live, monitored, and ready for users!

---

**📚 Additional Resources**

- [Render Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Resend Node.js SDK Guide](https://resend.com/docs/send-with-nodejs)
- [Render Custom Domains](https://render.com/docs/custom-domains)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
