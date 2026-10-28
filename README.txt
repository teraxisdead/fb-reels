FACEBOOK MEDIA DOWNLOADER (free PWA)

1) Host the folder for free: drag it into Netlify Drop, Cloudflare Pages, or GitHub Pages. Open the link on your phone -> "Install / Add to Home Screen". The icon appears.
2) Works right away in DEMO mode (sample data only).
3) For real downloads of PUBLIC Reels/videos/photos with no Facebook login: create a free Cloudflare account -> Workers -> Create -> paste worker.js -> Deploy. Copy the *.workers.dev URL into App > Settings > Backend.
Notes: private content, login-only content and page/profile listings can't be fetched without login; paste individual links (several at once, one per line) for bulk ZIP. Facebook changes its pages often, so extraction may need updating.
