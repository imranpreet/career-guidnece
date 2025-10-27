# 🚀 Netlify Deployment Guide - AI Career Coach

## Your Repository
**GitHub Repo**: https://github.com/imranpreet/career-guidnece.git

---

## 📋 Pre-Deployment Checklist

### ✅ Step 1: Prepare Your Project

#### 1.1 Create Production Environment Files

Create `.env.production` in your **frontend** folder:

```bash
cd /home/sama/Desktop/AI\ interview/frontend
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
REACT_APP_ENV=production
EOF
```

#### 1.2 Update API URLs in Frontend

Make sure your frontend uses environment variables instead of hardcoded `localhost:5000`.

**Files to check:**
- `src/pages/Dashboard.tsx`
- `src/pages/Settings.tsx`
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`
- `src/components/AIChat.tsx`
- `src/components/InterviewPractice.tsx`
- `src/components/QuizSystem.tsx`
- `src/components/ResumeBuilder.tsx`

**Replace all instances of:**
```javascript
'http://localhost:5000/api'
```

**With:**
```javascript
process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
```

#### 1.3 Create Netlify Configuration

Create `netlify.toml` in your **project root**:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 1.4 Add `.gitignore` Entries

Make sure your `.gitignore` includes:

```
# dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# production builds
frontend/build/
backend/dist/

# environment variables
.env
.env.local
.env.production
.env.development
backend/.env

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## 🚀 Method 1: Deploy via Netlify Web UI (Recommended)

### Step 1: Push Code to GitHub

```bash
cd /home/sama/Desktop/AI\ interview

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Netlify deployment"

# Push to GitHub
git push origin main
```

### Step 2: Deploy on Netlify

1. **Go to Netlify**: https://app.netlify.com/
2. **Sign up/Login** with your GitHub account
3. **Click "Add new site"** → **"Import an existing project"**
4. **Choose GitHub** and authorize Netlify
5. **Select your repository**: `imranpreet/career-guidnece`

### Step 3: Configure Build Settings

In the Netlify configuration screen, set:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

### Step 4: Add Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:

```
REACT_APP_API_URL = https://your-backend-url.herokuapp.com/api
REACT_APP_ENV = production
```

### Step 5: Deploy!

Click **"Deploy site"** button. Netlify will:
- Install dependencies
- Run build command
- Deploy your app
- Give you a URL like: `https://random-name-123.netlify.app`

---

## 🖥️ Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open a browser window to authenticate.

### Step 3: Initialize Netlify

```bash
cd /home/sama/Desktop/AI\ interview
netlify init
```

Follow the prompts:
- **Create & configure a new site**
- **Choose your team**
- **Site name**: `ai-career-coach` (or your preferred name)
- **Build command**: `npm run build`
- **Directory to deploy**: `frontend/build`
- **Netlify configuration file**: Use `netlify.toml`

### Step 4: Build Your Frontend

```bash
cd frontend
npm run build
```

### Step 5: Deploy

```bash
# Deploy to draft URL first (testing)
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 🔧 Backend Deployment (Required!)

Your frontend needs a backend API. Deploy your backend separately:

### Option A: Deploy Backend to Render.com (Recommended)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New Web Service**
4. **Connect your repository**: `imranpreet/career-guidnece`
5. **Configure**:
   - **Name**: `ai-career-coach-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   ```

7. **Deploy** and get your backend URL: `https://ai-career-coach-api.onrender.com`

### Option B: Deploy Backend to Railway.app

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `imranpreet/career-guidnece`
5. **Add Service** → **Configure**:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. **Add Environment Variables** (same as above)
7. **Deploy** and get your URL

### Option C: Deploy Backend to Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create ai-career-coach-api

# Set buildpack for subdirectory
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku buildpacks:add heroku/nodejs
heroku config:set PROJECT_PATH=backend

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_secret_key_here
heroku config:set OPENAI_API_KEY=your_openai_api_key

# Deploy
git push heroku main
```

---

## 🔗 Connect Frontend to Backend

After deploying backend, update your Netlify environment variables:

1. Go to **Netlify Dashboard** → **Site settings** → **Environment variables**
2. Update `REACT_APP_API_URL` with your backend URL:
   ```
   REACT_APP_API_URL=https://ai-career-coach-api.onrender.com/api
   ```
3. **Trigger redeploy**: Deploys → **Trigger deploy** → **Deploy site**

---

## 📝 Quick Deployment Commands (Complete Flow)

```bash
# 1. Navigate to project
cd /home/sama/Desktop/AI\ interview

