// Wells-style gallery: left half = prev, right half = next,
// center = thumbnail grid, arrow keys, Esc back to slideshow.
// Bottom-left controls (prev / next, show thumbnails) are always visible.
// Thumbnails are balanced into three columns; on desktop the first two columns
// drift down with scroll so all three photo edges meet at the bottom.

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
  var nudgeTargets = [0, 0, 0];
  var nudgeMeasureFrame = 0;
  var nudgeUpdateFrame = 0;

  // tag each slide by aspect ratio so the tablet layout (800–1280) can size
  // landscape images to the text width and portrait images to the height
  function tagOrientation(img) {
    if (!img || !img.naturalWidth) return;
    var slide = img.parentNode;
    var r = img.naturalWidth / img.naturalHeight;
    slide.classList.toggle('is-portrait', r < 1);
    slide.classList.toggle('is-landscape', r >= 1);
    // standardized display frames — the image fills a fixed-ratio box (cover) so the
    // slideshow frame stays uniform across near-identical ratios. Non-destructive: the
    // source file is never modified, only the visible crop. Buckets match the inventory:
    slide.classList.toggle('fill-32', r >= 1.485 && r <= 1.51);  // near-3:2 → 3:2
    slide.classList.toggle('fill-75', r >= 1.405 && r < 1.485);  // squarer landscape → 7:5
  }

  // the photo sits at 90% of the frame: 90% width when it is wider than the frame,
  // 90% height when it is taller. Measuring against the live frame ratio (rather than
  // orientation alone) keeps a margin on all four sides at any window size — a 7:5
  // photo at 90% width would otherwise run to the top and bottom edges of a 3:2 frame.
  var frame = document.getElementById('slideshowWrapper');

  function displayRatio(slide, img) {
    if (slide.classList.contains('fill-32')) return 1.5; // standardized buckets display
    if (slide.classList.contains('fill-75')) return 1.4; // at their box ratio, not the file's
    return img.naturalWidth / img.naturalHeight;
  }

  function fitSlides() {
    if (!frame) return;
    var box = frame.getBoundingClientRect();
    if (!box.width || !box.height) return;
    var frameRatio = box.width / box.height;
    slides.forEach(function (s) {
      var img = s.querySelector('img');
      if (!img || !img.naturalWidth) return;
      var wide = displayRatio(s, img) >= frameRatio;
      s.classList.toggle('fit-width', wide);
      s.classList.toggle('fit-height', !wide);
    });
  }

  slides.forEach(function (s) {
    var img = s.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth) tagOrientation(img);
    else img.addEventListener('load', function () { tagOrientation(img); fitSlides(); });
  });
  fitSlides();
  window.addEventListener('resize', fitSlides);

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

  function updateNudge() {
    nudgeUpdateFrame = 0;
    if (!document.body.classList.contains('view-thumbs') || mobile.matches) return;

    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    thumbCols.forEach(function (col, i) {
      col.style.setProperty('--column-nudge', (nudgeTargets[i] * progress).toFixed(2) + 'px');
    });
  }

  function scheduleNudgeUpdate() {
    if (nudgeUpdateFrame) return;
    nudgeUpdateFrame = window.requestAnimationFrame(updateNudge);
  }

  function measureNudge() {
    nudgeMeasureFrame = 0;
    if (!document.body.classList.contains('view-thumbs') || mobile.matches || thumbCols.length < 3) return;

    var naturalBottoms = thumbCols.map(function (col) {
      var images = col.querySelectorAll('.thumb img');
      var last = images[images.length - 1];
      if (!last) return 0;
      var currentOffset = parseFloat(col.style.getPropertyValue('--column-nudge')) || 0;
      return last.getBoundingClientRect().bottom - currentOffset;
    });
    var targetBottom = naturalBottoms[2];
    nudgeTargets = naturalBottoms.map(function (bottom, i) {
      return i < 2 ? Math.max(0, targetBottom - bottom) : 0;
    });
    scheduleNudgeUpdate();
  }

  function scheduleNudgeMeasure() {
    if (nudgeMeasureFrame) return;
    nudgeMeasureFrame = window.requestAnimationFrame(measureNudge);
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
    scheduleNudgeMeasure();
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

  window.addEventListener('scroll', scheduleNudgeUpdate, { passive: true });
  window.addEventListener('resize', scheduleNudgeMeasure);
  mobile.addEventListener('change', scheduleNudgeMeasure);

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
