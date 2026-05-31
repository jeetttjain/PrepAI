# 🚀 PrepAI — Production Deployment Guide

This guide outlines the steps required to deploy the **PrepAI** web application (Frontend + Backend) to production.

---

## 🗄️ 1. Database Setup (MongoDB Atlas)
PrepAI uses MongoDB for storing user accounts, interview logs, roadmaps, and cheatsheets.
1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (Shared/Free tier is sufficient for launch).
3. Under **Database Access**, create a user with read/write access.
4. Under **Network Access**, add `0.0.0.0/0` (or your backend's static IP) to allow connections.
5. Copy your cluster's **Connection String** (e.g., `mongodb+srv://...`).

---

## 💻 2. Backend Deployment
The Node/Express backend is ready to run on any cloud provider supporting Node.js (e.g., **Render**, **Railway**, **Heroku**, or a **Linux VPS**).

### Deployment Environment Variables
Set the following environment variables in your server's hosting panel:
| Key | Example Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for Express server |
| `NODE_ENV` | `production` | Enables optimized logging & error hiding |
| `MONGO_URI` | `mongodb+srv://...` | Secure connection string from MongoDB Atlas |
| `JWT_SECRET` | `your-random-32char-secret` | Cryptographic secret for signing tokens |
| `GROQ_API_KEY` | `gsk_...` | Groq console key for fast content generation |
| `FRONTEND_URL` | `https://prepai-app.com` | Production URL of your frontend (protects CORS) |

### Start Scripts
Configure your hosting platform's start command to execute:
```bash
npm install --omit=dev
npm start
```

---

## 🎨 3. Frontend Deployment
The React client is built with Vite and can be hosted for **free** on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### Deployment Environment Variables
Set this single variable in your frontend project dashboard:
| Key | Example Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://api.prepai-app.com/api` | The hosted URL of your backend server API |

### Build Configurations
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`
*   **Node Version:** `18.x` or higher

---

## 🔐 4. Post-Deployment Security Checks
Once both environments are live:
1. Try accessing the frontend right-click context menu or pressing `F12` — verify they trigger custom security toasts.
2. Confirm console output remains clean and the background debugger pauses runtime if inspection tools are opened in production.
3. Access `https://prepai-app.com/admin` to set up your admin parameters (Uses Master Password: `admin_prepai_2026_secure` + 2FA rolling code).
4. Verify backend routes respond with standard `404 Resource not found` when accessed with invalid paths.
