# Yorkshire Accident Recovery & Rescue website

Static site (plain HTML, CSS and JS, no build step) for https://yorkshirerecovery.co.uk

- Pages: `/`, `/services/` (plus 4 service pages), `/areas/`, `/about/`, `/contact/`
- Shared styles: `assets/css/style.css`; menu and contact form: `assets/js/main.js`
- Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000
- Host on any static host (Netlify, Cloudflare Pages, GitHub Pages, etc.). URLs match the old WordPress site, so existing links and SEO carry over.
- The header and footer are repeated in each `index.html`; update them in every page when changing nav or contact details.
- The contact form opens the visitor's email app (mailto). To receive submissions directly, connect it to a form service such as Formspree or Netlify Forms.
