# 🚀 Quick Deployment Checklist - Railway + Vercel

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
- [ ] Check "Add README"
- [ ] Click "Create repository"

### Push Code
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```
- [ ] Code pushed successfully
- [ ] Verify files on GitHub

**If password fails**: Create Personal Access Token
- [ ] GitHub → Settings → Developer settings
- [ ] Personal access tokens → Generate new token
- [ ] Check "repo" → Generate → Copy token
- [ ] Use token as password

---

## ☐ PART 2: Railway Backend + Database (10 min)

### Create Account
- [ ] Go to https://railway.app
- [ ] Click "Login with GitHub"
- [ ] Authorize Railway

### Create Project & Database
- [ ] Click "New Project"
- [ ] Click "Provision PostgreSQL"
- [ ] Wait 10-20 seconds
- [ ] See purple "Postgres" card

### Add Backend Service
- [ ] Click "New" → "GitHub Repo"
- [ ] Configure GitHub App (if first time)
- [ ] Select `trading-journal` repo
- [ ] Service starts deploying

### Configure Backend
- [ ] Click on backend service
- [ ] Settings → Root Directory → `backend`
- [ ] Settings → Start Command → `npm start`
- [ ] Settings → Build Command → `npm install && npx prisma generate && npm run build`

### Add Environment Variables
Go to Variables tab:

- [ ] **DATABASE_URL**: Click "New Variable" → "Add Reference" → Postgres → DATABASE_URL
- [ ] **JWT_SECRET**: `your-super-secret-jwt-key-change-this-12345678`
- [ ] **NODE_ENV**: `production`
- [ ] **PORT**: `5000`
- [ ] **FRONTEND_URL**: `http://localhost:5173` (temporary)

### Deploy & Test
- [ ] Go to Deployments → Click "Deploy"
- [ ] Wait 3-5 minutes
- [ ] Look for "🚀 Server is running on port 5000"
- [ ] Settings → Networking → "Generate Domain"
- [ ] Copy backend URL
- [ ] Test: Open URL/api in browser
- [ ] Should see welcome message

**Backend URL**: ___________________________________

---

## ☐ PART 3: Vercel Frontend (10 min)

### Create Account
- [ ] Go to https://vercel.com
- [ ] Click "Continue with GitHub"
- [ ] Authorize Vercel

### Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select `trading-journal` repo
- [ ] Click "Import"

### Configure Build
- [ ] Framework: Vite (auto-detected)
- [ ] Root Directory: Click "Edit" → `frontend` → Save
- [ ] Build Command: `npm run build` (auto)
- [ ] Output Directory: `dist` (auto)

### Add Environment Variable
- [ ] Expand "Environment Variables"
- [ ] Name: `VITE_API_URL`
- [ ] Value: (your Railway URL + /api)
  - Example: `https://your-app-production-xxxx.up.railway.app/api`
- [ ] Click "Add"

### Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] See confetti 🎉
- [ ] Copy frontend URL

**Frontend URL**: ___________________________________

### Optional: Customize Domain
- [ ] Dashboard → Settings → Domains
- [ ] Edit domain name
- [ ] Example: `my-trading-journal.vercel.app`

---

## ☐ PART 4: Connect Everything (5 min)

### Update Railway Environment
- [ ] Railway → Backend service → Variables
- [ ] Edit FRONTEND_URL
- [ ] Change to your Vercel URL
- [ ] Press Enter to save
- [ ] Wait for auto-redeploy (2-3 min)

### Update Code
- [ ] Open `backend/src/server.ts`
- [ ] Find `app.use(cors())`
- [ ] Replace with:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://YOUR-VERCEL-URL.vercel.app',
  ],
  credentials: true,
}));
```
- [ ] Save file

### Push Changes
```bash
git add backend/src/server.ts
git commit -m "Update CORS for production"
git push
```
- [ ] Wait for Railway to redeploy (3-5 min)
- [ ] Wait for Vercel to redeploy (2-3 min)

---

## ☐ PART 5: Test (5 min)

### Open Your App
- [ ] Go to your Vercel URL
- [ ] See login page

### Test Registration
- [ ] Click "Register"
- [ ] Fill in email, password, name
- [ ] Click "Register"
- [ ] Should see dashboard

### Test Features
- [ ] Dashboard loads
- [ ] Can add trade (Quick Add)
- [ ] Can view profile
- [ ] Can create community post
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

**Performance**: ⭐⭐⭐⭐⭐ No sleep, always fast!

---

## 🆘 Quick Troubleshooting

### Can't login (Network Error)
1. Check VITE_API_URL in Vercel (must end with /api)
2. Check backend is "Active" on Railway
3. Check CORS in backend code includes Vercel URL

### Backend not starting
1. Check Railway logs (Deployments tab)
2. Verify DATABASE_URL is connected (reference)
3. Check all environment variables are set
4. Check Root Directory is `backend`

### Frontend build fails
1. Check Vercel build logs
2. Verify Root Directory is `frontend`
3. Verify VITE_API_URL is set
4. Check Build Command is `npm run build`

### Database connection error
1. Railway → Backend → Variables
2. Check DATABASE_URL shows `${{Postgres.DATABASE_URL}}`
3. If missing, add reference to Postgres database
4. Redeploy backend

---

## 💡 Pro Tips

### Monitor Usage
- Railway → Usage (check monthly credit)
- Vercel → Usage (check bandwidth)

### View Logs
- Railway → Deployments → Click deployment
- Vercel → Deployments → Click deployment

### Auto-Deploy
- Push to GitHub = auto-deploy on both!
- No manual deployment needed

---

**Need detailed help?** See `RAILWAY_VERCEL_DEPLOYMENT_GUIDE.md`

**Date**: _______________
**Status**: ☐ In Progress  ☐ Complete
**Time**: ~20-30 minutes