# 2. Create netlify.toml (if not exists)
cat > netlify.toml << 'EOF'
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 3. Create frontend/.env.production
cat > frontend/.env.production << 'EOF'
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_ENV=production
EOF

# 4. Test build locally
cd frontend
npm run build

# 5. Commit and push to GitHub
cd ..
git add .
git commit -m "Add Netlify configuration"
git push origin main

# 6. Install Netlify CLI
npm install -g netlify-cli

# 7. Login to Netlify
netlify login

# 8. Deploy
cd frontend
netlify deploy --prod
```

---

## 🔍 Troubleshooting

### Issue: Build Fails on Netlify

**Solution 1**: Check Node version compatibility
```toml
# In netlify.toml
[build.environment]
  NODE_VERSION = "18"
```

**Solution 2**: Clear cache and rebuild
- Netlify Dashboard → Deploys → Deploy settings → Clear cache and retry deploy

### Issue: API Calls Fail (CORS Error)

**Solution**: Update backend CORS configuration in `backend/src/server.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://your-netlify-url.netlify.app'
  ],
  credentials: true
}));
```

### Issue: Environment Variables Not Working

**Solution**: Make sure to prefix with `REACT_APP_`:
```
REACT_APP_API_URL (✅ Correct)
API_URL (❌ Wrong - won't work in React)
```

### Issue: 404 on Page Refresh

**Solution**: Already handled by `netlify.toml` redirects. If still occurring, add:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] MongoDB connection string updated
- [ ] Environment variables configured
- [ ] CORS configured with production URLs
- [ ] Custom domain added (optional)
- [ ] HTTPS enabled (automatic on Netlify)
- [ ] Test all features:
  - [ ] Registration
  - [ ] Login
  - [ ] Dashboard
  - [ ] Settings
  - [ ] Quiz System
  - [ ] Interview Practice
  - [ ] Resume Builder
  - [ ] AI Chat

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Netlify

1. **Buy domain** from Namecheap, GoDaddy, or Google Domains
2. **Netlify Dashboard** → **Domain settings** → **Add custom domain**
3. **Add DNS records**:
   - Type: `A` Record
   - Name: `@`
   - Value: `75.2.60.5` (Netlify's load balancer)
   
   - Type: `CNAME` Record
   - Name: `www`
   - Value: `your-site.netlify.app`

4. **Wait for DNS propagation** (5-30 minutes)
5. **Enable HTTPS** (automatic via Let's Encrypt)

---

## 📊 Monitoring & Analytics

### Add Netlify Analytics

1. **Netlify Dashboard** → **Analytics** → **Enable**
2. Get insights on:
   - Page views
   - Unique visitors
   - Top pages
   - Bandwidth usage

### Add Google Analytics (Optional)

Add to `frontend/public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

## 💡 Best Practices

1. **Use Environment Variables**: Never commit API keys or secrets
2. **Enable Branch Deploys**: Preview changes before production
3. **Set up CI/CD**: Auto-deploy on git push
4. **Monitor Logs**: Check Netlify function logs regularly
5. **Optimize Build Time**: Use build cache
6. **Add Status Badge**: Show deployment status in README

---

## 🚀 Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://ai-career-coach.netlify.app`
- **Backend**: `https://ai-career-coach-api.onrender.com`
- **Admin Dashboard**: Netlify Dashboard for frontend management
- **Database**: MongoDB Atlas for data storage

---

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app/
- **React Deployment**: https://create-react-app.dev/docs/deployment/

---

## ✅ Quick Start Summary

1. **Push code to GitHub** ✅
2. **Deploy backend** to Render/Railway/Heroku ✅
3. **Deploy frontend** to Netlify ✅
4. **Configure environment variables** ✅
5. **Test live application** ✅
6. **Add custom domain** (optional) ✅

**You're ready to go! 🎉**

---

**Created**: October 27, 2025
**Status**: Ready for deployment
**Repository**: https://github.com/imranpreet/career-guidnece
