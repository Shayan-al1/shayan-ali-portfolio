# Shayan Ali – portfolio

React + GSAP (ScrollTrigger, ScrollToPlugin) + Tailwind CSS, built with Vite and ready to deploy on Vercel.

## Run it locally

```bash
npm install
npm run dev       # local dev server, usually http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build
```
Needs Node.js 18 or newer (check with `node -v`).

## Deploy on Vercel (free, from GitHub)

1. Create an empty repository on github.com (for example `shayan-ali-portfolio`).
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/shayan-ali-portfolio.git
   git push -u origin main
   ```
3. On vercel.com, sign in with GitHub, then **Add New > Project** and import the repository.
4. Keep the project name `shayan-ali-portfolio` so the address matches `.env`. Vercel detects Vite on its own
   (`vercel.json` sets `npm run build` and the `dist` folder). Click **Deploy**.
5. When it finishes you get an address like `https://shayan-ali-portfolio.vercel.app`. If the address is different,
   put the real one in `.env` (`VITE_SITE_URL`), commit and push.

Every `git push` to `main` redeploys the site automatically.

### Deploy without GitHub (Vercel CLI)

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Add your domain later

1. Buy the domain (for example at Cloudflare Registrar).
2. In Vercel: **Project > Settings > Domains**, add `shayan-ali.com` and `www.shayan-ali.com`.
3. Add the DNS records Vercel shows at your DNS provider. If DNS is on Cloudflare, set them to **DNS only** (grey cloud).
4. Change `VITE_SITE_URL` in `.env` to the new domain, commit and push.

## Plan note

Vercel's free Hobby plan is meant for personal, non-commercial use. This site promotes paid work, so check Vercel's current
terms, or use Pro, or host the same project on Cloudflare Pages (build command `npm run build`, output folder `dist`).

## Where things live

- `src/data.js` – name, email, phone, tagline, the skills keyboard (`SKILLS`), experience, services and projects.
- `src/index.css` – light and dark colour variables at the top (including the hero overlay colours), plus Tailwind.
- `tailwind.config.js` – maps the colour variables to Tailwind classes.
- `src/components/` – Nav (with the mobile menu), SkipIntro, Hero (zoom-through name), Skills (interactive keyboard), Experience, Work (wipe-reveal stage), Services, Contact (assembling email), ProgressBar.
- `src/lib/motion.js` – GSAP setup and the reduced-motion flag.
- `src/lib/images.js` and `src/assets/work/` – the project screenshots.
- `public/` – `Shayan_Ali_CV.pdf` (behind the Download CV button; replace the file to update it), `favicon.svg`, `og.png` (share preview image) and `robots.txt`.
