# 📋 EventEase — Deployment Specification

> **Project:** EventEase — College Event Registration & Check-In System  
> **Deploy Target:** [Render.com](https://render.com)  
> **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)  
> **Email Service:** [Resend](https://resend.com)  
> **Version:** 1.0.0 | **Updated:** July 2026

---

## 📁 Spec Files Overview

| # | File | What It Covers |
|---|---|---|
| 1 | [`01-pre-requisites.md`](./01-pre-requisites.md) | Create accounts, generate passwords, prepare git repo |
| 2 | [`02-mongodb-setup.md`](./02-mongodb-setup.md) | MongoDB Atlas cluster, database user, network access, connection string |
| 3 | [`03-resend-setup.md`](./03-resend-setup.md) | Resend account, domain verification, API key generation |
| 4 | [`04-render-setup.md`](./04-render-setup.md) | Render account, Blueprint config, environment variables |
| 5 | [`05-code-migration.md`](./05-code-migration.md) | Migrate Nodemailer → Resend, update email template |
| 6 | [`06-deployment.md`](./06-deployment.md) | Deploy, run smoke tests, check logs, troubleshoot |
| 7 | [`07-production-hardening.md`](./07-production-hardening.md) | Security, monitoring, performance, going live |
| — | [`render.yaml`](./render.yaml) | Render Blueprint — auto-deploy configuration file |

---

## 🚦 How to Use This Spec

**Step 1:** Start with **Phase 01** and work through each phase sequentially.  
**Step 2:** Tick the ✅ checkboxes as you complete each task.  
**Step 3:** By the end of **Phase 06**, your app will be live on Render.  
**Step 4:** Use **Phase 07** for post-deployment hardening before going public.

> ⏱ **Estimated Time:** 1–2 hours (first time) | 15–30 min (subsequent deploys)

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Resend Docs: https://resend.com/docs
- Check Render Logs: Dashboard → Your Service → **Logs** tab
