# ✅ Phase 01 — Pre-Requisites & Account Setup

> **Goal:** Create all required accounts, generate secure passwords, and prepare your Git repository.

---

## 📦 1.1 Required Accounts

Before starting, ensure you can sign up for these services (all free tiers work):

| Service | Purpose | Free Tier Limit |
|---|---|---|
| [GitHub](https://github.com) | Host your code | Unlimited public repos |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database | 512 MB storage |
| [Resend](https://resend.com) | Email delivery | 100 emails/day free |
| [Render](https://render.com) | App hosting | 750 hrs/month + 15 min sleep |

---

## 🔐 1.2 Generate Secure Passwords

You will need the following secure values. Generate them now:

### Password #1 — MongoDB Atlas User Password

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```
**Example output:** `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`

- [ ] Generated MongoDB database user password (copy somewhere safe)
- [ ] Saved as `MONGO_DB_PASSWORD` in your password manager

### Password #2 — Admin Dashboard Password

This is the password for logging into `/admin` on EventEase.

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"
```
**Example output:** `YnV3MTIzNDU2Nzg5MDEyMzQ1Njc4OTA=`

- [ ] Generated Admin password (at least 16 chars)
- [ ] Will use as `ADMIN_PASSWORD` later

### Password #3 — Session Secret

Used by Express to encrypt session cookies.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Example output:** `e3f2a1b0c9d8e7f6a5b4c3d2e1f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f`

- [ ] Generated Session Secret (64 chars hex)
- [ ] Will use as `SESSION_SECRET` later

---

## 📁 1.3 Git Repository Preparation

- [ ] Your project is already in a Git repository locally
- [ ] Verify `.env` is in `.gitignore`:
  ```bash
  cat .gitignore
  # Should contain: .env
  ```
- [ ] Verify `node_modules/` is in `.gitignore` (should be implicit with Node)
- [ ] Commit any pending changes:
  ```bash
  git add .
  git commit -m "chore: prepare for Render deployment"
  ```
- [ ] Create a **public repository** on GitHub (if not already)
  ```bash
  # Example (if not linked yet):
  git remote add origin https://github.com/YOUR_USERNAME/EventEase.git
  git branch -M main
  git push -u origin main
  ```

---

## ✅ Phase 01 Checklist

| # | Task | Done? |
|---|---|---|
| 1.1 | GitHub account ready & repository pushed | ☐ |
| 1.2 | MongoDB Atlas account created | ☐ |
| 1.3 | Resend account created | ☐ |
| 1.4 | Render account created | ☐ |
| 1.5 | MongoDB database user password generated | ☐ |
| 1.6 | Admin password generated | ☐ |
| 1.7 | Session secret generated | ☐ |
| 1.8 | All secrets saved securely (not in code!) | ☐ |
| 1.9 | Code pushed to GitHub public repo | ☐ |

---

**▶ Next Step:** → [Phase 02 — MongoDB Atlas Setup](./02-mongodb-setup.md)
