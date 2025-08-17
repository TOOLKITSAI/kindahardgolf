# 🚀 Deployment Guide - Kinda Hard Golf

## ✅ Pre-Deployment Checklist
All items have been completed:
- [x] robots.txt created and configured
- [x] sitemap.xml updated with actual pages
- [x] _headers configured with CSP for game and YouTube
- [x] .gitignore created for Git
- [x] Google Analytics code removed
- [x] README.md updated

## 📋 Step-by-Step Deployment

### Step 1: Initialize Git Repository
```bash
cd /Users/rickchoi/Desktop/kinda-hard-golf
git init
git add .
git commit -m "Initial commit - Kinda Hard Golf website ready for deployment"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `kinda-hard-golf-website`
3. Set as **Public**
4. Don't initialize with README (we already have one)
5. Create repository

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/kinda-hard-golf-website.git
git branch -M main
git push -u origin main
```

### Step 4: Connect to Cloudflare Pages
1. Go to https://dash.cloudflare.com/
2. Select **Pages** from the sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select your GitHub account and repository
6. Configure build settings:
   - Project name: `kindahardgolf`
   - Production branch: `main`
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`
7. Click **Save and Deploy**

### Step 5: Add Custom Domain
1. After deployment completes, go to project settings
2. Select **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `kindahardgolf.app`
5. Cloudflare will automatically configure DNS
6. Add www subdomain: `www.kindahardgolf.app`

## ⚠️ Important Notes

### YouTube Videos
The current videos use placeholder IDs. You mentioned you've updated them, but verify they work:
- Video 1: B20nCy01dsk
- Video 2: Nqm2Q1UfF5s

### Game iFrame
The game embeds from: https://kindahardgolf.com
Make sure this domain allows embedding on kindahardgolf.app

### Images to Add
Before going fully live, consider adding:
- `/images/og-image.jpg` (1200x630px) for social sharing
- Verify `/favicon.ico` is working

## 🔄 Post-Deployment

### Test Everything
1. Game loads correctly
2. YouTube videos play
3. All links work
4. Mobile responsive design
5. Social sharing buttons

### Monitor
- Check Cloudflare Analytics
- Test page speed with PageSpeed Insights
- Monitor for any console errors

## 📞 Support

If you encounter issues:
1. Check Cloudflare Pages build logs
2. Verify DNS propagation (can take up to 24 hours)
3. Test with different browsers

## 🎉 You're Ready!

Your site is prepared for deployment. Follow the steps above and your site should be live within minutes!

---
Last updated: 2025-01-17
