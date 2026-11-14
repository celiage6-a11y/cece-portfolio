// Carousels
document.querySelectorAll('[data-carousel]').forEach(function (c) {
  var imgs = Array.prototype.slice.call(c.querySelectorAll('.c-stage img'));
  var label = c.querySelector('[data-c="label"]');
  var title = c.querySelector('[data-c="title"]');
  var text = c.querySelector('[data-c="text"]');
  var textBox = c.querySelector('.c-text .fade');
  var dotsBox = c.querySelector('.dots');
  var n = imgs.length, i = 0;
  var dots = imgs.map(function (_, k) {
    var d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label', 'Show screen ' + (k + 1));
    d.addEventListener('click', function () { go(k); });
    dotsBox.appendChild(d);
    return d;
  });
  function pad(x) { return (x < 10 ? '0' : '') + x; }
  function render() {
    imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    label.textContent = 'The app  ·  ' + pad(i + 1) + ' / ' + pad(n);
    title.textContent = imgs[i].dataset.title;
    text.textContent = imgs[i].dataset.text;
  }
  function go(k) {
    i = (k + n) % n;
    textBox.classList.add('out');
    setTimeout(function () { render(); textBox.classList.remove('out'); }, 180);
    imgs.forEach(function (im, j) { im.classList.toggle('on', j === i); });
    dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
  }
  c.querySelector('.c-btn.prev').addEventListener('click', function () { go(i - 1); });
  c.querySelector('.c-btn.next').addEventListener('click', function () { go(i + 1); });
  var stage = c.querySelector('.c-stage'), sx = null;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    sx = null;
  });
  stage.addEventListener('click', function () { go(i + 1); });
  render();
});

// Process tabs
document.querySelectorAll('[data-tabs]').forEach(function (box) {
  var tabs = box.querySelectorAll('.tab');
  var panels = box.querySelectorAll('.panel');
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x, j) { x.setAttribute('aria-selected', j === k ? 'true' : 'false'); });
      panels.forEach(function (p, j) { p.hidden = j !== k; });
    });
  });
});

// Before / after toggles
document.querySelectorAll('.toggle').forEach(function (t) {
  var pill = t.querySelector('.tpill');
  t.addEventListener('click', function () {
    var on = t.classList.toggle('on');
    pill.textContent = on ? t.dataset.after : t.dataset.before;
  });
});

// Greeting wheel: words roll down like a clock picker, "I'm" never moves
(function () {
  var wheel = document.querySelector('.wheel');
  if (!wheel) return;
  var words = wheel.dataset.words.split('|'), N = words.length, k = 0;
  var els = words.map(function (w) { var s = document.createElement('span'); s.className = 'w'; s.textContent = w; wheel.appendChild(s); return s; });
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prev = [];
  function place(first) {
    els.forEach(function (el, i) {
      var rel = ((i - k) % N + N) % N; if (rel > N / 2) rel -= N;
      el.classList.toggle('jump', first || (prev[i] !== undefined && Math.abs(rel - prev[i]) > 1));
      el.style.transform = 'translateY(' + (rel * 0.98) + 'em) rotateX(' + (-rel * 52) + 'deg) scale(' + (1 - Math.abs(rel) * 0.08) + ')';
      el.style.opacity = rel === 0 ? 1 : (Math.abs(rel) === 1 ? 0.28 : 0);
      el.style.filter = rel === 0 ? 'none' : 'blur(1px)';
      el.classList.toggle('on', rel === 0);
      prev[i] = rel;
    });
  }
  place(true);
  if (still) return;
  setInterval(function () { k = (k + 1) % N; place(false); }, 2400);
})();
