// Wells-style gallery: left half = prev, right half = next,
// center = thumbnail grid, arrow keys, Esc back to slideshow.
// Bottom-left controls (prev / next, show thumbnails) are always visible.
// Thumbnails are balanced into three columns so mixed photo ratios don't leave
// a short column and a ragged bottom edge.

(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('#slideshow .slide'));
  if (!slides.length) return;

  var thumbGrid = document.querySelector('#thumbnails');
  var thumbCols = Array.prototype.slice.call(document.querySelectorAll('#thumbnails .thumb-col'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#thumbnails .thumb')).sort(function (a, b) {
    return (parseInt(a.getAttribute('data-slide'), 10) || 0) - (parseInt(b.getAttribute('data-slide'), 10) || 0);
  });
  var toggleLink = document.querySelector('.meta .thumbnail-toggle');
  var current = 0;
  var mobile = window.matchMedia('(max-width: 800px)');
  var thumbsBalanced = false;

  // tag each slide by aspect ratio so the tablet layout (800–1280) can size
  // landscape images to the text width and portrait images to the height
  function tagOrientation(img) {
    if (!img || !img.naturalWidth) return;
    var portrait = img.naturalHeight > img.naturalWidth;
    img.parentNode.classList.toggle('is-portrait', portrait);
    img.parentNode.classList.toggle('is-landscape', !portrait);
  }
  slides.forEach(function (s) {
    var img = s.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth) tagOrientation(img);
    else img.addEventListener('load', function () { tagOrientation(img); });
  });

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

  function shortestColumn(heights) {
    var shortest = 0;
    for (var i = 1; i < heights.length; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    return shortest;
  }

  function balanceThumbs() {
    if (!thumbGrid || thumbCols.length < 2 || mobile.matches) return;

    var gap = parseFloat(getComputedStyle(thumbGrid).getPropertyValue('--thumb-gap')) || 10;
    var heights = thumbCols.map(function () { return 0; });
    var colWidth = thumbCols[0].getBoundingClientRect().width || 1;

    thumbCols.forEach(function (col) { col.textContent = ''; });

    thumbs.forEach(function (thumb) {
      var img = thumb.querySelector('img');
      var ratio = 1;
      if (img && img.naturalWidth && img.naturalHeight) {
        ratio = img.naturalHeight / img.naturalWidth;
      }

      var target = shortestColumn(heights);
      thumbCols[target].appendChild(thumb);
      heights[target] += (colWidth * ratio) + gap;
    });
  }

  function setView(thumbView) {
    document.body.classList.toggle('view-thumbs', thumbView);
    if (toggleLink) toggleLink.textContent = 'view gallery';
    if (thumbView) {
      window.scrollTo(0, 0);
      balanceThumbs();
      if (!thumbsBalanced) {
        thumbsBalanced = true;
        thumbs.forEach(function (thumb) {
          var img = thumb.querySelector('img');
          if (img && !img.complete) img.addEventListener('load', balanceThumbs, { once: true });
        });
      }
    }
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
