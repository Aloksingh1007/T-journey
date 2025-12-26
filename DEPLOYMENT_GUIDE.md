# Trading Journal - Deployment Guide 🚀

## Overview
This guide covers deploying your full-stack Trading Journal application with:
- **Backend**: Node.js/Express API with PostgreSQL
- **Frontend**: React/Vite SPA
- **Database**: PostgreSQL with Prisma ORM

---

## 🎯 Recommended Hosting Options

### Option 1: Vercel (Frontend) + Railway (Backend + Database) ⭐ EASIEST
**Best for**: Quick deployment, free tier available
**Cost**: Free tier available, ~$5-10/month for production

### Option 2: Netlify (Frontend) + Render (Backend + Database)
**Best for**: Similar to Option 1, good free tier
**Cost**: Free tier available

### Option 3: AWS (Full Stack)
**Best for**: Production-grade, scalable
**Cost**: ~$20-50/month

### Option 4: DigitalOcean/Linode VPS
**Best for**: Full control, cost-effective
**Cost**: ~$12-24/month

---

## 🚀 OPTION 1: Vercel + Railway (RECOMMENDED)

### Part A: Deploy Database & Backend to Railway

#### Step 1: Prepare Backend for Production

1. **Create `.env.production` in backend folder**:
```env
# Database (Railway will provide this)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@tradingjournal.com

# AI Configuration
OPENAI_API_KEY=your-openai-key
GROQ_API_KEY=your-groq-key

# Environment
NODE_ENV=production
PORT=5000
```

2. **Update `backend/package.json` scripts**:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "prisma generate",
    "deploy": "prisma migrate deploy && npm run build && npm start"
  }
}
```

3. **Create `backend/railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run deploy",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 2: Deploy to Railway

1. **Sign up**: Go to https://railway.app and sign up with GitHub
2. **Create New Project**: Click "New Project"
3. **Add PostgreSQL**: 
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway will create a database and provide connection string
4. **Add Backend Service**:
   - Click "Add Service" → "GitHub Repo"
   - Connect your repository
   - Select the backend folder (or root if monorepo)
5. **Configure Environment Variables**:
   - Go to backend service → "Variables"
   - Add all variables from `.env.production`
   - Railway auto-provides `DATABASE_URL` from PostgreSQL service
6. **Set Root Directory** (if needed):
   - Go to "Settings" → "Root Directory" → Set to `backend`
7. **Deploy**: Railway will auto-deploy
8. **Get Backend URL**: Copy the public URL (e.g., `https://your-app.railway.app`)

#### Step 3: Run Migrations

1. In Railway backend service, go to "Settings" → "Deploy"
2. Or use Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

### Part B: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend for Production

1. **Update `frontend/.env.production`**:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

2. **Update `frontend/vite.config.ts`** (if needed):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@tanstack/react-query', 'axios'],
        },
      },
    },
  },
});
```

3. **Create `frontend/vercel.json`**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. **Sign up**: Go to https://vercel.com and sign up with GitHub
2. **Import Project**: Click "Add New" → "Project"
3. **Select Repository**: Choose your GitHub repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variables**:
   - Add `VITE_API_URL` with your Railway backend URL
6. **Deploy**: Click "Deploy"
7. **Get Frontend URL**: Copy the URL (e.g., `https://your-app.vercel.app`)

#### Step 3: Update Backend CORS

Update `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app', // Add your Vercel URL
  ],
  credentials: true,
}));
```

Redeploy backend on Railway.

---

## 🚀 OPTION 2: Netlify + Render

### Part A: Deploy Backend to Render

1. **Sign up**: https://render.com
2. **Create PostgreSQL Database**:
   - Dashboard → "New" → "PostgreSQL"
   - Copy the Internal Database URL
3. **Create Web Service**:
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Add Environment Variables**: Same as Railway
5. **Deploy**: Render will build and deploy

### Part B: Deploy Frontend to Netlify

1. **Sign up**: https://netlify.com
2. **Import Project**: "Add new site" → "Import from Git"
3. **Configure**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. **Add Environment Variables**: `VITE_API_URL`
5. **Deploy**: Netlify will build and deploy

---

## 🚀 OPTION 3: AWS (Production-Grade)

### Services Needed:
- **EC2**: Backend server
- **RDS**: PostgreSQL database
- **S3 + CloudFront**: Frontend hosting
- **Route 53**: Domain management (optional)

### Quick Setup:

