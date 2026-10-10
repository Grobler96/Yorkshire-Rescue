(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.classList.add('js');

  // Mobile menu
  var toggle = d.querySelector('.menu-toggle'), nav = d.getElementById('nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Scroll progress, header state, steps timeline
  var bar = d.querySelector('.progress'), header = d.querySelector('.header'), steps = d.querySelector('.steps');
  var ticking = false;
  function onScroll() {
    var h = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    if (header) header.classList.toggle('scrolled', scrollY > 20);
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.1);
      steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Reveal on scroll (auto-tagged)
  var targets = d.querySelectorAll('.section-head, .strip .item, .stat, .card, .step, .quote, .area, .gallery img, .faq details, .split > *, .prose, .aside > *, .contact-grid > *, .cta-band .wrap');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.removeAttribute('data-r'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el); el.classList.add('in');
        setTimeout(function () { el.removeAttribute('data-r'); el.classList.remove('in'); }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.setAttribute('data-r', el.matches('.split > :first-child') ? 'left' : el.matches('.split > :last-child') ? 'right' : '');
      el.style.setProperty('--d', Math.min(sib, 5) * 0.09 + 's');
      io.observe(el);
    });
  }

  // Counters
  var counters = d.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, pre = el.dataset.prefix || '', t0 = null;
        (function step(t) {
          if (t0 === null) t0 = t;
          var k = Math.min((t - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
          el.textContent = pre + v;
          if (k < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // 3D tilt + glare
  if (fine && !reduce) {
    d.querySelectorAll('.card, .quote, .step, .area, .gallery img, .panel.emergency').forEach(function (el) {
      el.classList.add('tilt', 'rest');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('live'); el.classList.remove('rest');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 10).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 12).toFixed(2) + 'deg) translateZ(14px)';
        el.style.setProperty('--gx', (x * 100) + '%'); el.style.setProperty('--gy', (y * 100) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('live'); el.classList.add('rest'); el.style.transform = '';
      });
    });

    // Hero stage follows the pointer
    var stage = d.querySelector('[data-stage]');
    if (stage) {
      var inner = d.createElement('div'); inner.className = 'stage-in';
      while (stage.firstChild) inner.appendChild(stage.firstChild);
      stage.appendChild(inner);
      var hero = stage.closest('.hero');
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = 'rotateX(' + (-y * 12).toFixed(2) + 'deg) rotateY(' + (x * 16).toFixed(2) + 'deg)';
      });
      hero.addEventListener('pointerleave', function () { inner.style.transform = ''; });
    }
  } else {
    var s = d.querySelector('[data-stage]');
    if (s) { var i2 = d.createElement('div'); i2.className = 'stage-in'; while (s.firstChild) i2.appendChild(s.firstChild); s.appendChild(i2); }
  }

  // Contact form -> mailto
  var form = d.getElementById('contact-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var body = ['Name: ' + f.name.value, 'Phone: ' + f.phone.value, 'Service: ' + f.service.value, 'Location: ' + f.location.value, '', f.message.value].join('\n');
    location.href = 'mailto:info@yorkshirerecovery.co.uk?subject=' + encodeURIComponent('Website enquiry: ' + f.service.value) + '&body=' + encodeURIComponent(body);
  });
})();
