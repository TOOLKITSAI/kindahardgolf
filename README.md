# Kinda Hard Golf Website

Official website for Kinda Hard Golf - a daily physics golf puzzle game that's simple to learn but kinda hard to master. Built with pure HTML/CSS/JavaScript and deployed on Cloudflare Pages.

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/kinda-hard-golf.git
   cd kinda-hard-golf
   ```

2. **Deploy to Cloudflare Pages:**
   - Connect your GitHub repository to Cloudflare Pages
   - Set build output directory to `/`
   - No build command needed (static site)

3. **Configure domain:**
   - Add custom domain: kindahardgolf.app
   - SSL will be automatically provisioned

## 📁 Project Structure

```
kinda-hard-golf/
├── index.html              # Main landing page with game
├── about.html             # About the game and creator
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
├── 404.html              # Custom 404 page
├── css/                  # Stylesheets
│   ├── style.css         # Main styles
│   ├── responsive.css    # Mobile responsive
│   └── animations.css    # Animations
├── js/                   # JavaScript files
│   ├── main.js           # Core functionality
│   ├── game-frame.js     # Game iframe control
│   └── share.js          # Social sharing
├── images/               # Image assets
├── _headers              # Cloudflare security headers
├── _redirects            # URL redirects
├── robots.txt            # SEO crawler rules
├── sitemap.xml           # XML sitemap
└── .gitignore            # Git ignore file
```

## 🎨 Features

- **Responsive Design:** Works perfectly on all devices
- **Game Integration:** Seamless iframe embedding of Kinda Hard Golf
- **YouTube Tutorials:** Embedded gameplay videos from top players
- **Social Sharing:** Built-in score sharing functionality
- **SEO Optimized:** Meta tags, structured data, sitemap
- **Performance:** Optimized loading, caching strategies
- **Security:** CSP headers, iframe sandboxing

## 🛠️ Technologies

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Cloudflare Pages hosting
- Google Fonts

## 📝 Configuration

### Game URL
The game is embedded from `https://kindahardgolf.com`. If the URL changes, update in:
- `/js/game-frame.js` (line 8)

### YouTube Videos
To update the tutorial videos, replace the video IDs in:
- `/index.html` (search for `youtube.com/embed/`)

### Social Media Links
Current links:
- Discord: https://discord.com/invite/ZcBf2FhcVH
- Twitter/X: #KindaHardGolf hashtag search
- Reddit: Community search

## 🚦 Development

### Local Development
```bash
# Use any local server
python -m http.server 8000
# or
npx serve
```

### Making Changes
1. Edit HTML/CSS/JS files directly
2. Test locally
3. Commit and push to trigger Cloudflare deployment

## 📊 Performance Targets

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Core Web Vitals: All green

## 🔍 SEO Checklist

- [x] Meta tags on all pages
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (VideoGame schema)
- [x] XML sitemap
- [x] Robots.txt
- [x] Privacy Policy page
- [x] Terms of Service page
- [ ] Add actual og-image.jpg (1200x630px)
- [ ] Verify favicon.ico is working

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this template for your own projects!

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@kindahardgolf.app

## 🎯 TODO

- [ ] Add actual image assets (favicon.ico, og-image.jpg)
- [ ] Replace YouTube video placeholders with actual video IDs
- [ ] Test game iframe on production domain
- [ ] Monitor Core Web Vitals after launch
- [ ] Consider adding PWA support (service worker, manifest.json)
- [ ] Add more gameplay tutorial videos

---

Built with ⛳ for golf lovers everywhere!