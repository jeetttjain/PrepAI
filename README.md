# PrepAI Project

## Overview
PrepAI is a modern interview‑preparation platform featuring:
- AI‑driven interview question generation & real‑time evaluation
- Resume ATS scoring and keyword alignment
- Interactive roadmap generator
- File assistant for PDF/Docx knowledge extraction
- Admin Control Center (owner‑only) for managing users, roles, and global settings

## Prerequisites
- **Node.js** (v20.x) and **npm** (or **pnpm**/**yarn**)
- **MongoDB** instance (local or remote URI)
- **Git** for version control
- **Windows PowerShell** (for the provided `swap_colors.ps1` helper script)

## Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/your-org/prepAI.git
   cd prepAI
   ```
2. Install dependencies for **both** frontend and backend:
   ```
   # Backend
   cd backend
   npm install
   # Frontend
   cd ../frontend
   npm install
   ```
3. Create a `.env` file in `backend/` with the required variables:
   ```
   MONGO_URI=mongodb://localhost:27017/prepai
   JWT_SECRET=your‑strong‑secret
   PORT=5000
   ```
4. (Optional) Run the PowerShell colour swap script to apply the dark theme:
   ```powershell
   cd ../frontend
   .\swap_colors.ps1
   ```

## Running the Application
```bash
# In one terminal – start the backend API
cd backend
npm run dev   # starts on http://localhost:5000

# In another terminal – start the Vite frontend
cd ../frontend
npm run dev   # starts on http://localhost:5173
```
Open `http://localhost:5173` in your browser.

## Admin Control Panel
The admin UI is available at `/admin` and is **only** visible to users whose `role` contains the word **owner** (e.g., "OrgOwner").

### Default Owner Credentials (for demo)
- **Email:** `owner@prepai.ai`
- **Password:** `owner2026`
> **Important:** Change these credentials after the first login via the **Admin → Settings** section.

### Admin Features
- **User Management** – view, edit, deactivate, or delete users.
- **Role Assignment** – promote users to `owner`, `admin`, or `free` plans.
- **Global Settings** – toggle feature flags, adjust AI model defaults, and set environment variables.
- **Analytics Dashboard** – see usage statistics, registration counts, and AI interaction metrics.

## Building for Production
```bash
# Backend
cd backend
npm run build   # creates a compiled bundle in ./dist

# Frontend
cd ../frontend
npm run build   # outputs to ./dist (served by the backend static middleware)
```
Deploy the `backend/dist` folder to your preferred host (e.g., Azure, AWS, or a VPS).

## Troubleshooting
- **Registration fails** – ensure the `phone` field is either a valid international number or omitted (MongoDB sparse index).
- **API connection errors** – verify `VITE_API_URL` in `frontend/.env` points to the correct backend URL.
- **Admin not visible** – confirm the logged‑in user’s `role` includes `owner` (case‑insensitive).

## License
MIT – see `LICENSE` file for details.
