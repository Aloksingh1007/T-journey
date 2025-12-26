# 🚀 Quick Deployment Checklist - Netlify + Render

Print this or keep it open while deploying!

---

## ☐ PART 1: GitHub (10 min)

### Create GitHub Account
- [ ] Go to https://github.com
- [ ] Sign up with email
- [ ] Verify email

### Create Repository
- [ ] Click "+" → "New repository"
- [ ] Name: `trading-journal`
- [ ] Choose: Public
- [ ] Click "Create repository"

### Push Code
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
- [ ] Code pushed successfully
- [ ] Verify files on GitHub

---

## ☐ PART 2: Render Backend (15 min)

### Create Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Verify email

### Create Database
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `trading-journal-db`
- [ ] Database: `trading_journal`
- [ ] Plan: Free
- [ ] Click "Create Database"
- [ ] Wait 2-3 minutes
- [ ] Copy "Internal Database URL"
- [ ] Save URL somewhere safe

### Create Backend Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repo
- [ ] Name: `trading-journal-api`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Add Environment Variables
- [ ] DATABASE_URL = (paste your database URL)
- [ ] JWT_SECRET = (create random 32+ character string)
- [ ] NODE_ENV = production
- [ ] PORT = 5000
- [ ] FRONTEND_URL = http://localhost:5173 (temporary)

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Status shows "Live" (green)
- [ ] Copy backend URL
- [ ] Test: Open URL/api in browser
- [ ] Should see welcome message

**Backend URL**: ___________________________________

---

## ☐ PART 3: Netlify Frontend (10 min)

### Create Account
- [ ] Go to https://netlify.com
- [ ] Sign up with GitHub
- [ ] Verify email

### Create Site
- [ ] Click "Add new site" → "Import project"
- [ ] Click "GitHub"
- [ ] Select `trading-journal` repo

### Configure Build
- [ ] Branch: main
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Add Environment Variable
- [ ] Click "Show advanced"
- [ ] Key: `VITE_API_URL`
- [ ] Value: (your backend URL + /api)
  - Example: `https://trading-journal-api-xxxx.onrender.com/api`

### Deploy
- [ ] Click "Deploy site"
- [ ] Wait 3-5 minutes
- [ ] Status shows "Published" (green)
- [ ] Copy frontend URL
- [ ] Optional: Change site name

**Frontend URL**: ___________________________________

---

## ☐ PART 4: Connect Everything (5 min)

### Update Backend CORS
- [ ] Go to Render → Backend service
- [ ] Click "Environment"
- [ ] Edit FRONTEND_URL
- [ ] Change to your Netlify URL
- [ ] Save (auto-redeploys)

### Update Code
- [ ] Open `backend/src/server.ts`
- [ ] Find `app.use(cors())`
- [ ] Replace with:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://YOUR-NETLIFY-URL.netlify.app',
  ],
  credentials: true,
}));
```
- [ ] Save file
- [ ] Run: `git add . && git commit -m "Update CORS" && git push`
- [ ] Wait for auto-deploy (3-5 min)

---

## ☐ PART 5: Test (5 min)

### Open Your App
- [ ] Go to your Netlify URL
- [ ] See login page

### Test Registration
- [ ] Click "Register"
- [ ] Fill in email, password, name
- [ ] Click "Register"
- [ ] Should see dashboard

### Test Features
- [ ] Dashboard loads
- [ ] Can add trade
- [ ] Can view profile
- [ ] Can logout and login

### Check Console
- [ ] Press F12
- [ ] Go to Console tab
- [ ] No red errors

---

## ✅ DONE!

**Your app is live!** 🎉

**URLs**:
- Frontend: ___________________________________
- Backend: ___________________________________

**Credentials**:
- Email: ___________________________________
- Password: ___________________________________

---

## 🆘 Quick Troubleshooting

### Can't login (Network Error)
1. Check VITE_API_URL in Netlify
2. Check backend is "Live" on Render
3. Check CORS in backend code

### Backend not starting
1. Check Render logs
2. Verify DATABASE_URL is correct
3. Check all environment variables

### Frontend 404 errors
1. Create `frontend/_redirects` file:
   ```
   /*    /index.html   200
   ```
2. Push to GitHub

---

**Need detailed help?** See `NETLIFY_RENDER_DEPLOYMENT_GUIDE.md`

**Date**: _______________
**Status**: ☐ In Progress  ☐ Complete
