# 🔧 Deployment Troubleshooting Guide for Beginners

## Common Issues & Step-by-Step Fixes

---

## Issue 1: Can't Push to GitHub

### Error: "Permission denied" or "Authentication failed"

**What it means**: GitHub doesn't recognize your credentials

**Fix**:
1. **Create Personal Access Token**:
   - Go to GitHub.com
   - Click your profile picture (top right) → Settings
   - Scroll down → Click "Developer settings" (bottom left)
   - Click "Personal access tokens" → "Tokens (classic)"
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: "Deployment Token"
   - Check the box: ☑️ repo (this gives full repo access)
   - Scroll down → Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Use Token as Password**:
   ```bash
   git push -u origin main
   # Username: your-github-username
   # Password: paste-your-token-here
   ```

---

## Issue 2: Render Backend Won't Start

### Error: "Application failed to respond"

**What it means**: Your backend crashed during startup

**How to find the problem**:
1. Go to Render.com
2. Click on your backend service
3. Click "Logs" tab (left sidebar)
4. Look for red error messages

**Common Causes & Fixes**:

### A. Database Connection Error
**Error in logs**: `Error: connect ECONNREFUSED` or `database "xxx" does not exist`

**Fix**:
1. Go to Render → Your backend service → Environment
2. Check `DATABASE_URL` variable
3. Go to Render → Your database service
4. Copy "Internal Database URL" (not External!)
5. Update `DATABASE_URL` in backend environment
6. Click "Save" (will auto-redeploy)

### B. Missing Environment Variables
**Error in logs**: `JWT_SECRET is not defined` or similar

**Fix**:
1. Go to Render → Your backend service → Environment
2. Make sure you have ALL these variables:
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV
   - PORT
   - FRONTEND_URL
3. Add any missing ones
4. Click "Save"

### C. Build Failed
**Error in logs**: `npm ERR!` or `tsc: command not found`

**Fix**:
1. Check your `backend/package.json` has these scripts:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/server.js",
     "postinstall": "prisma generate"
   }
   ```
2. If missing, add them
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Fix build scripts"
   git push
   ```

---

## Issue 3: Frontend Can't Connect to Backend

### Error: "Network Error" when trying to login

**What it means**: Frontend can't reach your backend API

**Fix - Step by Step**:

### Step 1: Check Backend is Running
1. Go to Render.com
2. Click your backend service
3. Check status at top - should be green "Live"
4. If not, check logs for errors (see Issue 2)

### Step 2: Check Backend URL
1. Copy your backend URL from Render (top of page)
2. Open it in browser, add `/api` at end
3. Example: `https://trading-journal-api-xxxx.onrender.com/api`
4. You should see:
   ```json
   {
     "success": true,
     "message": "Welcome to AI Trading Journal API"
   }
   ```
5. If you don't see this, backend has a problem (see Issue 2)

### Step 3: Check Netlify Environment Variable
1. Go to Netlify.com
2. Click your site
3. Click "Site settings" → "Environment variables"
4. Check `VITE_API_URL` value
5. It should be: `https://your-backend.onrender.com/api`
6. **Important**: Must end with `/api`
7. If wrong, click "Edit" → Fix it → Save
8. Go to "Deploys" → Click "Trigger deploy" → "Clear cache and deploy"

### Step 4: Check CORS Settings
1. Open your code editor
2. Open `backend/src/server.ts`
3. Find the CORS section (around line 20)
4. Make sure it includes your Netlify URL:
   ```typescript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-site.netlify.app', // Your actual Netlify URL
     ],
     credentials: true,
   }));
   ```
5. If missing or wrong, fix it
6. Push to GitHub:
   ```bash
   git add .
   git commit -m "Fix CORS"
   git push
   ```
7. Wait 3-5 minutes for Render to redeploy

---

## Issue 4: Netlify Build Fails

### Error: "Build failed" or "Command failed"

**How to find the problem**:
1. Go to Netlify.com
2. Click your site
3. Click "Deploys" tab
4. Click on the failed deploy (red X)
5. Read the error message

**Common Causes & Fixes**:

### A. Wrong Directory Settings
**Error**: `Could not find package.json`

**Fix**:
1. Netlify → Site settings → Build & deploy → Build settings
2. Check these settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. If wrong, click "Edit settings" → Fix → Save
4. Go to "Deploys" → "Trigger deploy"

### B. Missing Environment Variable
**Error**: `VITE_API_URL is not defined`

**Fix**:
1. Netlify → Site settings → Environment variables
2. Click "Add a variable"
3. Key: `VITE_API_URL`
4. Value: `https://your-backend.onrender.com/api`
5. Click "Create variable"
6. Go to "Deploys" → "Trigger deploy"

### C. Node Version Mismatch
**Error**: `The engine "node" is incompatible`

