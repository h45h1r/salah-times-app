# Salah Times App

A beautiful Islamic prayer times application with Quran ayahs, built with HTML, CSS, and JavaScript.

## Features

- 📍 **Location-based prayer times** - Automatically detects your location or uses default
- 🕌 **Accurate prayer times** - Uses Aladhan API for precise calculations
- 📅 **Date navigation** - Browse different dates and view prayer times
- ⏰ **Countdown timer** - Shows time remaining until next prayer
- 🌅 **Sunrise/Tahajjud times** - Interactive card showing both times
- 🎨 **Modern UI** - Beautiful dark theme with gradient designs
- 📱 **Mobile responsive** - Optimized for mobile devices
- 🔄 **PWA ready** - Can be installed as a progressive web app

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/salah-times-app.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **root** folder
   - Click **Save**

3. **Your app will be live at**
   - `https://YOUR_USERNAME.github.io/salah-times-app/`

### Option 2: Traditional Web Server

1. **Upload files to your server**
   - Upload all files to your web server's public directory
   - Ensure `index.html` is in the root directory

2. **Configure your domain**
   - Point your domain to your server
   - Configure your web server (Apache/Nginx) to serve static files

3. **Access your app**
   - Navigate to `https://yourdomain.com`

### Option 3: Netlify/Vercel

1. **Connect your GitHub repository**
   - Sign up for [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Deploy automatically on push

2. **Custom domain (optional)**
   - Add your custom domain in the deployment platform settings

## File Structure

```
salah-site/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── manifest.json       # PWA manifest
├── pwabuilder-sw.js    # Service worker
└── README.md          # This file
```

## Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/salah-times-app.git
   cd salah-times-app
   ```

2. **Start local server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000`

## API Dependencies

- **London Prayer Times API**: Prayer times
- **Aladhan API**: Islamic date conversion
- **Sunrise-Sunset API**: Sunrise times
- **BigDataCloud API**: Location reverse geocoding

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## Troubleshooting

### Prayer times not loading?
- Check your internet connection
- The app will fall back to mock data if APIs are unavailable
- Make sure you're running the app through a web server (not just opening the file)

### Location not working?
- Make sure you've allowed location access in your browser
- The app will use London, UK as default if location is denied
- Try refreshing the page and allowing location when prompted

### Styling issues?
- Make sure all CSS is loading properly
- Check browser console for any JavaScript errors
- Try clearing browser cache

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Adding translations

## License

This project is open source and available under the MIT License.
