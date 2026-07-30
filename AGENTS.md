<!-- last reviewed: 2026-06-26 -->

# steph.photo

Hand-coded rebuild of Steph's old Squarespace photography portfolio, "some-dilettante" / Wells template. Static site, no build step, no dependencies: plain HTML/CSS/JS.

Published: GitHub Pages from `main`, repo `github.com/sxzdsn/steph.photo`, custom domain `steph.photo` via `CNAME`, DNS on Cloudflare.

## Layout
- `index.html`: homepage / culinary gallery.
- `portraiture/`, `humannature/`, `about/`, `blog/`: original URL slugs kept on purpose. Slugs do not always match nav labels.
- `css/site.css`: all values extracted from original compiled Squarespace CSS.
- `js/gallery.js`: Wells slideshow. Click left/right halves for prev/next, center for thumbnail grid; arrow keys and Esc supported.
- `assets/`: original-resolution images. Order and focal points in `manifest.tsv`.
- `reference/`: extraction archive, not for deploy.

## Known Gaps
- Proxima Nova needs Steph's Adobe Fonts embed in each page head. Currently falls back to Helvetica Neue.
- About contact is an intentional decorative CSS redaction bar; no real email or mailto.
- Hidden `/screener` page from the original was not rebuilt.

## Preview
Normal local use can be direct or served static. If using the in-app preview config `steph-photo`, it serves `/tmp/steph-photo-preview` on port 4180. After edits, sync the project there and exclude `reference`, `manifest.tsv`, launchers, and project agent files.

## Deploy
Live on GitHub Pages from `main` root. Push to deploy; Pages rebuilds automatically. `.gitignore` keeps `reference/`, `manifest.tsv`, and launchers out of the repo. `CNAME` holds the custom domain.

DNS on Cloudflare: point apex `steph.photo` at GitHub Pages with four A records: 185.199.108.153, .109.153, .110.153, .111.153. Set DNS-only until GitHub provisions the cert, then turn on Enforce HTTPS in Pages settings.
