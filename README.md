# Chernyakov Coaching — website

A clean, static website for Michael Chernyakov's coaching practice (personal development & business leadership coaching).

## What's in this folder

```
.
├── index.html       Home page (hero, services, CTA)
├── about.html       About Me page
├── styles.css       Shared styles
├── CNAME            Custom domain for GitHub Pages
├── .nojekyll        Tells GitHub Pages to skip Jekyll processing
├── robots.txt       Search engine instructions
└── sitemap.xml      Sitemap for search engines
```

## Local preview

Open `index.html` directly in your browser, or run a quick local server:

```bash
# from this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages with your GoDaddy domain

See `DEPLOY.md` for the full step-by-step guide.

## Editing tips

- Change copy: edit `index.html` and `about.html` directly.
- Change colors: edit the CSS variables at the top of `styles.css` (`--accent`, `--bg`, etc.).
- Change booking link: search/replace `https://calendar.app.google/MXdrHfJUWrtYFRPc9` across both HTML files.
- Change email: search/replace `michael@chernyakov-coaching.com` across both HTML files.
