/* ═══════════════════════════════════════════════════════
   Revive, Renew & Restore Inc. — JavaScript Engine
   ═══════════════════════════════════════════════════════ */

'use strict';

// ─── CANVAS BACKGROUND ───────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const alpha = (1 - dist / 140) * 0.12;
          ctx.strokeStyle = `rgba(220, 38, 38, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 38, 38, ${n.alpha})`;
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    });

    requestAnimationFrame(draw);
  }

  resize();
  nodes = createNodes(60);
  draw();

  window.addEventListener('resize', () => {
    resize();
    nodes = createNodes(60);
  });
})();

// ─── NAVBAR ───────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Mobile CTA links
  document.querySelectorAll('.mobile-cta-group a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

// ─── SCROLL ANIMATIONS ─────────────────────────────────────
(function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-animate]'));
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => observer.observe(el));
})();

// ─── REPAIR TRACKER UI ─────────────────────────────────────
(function initTracker() {
  const trackBtn = document.getElementById('track-btn');
  const trackInput = document.getElementById('track-input');
  const trackerResult = document.getElementById('tracker-result');
  const trackerEmpty = document.getElementById('tracker-empty');

  if (!trackBtn) return;

  // Initially hide result, show empty state
  if (trackerResult) trackerResult.style.display = 'none';
  if (trackerEmpty) trackerEmpty.style.display = 'block';

  function runTrack() {
    const code = trackInput.value.trim();
    if (!code) {
      trackInput.style.borderColor = '#DC2626';
      trackInput.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.2)';
      trackInput.focus();
      setTimeout(() => {
        trackInput.style.borderColor = '';
        trackInput.style.boxShadow = '';
      }, 1500);
      return;
    }

    // Show loading state
    const originalText = trackBtn.textContent;
    trackBtn.textContent = '...';
    trackBtn.disabled = true;

    setTimeout(() => {
      trackerEmpty.style.display = 'none';
      trackerResult.style.display = 'block';
      trackerResult.style.animation = 'fadeIn 0.4s ease both';
      trackBtn.textContent = originalText;
      trackBtn.disabled = false;
    }, 700);
  }

  trackBtn.addEventListener('click', runTrack);
  trackInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runTrack();
  });

  // Hero track CTA and nav track button
  const heroTrackBtn = document.getElementById('hero-cta-secondary');
  const navTrackBtn = document.getElementById('nav-track-btn');
  const mobileTrackBtn = document.getElementById('mobile-track-btn');

  [heroTrackBtn, navTrackBtn, mobileTrackBtn].forEach(btn => {
    btn && btn.addEventListener('click', e => {
      e.preventDefault();
      const trackSection = document.getElementById('track');
      if (trackSection) {
        trackSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (trackInput) trackInput.focus();
        }, 600);
      }
    });
  });
})();

// ─── CONTACT FORM ─────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl = document.getElementById('full-name');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const vehicleEl = document.getElementById('vehicle');

    // Clear errors
    [nameEl, emailEl, phoneEl, vehicleEl].forEach(el => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });

    let valid = true;
    let firstInvalid = null;

    const validate = (el, condition) => {
      if (!condition) {
        el.style.borderColor = '#DC2626';
        el.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.2)';
        if (!firstInvalid) firstInvalid = el;
        valid = false;
      }
    };

    validate(nameEl, nameEl.value.trim().length >= 2);
    validate(emailEl, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value));
    validate(phoneEl, phoneEl.value.trim().length >= 7);
    validate(vehicleEl, vehicleEl.value.trim().length >= 3);

    if (!valid) {
      firstInvalid && firstInvalid.focus();
      return;
    }

    // ─── PASTE YOUR GOOGLE APPS SCRIPT URL BELOW ───────────
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxgX5aXiUG5jCN189l3G8MXWr5aGKop7dvZnCpX2vYO2aIia6Hku5CsQrNLDlMBGg_l/exec';
    // ────────────────────────────────────────────────────────

    const payload = {
      name: document.getElementById('full-name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      vehicle: document.getElementById('vehicle').value.trim(),
      service: document.getElementById('service-type').value || 'Not specified',
      message: document.getElementById('message').value.trim()
    };

    // Loading state
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...`;

    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        // Success — hide form, show confirmation
        form.querySelectorAll('.form-group, .form-row, .form-disclaimer').forEach(el => {
          el.style.display = 'none';
        });
        submitBtn.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'flex';
          successMsg.style.alignItems = 'center';
          successMsg.style.gap = '12px';
        }
      })
      .catch(() => {
        // Error — re-enable button, show error hint
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        submitBtn.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.4)';
        const errMsg = form.querySelector('.form-disclaimer');
        if (errMsg) {
          errMsg.textContent = '⚠️ Submission failed. Please email us directly at reviverenewandrestore@gmail.com';
          errMsg.style.color = '#EF4444';
        }
      });
  });
})();

// ─── BACK TO TOP ───────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── SMOOTH CARD HOVER GLOW ─────────────────────────────────
(function initCardGlow() {
  const cards = document.querySelectorAll('.service-card, .review-card, .trust-card, .fleet-feature');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();

// ─── PARALLAX HERO SCROLL ──────────────────────────────────
(function initHeroParallax() {
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (!heroBgImg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
})();

// ─── STAT NUMBER ANIMATE ON SCROLL ─────────────────────────
(function initStatAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const numMatch = text.match(/\d+/);
        if (!numMatch) return;

        const target = parseInt(numMatch[0], 10);
        const prefix = text.slice(0, text.indexOf(numMatch[0]));
        const suffix = text.slice(text.indexOf(numMatch[0]) + numMatch[0].length);
        let current = 0;
        const duration = 1200;
        const step = 16;
        const increment = target / (duration / step);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = prefix + target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = prefix + Math.floor(current) + suffix;
          }
        }, step);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();

// ─── SPIN KEYFRAME (form loading) ──────────────────────────
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(spinStyle);

// ─── CONSOLE BRANDING ─────────────────────────────────────
console.log(
  '%c Revive, Renew & Restore Inc. %c Rivian-Certified Collision Repair | Jacksonville, FL ',
  'background: #DC2626; color: #fff; font-family: monospace; font-size: 13px; font-weight: bold; padding: 6px 12px; border-radius: 4px 0 0 4px;',
  'background: #141414; color: #DC2626; font-family: monospace; font-size: 13px; padding: 6px 12px; border-radius: 0 4px 4px 0; border: 1px solid #DC2626;'
);