1. **RDS PostgreSQL**:
   - Create RDS PostgreSQL instance
   - Note connection details

2. **EC2 Backend**:
   - Launch Ubuntu EC2 instance
   - Install Node.js, PM2
   - Clone repository
   - Set environment variables
   - Run migrations
   - Start with PM2

3. **S3 + CloudFront Frontend**:
   - Build frontend: `npm run build`
   - Upload `dist` folder to S3
   - Create CloudFront distribution
   - Point to S3 bucket

---

## 🚀 OPTION 4: DigitalOcean VPS (Full Control)

### Step 1: Create Droplet

1. **Sign up**: https://digitalocean.com
2. **Create Droplet**: Ubuntu 22.04, 2GB RAM minimum
3. **SSH into server**: `ssh root@your-ip`

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Git
apt install -y git
```

### Step 3: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE trading_journal;
CREATE USER tjuser WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE trading_journal TO tjuser;
\q
```

### Step 4: Deploy Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/trading-journal.git
cd trading-journal/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start dist/server.js --name trading-journal-api
pm2 save
pm2 startup
```

### Step 5: Deploy Frontend

```bash
# Build frontend
cd /var/www/trading-journal/frontend
npm install
npm run build

# Copy to Nginx directory
cp -r dist /var/www/html/trading-journal
```

### Step 6: Configure Nginx

```bash
nano /etc/nginx/sites-available/trading-journal
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html/trading-journal;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/trading-journal /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificates
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 📋 Pre-Deployment Checklist

### Backend:
- [ ] Update CORS origins with production URLs
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set NODE_ENV=production
- [ ] Configure email SMTP (optional)
- [ ] Add AI API keys if using AI features
- [ ] Test all API endpoints
- [ ] Run database migrations

### Frontend:
- [ ] Update VITE_API_URL to production backend
- [ ] Test build locally: `npm run build`
- [ ] Check for console errors
- [ ] Test all routes
- [ ] Verify API calls work

### Database:
- [ ] Backup existing data
- [ ] Run migrations on production DB
- [ ] Test database connection
- [ ] Set up automated backups

### Security:
- [ ] Use HTTPS (SSL certificates)
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use strong passwords
- [ ] Enable database encryption

---

## 🔧 Post-Deployment Tasks

1. **Monitor Logs**:
   - Railway: Check service logs
   - Vercel: Check function logs
   - VPS: `pm2 logs`

2. **Setup Monitoring**:
   - Use Railway/Render built-in monitoring
   - Or setup external: Sentry, LogRocket, DataDog

3. **Database Backups**:
   - Railway: Automatic backups
   - VPS: Setup cron job for pg_dump

4. **Domain Setup** (Optional):
   - Buy domain from Namecheap, GoDaddy, etc.
   - Point DNS to hosting provider
   - Update environment variables

5. **Email Configuration**:
   - Setup SMTP (Gmail, SendGrid, AWS SES)
   - Test password reset emails

---

## 🐛 Troubleshooting

### Backend won't start:
- Check environment variables
- Verify DATABASE_URL is correct
- Check logs for errors
- Ensure migrations ran successfully

### Frontend can't connect to backend:
- Verify VITE_API_URL is correct
- Check CORS configuration
- Ensure backend is running
- Check browser console for errors

### Database connection failed:
- Verify DATABASE_URL format
- Check database is running
- Ensure IP whitelist (if applicable)
- Test connection with psql

### Build fails:
- Check Node.js version (use 18 or 20)
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies installed

---

## 💰 Cost Estimates

### Free Tier (Development):
- **Railway**: Free $5 credit/month
- **Vercel**: Free for personal projects
- **Total**: $0-5/month

### Production (Small):
- **Railway**: $5-10/month (backend + database)
- **Vercel**: Free (frontend)
- **Total**: $5-10/month

### Production (Medium):
- **Render**: $7/month (backend) + $7/month (database)
- **Netlify**: Free (frontend)
- **Total**: $14/month

### Production (Large):
- **DigitalOcean**: $12-24/month (VPS)
- **Managed Database**: $15/month
- **Total**: $27-39/month

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 Quick Start (Railway + Vercel)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
railway init

# 4. Add PostgreSQL
railway add

# 5. Deploy backend
cd backend
railway up

# 6. Deploy frontend to Vercel
cd ../frontend
npx vercel

# 7. Done! 🚀
```

---

**Need Help?** Check the troubleshooting section or reach out for support!

**Status**: Ready for deployment ✅
**Last Updated**: December 26, 2024
