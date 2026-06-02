# 🚀 PrepAI — Production Deployment Guide

This guide outlines how to deploy the **PrepAI** application securely to production. 

To bypass Firebase's **Spark Tier** limitations (which require a paid Blaze upgrade to compile Firebase Cloud Functions), we have completed a fully unified Express Node.js backend. This allows you to host the backend completely for **free** on platforms like **Render**, **Railway**, or **Heroku**, while keeping your fast frontend hosted on **Firebase Hosting**.

---

## 🗺️ Deployment Overview

Choose your preferred production deployment path:

1. **Option A: Unified Express Node Backend (Recommended — 100% Free)**
   - Host your Express backend on **Render/Railway** (Free Tier).
   - Host your React frontend on **Firebase Hosting** (Free Spark Tier).
2. **Option B: Serverless Firebase Cloud Functions (Paid Firebase Plan)**
   - Requires upgrading your Firebase Project to the **Blaze (Pay-as-you-go)** tier.
   - Deploys both backend functions and frontend hosting directly through Firebase CLI.

---

## 🔌 Option A: Unified Express Backend (100% Free)

### Step 1: Deploy the Express Backend (Render / Railway)
1. Commit the project to your GitHub repository (ensure `.env` is ignored via Git).
2. Create a free account on **[Render.com](https://render.com/)**.
3. Create a new **Web Service** and connect your GitHub repository.
4. Configure the service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `10000` (or leave default)
   - `MONGO_URI`: `mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET`: `supersecretkey` (your JWT signature secret)
   - `GROQ_API_KEY`: `gsk_...` (your secure Groq API key)
6. Click **Deploy**. Render will generate a public URL for your backend, for example:
   `https://prepai-backend.onrender.com`

---

### Step 2: Build & Deploy Frontend (Firebase Hosting)
1. Open your client environment file `frontend/.env` and update `VITE_API_URL` to point to your new public Render backend URL:
   ```env
   VITE_API_URL=https://prepai-backend.onrender.com/api
   ```
2. Navigate to the `frontend/` workspace and build your optimized static assets:
   ```bash
   cd frontend
   npm run build
   ```
   *This compiles all assets into the `frontend/dist` directory.*
3. From the root directory, deploy your static assets to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```
4. **Done!** Your app is live at `https://prepai-38233.web.app` and securely processes cheat sheets, resume scans, roadmaps, and mock interviews via your Render backend.

---

## ⚡ Option B: Serverless Firebase Cloud Functions (Paid Blaze Tier)

If you prefer a 100% serverless, zero-maintenance architecture and have upgraded your Firebase account to the **Blaze Tier**:

### Step 1: Set Up Cloud Secrets
All Groq AI calls are executed in isolated, secure Firebase Cloud Environments.
```bash
# Store your Groq API secret key securely in your Firebase Functions environment
firebase functions:secrets:set GROQ_API_KEY=gsk_your_real_groq_key_here
```

### Step 2: Deploy Cloud Functions
1. Navigate to the `functions/` directory and install dependencies:
   ```bash
   cd functions
   npm install
   ```
2. Deploy the isolated Cloud Functions to Google Cloud Servers:
   ```bash
   firebase deploy --only functions
   ```
   *Your serverless endpoints will activate at:*
   `https://us-central1-prepai-38233.cloudfunctions.net/<functionName>`

### Step 3: Build & Deploy Frontend
1. Open `frontend/.env` and leave `VITE_API_URL` empty or comment it out so that the frontend defaults to relative serverless endpoints (`/api/...`).
2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy the frontend to Hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 🔍 Post-Deployment Verification

1. **2FA Telemetry Access**: Navigate to `https://prepai-38233.web.app/admin` and verify that the 2FA passcode overlay prompts securely. Enter `159753` to access active Firestore telemetry.
2. **Plaintext Credential Check**: Press `F12` inside the browser during signup or mock interview generation. Verify that your Groq API key or Mongo credentials **never** print to console warnings or network logs.
3. **No Active Computers**: Close all local terminal instances on your computer. Navigate to your deployed hosting URL and confirm that resume scanners, interview simulators, cheatsheets, roadmaps, and file chats operate flawlessly!
