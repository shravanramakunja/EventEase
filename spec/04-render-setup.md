# ✅ Phase 04 — Render Setup

> **Goal:** Configure Render for deployment using Render Blueprint and set environment variables.

---

## 🏗️ 4.1 (Recommended) Option A — Render Blueprint (Automated)

Render Blueprint uses a `render.yaml` file in your repo to auto-configure the service.

### Step 1: Create the render.yaml File

A `spec/render.yaml` file has been provided — but it needs to be at the **project root** for Render to detect it. However, since it's in `spec/`, you'll use the manual method below instead OR copy it.

- [ ] Copy `spec/render.yaml` to the project root:
  ```bash
  copy spec\render.yaml render.yaml
  ```

- [ ] Verify the file is at the project root:
  ```bash
  dir render.yaml
  ```

### Step 2: Push render.yaml to GitHub

- [ ] Commit and push:
  ```bash
  git add render.yaml
  git commit -m "feat: add Render Blueprint config"
  git push
  ```

### Step 3: Import Blueprint to Render

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Click **"New +"** → **"Blueprint"**
- [ ] Connect your GitHub repository
- [ ] Render will automatically detect `render.yaml` and show the service config
- [ ] Fill in the **sync: false** environment variables (see section 4.3 below)
- [ ] Click **"Apply"**

✅ **Done!** Render creates the Web Service automatically.

---

## 🔧 4.2 Option B — Manual Web Service Setup (Fallback)

If Blueprint doesn't work for you:

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect your GitHub repository
- [ ] Configure:

| Setting | Value |
|---|---|
| **Name** | `eventease` |
| **Region** | `Oregon (US West)` *(closest to your audience)* |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

- [ ] Scroll down to **"Advanced"** → **"Add Environment Variable"**
- [ ] Add all variables from section **4.3** below
- [ ] Click **"Create Web Service"**
- [ ] Wait ~2–5 minutes for deployment

---

## 🌐 4.3 Environment Variables — The Complete Set

These must be configured in Render (in Environment → Environment Variables).

| Variable | Value (Example) | Source |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://eventeaseUser:...@cluster0.xxxxx.mongodb.net/eventease?retryWrites=true&w=majority` | Phase 02 |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Phase 03 |
| `ADMIN_EMAIL` | `admin@example.com` | Your choice |
| `ADMIN_PASSWORD` | `YnV3MTIzNDU2Nzg5MDEyMzQ1Njc4OTA=` | Phase 01 |
| `SESSION_SECRET` | `e3f2a1b0c9d8e7f6a5b4c3d2e1f0a1b2...` | Phase 01 |
| `NODE_ENV` | `production` | (fixed value) |
| `PORT` | `8080` | (Render will also override this) |

- [ ] **MONGO_URI** — Paste the full MongoDB Atlas connection string from Phase 02
- [ ] **RESEND_API_KEY** — Paste the API key from Phase 03
- [ ] **ADMIN_EMAIL** — Set to your preferred admin email
- [ ] **ADMIN_PASSWORD** — Paste the generated admin password from Phase 01
- [ ] **SESSION_SECRET** — Paste the generated session secret from Phase 01
- [ ] **NODE_ENV** — Set to `production`
- [ ] Double-check for **typos** in the connection string (especially `@`, `:`, `/`)
- [ ] All 7 variables saved in Render

> 🔐 **Note:** Variables with `sync: false` in `render.yaml` are marked as secret — Render will not show their values after saving.

---

## 📝 4.4 Create `.env.example` for Documentation

- [ ] Create a `.env.example` file at the project root:

```env
# ==============================
# EventEase — Environment Config
# ==============================

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/eventease?retryWrites=true&w=majority

# Resend API Key (starts with re_)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Admin login credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Session encryption secret (min 32 chars)
SESSION_SECRET=your-random-session-secret

# Port (Render sets automatically, this is just a fallback)
PORT=8080
```

- [ ] Add and commit:
  ```bash
  git add .env.example
  git commit -m "docs: add .env.example for deployment reference"
  git push
  ```

---

## 🔍 4.5 Pre-Deployment Health Check

Before moving on, verify your project structure:

- [ ] `package.json` has `"start": "node server.js"` script
- [ ] `server.js` uses `process.env.PORT || 8080`
- [ ] `config/db.js` reads `process.env.MONGO_URI`
- [ ] `.env` is in `.gitignore`
- [ ] `node_modules` is not committed to Git
- [ ] No hardcoded secrets anywhere in the code

---

## ✅ Phase 04 Checklist

| # | Task | Done? |
|---|---|---|
| 4.1 | `render.yaml` placed at project root (or using manual setup) | ☐ |
| 4.2 | Web Service created on Render | ☐ |
| 4.3 | All 7 environment variables configured in Render | ☐ |
| 4.4 | `.env.example` created and committed | ☐ |
| 4.5 | Pre-deployment health checks passed | ☐ |

---

**▶ Next Step:** → [Phase 05 — Code Migration (Nodemailer → Resend)](./05-code-migration.md)
