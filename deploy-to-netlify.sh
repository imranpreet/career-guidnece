#!/bin/bash

# 🚀 AI Career Coach - Netlify Deployment Script
# This script helps you prepare and deploy your project to Netlify

echo "🚀 AI Career Coach - Netlify Deployment Helper"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-Deployment Checklist${NC}"
echo ""

# Step 1: Check Node.js version
echo -e "${YELLOW}1. Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo "   Node.js version: $NODE_VERSION"
echo ""

# Step 2: Check if netlify.toml exists
echo -e "${YELLOW}2. Checking Netlify configuration...${NC}"
if [ -f "netlify.toml" ]; then
    echo -e "   ${GREEN}✅ netlify.toml found${NC}"
else
    echo -e "   ${RED}❌ netlify.toml not found${NC}"
    echo "   Creating netlify.toml..."
    # Create netlify.toml (already created by previous command)
fi
echo ""

# Step 3: Check frontend dependencies
echo -e "${YELLOW}3. Checking frontend dependencies...${NC}"
cd frontend
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "   ${YELLOW}⚠️  Installing dependencies...${NC}"
    npm install
fi
cd ..
echo ""

# Step 4: Test build
echo -e "${YELLOW}4. Testing production build...${NC}"
read -p "   Do you want to test the build? (y/n): " test_build
if [ "$test_build" = "y" ]; then
    cd frontend
    echo "   Building..."
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ Build successful!${NC}"
        echo "   Build output: frontend/build/"
        echo "   Build size:"
        du -sh build
    else
        echo -e "   ${RED}❌ Build failed. Please fix errors before deploying.${NC}"
        exit 1
    fi
    cd ..
fi
echo ""

# Step 5: Check Git status
echo -e "${YELLOW}5. Checking Git status...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Git repository found${NC}"
    
    # Check if there are uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "   ${YELLOW}⚠️  You have uncommitted changes:${NC}"
        git status -s
        echo ""
        read -p "   Do you want to commit and push? (y/n): " commit_push
        if [ "$commit_push" = "y" ]; then
            read -p "   Enter commit message: " commit_msg
            git add .
            git commit -m "$commit_msg"
            git push origin main
            echo -e "   ${GREEN}✅ Changes pushed to GitHub${NC}"
        fi
    else
        echo -e "   ${GREEN}✅ No uncommitted changes${NC}"
    fi
else
    echo -e "   ${RED}❌ Not a git repository${NC}"
fi
echo ""

# Step 6: Backend deployment reminder
echo -e "${BLUE}📝 Backend Deployment Reminder${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important: Deploy your backend first!${NC}"
echo ""
echo "Backend deployment options:"
echo "  1. Render.com (Recommended) - https://render.com"
echo "  2. Railway.app - https://railway.app"
echo "  3. Heroku - https://heroku.com"
echo ""
read -p "Have you deployed your backend? (y/n): " backend_deployed
if [ "$backend_deployed" != "y" ]; then
    echo -e "${YELLOW}Please deploy your backend first and get the API URL.${NC}"
    echo "Refer to NETLIFY_DEPLOYMENT_GUIDE.md for instructions."
    echo ""
fi

if [ "$backend_deployed" = "y" ]; then
    read -p "Enter your backend URL (e.g., https://api.example.com): " backend_url
    echo ""
    echo -e "${GREEN}✅ Backend URL: $backend_url${NC}"
    echo ""
    echo "Don't forget to add this in Netlify environment variables:"
    echo "  REACT_APP_API_URL=${backend_url}/api"
    echo ""
fi

# Step 7: Netlify deployment instructions
echo -e "${BLUE}🚀 Ready to Deploy to Netlify!${NC}"
echo ""
echo "Choose your deployment method:"
echo ""
echo "Method 1: Netlify Web UI (Easiest)"
echo "  1. Go to https://app.netlify.com/"
echo "  2. Click 'Add new site' → 'Import an existing project'"
echo "  3. Choose GitHub and select: imranpreet/career-guidnece"
echo "  4. Configure:"
echo "     - Base directory: frontend"
echo "     - Build command: npm run build"
echo "     - Publish directory: frontend/build"
echo "  5. Add environment variables:"
echo "     - REACT_APP_API_URL=${backend_url}/api"
echo "  6. Click 'Deploy site'"
echo ""
echo "Method 2: Netlify CLI"
echo "  Run these commands:"
echo "  $ npm install -g netlify-cli"
echo "  $ netlify login"
echo "  $ cd frontend"
echo "  $ netlify deploy --prod"
echo ""

read -p "Do you want to install Netlify CLI now? (y/n): " install_cli
if [ "$install_cli" = "y" ]; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
    echo -e "${GREEN}✅ Netlify CLI installed${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: netlify login"
    echo "  2. Run: cd frontend"
    echo "  3. Run: netlify deploy --prod"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Pre-deployment preparation complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📚 For detailed instructions, see: NETLIFY_DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${BLUE}Good luck with your deployment! 🚀${NC}"
