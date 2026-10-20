# Old architecture — Chernyakov Coaching website

Snapshot of how the site is built as of `main` @ `795db31` (2026-10-19). Written as a baseline before any rework.

## 1. Summary

- Plain static site: hand-written HTML + one shared CSS file + inline JS per page. No build step, no framework, no package manager, no tests, no CI.
- Hosted on **GitHub Pages** (repo `michael-busy/Coaching-Website`, branch `main`, root folder). `.nojekyll` disables Jekyll.
- Custom domain `chernyakov-coaching.com` via `CNAME`; DNS at **GoDaddy**.
- Third-party services: Google Calendar appointment pages (booking), MailerLite (email list / lead magnet), Umami Cloud (analytics), Google Fonts, Google Workspace (email).
- Deploy = `git push` to `main`. See `DEPLOY.md`.

## 2. Repository layout

```
.
├── index.html                       Home (full-screen video hero, philosophy, 2 offer teasers, discovery CTA)
├── about.html                       Redirect stub → /about-me/
├── about-me/index.html              About page (bio, ICF cert, career, education, JSON-LD Person)
├── offers/index.html                Offers overview (3 cards)
├── offers/personal-coaching/        Personal Coaching offer (vertical video, GROW model)
├── offers/confidence-building/      Confidence Building offer (5 elements)
├── offers/coaching-for-leaders/     Leadership workshop offer (email inquiry only)
├── offers/one-on-one-coaching/      Redirect stub → /offers/personal-coaching/
├── resources/index.html             Free downloads (no signup)
├── guide/index.html                 Lead-magnet landing page with MailerLite form (noindex)
├── privacy/index.html               GDPR privacy policy
├── styles.css                       Single shared stylesheet (~1700 lines)
├── main.js                          Booking/email constants + link rewriter — NOT loaded by any page
├── favicon.svg                      "MC" monogram
├── fonts/                           Self-hosted Inter + Source Serif 4 (latin, woff2 variable)
├── downloads/                       Public PDFs linked from /resources/
├── PDFs/                            Duplicate copies of downloads + extra PDFs (unlinked)
├── *.mp4, *.jpg, *.JPG, CV pdf      Media in repo root (several unused, see §8)
├── CNAME, .nojekyll, robots.txt, sitemap.xml
├── chernyakov-coaching.com.txt      GoDaddy DNS zone export
├── README.md, DEPLOY.md             Docs
└── runway-video-guide.md            Notes for producing an AI intro video (Runway); not site code
```

## 3. Pages and routing

Routing is folder-based (`/<path>/index.html`), served by GitHub Pages.

| URL | File | Indexed | In sitemap | Notes |
|-----|------|---------|-----------|-------|
| `/` | `index.html` | yes | yes | Transparent header that turns solid on scroll; hero `<video>` `/background-video-2.mp4` |
| `/about-me/` | `about-me/index.html` | yes | yes | JSON-LD `Person` schema |
| `/about.html` | `about.html` | noindex | no | Meta-refresh + JS redirect to `/about-me/` |
| `/offers/` | `offers/index.html` | yes | yes | Not linked from the nav (nav uses a dropdown straight to sub-pages) |
| `/offers/personal-coaching/` | … | yes | yes | Hero `<video>` `/circle-vertical.mp4` |
| `/offers/confidence-building/` | … | yes | yes | |
| `/offers/coaching-for-leaders/` | … | yes | yes | CTA is `mailto:` with subject, no booking |
| `/offers/one-on-one-coaching/` | … | noindex | no | Redirect stub to personal-coaching |
| `/resources/` | `resources/index.html` | yes | yes | Direct PDF downloads |
| `/guide/` | `guide/index.html` | `noindex, nofollow` | no | Email-gated download of the Unstuck worksheet |
| `/privacy/` | `privacy/index.html` | yes | yes | |

