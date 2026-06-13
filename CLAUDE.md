<!-- last reviewed: 2026-06-12 -->

# steph.photo

Hand-coded rebuild of my old Squarespace photography portfolio ("some-dilettante", Wells template). Static site, no build step, no dependencies — plain HTML/CSS/JS. Domain steph.photo is owned, not yet deployed.

## Layout
- `index.html` — homepage = culinary gallery (matches the original, where one collection served both `/` and `/portraiture`)
- `portraiture/`, `humannature/`, `about/`, `blog/` — original URL slugs kept on purpose (slugs ≠ nav labels: nav says "culinary"/"else")
- `css/site.css` — all values extracted from the original compiled Squarespace CSS
- `js/gallery.js` — Wells slideshow: click left/right halves = prev/next, center = thumbnail grid, arrow keys, Esc back to slideshow
- `assets/` — original-resolution images; order + focal points in `manifest.tsv`
- `reference/` — extraction archive: captured pages (`html/`), original compiled CSS, design tokens (`rebuild-spec.md`, `tweaks.json`). Not for deploy.

## Known gaps
- Proxima Nova: needs my Adobe Fonts embed in each page `<head>` (placeholder comment there); currently falls back to Helvetica Neue
- "Say Hello" on about is a mailto: (original was a Squarespace form lightbox)
- Gallery controls bar (‹ n/N ›) is a reconstruction — original controls were JS-injected and not captured; everything else is verbatim
- Hidden `/screener` page from the original was not rebuilt

## Preview
`steph-photo` config in ~/.claude/launch.json serves **/tmp/steph-photo-preview** on port 4180 — macOS TCC blocks preview-spawned servers from reading ~/Desktop, so the site is rsynced there (same pattern as every other project). After edits:
`rsync -a --delete --exclude reference --exclude manifest.tsv --exclude '*.command' --exclude '*.app' --exclude CLAUDE.md ~/Desktop/projects/steph.photo/ /tmp/steph-photo-preview/`

## Deploy (when ready)
Exclude `reference/`, `manifest.tsv`, launchers from upload. Everything else is the site.
