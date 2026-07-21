# ✅ Phase 03 — Resend Setup

> **Goal:** Set up Resend as your email provider, verify your domain, and generate an API key.

---

## ❓ Why Resend instead of Nodemailer/Gmail?

| Feature | Nodemailer + Gmail | Resend |
|---|---|---|
| Daily limit | 500 emails/day | 100/day (free) / 50,000/day (paid) |
| Setup complexity | SMTP config + OAuth | Single API key |
| Works on Render? | Yes (SMTP) | ✅ Yes — **native REST API** |
| Attachment support | ✅ Full | ✅ Full (base64) |
| Deliverability | Medium (Gmail flags) | High (dedicated infrastructure) |
| Analytics | No | Opens, clicks, bounces via webhooks |

Resend is purpose-built for **transactional emails** (registration confirmations, QR codes, etc.) and is much simpler to set up on cloud platforms.

---

## 🏗️ 3.1 Create Resend Account

- [ ] Go to [Resend.com](https://resend.com) and click **"Start for Free"**
- [ ] Sign up using GitHub or email
- [ ] Verify your email address (check inbox for confirmation link)
- [ ] Complete the onboarding survey (or skip)

---

## 🌐 3.2 Verify Your Domain (Sandbox vs. Production)

### The Sandbox (Default)

When you first sign up, Resend places you in **sandbox mode**:
- ✅ Can send emails **only to `delivered@resend.dev`**
- ❌ Cannot send to real email addresses
- ✅ Good for testing

### Adding a Verified Domain

To send to real users (e.g., `student@gmail.com`), you must verify a domain you own.

- [ ] In Resend Dashboard, go to **Domains**
- [ ] Click **"Add Domain"**
- [ ] Enter your domain name (e.g., `yourcollege.edu` or `myevent.com`)
  - If you don't have a domain, you can purchase one or skip this step and only send to yourself during testing
- [ ] Copy the 3 DNS records provided (TXT, MX, CNAME)
- [ ] Add these records to your domain's DNS provider (Namecheap, GoDaddy, Cloudflare, etc.)

**Example DNS records for Resend:**
```
Type  Name                    Value
TXT   _resend.yourdomain.com  "resend-xxx-xxxxx=xxxxx"
MX    resend.yourdomain.com    feedback-smtp.yourdomain.com
CNAME  email.yourdomain.com    resend.net
```

- [ ] Wait for DNS propagation (can take 5 min to 24 hours)
- [ ] Click **"Verify"** in the Resend dashboard
- [ ] Status should change to **"Verified"** ✅

> 🎓 **College users:** If you don't own a domain, you can still proceed. Just know that during testing, only `delivered@resend.dev` will receive emails.

---

## 🔑 3.3 Generate an API Key

- [ ] In Resend Dashboard, go to **API Keys**
- [ ] Click **"Create API Key"**
- [ ] Configure:
  - **Name:** `EventEase Production` (or any descriptive name)
  - **Permission:** `Full Access`
- [ ] Click **"Create"**
- [ ] ⚠️ **IMPORTANT:** Copy the API key immediately — it starts with `re_` and looks like:
  ```
  re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
- [ ] Save it securely — you'll set it as `RESEND_API_KEY` in Render
- [ ] (Optional) Create a **second API key** with `Sending Only` permission for extra security

> 🔒 **Never** commit the API key to Git. It will only live in Render's Environment Variables.

---

## 📧 3.4 Understand the Sending Address Format

When you send emails via Resend, the `from` address must use a verified domain.

**If your domain is verified:**
```
from: "EventEase" <noreply@yourdomain.com>
```

**If using sandbox (Resend default):**
```
from: "EventEase" <onboarding@resend.dev>
```

- [ ] Decide which `from` address format you'll use
- [ ] Note: This will go into the code in Phase 05

---

## 📊 3.5 (Optional) Explore Resend Dashboard

Familiarize yourself with:

- [ ] **Audience** — manage subscriber lists
- [ ] **Emails** — view sent emails, delivery status, open rates
- [ ] **Webhooks** — receive real-time delivery events (bounces, opens)
- [ ] **API Keys** — manage access tokens
- [ ] **Domains** — manage verified sending domains

---

## ✅ Phase 03 Checklist

| # | Task | Done? |
|---|---|---|
| 3.1 | Resend account created | ☐ |
| 3.2 | Domain verified (or using sandbox) | ☐ |
| 3.3 | API key generated & saved (starts with `re_`) | ☐ |
| 3.4 | `from` address format decided | ☐ |
| 3.5 | Understand sandbox limitation (only `delivered@resend.dev` until domain verified) | ☐ |

---

**▶ Next Step:** → [Phase 04 — Render Setup](./04-render-setup.md)
