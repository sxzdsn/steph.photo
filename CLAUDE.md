<!-- last reviewed: 2026-06-12 -->

# steph.photo

Hand-coded rebuild of my old Squarespace photography portfolio ("some-dilettante", Wells template). Static site, no build step, no dependencies — plain HTML/CSS/JS. Published: GitHub Pages from `main` (repo github.com/sxzdsn/steph.photo), custom domain steph.photo via `CNAME` file, DNS on Cloudflare (same pattern as steph.cv).

## Layout
- `index.html` — homepage = culinary gallery (matches the original, where one collection served both `/` and `/portraiture`)
- `portraiture/`, `humannature/`, `about/`, `blog/` — original URL slugs kept on purpose (slugs ≠ nav labels: nav says "culinary"/"else")
- `css/site.css` — all values extracted from the original compiled Squarespace CSS
- `js/gallery.js` — Wells slideshow: click left/right halves = prev/next, center = thumbnail grid, arrow keys, Esc back to slideshow
- `assets/` — original-resolution images; order + focal points in `manifest.tsv`
- `reference/` — extraction archive: captured pages (`html/`), original compiled CSS, design tokens (`rebuild-spec.md`, `tweaks.json`). Not for deploy.

## Known gaps
- Proxima Nova: needs my Adobe Fonts embed in each page `<head>` (placeholder comment there); currently falls back to Helvetica Neue
- "Say Hello" on about is a JS-obfuscated mailto (email assembled at runtime, never in HTML source — keeps it off scrapers). Original was a Squarespace form lightbox.
- Hidden `/screener` page from the original was not rebuilt (was just a Google Form embed)

## Preview
`steph-photo` config in ~/.claude/launch.json serves **/tmp/steph-photo-preview** on port 4180 — macOS TCC blocks preview-spawned servers from reading ~/Desktop, so the site is rsynced there (same pattern as every other project). After edits:
`rsync -a --delete --exclude reference --exclude manifest.tsv --exclude '*.command' --exclude '*.app' --exclude CLAUDE.md ~/Desktop/projects/steph.photo/ /tmp/steph-photo-preview/`

## Deploy
Live on GitHub Pages from `main` root. Push to deploy — Pages rebuilds automatically. `.gitignore` keeps `reference/`, `manifest.tsv`, and launchers out of the repo. `CNAME` holds the custom domain.

DNS (Cloudflare) — point apex `steph.photo` at GitHub Pages with four A records: 185.199.108.153, .109.153, .110.153, .111.153. Set **DNS-only (grey cloud)** until GitHub provisions the cert, then turn on "Enforce HTTPS" in Pages settings. (Optional AAAA: 2606:50c0:8000–8003::153.)
