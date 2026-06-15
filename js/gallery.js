// Wells-style gallery: left half = prev, right half = next,
// center = thumbnail grid, arrow keys, Esc back to slideshow.
// Bottom-left controls (prev / next, show thumbnails) are always visible.
// Thumbnails are laid out with native CSS columns (see site.css) — no JS
// measuring, so lazy-loaded images and variable heights just work.

(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('#slideshow .slide'));
  if (!slides.length) return;

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#thumbnails .thumb'));
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

  function setView(thumbView) {
    document.body.classList.toggle('view-thumbs', thumbView);
    if (toggleLink) toggleLink.textContent = 'view all';
    if (thumbView) window.scrollTo(0, 0);
  }

  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      setView(false);
      show(parseInt(t.getAttribute('data-slide'), 10) || 0);
    });
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