Navigation (duplicated in every page's markup): Home · About me · Offers ▾ (Personal Coaching / Confidence Building / Coaching for Leaders) · Resources · "Book a call" CTA.

## 4. Front-end structure

### HTML
- Every page is a fully self-contained document: `<head>` (meta, OG/Twitter tags, canonical, favicon, fonts, CSS, Umami), header/nav, `<main>`, footer, inline `<script>`.
- Header, nav, footer and the JS block are **copy-pasted** in each page — no includes/templating. Any nav change must be made in ~9 files.
- Asset paths are mixed: root-relative (`/background-video-2.mp4`), relative (`../styles.css`, `../../styles.css`), and bare (`styles.css`).
- CSS cache-busting via query string: `styles.css?v=5` everywhere except `guide/` which still uses `?v=4`.
- Accessibility: skip link, `aria-expanded`/`aria-controls` on menu toggle and dropdown, `prefers-reduced-motion` handling in CSS.

### CSS (`styles.css`)
- Design tokens on `:root`: `--bg #fafaf7`, `--accent #2f4a3a` (deep forest), `--ink`, `--line`, `--radius 10px`, `--maxw 1080px`, `--font-sans` (Inter), `--font-serif` (Source Serif 4).
- Sections by comment banner: fonts, skip link, base, header/nav (incl. transparent variant), hero, sections, services grid, CTA band, footer, lead magnet + signup form states, resources, legal pages, split hero, about, experience grid, …
- Breakpoints: 540 / 640 / 760 / 860 px (max-width). No dark mode.
- Self-hosts fonts via `@font-face` from `fonts/`.

### JavaScript (inline, per page)
| Behavior | Where |
|----------|-------|
| Footer year (`#year` = current year) | all content pages |
| Mobile drawer toggle (`.nav-toggle` → `data-nav-open` on header) | all content pages |
| Offers dropdown (click toggle, close on outside click) | all content pages |
| Transparent → solid header on scroll (> 80px) | `index.html` only |
| MailerLite form submit via `fetch` (`mode: 'no-cors'`) with success / error panels | `guide/index.html` only |

`main.js` defines `BOOKING_URL` / `CONTACT_EMAIL` and rewrites every `a[data-link="booking"]` / `a[data-link="email"]`. It was referenced earlier in history but **no page includes it now**, so the `data-link` attributes are inert and the hard-coded `href`s are what users get.

## 5. External integrations

| Service | Purpose | How it's wired | Identifier in repo |
|---------|---------|----------------|--------------------|
| GitHub Pages | Hosting + TLS | `main` branch root, `CNAME` | repo `michael-busy/Coaching-Website` |
| GoDaddy DNS | Domain | 4× A to `185.199.108–111.153`, `www` CNAME → `michael-busy.github.io` | zone export `chernyakov-coaching.com.txt` |
| Google Calendar appointment pages | Booking intro/discovery calls | Plain `<a target="_blank">` links | 3 different links, see §7 |
| MailerLite | Lead-magnet signup, double opt-in, newsletter consent | HTML form `POST` to `assets.mailerlite.com/jsonp/2609985/forms/197441156622058500/subscribe`, no MailerLite JS | account `2609985`, form `197441156622058500` |
| Umami Cloud | Cookieless analytics | `<script defer src="https://cloud.umami.is/script.js" data-website-id=…>` on every content page | website id `620375bf-ee3b-4be4-a532-98f35ceef0b4` |
| Google Fonts | Web fonts | `<link>` to `fonts.googleapis.com` (Inter + Source Serif **Pro**) on every page | — |
| Google Workspace | Email (`michael@chernyakov-coaching.com`) | MX → `aspmx.l.google.com` etc. | DNS only |
| MailerLite sending | Email auth | SPF `include:_spf.mlsend.com`, DKIM `litesrv._domainkey` CNAME | DNS only |

## 6. Hosting, DNS and deploy

- Deploy flow: edit files → commit → push `main` → GitHub Pages republishes (~30 s). No preview environments, no PR checks.
- DNS (from the zone export): apex A records to GitHub Pages, `www` → `michael-busy.github.io`, Google MX, SPF (MailerLite + Google), DMARC `p=quarantine`, Google site verification and MailerLite domain verification TXT records.
- `robots.txt` allows all and points to `sitemap.xml`. Sitemap `lastmod` is hard-coded to `2026-09-08`.

## 7. Configuration values (no secrets)

There is no `.env`, no config file and no server code. All "config" is literal values in HTML:

| Value | Where |
|-------|-------|
| Booking link A `https://calendar.app.google/iF25YMjAwqjbfpdF8` | nav "Book a call" on all pages; CTA bands on `/guide/`, `/resources/` |
| Booking link B `https://calendar.app.google/MXdrHfJUWrtYFRPc9` | intro-call buttons on about-me + offer pages; `main.js`; README |
| Booking link C `https://calendar.app.google/o5aKAvfYqwtAx6nRA` | home "Book your discovery session" |
| Contact email `michael@chernyakov-coaching.com` | footers, mailto CTAs, privacy policy, JSON-LD |
| Umami website id | `<head>` of every content page |
| MailerLite account/form ids | `guide/index.html` form `action` |

## 8. Findings / issues

**Consistency & maintainability**
1. Three different booking links in use; README and `main.js` document only one (B). Unclear which calendar is current.
2. `main.js` is dead code — not loaded anywhere — yet README implies it is the single source of truth.
3. Header/nav/footer/JS duplicated across ~9 pages; drift already visible (`styles.css?v=4` on `/guide/`, scroll-header JS only on home).
4. README file tree is outdated (lists only `index.html`/`about.html`; mentions "both HTML files").
5. `DEPLOY.md` references a different repo name (`chernyakov-coaching`) and a local path on another machine.

**Performance**
6. Fonts loaded twice: self-hosted `Inter`/`Source Serif 4` in CSS **and** Google Fonts `Inter`/`Source Serif Pro` in every `<head>`. The CSS uses `Source Serif 4`, so the Google `Source Serif Pro` download is wasted; weight 700 requested from Google but self-hosted files cover 400–600.
7. Large binaries committed to git (`.git` ≈ 113 MB). `1779307911545232.mp4` is 64.9 MB (over GitHub's 50 MB warning threshold). Unreferenced: `1779307911545232.mp4`, `Wave-video-1.mp4.mp4`, `circle-full-screen.mp4`, `profile.JPG` (2.7 MB), `michael-coaching-class.jpg`, `Michael-Chernyakov-CV.pdf`, everything under `PDFs/`.
8. `PDFs/The-Four-Goals-Workbook.pdf` and `PDFs/Unstuck_Question_Toolkit_Worksheet.pdf` are byte-identical to the copies in `downloads/`.
9. `.DS_Store` committed at the root (no `.gitignore`).

**Privacy / exposure**
10. Every file in the repo is publicly served by GitHub Pages, including unlinked ones: the CV PDF, `PDFs/ICF-ACC-Exam-Study-Guide.pdf`, the DNS zone export and `runway-video-guide.md`. Check that publishing these is intended (and that the ICF study guide may be redistributed).
11. Google Fonts loaded from Google servers (IP transfer) — disclosed in the privacy policy, but unnecessary since fonts are already self-hosted. Removing it also simplifies the policy.
12. Privacy policy controller address is still a placeholder (`[Street address]`, `[Postal code, City]`) — a GDPR requirement in Germany.

**Funnel / product**
13. The email-gated Unstuck worksheet on `/guide/` is also downloadable without signup from `/resources/` and `/downloads/…` — the gate is bypassable.
14. MailerLite submit uses `mode: 'no-cors'`, so the page cannot read the response: any request that reaches the network shows "Check your inbox", even if MailerLite rejected it. Only network-level failures (e.g. ad blockers) show the error box.
15. `/offers/` overview page is in the sitemap but not reachable from the nav.

## 9. Secrets assessment

No credentials found in the working tree or in git history (scanned for API keys, tokens, passwords, private keys, `.env` files, cloud key prefixes). All identifiers present are public-by-design client-side values:

- Umami website id — public, embedded in page HTML by design.
- MailerLite account id `2609985` + form id — public form endpoint by design.
- Google Calendar booking URLs — public share links.
- `google-site-verification` and `mailerlite-domain-verification` TXT values (in the DNS export) — public in DNS anyway.
