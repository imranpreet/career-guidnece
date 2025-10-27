# 🚀 Quick Start Guide - AI Career Coach

## Important: Correct Commands

### ❌ WRONG Commands
```bash
npm run dev  # This doesn't exist in the root folder or frontend!
```

### ✅ CORRECT Commands

#### Backend (Port 5000)
```bash
cd backend
npm run dev    # Uses nodemon with TypeScript
```

#### Frontend (Port 3000)
```bash
cd frontend
npm start      # Uses react-scripts start
```

## Current Status (Everything is Running!)

✅ **Backend**: Running on http://localhost:5000
✅ **Frontend**: Running on http://localhost:3000
✅ **MongoDB**: Running locally on port 27017

## Available Scripts by Folder

### Root Folder (`/home/sama/Desktop/AI interview`)
- No dev script here! Navigate to `backend` or `frontend` first

### Backend Folder (`/home/sama/Desktop/AI interview/backend`)
```bash
npm start      # Run compiled production code
npm run dev    # Run development server with nodemon (TypeScript)
npm run build  # Compile TypeScript to JavaScript
```

### Frontend Folder (`/home/sama/Desktop/AI interview/frontend`)
```bash
npm start      # Start development server (React)
npm run build  # Build production bundle
npm test       # Run tests
```

## How to Access Your Application

1. **Frontend Website**: http://localhost:3000
   - Landing page with all features
   - Login/Register
   - Dashboard
   - Resume Builder
   - Interview Practice
   - Quiz System
   - AI Chat
   - **Testimonials with dynamic reviews** ⭐

2. **Backend API**: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health
   - Reviews: http://localhost:5000/api/reviews/approved
   - All endpoints available

3. **Test Review System**: `test-review-system.html`
   - Open this file in your browser
   - Submit and approve reviews
   - See them appear on your website!

## Stopping and Restarting

### Stop Servers
Press `Ctrl+C` in the terminal where each server is running

### Restart Backend
```bash
cd backend
npm run dev
```

### Restart Frontend
```bash
cd frontend
npm start
```

## Common Issues

### "Missing script: dev" Error
✅ **Solution**: You're in the wrong folder!
- Frontend uses `npm start` (not `npm run dev`)
- Backend uses `npm run dev`
- Root folder has no dev script

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Running
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

## VS Code Tasks Available

You can also use VS Code tasks:
- "Start Frontend Dev Server" - Starts frontend (port 3000)
- "Start Backend Dev Server" - Starts backend (port 5000)
- "Build Frontend" - Creates production build
- "Build Backend" - Compiles TypeScript

## Quick Test Commands

### Test Backend API
```bash
curl http://localhost:5000/api/health
```

### Test Reviews System
```bash
# Get approved reviews
curl http://localhost:5000/api/reviews/approved

# Submit a review
curl -X POST http://localhost:5000/api/reviews/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "role": "Developer",
    "rating": 5,
    "review": "Great platform!"
  }'
```

### Open in Browser
```bash
# Frontend
xdg-open http://localhost:3000

# Backend health
xdg-open http://localhost:5000/api/health
```

## Your Review System is Live! 🎉

1. Go to http://localhost:3000
2. Scroll to "What Our Users Say"
3. Click "Submit Your Review"
4. Fill out the form
5. Use `test-review-system.html` to approve it
6. Refresh page - your review appears!

---

**Remember**: 
- Frontend = `npm start`
- Backend = `npm run dev`
- Both are currently running and working perfectly!