**Fix**:
1. Create file `frontend/.nvmrc` with content:
   ```
   18
   ```
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Set Node version"
   git push
   ```

---

## Issue 5: 404 Error on Frontend Routes

### Error: Clicking links shows "Page Not Found"

**What it means**: Netlify doesn't know how to handle React Router

**Fix**:
1. Create file `frontend/_redirects` (no extension!)
2. Add this content:
   ```
   /*    /index.html   200
   ```
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Add Netlify redirects"
   git push
   ```
4. Netlify will auto-deploy

**Alternative** (if above doesn't work):
1. Create file `frontend/netlify.toml`
2. Add this content:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
3. Push to GitHub

---

## Issue 6: Database Connection Fails

### Error: "Connection terminated unexpectedly"

**What it means**: Can't connect to PostgreSQL database

**Fix**:

### Step 1: Check Database is Running
1. Go to Render.com
2. Click on your database service
3. Check status - should be green "Available"
4. If not, wait a few minutes or contact Render support

### Step 2: Check Connection String
1. In database page, scroll to "Connections"
2. Copy "Internal Database URL" (not External!)
3. It should look like:
   ```
   postgresql://user:password@host/database
   ```
4. Go to backend service → Environment
5. Update `DATABASE_URL` with this value
6. Save (will redeploy)

### Step 3: Run Migrations
1. Go to Render → Backend service
2. Click "Shell" tab (left sidebar)
3. Run this command:
   ```bash
   npx prisma migrate deploy
   ```
4. Wait for it to complete
5. Restart your backend service

---

## Issue 7: Slow First Request (Render Free Tier)

### Problem: First request takes 30-60 seconds

**What it means**: Render free tier "spins down" after 15 minutes of inactivity

**This is normal!** Free tier behavior.

**Solutions**:

### Option 1: Accept it (Free)
- First request after inactivity will be slow
- Subsequent requests will be fast
- Good for testing/personal use

### Option 2: Keep-Alive Service (Free)
- Use a service like UptimeRobot
- Pings your backend every 5 minutes
- Keeps it awake
- Setup:
  1. Go to https://uptimerobot.com
  2. Sign up (free)
  3. Add monitor → HTTP(s)
  4. URL: Your backend URL
  5. Interval: 5 minutes

### Option 3: Upgrade (Paid)
- Upgrade to Render paid plan ($7/month)
- No spin down
- Always fast

---

## Issue 8: Can't Upload Avatar/Images

### Error: "Failed to upload" or images don't show

**What it means**: File upload not working in production

**Fix**:

### Step 1: Check Upload Directory
1. Render free tier doesn't persist files
2. Files uploaded will be lost on redeploy
3. **Solution**: Use cloud storage (S3, Cloudinary)

### Step 2: Quick Fix (Temporary)
1. For now, uploads work but will be lost on redeploy
2. This is okay for testing
3. For production, implement cloud storage

### Step 3: Implement Cloud Storage (Advanced)
Use Cloudinary (free tier):
1. Sign up at https://cloudinary.com
2. Get API credentials
3. Update backend to use Cloudinary
4. (This requires code changes - can do later)

---

## Issue 9: Email Not Sending (Password Reset)

### Problem: Password reset emails not arriving

**What it means**: SMTP not configured

**Fix**:

### For Development/Testing:
- Emails are logged to Render logs
- Go to Render → Backend → Logs
- Look for "📧 PASSWORD RESET EMAIL"
- Copy the reset URL from logs
- Use it directly

### For Production:
1. Set up Gmail SMTP:
   - Enable 2FA on Gmail
   - Create App Password
   - Add to Render environment:
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     ```

---

## Issue 10: "Out of Memory" Error

### Error: Backend crashes with memory error

**What it means**: Using more than 512MB RAM (free tier limit)

**Fix**:

### Short-term:
1. Restart backend service
2. Monitor memory usage in Render dashboard

### Long-term:
1. Optimize code (reduce memory usage)
2. Upgrade to paid plan (1GB+ RAM)

---

## 🆘 Still Having Issues?

### Check Logs First!

**Render Backend Logs**:
1. Render → Your service → Logs
2. Look for red error messages
3. Google the error message

**Netlify Build Logs**:
1. Netlify → Deploys → Click failed deploy
2. Read error message
3. Google the error

### Get Help:

1. **Render Community**: https://community.render.com
2. **Netlify Community**: https://answers.netlify.com
3. **Stack Overflow**: Search your error message
4. **GitHub Issues**: Check if others had same problem

### Contact Support:

**Render**: support@render.com
**Netlify**: support@netlify.com

---

## 📋 Debug Checklist

When something doesn't work, check these in order:

- [ ] Is backend "Live" on Render?
- [ ] Is database "Available" on Render?
- [ ] Is frontend "Published" on Netlify?
- [ ] Are all environment variables set correctly?
- [ ] Does backend URL end with `/api` in Netlify?
- [ ] Is CORS configured with correct Netlify URL?
- [ ] Are there any errors in Render logs?
- [ ] Are there any errors in browser console (F12)?
- [ ] Did you push latest code to GitHub?
- [ ] Did services redeploy after code changes?

---

## 💡 Prevention Tips

1. **Always check logs** when something fails
2. **Test locally first** before deploying
3. **One change at a time** - easier to debug
4. **Save environment variables** somewhere safe
5. **Document your URLs** (backend, frontend, database)
6. **Use git commits** with clear messages
7. **Wait for deploys** to complete before testing

---

**Remember**: Deployment issues are normal! Every developer faces them. Take it step by step, check logs, and you'll figure it out! 💪

**Last Updated**: December 26, 2024
