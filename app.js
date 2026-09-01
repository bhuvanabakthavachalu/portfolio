/* ============================================================
   Bhuvaneshwari B. — Digital Marketing Portfolio
   Reel-style snap-scroll · Interactive JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Case study modal buttons ─── */
  const case1Btn = document.getElementById('case1Btn');
  const case2Btn = document.getElementById('case2Btn');
  if (case1Btn) {
    case1Btn.addEventListener('click', e => {
      e.preventDefault();
      openCaseStudy(1);
    });
  }
  if (case2Btn) {
    case2Btn.addEventListener('click', e => {
      e.preventDefault();
      openCaseStudy(2);
    });
  }

  /* ─── Core references ─── */
  const container   = document.getElementById('reelContainer');
  const slides      = Array.from(document.querySelectorAll('.reel-slide'));
  const dots        = Array.from(document.querySelectorAll('.reel-dot'));
  const progress    = document.getElementById('progressFill');
  const header      = document.getElementById('siteHeader');
  const navLinks    = Array.from(document.querySelectorAll('.nav-link'));
  const mobLinks    = Array.from(document.querySelectorAll('.mob-link'));
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const total       = slides.length;
  let current       = 0;

  /* ─── Slides that need dark header text (light bg) ─── */
  const lightSlides = new Set([0, 1, 3, 4]); // hero, work, certs, about

  /* ======================================================
     NAV & HEADER UPDATE
     ====================================================== */
  function updateUI(idx) {
    current = idx;

    /* Progress bar */
    progress.style.width = ((idx / (total - 1)) * 100) + '%';

    /* Reel dots */
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));

    /* Header theme */
    header.classList.remove('light-slide', 'dark-slide');
    header.classList.add(lightSlides.has(idx) ? 'light-slide' : 'dark-slide');

    /* Active nav link (desktop & mobile) */
    navLinks.forEach(l => l.classList.toggle('active', parseInt(l.dataset.slide) === idx));
    mobLinks.forEach(l => l.classList.toggle('active', parseInt(l.dataset.slide) === idx));
  }

  /* Slightly slower, consistent scroll pace across browsers.
     Native scrollIntoView({behavior:'smooth'}) duration varies by browser/device
     and tends to feel quick — this gives explicit, tunable control.
     Increase SCROLL_DURATION for a slower feel, decrease for faster. */
  const SCROLL_DURATION = 650; // ms
  let isAnimating = false;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function scrollToSlide(idx) {
    if (idx < 0 || idx >= total || isAnimating) return;
    const startY = container.scrollTop;
    const targetY = slides[idx].offsetTop;
    const distance = targetY - startY;
    if (distance === 0) return;

    isAnimating = true;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      container.scrollTop = startY + distance * easeInOutQuad(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isAnimating = false;
      }
    }
    requestAnimationFrame(step);
  }

  /* ======================================================
     INTERSECTION OBSERVER — slide activation
     ====================================================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const idx = parseInt(entry.target.dataset.index);
        updateUI(idx);
        activateSlide(entry.target, idx);
      }
    });
  }, { threshold: 0.5, root: container });

  slides.forEach(s => observer.observe(s));

  /* ======================================================
     SLIDE ACTIVATION ANIMATIONS
     ====================================================== */
  function activateSlide(slide, idx) {
    /* Generic animate-in elements */
    slide.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));

    /* TOOLKIT — stagger tool rows + fill bars */
    if (idx === 2) {
      const rows = slide.querySelectorAll('.tool-row');
      rows.forEach((row, i) => {
        setTimeout(() => {
          row.classList.add('visible');
          const fill = row.querySelector('.tool-fill');
          if (fill) {
            const target = fill.style.width;
            fill.style.width = '0%';
            requestAnimationFrame(() => setTimeout(() => { fill.style.width = target; }, 40));
          }
        }, i * 80);
      });
    }

    /* CERTS — stagger cards */
    if (idx === 3) {
      slide.querySelectorAll('.cert-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(0.97)';
        setTimeout(() => {
          card.style.transition = 'all 0.55s cubic-bezier(0.4,0,0.2,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 100 + i * 120);
      });
    }

    /* ABOUT — stagger blocks */
    if (idx === 4) {
      slide.querySelectorAll('.about-block').forEach((block, i) => {
        setTimeout(() => block.classList.add('visible'), 100 + i * 120);
      });
    }

    /* WORK — stagger case cards */
    if (idx === 1) {
      slide.querySelectorAll('.case-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4,0,0.2,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 + i * 140);
      });
    }
  }

  /* ======================================================
     HAMBURGER MENU
     ====================================================== */
  function closeMob() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });

  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMob(); });

  /* ======================================================
     NAVIGATION CLICKS
     ====================================================== */
  function bindNavClicks(links) {
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        scrollToSlide(parseInt(link.dataset.slide));
        closeMob();
      });
    });
  }
  bindNavClicks(navLinks);
  bindNavClicks(mobLinks);

  /* Reel dots */
  dots.forEach(dot => {
    dot.addEventListener('click', () => scrollToSlide(parseInt(dot.dataset.index)));
  });

  /* Header brand → home */
  document.getElementById('headerBrand')?.addEventListener('click', e => {
    e.preventDefault(); scrollToSlide(0); closeMob();
  });

  /* Header CTA → contact */
  document.getElementById('headerCta')?.addEventListener('click', e => {
    e.preventDefault(); scrollToSlide(parseInt(e.currentTarget.dataset.slide)); closeMob();
  });

  /* Hero buttons */
  ['heroWork', 'heroContact'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      e.preventDefault();
      scrollToSlide(parseInt(e.currentTarget.dataset.slide));
    });
  });

  /* ======================================================
     KEYBOARD NAVIGATION
     ====================================================== */
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); scrollToSlide(current + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); scrollToSlide(current - 1); }
  });

  /* ======================================================
     TOUCH / SWIPE
     ====================================================== */
  let touchY = 0, touchT = 0;
  container.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY; touchT = Date.now();
  }, { passive: true });
  container.addEventListener('touchend', e => {
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50 && Date.now() - touchT < 400) {
      scrollToSlide(dy > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  /* ======================================================
     CONTACT FORM — EmailJS
     ====================================================== */
  // Initialise EmailJS with the public key from emailjs.config.js
  if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  }

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstNameInput')?.value.trim();
    const lastName  = document.getElementById('lastNameInput')?.value.trim();
    const email     = document.getElementById('emailInput')?.value.trim();
    const phone     = document.getElementById('phoneInput')?.value.trim();
    const company   = document.getElementById('companyInput')?.value.trim();
    const reason    = document.getElementById('reasonSelect')?.value;
    const msg       = document.getElementById('msgInput')?.value.trim();

    if (!firstName || !email || !msg) return;

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;

    const templateParams = {
      from_name:  `${firstName} ${lastName}`.trim(),
      from_email: email,
      phone:      phone  || 'Not provided',
      company:    company || 'Not provided',
      reason:     reason  || 'Not specified',
      message:    msg,
      to_name:    'Bhuvaneshwari',
    };

    try {
      if (typeof emailjs === 'undefined' || typeof EMAILJS_CONFIG === 'undefined' ||
          EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // EmailJS not yet configured — simulate success for development
        await new Promise(r => setTimeout(r, 1200));
        throw new Error('EmailJS not configured yet. Please update emailjs.config.js with your credentials.');
      }

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      btn.innerHTML = '<span>Send message</span><div class="btn-arrow">→</div>';
      btn.disabled = false;
      const success = document.getElementById('formSuccess');
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);

    } catch (err) {
      console.warn('EmailJS error:', err.message || err);
      btn.innerHTML = '<span>Send message</span><div class="btn-arrow">→</div>';
      btn.disabled = false;
      // Show friendly error inside the form
      const success = document.getElementById('formSuccess');
      success.style.background = '#FEE2E2';
      success.style.color = '#991B1B';
      success.style.borderColor = '#FECACA';
      success.textContent = EMAILJS_CONFIG?.PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
        ? '⚠ EmailJS not configured yet. Update emailjs.config.js with your credentials.'
        : '✗ Message could not be sent. Please email me directly.';
      success.classList.add('show');
      setTimeout(() => {
        success.classList.remove('show');
        success.style.cssText = '';
      }, 6000);
    }
  });


  /* ======================================================
     SOUND ICON (aesthetic)
     ====================================================== */
  let soundOn = true;
  document.getElementById('soundIcon')?.addEventListener('click', () => {
    soundOn = !soundOn;
    document.querySelectorAll('.sound-bars span').forEach(b => {
      b.style.animationPlayState = soundOn ? 'running' : 'paused';
      b.style.opacity = soundOn ? '1' : '0.3';
    });
  });

  /* ======================================================
     HERO PARALLAX
     ====================================================== */
  container.addEventListener('scroll', () => {
    const bgImg = slides[0]?.querySelector('.bg-img');
    if (bgImg) bgImg.style.transform = `translateY(${container.scrollTop * 0.25}px)`;
  }, { passive: true });

  /* ======================================================
     SKILL CHIP RIPPLE (hero)
     ====================================================== */
  document.querySelectorAll('.skill-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => { chip.style.transform = ''; }, 150);
    });
  });

  /* ======================================================
     CASE CARD TILT
     ====================================================== */
  document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ======================================================
     CERT CARD HOVER SHINE
     ====================================================== */
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.background = `radial-gradient(220px at ${e.clientX-r.left}px ${e.clientY-r.top}px, rgba(212,114,42,0.06), white 70%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  /* ======================================================
     INIT
     ====================================================== */
  updateUI(0);
  activateSlide(slides[0], 0);

  /* Pre-zero all tool bars so animation fires correctly */
  document.querySelectorAll('.tool-fill').forEach(f => {
    f.__target = f.style.width; f.style.width = '0%';
  });

  console.log('✅ Bhuvaneshwari B. — Portfolio loaded');
});
