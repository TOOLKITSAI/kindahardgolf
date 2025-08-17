# 🎯 Kinda Hard Golf - Local Setup Guide

## ✅ Path Issues Fixed

All absolute paths (`/css/`, `/js/`, etc.) have been converted to relative paths (`./css/`, `./js/`, etc.) to ensure the website works correctly when opened locally.

### Fixed Files:
- ✅ All HTML files (index.html, guide.html, leaderboard.html, etc.)
- ✅ JavaScript references in HTML
- ✅ CSS references in HTML
- ✅ Image paths in JavaScript files
- ✅ Navigation links between pages

## 🚀 How to View the Website Locally

### Option 1: Direct File Opening (Limited Functionality)
1. Open `index.html` directly in your browser
2. **Note:** Some features may not work due to browser security restrictions:
   - Game iframe may not load (CORS policy)
   - Some JavaScript features may be limited

### Option 2: Local Web Server (Recommended) 
Run the provided script:
```bash
./start-local-server.sh
```

Or manually start a server:

**Python 3:**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
# Visit http://localhost:8000
```

**Node.js:**
```bash
npx serve
# Visit http://localhost:3000
```

**PHP:**
```bash
php -S localhost:8080
# Visit http://localhost:8080
```

## 🧪 Test Your Setup

1. Open `test-local.html` in your browser to verify resource loading
2. Check that CSS styles are applied (green header, styled buttons)
3. Navigate between pages using the menu
4. Verify that all pages load correctly

## 📁 File Structure
```
kinda-hard-golf/
├── index.html          # Main page (start here)
├── test-local.html     # Test page for verification
├── css/               # Stylesheets
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/                # JavaScript files
│   ├── main.js
│   ├── game-frame.js
│   ├── share.js
│   └── analytics.js
└── images/            # Image assets
```

## ⚠️ Known Limitations When Running Locally

1. **Game iframe**: The actual game (from kindahardgolf.com) may not load due to CORS restrictions
2. **Analytics**: Google Analytics won't work without proper configuration
3. **Social Sharing**: Some sharing features require a live URL

## 🌐 For Full Functionality

Deploy to Cloudflare Pages or another web hosting service to enable all features:
- Full game integration
- Analytics tracking
- Social sharing
- SEO benefits

## 🆘 Troubleshooting

**Issue: CSS/JS not loading**
- Solution: Use a local web server instead of opening files directly

**Issue: Game iframe shows error**
- Solution: This is expected locally due to CORS. Deploy to a web server for full functionality

**Issue: Links not working**
- Solution: Ensure you're accessing via `index.html`, not just the folder

## ✨ Quick Start Commands

```bash
# Make server script executable (first time only)
chmod +x start-local-server.sh

# Start local server
./start-local-server.sh

# Open in browser
open http://localhost:8000
```

---

**Ready to go!** Your Kinda Hard Golf website is now configured for local development. 🎉