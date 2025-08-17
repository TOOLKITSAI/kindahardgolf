# Image Assets Required

This directory should contain the following image files for the Kinda Hard Golf website:

## Required Images

### 1. **og-image.jpg** (1200x630px)
- Open Graph image for social media sharing
- Should feature the game logo, golf theme, and website URL
- Optimized for Facebook, Twitter, LinkedIn sharing

### 2. **apple-touch-icon.png** (180x180px)
- Icon for iOS devices when saved to home screen
- Should be a high-quality version of the logo

### 3. **logo.svg** (Already created)
- Main site logo in SVG format
- Currently a placeholder - customize as needed

### 4. **favicon.ico** (Multiple sizes)
- Browser tab icon
- Should include 16x16, 32x32, and 48x48 sizes

## Icons Directory (/icons/)
Should contain SVG icons for:
- share.svg - Share icon
- fullscreen.svg - Fullscreen toggle
- refresh.svg - Refresh/restart icon
- trophy.svg - Leaderboard/achievement icon
- play.svg - Play button icon
- menu.svg - Mobile menu hamburger icon

## Backgrounds Directory (/backgrounds/)
Optional background patterns:
- golf-pattern.svg - Subtle golf ball pattern
- grass-texture.jpg - Golf course grass texture
- flag-pattern.svg - Golf flag decorative pattern

## Image Optimization Guidelines

1. **Format Selection:**
   - Use WebP for photographs with fallback to JPEG
   - Use SVG for logos and icons
   - Use PNG for images requiring transparency

2. **Optimization:**
   - Compress all images (TinyPNG, ImageOptim)
   - Use responsive images with srcset where appropriate
   - Lazy load images below the fold

3. **File Sizes:**
   - og-image.jpg: < 200KB
   - Icons: < 5KB each
   - Background patterns: < 50KB

4. **Accessibility:**
   - Include descriptive alt text for all images
   - Ensure sufficient contrast for overlaid text

## Tools for Creating Images

- **Favicon Generator:** https://realfavicongenerator.net/
- **OG Image Creator:** https://og-image.vercel.app/
- **SVG Icons:** https://heroicons.com/ or https://feathericons.com/
- **Image Compression:** https://tinypng.com/

## Color Palette Reference
- Primary Green: #4CAF50
- Dark Green: #2E7D32
- Light Green: #81C784
- Accent Red: #FF6B6B
- Background: #F5F5F5
- Text: #2C3E50