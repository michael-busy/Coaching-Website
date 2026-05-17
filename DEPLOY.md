# Deploy guide — GitHub Pages + GoDaddy domain

This walks you through publishing the site to **chernyakov-coaching.com** using GitHub Pages (free) and your existing GoDaddy domain.

Time: ~20–30 minutes the first time. Subsequent updates are a `git push` away.

---

## 1. Create the GitHub repository

1. Go to https://github.com/new (sign in if needed).
2. **Repository name**: `chernyakov-coaching` (any name works — it doesn't have to match the domain).
3. Set it to **Public** (required for free GitHub Pages).
4. **Do NOT** check "Add a README" — we already have one.
5. Click **Create repository**.

GitHub will show you a page with setup commands. Keep that tab open.

---

## 2. Push the files from your computer

**Easiest path: use GitHub Desktop (no command line)** — install https://desktop.github.com/, sign in as `michael-busy`, then File → Add Local Repository → pick this folder → Create → Commit → Publish repository.

**Or, command line:**

```bash
cd "/Users/michaelchernyakov/Documents/Claude/Projects/Coaching Website"

# Initialize git
git init
git branch -M main

# Stage and commit everything
git add .
git commit -m "Initial site"

# Connect to your GitHub repo and push
git remote add origin https://github.com/michael-busy/chernyakov-coaching.git
git push -u origin main
```

If git asks for credentials, GitHub no longer accepts passwords on the command line — you'll need a **personal access token** (Settings → Developer settings → Personal access tokens → Tokens (classic) → generate one with `repo` scope) or install [GitHub Desktop](https://desktop.github.com/) and use that instead.

---

## 3. Turn on GitHub Pages

1. In your repo on GitHub, click **Settings** (top-right of repo).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `/ (root)` → click **Save**
4. Wait ~1 minute. Refresh the page — you'll see "Your site is live at `https://michael-busy.github.io/chernyakov-coaching/`".

Visit that URL to confirm it works. It will look unstyled until DNS propagates if you visit via the custom domain — that's fine.

---

## 4. Point GoDaddy DNS at GitHub

The repo already includes a `CNAME` file with `chernyakov-coaching.com`, which tells GitHub Pages to serve your custom domain.

Now you need GoDaddy to send traffic to GitHub.

1. Log in to **GoDaddy** → **My Products** → find `chernyakov-coaching.com` → click **DNS** (or "Manage DNS").
2. **Delete** any existing `A` records pointing to `@` (apart from the ones below) and any default "parked" CNAME records that point `www` to `_domainconnect.gd.domaincontrol.com` or similar — those interfere.
3. Add the following records:

| Type  | Name | Value                         | TTL      |
|-------|------|-------------------------------|----------|
| A     | @    | `185.199.108.153`             | 600 sec  |
| A     | @    | `185.199.109.153`             | 600 sec  |
| A     | @    | `185.199.110.153`             | 600 sec  |
| A     | @    | `185.199.111.153`             | 600 sec  |
| CNAME | www  | `michael-busy.github.io`      | 600 sec  |

(Note: the CNAME value is just `michael-busy.github.io` — no `https://`, no repo name, no trailing slash.)

Save changes.

---

## 5. Tell GitHub about the domain

1. Back in GitHub → repo **Settings** → **Pages**.
2. Under **Custom domain**, enter: `chernyakov-coaching.com` → **Save**.
3. GitHub will run a DNS check. This can take anywhere from 5 minutes to a few hours (rarely up to 24h) depending on GoDaddy.
4. Once the check passes, **tick the "Enforce HTTPS" checkbox**. (If it's grayed out, wait — GitHub is still provisioning the SSL certificate.)

---

## 6. Verify

After DNS propagates, you should be able to visit:

- https://chernyakov-coaching.com ✅
- https://www.chernyakov-coaching.com (redirects to the apex)

To check DNS propagation from your machine:

```bash
dig chernyakov-coaching.com +short
# Should return the four 185.199.10x.153 addresses
```

---

## 7. Updating the site later

Any time you change a file in this folder:

```bash
cd "/Users/michaelchernyakov/Documents/Claude/Projects/Coaching Website"
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages will rebuild and republish within ~30 seconds.

---

## Troubleshooting

- **Site shows 404**: Pages may still be deploying — wait 2 minutes and reload. Confirm Settings → Pages shows "Your site is live".
- **"DNS check failed"**: Double-check the four A records and the `www` CNAME. Use https://dnschecker.org/ to confirm propagation.
- **"Enforce HTTPS" is grayed out**: SSL cert is still being issued — usually ready within an hour of the DNS check passing. Just wait and refresh.
- **Styles look broken**: Make sure `styles.css` was committed and pushed. Look at `https://chernyakov-coaching.com/styles.css` directly — it should show CSS, not a 404.
