# URL Shortener & QR Generator

Simple beginner-friendly project that shortens URLs and generates QR codes.

Features:
- Shorten a long URL and get a short link that redirects to the original.
- Generate a QR code for any URL and download it as PNG.

Run locally:

```bash
npm install
node server.js
```

Open http://localhost:3000 in your browser.

Files:
- [server.js](server.js) - Express server and redirect logic
- [urls.json](urls.json) - Stores short code -> original URL mapping
- [public/index.html](public/index.html) - Frontend UI
