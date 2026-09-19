/* ==========================================================================
   Abdul Rahman — Portfolio Scripts
   ========================================================================== */
'use strict';

/* ---------- Helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNavToggle();
  initScrollSpy();
  initReveal();
  initTyping();
  initContactForm();
  initYear();
  initScrollProgress();
  initCounters();
  initTilt();
  initBackToTop();
});

/* ---------- Sticky header state ---------- */
function initHeader() {
  const header = $('#siteHeader');
  if (!header || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-64px 0px 0px 0px' }
  ).observe($('#home'));
}

/* ---------- Mobile navigation toggle ---------- */
function initNavToggle() {
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after clicking any link
  $$('.nav-link', links).forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Scrollspy: highlight active nav link ---------- */
function initScrollSpy() {
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        // Small stagger for card grids
        const delay = Math.min(index % 8, 5) * 60;
        const el = entry.target;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Hero typing effect ---------- */
function initTyping() {
  const typeText = $('#typeText');
  if (!typeText) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const phrases = [
    'Meta Ads Lead Generation Specialist',
    'Facebook & Instagram Ads Expert',
    'Performance-Driven Digital Marketer',
  ];
  let phraseIndex = 0;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  (async function loop(cursor) {
    const current = phrases[phraseIndex % phrases.length];

    // Typing phase — advance one character at a time
    if (cursor < current.length) {
      typeText.textContent = current.slice(0, cursor + 1);
      await sleep(55);
      loop(cursor + 1);
      return;
    }

    // Pause while the full phrase is visible
    await sleep(2000);

    // Deleting phase — remove one character at a time
    if (cursor > 0) {
      typeText.textContent = current.slice(0, cursor - 1);
      await sleep(35);
      loop(cursor - 1);
      return;
    }

    // Move to the next phrase and restart
    phraseIndex = (phraseIndex + 1) % phrases.length;
    loop(0);
  })(0);
}

/* ---------- Contact form → sends directly via FormSubmit (no email app needed) ---------- */
function initContactForm() {
  const form = $('#contactForm');
  const note = $('#formNote');
  const btn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !note || !btn) return;

  const showStatus = (message, isError) => {
    note.textContent = message;
    note.classList.toggle('error', !!isError);
  };

  // The backend stores submissions + emails you. The static site only uses
  // the relative '/api/contact' when it is served FROM the backend itself
  // (port 5000). Everywhere else — opened as a local file, VS Code "Go Live"
  // server, or any other static host — the browser posts straight to the
  // backend URL. That cross-origin request is allowed because server.js
  // enables CORS for all origins.
  const isBackendOrigin = window.location.port === '5000';
  const API_URL = isBackendOrigin
    ? '/api/contact'
    : 'http://localhost:5000/api/contact';

  // Local dev = localhost / 127.0.0.1. Anything else is a live/public host.
  const hostname = window.location.hostname;
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';

  // On the live site, if the form can't reach the backend we offer a direct,
  // guaranteed channel instead of an error wall (verified works for visitors).
  const showLiveFallback = (name, business, message) => {
    const wa = 'https://wa.me/916384157591?text=' + encodeURIComponent(
      `Hi Abdul! I tried to send a message via your portfolio. ${name}` +
      (business ? ` (${business})` : '') + `: ${message}`
    );
    note.classList.toggle('error', false);
    note.innerHTML =
      `Couldn&rsquo;t send a message right now, but I&rsquo;m one tap away ⇢ ` +
      `<a href="${wa}" target="_blank" rel="noopener">Message on WhatsApp</a>` +
      ` or email <a href="mailto:abdulrahman.digimarketing@gmail.com">abdulrahman.digimarketing@gmail.com</a>`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const business = form.business.value.trim();
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !message) {
      showStatus('Please fill in your name, email, and message.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', true);
      return;
    }

    // Sending state
    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    showStatus('Sending your message…', false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          business,
          message,
          _honey: form._honey ? form._honey.value : '',
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        /* non-JSON body */
      }

      if (!response.ok || (data && data.success === false)) {
        throw new Error(
          data && typeof data.message === 'string'
            ? data.message
            : 'Server could not save your message'
        );
      }

      showStatus(data.message || 'Sent! Thanks for reaching out — I\u2019ll reply soon.', false);
      form.reset();
    } catch (err) {
      // Any failure here means the backend didn't respond properly.
      console.error('Contact form error:', err);
      if (!isLocalDev) {
        showLiveFallback(name, business, message);
      } else {
        showStatus(
          'Could not reach the backend server. Make sure it is running (npm run dev:backend) and try again — or email me directly at abdulrahman.digimarketing@gmail.com.',
          true
        );
      }
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

/* ---------- Footer copyright year ---------- */
function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Scroll progress bar (top edge, gradient fill) ---------- */
function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;

  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0;
    bar.style.width = pct + '%';
  };

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ---------- Animated result counters (once, reduced-motion aware) ---------- */
function initCounters() {
  const nodes = $$('.result-value');
  if (!nodes.length || !('IntersectionObserver' in window)) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduce) return;

  nodes.forEach((node) => {
    const m = node.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
    node.dataset.num = m ? m[1] : '0';
    node.dataset.suffix = m ? m[2] : '';
  });

  const play = (node) => {
    const target = Number(node.dataset.num) || 0;
    const suffix = node.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    node.textContent = '0' + suffix;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      node.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    ([entry], obs) => {
      if (!entry.isIntersecting) return;
      play(entry.target);
      obs.unobserve(entry.target);
    },
    { threshold: 0.45 }
  );
  nodes.forEach((n) => io.observe(n));
}

/* ---------- Subtle 3D tilt on the profile photo (desktop & hover only) ---------- */
function initTilt() {
  const card = $('.avatar-card');
  if (!card || !window.matchMedia) return;
  if (!window.matchMedia('(hover: hover)').matches) return; // touch devices
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  card.classList.add('tilt-target');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const update = () => btn.classList.toggle('show', window.scrollY > 480);
  addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    btn.classList.remove('show');
  });
}