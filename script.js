(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lowPower =
    reduceMotion ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.connection && navigator.connection.saveData);

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch { /* storage unavailable */ } },
  };
  const fmt = (n) => n.toLocaleString('en-US');

  /* ---------- Navigation: mobile menu sheet ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const sheet = document.getElementById('menu-sheet');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(sheet.hidden));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); toggle.focus(); }
  });

  /* ---------- Logo: variable frame changes per section ---------- */
  const frame = document.querySelector('.logo__frame');
  const frameStyles = {
    home: ['var(--color-text)', '50%'],
    orbit: ['var(--color-muted)', '50%'],
    features: ['var(--color-text)', '4px'],
    proof: ['var(--color-muted)', '4px'],
    waitlist: ['var(--color-accent)', '50%'],
  };
  const frameObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const [color, radius] = frameStyles[entry.target.id] || frameStyles.home;
      frame.style.setProperty('--frame-color', color);
      frame.style.setProperty('--frame-radius', radius);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  ['home', 'orbit', 'features', 'proof', 'waitlist'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) frameObserver.observe(el);
  });

  /* ---------- Waitlist: live count, sign-up, referral ---------- */
  // Front-end only: replace submitSignup() with a call to your waitlist API.
  const BASE_COUNT = 2847;
  let liveCount = Number(store.get('nebula:count')) || BASE_COUNT;
  const myPosition = Number(store.get('nebula:position')) || 0;
  const liveEls = document.querySelectorAll('[data-live-count]');
  const renderCount = () => liveEls.forEach((el) => { el.textContent = fmt(liveCount); });
  renderCount();

  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return;
      liveCount += Math.random() < 0.55 ? 1 : 0;
      store.set('nebula:count', liveCount);
      renderCount();
    }, 4200);
  }

  const makeCode = (email) => {
    let h = 0;
    for (const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h.toString(36).slice(0, 6).toUpperCase();
  };
  const referralUrl = (code) => `${location.origin}${location.pathname}?ref=${code}`;

  const submitSignup = (email) =>
    new Promise((resolve) => setTimeout(() => resolve({ code: makeCode(email) }), 600));

  const showSuccess = (code, position) => {
    document.querySelectorAll('[data-waitlist]').forEach((wl) => {
      wl.querySelector('.waitlist__form').hidden = true;
      const success = wl.querySelector('.waitlist__success');
      success.hidden = false;
      wl.querySelector('[data-ref-input]').value = referralUrl(code);
      const label = wl.querySelector('[data-queue-label]');
      if (label) label.textContent = `You're #${fmt(position)} in line`;
    });
  };

  const savedCode = store.get('nebula:code');
  if (savedCode && myPosition) showSuccess(savedCode, myPosition);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  document.querySelectorAll('.waitlist__form').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const error = form.querySelector('.waitlist__error');
    const button = form.querySelector('button[type="submit"]');
    input.addEventListener('input', () => {
      if (!error.hidden && emailOk(input.value.trim())) {
        error.hidden = true;
        input.removeAttribute('aria-invalid');
      }
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!emailOk(email)) {
        error.hidden = false;
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      button.disabled = true;
      button.textContent = 'Joining…';
      const { code } = await submitSignup(email);
      liveCount += 1;
      renderCount();
      store.set('nebula:count', liveCount);
      store.set('nebula:code', code);
      store.set('nebula:position', liveCount);
      showSuccess(code, liveCount);
      const success = form.parentElement.querySelector('.waitlist__success');
      success.setAttribute('tabindex', '-1');
      success.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const input = btn.parentElement.querySelector('[data-ref-input]');
      try { await navigator.clipboard.writeText(input.value); }
      catch { input.select(); document.execCommand && document.execCommand('copy'); }
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy link'; }, 1800);
    });
  });

  // Nav / sheet CTAs: jump to the hero form and focus the email field.
  document.querySelectorAll('a[href="#hero-form"]').forEach((a) => {
    a.addEventListener('click', () => {
      setTimeout(() => {
        const field = document.getElementById('hero-email');
        if (field && !field.closest('form').hidden) field.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 450);
    });
  });

  /* ---------- Magnetic buttons (max 6px) ---------- */
  if (finePointer && !reduceMotion) {
    const MAX = 6;
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transform = `translate(${(dx * MAX).toFixed(1)}px, ${(dy * MAX).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Glow cards: border glow follows cursor ---------- */
  if (finePointer) {
    document.querySelectorAll('.glow').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Count-up numbers ---------- */
  const countEls = document.querySelectorAll('[data-count]');
  const setFinal = (el) => {
    const d = Number(el.dataset.decimals || 0);
    el.textContent = Number(el.dataset.count).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  if (reduceMotion) {
    countEls.forEach(setFinal);
  } else {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const el = entry.target;
        const target = Number(el.dataset.count);
        const d = Number(el.dataset.decimals || 0);
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = (target * eased).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
          if (t < 1) requestAnimationFrame(tick); else setFinal(el);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    countEls.forEach((el) => countObserver.observe(el));
  }

  /* ---------- Ambient background video (hero + CTA) ---------- */
  // Lazy-loaded, desktop only; below 768px the poster stays static.
  const loadVideo = (video) => {
    if (video.dataset.loaded) return;
    video.dataset.loaded = '1';
    video.src = video.dataset.src;
    video.addEventListener('error', () => video.removeAttribute('src'), { once: true });
  };
  if (!reduceMotion && matchMedia('(min-width: 768px)').matches) {
    const vidObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          loadVideo(target);
          target.play().catch(() => {});
        } else if (target.dataset.loaded) {
          target.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    document.querySelectorAll('.ambient__video').forEach((v) => vidObserver.observe(v));
  }

  /* ---------- Orbital Scene ---------- */
  const orbit = document.querySelector('.orbit');
  const canvas = orbit.querySelector('.orbit__canvas');
  const fallback = orbit.querySelector('.orbit__video');
  const stats = [...orbit.querySelectorAll('.stat')];

  if (lowPower || !canvas.getContext) {
    orbit.classList.add('is-static');
    canvas.hidden = true;
    fallback.hidden = false;
    if (!reduceMotion) {
      new IntersectionObserver(([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        loadVideo(fallback);
        fallback.play().catch(() => {});
      }, { rootMargin: '200px 0px' }).observe(fallback);
    }
    return;
  }

  const ctx = canvas.getContext('2d');
  const N = 520;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const dots = Array.from({ length: N }, (_, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
  });
  // Points of interest: orbit radius, tilt, phase offset
  const pois = [
    { radius: 1.45, tilt: -0.35, phase: 0.2 },
    { radius: 1.6, tilt: 0.25, phase: 2.3 },
    { radius: 1.32, tilt: 0.6, phase: 4.2 },
  ];

  let w = 0, h = 0, dpr = 1, progress = 0, active = 0, visible = false, idle = 0, last = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };

  const readProgress = () => {
    const r = orbit.getBoundingClientRect();
    const span = r.height - innerHeight;
    progress = Math.min(1, Math.max(0, -r.top / (span || 1)));
    const next = Math.min(stats.length - 1, Math.floor(progress * stats.length));
    if (next !== active) {
      stats[active].classList.remove('is-active');
      stats[next].classList.add('is-active');
      active = next;
    }
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.3;
    const rotY = progress * Math.PI * 1.6 + idle;
    const tilt = 0.32;
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);

    // Thin atmosphere glow
    const atmo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22);
    atmo.addColorStop(0, 'rgba(244,244,242,0.16)');
    atmo.addColorStop(1, 'rgba(244,244,242,0)');
    ctx.fillStyle = atmo;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx.fill();

    // Sphere body
    const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
    body.addColorStop(0, '#26262a');
    body.addColorStop(1, '#0e0e10');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    // Dot surface
    for (const [x, y, z] of dots) {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosT - z1 * sinT;
      const z2 = y * sinT + z1 * cosT;
      if (z2 < -0.05) continue;
      ctx.fillStyle = `rgba(244,244,242,${(0.15 + z2 * 0.6).toFixed(3)})`;
      ctx.fillRect(cx + x1 * R - 0.75, cy + y2 * R - 0.75, 1.5, 1.5);
    }

    // Orbits + points of interest
    pois.forEach((p, i) => {
      const rx = R * p.radius, ry = rx * 0.28;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(p.tilt);
      ctx.strokeStyle = i === active ? 'rgba(244,244,242,0.35)' : 'rgba(138,138,134,0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      const a = p.phase + rotY * 1.2;
      const px = Math.cos(a) * rx, py = Math.sin(a) * ry;
      const behind = Math.sin(a) < 0 && Math.hypot(px, py) < R;
      if (!behind) {
        const size = i === active ? 5 : 3;
        if (i === active) {
          ctx.fillStyle = 'rgba(244,244,242,0.15)';
          ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = i === active ? '#F4F4F2' : '#8A8A86';
        ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  };

  const loop = (now) => {
    if (!visible) return;
    idle += Math.min(50, now - (last || now)) * 0.00008;
    last = now;
    draw();
    requestAnimationFrame(loop);
  };

  resize();
  readProgress();
  draw();
  addEventListener('resize', () => { resize(); draw(); });
  addEventListener('scroll', readProgress, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { last = 0; requestAnimationFrame(loop); }
  }).observe(orbit);
})();
