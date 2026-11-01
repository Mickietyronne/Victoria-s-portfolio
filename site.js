/* Victoria's portfolio — interactions. Plain JS, no build step. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var EMAIL = 'adenekanayo2002@gmail.com';   // ← replace with Victoria's real email (also update index.html)
  var actions = {};

  /* ---------- Work filter ---------- */
  actions.filter = function (f) {
    var n = 0;
    document.querySelectorAll('[data-cat]').forEach(function (el) {
      var show = f === 'all' || el.dataset.cat === f;
      el.classList.toggle('is-hidden', !show); if (show) n++;
    });
    document.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tab === f)); });
    $('workCount').textContent = String(n).padStart(2, '0');
  };

  /* ---------- Playground: toggle ---------- */
  var night = false;
  actions.tgl = function () {
    night = !night;
    $('tglTile').style.background = night ? '#16163A' : '#FFE873';
    $('tglTile').style.color = night ? '#F6F6F3' : '#0E0E10';
    $('tglBtn').style.background = night ? '#2A2A5C' : '#FFFFFF';
    $('tglBtn').setAttribute('aria-pressed', String(night));
    $('tglKnob').style.background = night ? '#E8E9FF' : '#FFB020';
    $('tglKnob').style.transform = 'translateX(' + (night ? '72px' : '0px') + ')';
    $('tglLabel').textContent = night ? 'Night' : 'Day';
  };

  /* ---------- Playground: like ---------- */
  var liked = false;
  actions.like = function () {
    liked = !liked;
    $('heartSvg').setAttribute('fill', liked ? '#E91E63' : 'none');
    $('likeBtn').style.transform = 'scale(' + (liked ? 1.12 : 1) + ')';
    $('likeBtn').setAttribute('aria-pressed', String(liked));
    $('likeLabel').textContent = liked ? 'Loved it, thank you!' : 'Tap the heart';
  };

  /* ---------- Playground: colour play ---------- */
  var sws = [['Butter', '#FFE873'], ['Mint', '#D9F7C5'], ['Sky', '#CFE3FF'], ['Peach', '#FFD3B8']];
  actions.sw = function (i) {
    i = +i; $('swTile').style.background = sws[i][1];
    $('swName').textContent = sws[i][0]; $('swHex').textContent = sws[i][1];
    document.querySelectorAll('.swbtn').forEach(function (b, k) {
      b.style.boxShadow = k === i ? '0 0 0 3px #0E0E10' : '0 0 0 1px rgba(14,14,16,.2)';
      b.setAttribute('aria-pressed', String(k === i));
    });
  };

  /* ---------- On repeat player: "Yellow" by Coldplay via Spotify's official embed ---------- */
  (function () {
    var TRACK = '3AJwUDP919kvQ9QcozQPxg', URL = 'https://open.spotify.com/track/' + TRACK;
    var slot = $('spotifyEmbed'); if (!slot || !$('playBtn')) return;
    var ctl = null, playing = false, loading = false;
    var framed = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
    function ui() {
      $('vinyl').style.animationPlayState = playing ? 'running' : 'paused';
      $('icoPause').style.display = playing ? 'flex' : 'none';
      $('icoPlay').style.display = playing ? 'none' : 'flex';
      $('playBtn').setAttribute('aria-label', playing ? 'Pause' : 'Play');
      $('playLabel').textContent = loading ? 'Loading…' : playing ? 'Now playing' : 'Paused';
    }
    function plainEmbed() {   // fallback if Spotify's controller script can't load
      slot.innerHTML = '<iframe title="Yellow by Coldplay on Spotify" src="https://open.spotify.com/embed/track/' + TRACK + '?utm_source=generator&theme=0" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="display:block;border:0"></iframe>';
      slot.classList.add('on'); loading = false; ui();
    }
    function load() {
      loading = true; ui(); slot.classList.add('on');
      var holder = document.createElement('div'); slot.appendChild(holder);
      window.onSpotifyIframeApiReady = function (API) {
        API.createController(holder, { uri: 'spotify:track:' + TRACK, width: '100%', height: 80 }, function (c) {
          ctl = c; loading = false; ui();
          c.addListener('playback_update', function (e) {
            var d = e && e.data || {}; playing = !d.isPaused; ui();
            if (d.duration) $('playProgress').style.width = (100 * d.position / d.duration).toFixed(1) + '%';
          });
          c.addListener('ready', function () { try { c.play(); } catch (err) {} });
        });
      };
      var s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
      s.onerror = function () { slot.innerHTML = ''; plainEmbed(); };
      document.head.appendChild(s);
      setTimeout(function () { if (!ctl && loading) { slot.innerHTML = ''; plainEmbed(); } }, 6000);
    }
    actions.play = function () {
      // inside a preview frame (e.g. claude.ai), third-party players are blocked — open Spotify instead
      if (framed) { window.open(URL, '_blank', 'noopener'); return; }
      if (!ctl && !loading && !slot.classList.contains('on')) { load(); return; }
      if (ctl) ctl.togglePlay();
    };
  })();

  /* ---------- Say-hi composer ---------- */
  var starters = [
    'Hi Victoria — we’re hiring a product designer and I’d love to chat.',
    'Hi Victoria — I have a project I think you’d be great for.',
    'Hi Victoria — would you be up for a virtual coffee?',
    'Hi Victoria — just wanted to say I love your work!'
  ];
  function syncMail() {
    var input = $('hi-msg'), link = $('sendLink'); if (!input || !link) return;
    link.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Hello from your portfolio') + '&body=' + encodeURIComponent(input.value);
  }
  actions.msg = function (i) { var input = $('hi-msg'); input.value = starters[+i]; input.focus(); syncMail(); };
  if ($('hi-msg')) $('hi-msg').addEventListener('input', syncMail);

  /* ---------- Cici: persona switch ---------- */
  actions.persona = function (k) {
    document.querySelectorAll('[data-persona]').forEach(function (el) { el.hidden = el.dataset.persona !== k; });
    document.querySelectorAll('[data-ptab]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.ptab === k)); });
  };


  /* ---------- Project cards: sticky stack + "View" cursor ---------- */
  (function () {
    var cards = [].slice.call(document.querySelectorAll('.stack'));
    if (!cards.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var wide = window.matchMedia('(min-width: 960px) and (min-height: 640px)');
    var ticking = false;
    function update() {
      ticking = false;
      var on = wide.matches && !reduce.matches;
      var vis = cards.filter(function (c) { return c.offsetParent !== null; });
      vis.forEach(function (c, i) {
        var next = vis[i + 1];
        if (!on || !next) { c.style.transform = ''; c.style.filter = ''; return; }
        var r = c.getBoundingClientRect(), n = next.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (r.bottom - n.top) / r.height));
        c.style.transform = 'translateY(' + (-26 * p).toFixed(1) + 'px) scale(' + (1 - 0.05 * p).toFixed(4) + ')';
        c.style.filter = 'brightness(' + (1 - 0.12 * p).toFixed(3) + ')';
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    document.addEventListener('click', function (e) { if (e.target.closest('[data-act^="filter"]')) setTimeout(update, 0); });
    window.addEventListener('hashchange', function () { setTimeout(update, 0); });
    window.addEventListener('viewchange', function () { setTimeout(update, 0); });
    update();

    /* Floating "View" bubble — only for mouse/trackpad users */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var dot = document.createElement('div');
    dot.setAttribute('aria-hidden', 'true');
    dot.className = 'view-cursor';
    dot.innerHTML = '<span></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"></path></svg>';
    document.body.appendChild(dot);
    var label = dot.querySelector('span'), x = 0, y = 0, tx = 0, ty = 0, raf = null;
    function follow() {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      dot.style.transform = 'translate(' + (x - 52) + 'px,' + (y - 52) + 'px) scale(' + (dot.classList.contains('on') ? 1 : 0.2) + ')';
      raf = (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) ? requestAnimationFrame(follow) : null;
    }
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var card = e.target.closest('.stack');
      var overControl = e.target.closest('a,button');
      if (card && !overControl) {
        dot.style.background = card.dataset.cursorBg; dot.style.color = card.dataset.cursorFg;
        label.textContent = card.dataset.cursorLabel;
        dot.querySelector('svg').style.display = card.dataset.cursorLabel === 'View' ? 'block' : 'none';
        dot.classList.add('on'); card.style.cursor = card.querySelector('a[href]') ? 'pointer' : 'default';
      } else dot.classList.remove('on');
      if (!raf) raf = requestAnimationFrame(follow);
    });
    document.addEventListener('mouseleave', function () { dot.classList.remove('on'); });
    window.addEventListener('scroll', function () { dot.classList.remove('on'); }, { passive: true });
    /* Whole card opens the case study */
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.stack'); if (!card || e.target.closest('a,button')) return;
      var link = card.querySelector('a[href]'); if (link) link.click();
    });
  })();


  /* ---------- Hero ID badge: hangs on its lanyard with a soft, slow sway ---------- */
  (function () {
    var rig = $('badgeRig'); if (!rig) return;
    var holder = rig.querySelector('.rig-holder');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var BASE = -2, SWAY = 1.2, MAX = 12;          // degrees: resting tilt, idle sway, furthest it can be pulled
    var ang = BASE, vel = 0, dragging = false, grabOffset = 0, visible = true;
    var t0 = performance.now(), lastT = t0;
    function pointerAngle(e) {                 // angle of the pointer around the lanyard's top
      var r = rig.parentNode.getBoundingClientRect();
      return -Math.atan2(e.clientX - (r.left + r.width / 2), Math.max(40, e.clientY - r.top)) * 180 / Math.PI;
    }
    function apply() { rig.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)'; }
    holder.addEventListener('pointerdown', function (e) {
      dragging = true; holder.setPointerCapture(e.pointerId);
      grabOffset = ang - pointerAngle(e); vel = 0; e.preventDefault();
    });
    holder.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ang = Math.max(BASE - MAX, Math.min(BASE + MAX, pointerAngle(e) + grabOffset)); apply();
    });
    function release() { if (!dragging) return; dragging = false; vel = 0; if (reduce) { ang = BASE; apply(); } }
    holder.addEventListener('pointerup', release);
    holder.addEventListener('pointercancel', release);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(rig);
    function tick(now) {
      var dt = Math.min(0.033, (now - lastT) / 1000); lastT = now;
      if (!dragging && visible && !reduce) {
        var rest = BASE + Math.sin((now - t0) / 1300) * SWAY;   // ~8s per sway, about 1° each way
        vel += (-7 * (ang - rest) - 5.3 * vel) * dt;           // critically damped: eases back, never bounces
        ang += vel * dt; apply();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();


  /* ---------- Hero word: changes on its own, letter by letter ---------- */
  (function () {
    var el = $('heroWord'); if (!el) return;
    var wrap = el.parentNode, words = ['trust', 'love to use', 'come back to', 'recommend'], i = 0, paused = false;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function paint(w, cls) {
      el.innerHTML = '';
      w.split('').forEach(function (c, k) {
        var s = document.createElement('span'); s.className = 'ch' + (cls ? ' ' + cls : '');
        s.style.setProperty('--k', k); s.textContent = c === ' ' ? '\u00a0' : c; el.appendChild(s);
      });
    }
    function fit() { wrap.style.width = el.offsetWidth + 'px'; }
    paint(words[0]); requestAnimationFrame(fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    if (reduce) return;
    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      var chars = el.querySelectorAll('.ch');
      wrap.classList.add('swap');
      chars.forEach(function (c) { c.classList.add('out'); });
      setTimeout(function () {
        i = (i + 1) % words.length; paint(words[i], 'pre'); fit();
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          el.querySelectorAll('.ch').forEach(function (c) { c.classList.remove('pre'); });
          wrap.classList.remove('swap');
        }); });
      }, 420 + chars.length * 28);
    }, 5800);   // each word stays fully visible for about 5 seconds before it changes
  })();

  /* ---------- Section headings glide in as you scroll ---------- */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('section h2, section h3').forEach(function (h) {
      if (h.closest('.stack, .lb, #top')) return;
      h.classList.add('rv'); io.observe(h);
    });
  })();

  /* ---------- Hero card: lanyard length makes the card end level with the CTA buttons ---------- */
  (function () {
    var rig = $('badgeRig'), body = $('heroCta'); if (!rig || !body) return;
    var straps = rig.querySelector('.rig-straps'), holder = rig.querySelector('.rig-holder');
    var strapEls = rig.querySelectorAll('.strap');
    var clip = rig.querySelector('.rig-clip'), header = document.querySelector('header');
    function setZoom(z) { holder.style.zoom = z; if (clip) clip.style.zoom = z; }
    function reset() {
      straps.style.removeProperty('height'); strapEls.forEach(function (s) { s.style.removeProperty('height'); });
      holder.style.zoom = ''; if (clip) clip.style.zoom = '';
    }
    function align() {
      if (window.innerWidth < 1011 || !body.offsetParent) { reset(); return; }
      var cta = body.getBoundingClientRect().bottom;
      // keep a visible stretch of lanyard under the header, then size the card to fit
      var minTop = (header ? header.getBoundingClientRect().bottom : 80) + 90;
      setZoom(1);
      var natural = holder.getBoundingClientRect().height;
      var z = Math.max(0.62, Math.min(1.15, (cta - minTop) / natural));
      setZoom(z);
      for (var n = 0; n < 2; n++) {                                   // lanyard length so the card ends level with the CTA row
        var cur = straps.offsetHeight;
        var delta = cta - holder.getBoundingClientRect().bottom;
        var h = Math.max(60, Math.min(900, cur + delta));
        straps.style.setProperty('height', h + 'px', 'important');
        strapEls.forEach(function (s) { s.style.setProperty('height', (h + 10) + 'px', 'important'); });
      }
    }
    var col = rig.parentNode; col.addEventListener('animationend', align);
    align(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    window.addEventListener('resize', align); window.addEventListener('hashchange', function () { setTimeout(align, 0); }); window.addEventListener('viewchange', function () { setTimeout(align, 0); });
  })();

  /* ---------- Playground: filter + lightbox ---------- */
  actions.pfilter = function (f) {
    document.querySelectorAll('.shot-wrap').forEach(function (s) { s.classList.toggle('is-hidden', f !== 'all' && s.dataset.kind !== f); });
    document.querySelectorAll('[data-pfilter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.pfilter === f)); });
  };
  (function () {
    var box = $('shotBox'); if (!box) return;
    var stage = $('shotStage'), cur = 0, opener = null;
    function list() { return [].slice.call(document.querySelectorAll('.shot')).filter(function (s) { var w = s.closest('.shot-wrap'); return !(w && w.classList.contains('is-hidden')); }); }
    function show(idx) {
      var L = list(); if (!L.length) return; cur = (idx + L.length) % L.length; var s = L[cur];
      stage.innerHTML = ''; stage.style.background = s.style.background;
      var art = s.querySelector('.shot-art').cloneNode(true); art.style.padding = ''; stage.appendChild(art);
      $('shotTitle').textContent = s.dataset.title;
      $('shotCount').textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(L.length).padStart(2, '0');
    }
    function open(s) { opener = s; box.hidden = false; document.documentElement.style.overflow = 'hidden'; show(list().indexOf(s)); box.querySelector('[data-lb="close"][aria-label]').focus(); }
    function close() { box.hidden = true; document.documentElement.style.overflow = ''; if (opener) opener.focus(); }
    document.addEventListener('click', function (e) {
      var s = e.target.closest('.shot'); if (s) { open(s); return; }
      var b = e.target.closest('[data-lb]'); if (!b || box.hidden) return;
      var a = b.dataset.lb; if (a === 'close') close(); else show(cur + (a === 'next' ? 1 : -1));
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'Tab') {                                   // keep focus inside the dialog
        var f = [].slice.call(box.querySelectorAll('button')), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();


  /* ---------- Case study switchers (PeopleFlow): tabs slide between screens ---------- */
  actions.pfsw = function (v, btn) {
    var p = v.split('-'), g = p[0], k = +p[1];
    var scope = btn ? btn.closest('.pfsw') : document;
    var img = scope.querySelector('.pfsw-img[data-swg="' + g + '"]'); if (!img) return;
    var n = +img.dataset.n || 1;
    img.style.transform = 'translateY(' + (-(k / n) * 100) + '%)';
    scope.querySelectorAll('[data-swg="' + g + '"][data-swk]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.swk === k)); });
    var t = scope.querySelector('.pfsw-capt[data-swg="' + g + '"]'), c = scope.querySelector('.pfsw-cap[data-swg="' + g + '"]');
    if (btn && t) t.textContent = btn.dataset.capt + '.';
    if (btn && c) c.textContent = btn.dataset.cap;
  };


  /* ---------- Vee, the floating robot: eyes follow the cursor, click to say hi ---------- */
  (function () {
    var bot = $('bot'), eyes = $('botEyes'), bubble = $('botBubble'); if (!bot || !eyes) return;
    var lines = ['Hi, I’m Vee 👋', 'Victoria’s open to new roles!', 'Psst… say hi just up there ↑', 'Have you seen the Playground?', 'I run on jollof and pixels.'];
    var k = 0, hideT = null, raf = null, mx = 0, my = 0;
    function look() {
      raf = null; var r = bot.getBoundingClientRect(); if (!r.width) return;
      var cx = r.left + r.width / 2, cy = r.top + r.height * 0.35;
      var dx = mx - cx, dy = my - cy, d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(1, d / 260);
      eyes.setAttribute('transform', 'translate(' + (dx / d * 7 * m).toFixed(2) + ' ' + (dy / d * 5 * m).toFixed(2) + ')');
    }
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(look); }, { passive: true });
    bot.addEventListener('click', function () {
      bubble.textContent = lines[k % lines.length]; k++;
      bubble.classList.add('show'); bot.classList.remove('wave'); void bot.offsetWidth; bot.classList.add('wave');
      clearTimeout(hideT); hideT = setTimeout(function () { bubble.classList.remove('show'); }, 2800);
    });
    bot.addEventListener('animationend', function (e) { if (e.animationName === 'botWave') bot.classList.remove('wave'); });
  })();


  /* ---------- Intro: big name slides away, a strip of photos glides past, and the
     last portrait flies into the ID card. Once per visit; skippable. ---------- */
  (function () {
    var intro = $('intro'); if (!intro) return;
    var photo = $('badgePhoto'), track = $('introTrack'), fin = $('introFinal'), skip = $('introSkip');
    var name = intro.querySelector('.intro-name');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, seen = false;
    // plays on every load of the homepage; skipped only when the visit opens straight on a case study
    var h = (location.hash || '').slice(1), tgt = h && document.getElementById(h);
    var deep = h && ['cici', 'quickpay', 'pipchat', 'peopleflow'].indexOf(h) > -1 || (tgt && tgt.closest && tgt.closest('[data-view]:not([data-view="home"])'));
    var root = document.documentElement, ended = false, landed = false, slide = null;
    function cleanup() {
      if (ended) return; ended = true;
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      root.classList.remove('intro-lock'); if (photo) photo.style.visibility = '';
    }
    if (seen || reduce || deep) { cleanup(); return; }
    root.classList.add('intro-lock');
    function centre() { var w = window.innerWidth; track.style.setProperty('--pad', Math.max(w * 0.06, (w - name.offsetWidth) / 2) + 'px'); }
    function cardTarget() {
      if (!photo || window.innerWidth < 1011) return null;
      var r = photo.getBoundingClientRect(); if (!r.width || r.top < 0 || r.bottom > window.innerHeight) return null;
      var m = /rotate\(([-\d.]+)deg\)/.exec(($('badgeRig') || {}).style ? $('badgeRig').style.transform : '');
      var a = (m ? +m[1] : -3) * Math.PI / 180, c = Math.cos(a), s = Math.abs(Math.sin(a)), d = c * c - s * s;
      var w = (r.width * c - r.height * s) / d, hh = (r.height * c - r.width * s) / d;   // un-rotated size
      return { x: r.left + r.width / 2 - w / 2, y: r.top + r.height / 2 - hh / 2, w: w, h: hh, deg: m ? +m[1] : -3 };
    }
    function land() {
      if (landed) return; landed = true;
      intro.classList.add('dissolve');                       // the whole intro simply melts into the page
      setTimeout(cleanup, 950);
    }
    function play() {
      centre();
      var f = fin.getBoundingClientRect(), dist = f.left + f.width / 2 - window.innerWidth / 2;
      slide = track.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (-dist) + 'px)' }],
        { duration: 3400, delay: 1150, easing: 'cubic-bezier(.62,0,.28,1)', fill: 'forwards' });
      slide.finished.then(function () { setTimeout(land, 280); });
    }
    function skipNow() { if (slide) slide.finish(); land(); }
    skip.addEventListener('click', skipNow);
    document.addEventListener('keydown', function (e) { if (!ended && e.key === 'Escape') skipNow(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(play); else play();
  })();


  /* ---------- Hamburger menu (phones) ---------- */
  (function () {
    var btn = $('burger'), menu = $('mmenu'), close = $('mmenuClose'); if (!btn || !menu) return;
    function open() {
      menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('menu-lock');
      setTimeout(function () { var a = menu.querySelector('nav a'); if (a) a.focus({ preventScroll: true }); }, 60);
    }
    function shut(refocus) {
      menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('menu-lock');
      if (refocus) btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', open);
    close.addEventListener('click', function () { shut(true); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { shut(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('open')) return;
      if (e.key === 'Escape') shut(true);
      if (e.key === 'Tab') {   // keep focus inside the open menu
        var f = [].slice.call(menu.querySelectorAll('a,button')), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 599 && menu.classList.contains('open')) shut(false); });
  })();

  /* ---------- One click handler for everything ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var parts = el.dataset.act.split(':'), fn = actions[parts[0]];
    if (fn) fn(parts[1], el);
  });
})();
