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

  // Little recovery truck that drives along the steps as you scroll
  if (steps && !reduce) {
    var truck = d.createElement('div');
    truck.className = 'truck'; truck.setAttribute('aria-hidden', 'true');
    truck.innerHTML = '<svg viewBox="0 0 84 44"><g class="car"><path d="M10 14h26l-3-6a3 3 0 0 0-2.6-1.6H17.4A3 3 0 0 0 14.700 8z" fill="#2a4a7a"/><rect x="6" y="13" width="34" height="7" rx="3" fill="#3b6bb0"/><circle cx="15" cy="20.500" r="3" fill="#16191d"/><circle cx="32" cy="20.500" r="3" fill="#16191d"/></g>' +
      '<path d="M2 26h52l2 3H4z" fill="#16191d"/><path d="M2 26h10l-4 3H2z M16 26h10l-4 3H12z M30 26h10l-4 3H26z M44 26h10l-4 3H40z" fill="#c8102e"/>' +
      '<rect x="4" y="29" width="52" height="5" fill="#2b3138"/>' +
      '<path d="M57 14h12l8 10v10H57z" fill="#fff" stroke="#16191d" stroke-width="1.500" stroke-linejoin="round"/><path d="M61 17h7l5 7h-12z" fill="#9fc6e8"/><rect x="57" y="30" width="23" height="4" fill="#c8102e"/><rect x="77" y="26" width="3" height="3" rx="1" fill="#ffd24a"/>' +
      '<g class="wheel"><circle cx="16" cy="36" r="6" fill="#16191d"/><circle cx="16" cy="36" r="2.500" fill="#cfd5dc"/><path d="M16 31v10M11 36h10" stroke="#cfd5dc" stroke-width="1"/></g>' +
      '<g class="wheel"><circle cx="66" cy="36" r="6" fill="#16191d"/><circle cx="66" cy="36" r="2.500" fill="#cfd5dc"/><path d="M66 31v10M61 36h10" stroke="#cfd5dc" stroke-width="1"/></g></svg>';
    steps.appendChild(truck);
    var stepEls = steps.querySelectorAll('.step');
  }
  function onScroll() {
    var h = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    if (header) header.classList.toggle('scrolled', scrollY > 20);
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (innerHeight * 0.6)));
      steps.style.setProperty('--p', p.toFixed(3));
      if (typeof stepEls !== 'undefined') {
        stepEls.forEach(function (el, i) { el.classList.toggle('reached', p >= i / 3 - 0.02); });
        truck.classList.toggle('loaded', p >= 2 / 3 - 0.02);
      }
    }
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Reveal on scroll (auto-tagged)
  var targets = d.querySelectorAll('.section-head, .strip .item, .stat, .card, .step, .quote, .area, .gallery img, .faq details, .split > *, .prose, .aside > *, .contact-grid > *, .cta-band .wrap, .locate-card');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.removeAttribute('data-r'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el); el.classList.add('in');
        setTimeout(function () { el.removeAttribute('data-r'); el.classList.remove('in'); }, 1300);
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
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


  // Share my location
  var lb = d.getElementById('locate-btn');
  if (lb) {
    var st = d.getElementById('locate-status'), acts = d.getElementById('locate-actions');
    var NUM = '+447914028283', MAIL = 'info@yorkshirerecovery.co.uk', link = '';
    function say(t, bad) { st.textContent = t; st.classList.toggle('err', !!bad); }
    lb.addEventListener('click', function () {
      if (!navigator.geolocation) { say('Your browser can\'t share location. Please call us instead.', true); return; }
      acts.hidden = true; lb.disabled = true; lb.classList.add('loading'); say('Finding you…');
      navigator.geolocation.getCurrentPosition(function (pos) {
        var la = pos.coords.latitude.toFixed(6), lo = pos.coords.longitude.toFixed(6), acc = Math.round(pos.coords.accuracy);
        link = 'https://www.google.com/maps?q=' + la + ',' + lo;
        var msg = 'Hi, I need vehicle recovery. My location: ' + link + ' (accurate to about ' + acc + ' m)';
        d.getElementById('loc-sms').href = 'sms:' + NUM + '?&body=' + encodeURIComponent(msg);
        d.getElementById('loc-mail').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Recovery needed: my location') + '&body=' + encodeURIComponent(msg);
        d.getElementById('loc-map').href = link;
        acts.hidden = false; lb.disabled = false; lb.classList.remove('loading');
        say('Got it, accurate to about ' + acc + ' m. Tap "Text it to us" to send it, then call if you can.');
      }, function (err) {
        lb.disabled = false; lb.classList.remove('loading');
        say(err.code === 1 ? 'Location is blocked. Allow location access for this site in your browser settings, or just call us.' : 'We couldn\'t get your position. Please call us and describe where you are.', true);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
    });
    d.getElementById('loc-copy').addEventListener('click', function () {
      if (navigator.clipboard && link) navigator.clipboard.writeText(link).then(function () { say('Link copied.'); }, function () { say(link); });
      else say(link);
    });
  }

  var CFG = window.YR || {};

  // ----- Cookie consent (optional cookies are blocked until you accept) -----
  var KEY = 'yr-consent', banner = d.getElementById('consent'), mapPh = d.getElementById('map-ph');
  function getC() { try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && v.t && Date.now() - v.t < 31536000000) return v.v; } catch (e) {} return null; }
  function setC(v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {} }
  function loadGA() {
    if (!CFG.analyticsId || window.__yrga) return; window.__yrga = 1;
    var sc = d.createElement('script'); sc.async = true; sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.analyticsId); d.head.appendChild(sc);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', CFG.analyticsId, { anonymize_ip: true });
  }
  function clearGA() {
    d.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^_ga/.test(n)) { var x = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; d.cookie = x; d.cookie = x + '; domain=' + location.hostname; }
    });
  }
  function loadMap() {
    var ph = d.getElementById('map-ph'); if (!ph) return;
    var f = d.createElement('iframe'); f.className = 'map'; f.title = 'Map of Rilston Street, Bradford'; f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade'; f.src = ph.dataset.src; ph.replaceWith(f);
  }
  function applyC(v) { if (v === 'all') { loadGA(); loadMap(); } else { clearGA(); } }
  function showBanner() {
    if (!banner) return;
    d.getElementById('consent-text').textContent = CFG.analyticsId
      ? 'We use optional cookies to load Google Maps and to count visits with anonymous analytics. The site works fine without them.'
      : 'We use an optional Google Maps embed, which may set cookies. The rest of the site works without cookies.';
    banner.hidden = false;
  }
  if (banner) {
    var cur = getC();
    if (cur) applyC(cur);
    else if (CFG.analyticsId || mapPh) showBanner();
    d.getElementById('consent-accept').addEventListener('click', function () { setC('all'); applyC('all'); banner.hidden = true; });
    d.getElementById('consent-reject').addEventListener('click', function () { setC('essential'); applyC('essential'); banner.hidden = true; });
    var cs = d.getElementById('cookie-settings');
    if (cs) cs.addEventListener('click', showBanner);
  }
  var ml = d.getElementById('map-load');
  if (ml) ml.addEventListener('click', loadMap);

  // ----- Contact form: validation, loading, error and success states -----
  var form = d.getElementById('contact-form');
  if (form) {
    var summary = d.getElementById('form-summary'), btn = d.getElementById('form-submit'), note = d.getElementById('form-note'), ok = d.getElementById('form-success');
    var label = btn.querySelector('.btn-label'), MAIL = 'info@yorkshirerecovery.co.uk', TEL = '07914 028283';
    if (!CFG.formEndpoint) note.insertAdjacentHTML('afterbegin', 'This opens your email app with your message ready to send. ');
    var f = form.elements;
    function setErr(el, msg) {
      var e = d.getElementById(el.id + '-err'); if (e) e.textContent = msg || '';
      el.setAttribute('aria-invalid', msg ? 'true' : 'false'); el.classList.toggle('invalid', !!msg);
    }
    function check(el) {
      var v = el.value.trim(), msg = '';
      if (el === f.name && v.length < 2) msg = 'Please enter your name.';
      if (el === f.phone && !/^(\+44|0044|0)\d{9,10}$/.test(v.replace(/[\s()-]/g, ''))) msg = v ? 'That doesn\'t look like a UK phone number. Example: 07914 028283.' : 'Please enter a phone number so we can call you back.';
      if (el === f.email && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Please enter a valid email address, or leave it blank.';
      setErr(el, msg); return msg ? [el, msg] : null;
    }
    [f.name, f.phone, f.email].forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.classList.contains('invalid')) check(el); });
      el.addEventListener('input', function () { if (el.classList.contains('invalid')) check(el); });
    });
    function showSummary(html) { summary.innerHTML = html; summary.hidden = false; summary.focus(); }
    function loading(on) { btn.disabled = on; btn.classList.toggle('loading', on); label.textContent = on ? 'Sending…' : 'Send message'; form.setAttribute('aria-busy', on ? 'true' : 'false'); }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); summary.hidden = true; ok.hidden = true;
      if (f.website.value) { form.hidden = true; ok.textContent = 'Thanks, your message has been sent.'; ok.hidden = false; return; }
      var errs = [f.name, f.phone, f.email].map(check).filter(Boolean);
      if (errs.length) {
        showSummary('Please fix ' + (errs.length > 1 ? 'these ' + errs.length + ' things' : 'this') + ' before sending:<ul>' + errs.map(function (x) { return '<li><a href="#' + x[0].id + '">' + x[1] + '</a></li>'; }).join('') + '</ul>');
        errs[0][0].focus(); return;
      }
      var data = { name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), service: f.service.value, location: f.location.value.trim(), message: f.message.value.trim() };
      if (CFG.formEndpoint) {
        loading(true);
        var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
        fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ _subject: 'Website enquiry: ' + data.service }, data)), signal: ctl ? ctl.signal : undefined })
          .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error('bad'); location.href = form.dataset.thanks; })
          .catch(function () { clearTimeout(timer); loading(false); showSummary('Sorry, we couldn\'t send your message. Please try again, or call us on <a href="tel:+447914028283">' + TEL + '</a>.'); });
      } else {
        var body = ['Name: ' + data.name, 'Phone: ' + data.phone, 'Email: ' + data.email, 'Service: ' + data.service, 'Location: ' + data.location, '', data.message].join('\n');
        location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Website enquiry: ' + data.service) + '&body=' + encodeURIComponent(body);
        ok.innerHTML = '<strong>Almost done.</strong> Your email app should have opened with your message ready. Please press send there. If nothing opened, email us at <a href="mailto:' + MAIL + '">' + MAIL + '</a> or call <a href="tel:+447914028283">' + TEL + '</a>.';
        ok.hidden = false; ok.focus();
      }
    });
  }
})();
