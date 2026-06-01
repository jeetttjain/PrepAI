# 🚀 PrepAI — Serverless Production Deployment Guide

This guide outlines the steps required to deploy the **PrepAI** application securely to production using **Firebase Hosting** and **Firebase Cloud Functions**. 

By transitioning to a serverless model, **no local terminal, backend server, or active computer is required** to keep the platform online!

---

## 🔐 1. Groq API Secret Security Configuration

All AI interactions (questions, resume analysis, cheatsheets, learning roadmaps, and document RAG chats) are securely executed in isolated Cloud Environments. The browser has 0% access to any credentials.

Before deploying your Cloud Functions, configure your **Groq API Key** securely inside your Firebase project:

```bash
# Set your Groq API secret key securely in Firebase Functions config
firebase functions:secrets:set GROQ_API_KEY=gsk_your_real_groq_key_here
```

---

## ⚙️ 2. Backend Cloud Functions Deployment

The secure serverless layer is fully declared inside the `functions/` directory.

### Local Emulation (Optional)
To test the Cloud Functions locally before deploying:
1. Navigate to the `functions/` directory and install dependencies:
   ```bash
   cd functions
   npm install
   ```
2. Verify that `functions/.env` contains your `GROQ_API_KEY`.
3. Start the local emulators:
   ```bash
   firebase emulators:start --only functions
   ```

### Deploy to Cloud Environment
Deploy your isolated API endpoints to Google Cloud Servers:
```bash
firebase deploy --only functions
```

Deployed serverless endpoints will be active at:
`https://us-central1-<your-project-id>.cloudfunctions.net/<functionName>`

---

## 🎨 3. Frontend Hosting Deployment

The React client compiles into optimized, static HTML/JS/CSS, perfect for secure hosting on **Firebase Hosting**.

### Build Optimized Payload
1. Navigate to the `frontend/` directory and install client dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Generate the production-grade static build:
   ```bash
   npm run build
   ```
   *This compiles client code and bundle layers into the `frontend/dist/` directory.*

### Deploy to Firebase Hosting
Deploy your static assets directly:
```bash
firebase deploy --only hosting
```

Your application is now live at:
`https://<your-project-id>.web.app` or `https://<your-project-id>.firebaseapp.com`

---

## 🔍 4. Post-Deployment Verification

1. **2FA Gate Access**: Navigate to `https://<your-project-id>.web.app/admin` and verify that the 2FA passcode overlay prompts securely. Enter `159753` to access active Firestore telemetry.
2. **Developer Inspect Blockers**: Press `F12` or right-click to inspect. Verify that custom security block overlays intercept key calls and the background debugger pauses runtime execution.
3. **No Local Terminals**: Close all local terminal instances on your computer. Navigate to your deployed hosting URL and confirm that resume scanners, interview simulators, cheatsheets, roadmaps, and file chats operate flawlessly!
