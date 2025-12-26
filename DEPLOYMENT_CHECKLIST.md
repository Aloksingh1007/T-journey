# 🚀 Quick Deployment Checklist

## Before You Deploy

### 1. Test Locally ✅
- [ ] Backend running without errors
- [ ] Frontend connecting to backend
- [ ] All features working
- [ ] Database migrations applied
- [ ] No console errors

### 2. Prepare Files ✅
- [ ] Created `.env.production` files
- [ ] Updated CORS origins in backend
- [ ] Set strong JWT_SECRET
- [ ] Configured production database URL
- [ ] Added frontend production URL to backend

---

## 🎯 Recommended: Railway + Vercel (15 minutes)

### Step 1: Deploy Backend to Railway (10 min)

1. **Sign up**: https://railway.app (use GitHub)
2. **New Project** → **Add PostgreSQL**
3. **Add Service** → **GitHub Repo** → Select your repo
4. **Settings** → **Root Directory** → `backend`
5. **Variables** → Add these:
   ```
   JWT_SECRET=your-super-secret-key-change-this
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```
6. **Deploy** → Wait for build
7. **Copy Backend URL** (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel (5 min)

1. **Sign up**: https://vercel.com (use GitHub)
2. **Add New** → **Project** → Select your repo
3. **Configure**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. **Deploy** → Wait for build
6. **Copy Frontend URL** (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS (2 min)

1. Go back to Railway
2. **Variables** → Update `FRONTEND_URL` with your Vercel URL
3. **Redeploy** backend

### Step 4: Test! 🎉

1. Visit your Vercel URL
2. Try to register/login
3. Test all features
4. Check for errors

---

## 📋 Environment Variables Reference

### Backend (Railway):
```env
DATABASE_URL=<auto-provided-by-railway>
JWT_SECRET=<generate-strong-secret>
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔧 Common Issues & Fixes

### Issue: Backend won't start
**Fix**: Check Railway logs, ensure DATABASE_URL is set

### Issue: Frontend can't connect to backend
**Fix**: 
1. Verify VITE_API_URL is correct
2. Check CORS in backend includes your Vercel URL
3. Ensure backend is running (check Railway)

### Issue: Database connection error
**Fix**: 
1. Ensure PostgreSQL service is running in Railway
2. Check DATABASE_URL format
3. Run migrations: Railway → Backend → Settings → Deploy

### Issue: 404 on frontend routes
**Fix**: Vercel should handle this automatically with `vercel.json`

---

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployments:
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

2. **Monitor Logs**:
   - Railway: Click on service → Logs tab
   - Vercel: Click on deployment → Function logs

3. **Custom Domain** (Optional):
   - Railway: Settings → Domains → Add custom domain
   - Vercel: Settings → Domains → Add domain

4. **Database Backups**:
   - Railway: Automatic backups included
   - Download: Railway → PostgreSQL → Data → Export

5. **Environment Variables**:
   - Never commit `.env` files
   - Use `.env.example` templates
   - Update variables in hosting dashboard

---

## 🎉 You're Done!

Your Trading Journal is now live! 

**Next Steps**:
- Share the URL with users
- Monitor logs for errors
- Set up custom domain (optional)
- Configure email SMTP for password reset
- Add monitoring (Sentry, LogRocket)

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment

**Deployment Time**: ~15-20 minutes
**Cost**: Free tier available (Railway $5 credit/month)
**Status**: Ready to deploy! 🚀
