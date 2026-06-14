// Wells-style gallery: left half = prev, right half = next,
// center = thumbnail grid, arrow keys, Esc back to slideshow.
// Bottom-left controls (prev / next, show thumbnails) are always visible.
// Thumbnails use a 350px-target JS masonry like the original.

(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('#slideshow .slide'));
  if (!slides.length) return;

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#thumbnails .thumb'));
  var container = document.getElementById('thumbnails');
  var toggleLink = document.querySelector('.meta .thumbnail-toggle');
  var current = 0;
  var mobile = window.matchMedia('(max-width: 800px)');

  function load(i) {
    if (i < 0 || i >= slides.length) return;
    var img = slides[i].querySelector('img[data-src]');
    if (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); }
  }

  function show(i) {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    for (var d = -2; d <= 2; d++) load((current + d + slides.length) % slides.length);
  }

  // mobile: stacked view needs every image
  function hydrateAll() { for (var i = 0; i < slides.length; i++) load(i); }
  if (mobile.matches) hydrateAll();
  mobile.addEventListener('change', function (e) { if (e.matches) hydrateAll(); });

  // masonry: ~250px column target → 3 columns at desktop widths,
  // matching the original site and the Wells demo
  var GAP = 10, TARGET = 250;
  function layoutThumbs() {
    if (!container || !thumbs.length) return;
    var width = container.clientWidth;
    var n = Math.max(1, Math.round(width / TARGET));
    var colW = (width - (n - 1) * GAP) / n;
    var heights = [];
    for (var c = 0; c < n; c++) heights.push(0);
    thumbs.forEach(function (t) {
      t.style.width = colW + 'px';
      var col = heights.indexOf(Math.min.apply(null, heights));
      t.style.left = (col * (colW + GAP)) + 'px';
      t.style.top = heights[col] + 'px';
      heights[col] += t.offsetHeight + GAP;
    });
    container.style.height = Math.max.apply(null, heights) + 'px';
  }

  function setView(thumbView) {
    document.body.classList.toggle('view-thumbs', thumbView);
    if (toggleLink) toggleLink.textContent = thumbView ? 'hide thumbnails' : 'show thumbnails';
    if (thumbView) { window.scrollTo(0, 0); layoutThumbs(); }
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () { setView(false); show(i); });
    var img = t.querySelector('img');
    if (img) img.addEventListener('load', layoutThumbs);
  });
  window.addEventListener('resize', function () {
    if (document.body.classList.contains('view-thumbs')) layoutThumbs();
  });

  document.querySelector('.left-control').addEventListener('click', function () { show(current - 1); });
  document.querySelector('.right-control').addEventListener('click', function () { show(current + 1); });
  // both the invisible center zone and the visible "show thumbnails" link toggle the grid
  document.querySelector('.overlay-controls.thumbnail-toggle').addEventListener('click', function () { setView(true); });
  if (toggleLink) toggleLink.addEventListener('click', function () {
    setView(!document.body.classList.contains('view-thumbs'));
  });

  var prev = document.querySelector('.gallery-controls .prev-slide');
  var next = document.querySelector('.gallery-controls .next-slide');
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Escape') setView(false);
  });

  show(0);
})();
