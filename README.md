# Yorkshire Accident Recovery & Rescue website

Static site (plain HTML, CSS and JS, no build step; 3D hero, tilt cards and scroll animations are pure CSS/JS, all disabled for visitors who prefer reduced motion) for https://yorkshirerecovery.co.uk

- Pages: `/`, `/services/` (plus 4 service pages), `/areas/`, `/about/`, `/contact/`
- Shared styles: `assets/css/style.css`; menu and contact form: `assets/js/main.js`
- Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000
- Host on any static host (Netlify, Cloudflare Pages, GitHub Pages, etc.). URLs match the old WordPress site, so existing links and SEO carry over.
- The header and footer are repeated in each `index.html`; update them in every page when changing nav or contact details.
- The contact form opens the visitor's email app (mailto). To receive submissions directly, connect it to a form service such as Formspree or Netlify Forms.

All links are relative, so the site works at a domain root and from a sub-folder such as `https://<user>.github.io/Yorkshire-Rescue/`.

## Settings (assets/js/config.js)
- `analyticsId`: Google Analytics 4 ID (e.g. `G-ABC123XYZ9`). Loads only after a visitor accepts cookies. The cookie banner then appears site-wide.
- `formEndpoint`: URL from a form service such as Formspree. Enquiries are emailed to you and visitors land on `/thank-you/`. Leave empty to fall back to the visitor's email app.

## SEO and compliance
Per-page titles and descriptions, canonical URLs, Open Graph/Twitter cards (`assets/img/og-image.jpg`), LocalBusiness, Service, FAQ and Breadcrumb structured data, `sitemap.xml`, `robots.txt`, favicons and web manifest, a custom `404.html`, privacy and terms pages, and a consent-gated cookie banner (Google Maps and analytics only load after consent).

## Hosting on Vercel
Import the repo in Vercel with framework preset "Other" and no build command. `vercel.json` adds a www to non-www redirect, security headers and image caching. Add `yorkshirerecovery.co.uk` and `www.yorkshirerecovery.co.uk` under Settings > Domains and use the DNS records Vercel shows.
