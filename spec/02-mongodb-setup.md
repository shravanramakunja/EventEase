# ✅ Phase 02 — MongoDB Atlas Setup

> **Goal:** Create a cloud MongoDB cluster, configure access, and get a connection string.

---

## 🗺️ Overview

Render (free tier) does **not** host MongoDB. Instead, you connect to **MongoDB Atlas** — a fully managed cloud database. The app connects to it via a connection string stored in an environment variable (`MONGO_URI`).

```
┌─────────────────────┐     Internet      ┌──────────────────┐
│  Render (Node.js)   │ ◄──────────────►  │  MongoDB Atlas   │
│  process.env.MONGO_URI │               │  (Cloud Cluster) │
└─────────────────────┘                   └──────────────────┘
```

---

## 🏗️ 2.1 Create a Cluster

- [ ] Go to [MongoDB Atlas](https://cloud.mongodb.com) and log in
- [ ] Click **"Build a Database"** or **"Create"**
- [ ] Select **"FREE" (M0)** tier — it's sufficient for EventEase
- [ ] Choose a Cloud Provider & Region:
  - **Provider:** AWS (recommended) or GCP
  - **Region:** Choose one close to your Render server region (e.g., `us-east-1` or `eu-west-1`)
  - Example: Render in `Oregon` → Atlas in `US-WEST-2`
- [ ] Click **"Create Cluster"**
- [ ] Wait ~2–3 minutes for cluster provisioning

---

## 👤 2.2 Create a Database User

- [ ] In the left sidebar, go to **Database Access** (under **Security**)
- [ ] Click **"Add New Database User"**
- [ ] Set:
  - **Authentication Method:** Password
  - **Username:** `eventeaseUser` (or your choice)
  - **Password:** Paste the password you generated in Phase 01
  - **Database User Privileges:** `Read and Write to Any Database`
- [ ] Click **"Add User"**

---

## 🌐 2.3 Configure Network Access

Render free-tier services have **dynamic IP addresses** (they change), so we must allow connections from anywhere.

- [ ] In the left sidebar, go to **Network Access**
- [ ] Click **"Add IP Address"**
- [ ] Select **"Allow Access from Anywhere"** (automatically enters `0.0.0.0/0`)
- [ ] **Comment:** `Allow all (Render free tier)`
- [ ] Click **"Confirm"**

> ⚠️ **Security Note:** `0.0.0.0/0` means any IP can attempt to connect — but they still need the username/password. For production with a paid Render plan, [use Render's static IP ranges](https://render.com/docs/static-ip).

---

## 🔗 2.4 Get the Connection String (MONGO_URI)

- [ ] Click **"Connect"** button on your cluster page
- [ ] Select **"Connect your application"**
- [ ] Choose:
  - **Driver:** `Node.js`
  - **Version:** `4.1 or later` (or latest)
- [ ] Copy the connection string, which looks like:

  ```
  mongodb+srv://eventeaseUser:<password>@cluster0.xxxxx.mongodb.net/eventease?retryWrites=true&w=majority
  ```

- [ ] **Replace `<password>`** with the actual database user password you generated
- [ ] **Replace the database name** (`eventease`) with your preferred DB name
  - Good names: `eventease`, `eventease_prod`, `college_fest`
- [ ] **Save this final string** — it will be set as `MONGO_URI` in Render later

### Example Final Connection String:

```
mongodb+srv://eventeaseUser:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6@cluster0.ab1cd2e.mongodb.net/eventease_prod?retryWrites=true&w=majority
```

---

## 🔍 2.5 Verify Connectivity (Optional but Recommended)

Since `.env` is ignored by Git, create a local test:

- [ ] Create a `.env` file (if not already present):
  ```env
  MONGO_URI=mongodb+srv://eventeaseUser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/eventease?retryWrites=true&w=majority
  ```
- [ ] Start the app locally:
  ```bash
  npm start
  ```
- [ ] Check the terminal for:
  ```
  📌 Connected to DB: eventease
  MongoDB Connected (Local)
  ```
- [ ] If you see an error, check:
  - Password has special characters? → URL-encode them (e.g., `@` → `%40`)
  - IP whitelist correctly set to `0.0.0.0/0`?
  - Username and password correct?

---

## ✅ Phase 02 Checklist

| # | Task | Done? |
|---|---|---|
| 2.1 | M0 cluster created on MongoDB Atlas | ✅ |
| 2.2 | Database user created (`eeventease_db_user`) | ✅ |
| 2.3 | Network access set to `0.0.0.0/0` | ✅ |
| 2.4 | Connection string (`MONGO_URI`) copied & saved | ✅ |
| 2.5 | Local test: app connects to Atlas successfully | ✅ |

---

**▶ Next Step:** → [Phase 03 — Resend Setup](./03-resend-setup.md)
