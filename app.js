/* ============================================================
   Bhuvaneshwari B. — Digital Marketing Portfolio
   Reel-style snap-scroll · Interactive JS
   High-performance scrolling, reactive animations & contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Case study modal triggers ─── */
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
    if (progress) {
      progress.style.width = ((idx / Math.max(total - 1, 1)) * 100) + '%';
    }

    /* Reel dots */
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));

    /* Header theme */
    if (header) {
      header.classList.remove('light-slide', 'dark-slide');
      header.classList.add(lightSlides.has(idx) ? 'light-slide' : 'dark-slide');
    }

    /* Active nav link (desktop & mobile) */
    navLinks.forEach(l => l.classList.toggle('active', parseInt(l.dataset.slide, 10) === idx));
    mobLinks.forEach(l => l.classList.toggle('active', parseInt(l.dataset.slide, 10) === idx));
  }

  /* ======================================================
     SMOOTH SLIDE SCROLLING (CALM, CONTROLLED PACING)
     Prevents fast-scroll skips and trackpad inertia runaway
     ====================================================== */
  const SLIDE_DURATION = 1.05; // seconds — calm, luxurious, unhurried pace
  let isAnimating = false;
  let lastWheelTime = 0;
  let wheelAccumulator = 0;
  let wheelClearTimer = null;

  function scrollToSlide(idx, customDuration) {
    if (idx < 0 || idx >= total) return;
    if (isAnimating) return;

    const targetY = slides[idx].offsetTop;
    const distance = Math.abs(targetY - container.scrollTop);

    if (distance < 2) {
      updateUI(idx);
      return;
    }

    isAnimating = true;
    updateUI(idx);

    const dur = customDuration || SLIDE_DURATION;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(container);
      gsap.to(container, {
        scrollTop: targetY,
        duration: dur,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          container.scrollTop = targetY;
          // Small settle buffer to absorb residual trackpad momentum
          setTimeout(() => {
            isAnimating = false;
          }, 140);
        }
      });
    } else {
      container.scrollTo({ top: targetY, behavior: 'smooth' });
      setTimeout(() => {
        isAnimating = false;
      }, dur * 1000);
    }
  }

  /* ======================================================
     INTELLIGENT WHEEL & TRACKPAD NAVIGATION
     Strict single-slide lock with complete inertia dampening
     ====================================================== */
  const WHEEL_THRESHOLD = 70; // Deliberate scroll intent required
  const INERTIA_QUIET_PERIOD = 240; // ms of quiet required after wheel stops

  window.addEventListener('wheel', (e) => {
    // If modal is active or on touch-primary mobile screens, allow normal scrolling
    if (document.querySelector('.case-study-modal.active')) return;
    if (window.innerWidth <= 1024) return;

    // Check if user is scrolling inside a scrollable child container
    let el = e.target;
    while (el && el !== container && el !== document.body) {
      if (el.scrollHeight > el.clientHeight + 6) {
        const atTop = el.scrollTop <= 0 && e.deltaY < 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2 && e.deltaY > 0;
        if (!atTop && !atBottom) {
          return; // Allow internal element scroll
        }
      }
      el = el.parentElement;
    }

    e.preventDefault();

    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelTime;
    lastWheelTime = now;

    // While animating, absorb all wheel momentum completely
    if (isAnimating) {
      wheelAccumulator = 0;
      return;
    }

    // Filter out residual decaying inertia pulses from previous gestures
    if (timeSinceLastWheel < 40 && Math.abs(wheelAccumulator) === 0 && Math.abs(e.deltaY) < 25) {
      return;
    }

    wheelAccumulator += e.deltaY;

    // Trigger only when deliberate threshold is reached
    if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;

      const nextSlide = current + direction;
      if (nextSlide >= 0 && nextSlide < total) {
        scrollToSlide(nextSlide);
      }
    }

    // Reset accumulator when user pauses
    clearTimeout(wheelClearTimer);
    wheelClearTimer = setTimeout(() => {
      wheelAccumulator = 0;
    }, INERTIA_QUIET_PERIOD);
  }, { passive: false });

  /* Real-time progress bar update during scroll */
  if (container) {
    container.addEventListener('scroll', () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (progress && maxScroll > 0) {
        progress.style.width = Math.min((container.scrollTop / maxScroll) * 100, 100) + '%';
      }
    }, { passive: true });
  }

  /* ======================================================
     INTERSECTION OBSERVER — slide activation
     ====================================================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index, 10);
        updateUI(idx);
        activateSlide(entry.target, idx);
      }
    });
  }, { threshold: 0.45, root: container });

  slides.forEach(s => observer.observe(s));

  /* ======================================================
     SLIDE ACTIVATION ANIMATIONS
     ====================================================== */
  function activateSlide(slide, idx) {
    /* Generic animate-in elements */
    slide.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));

    /* BlurText animation on section heading (ReactBits style) */
    const blurHeading = slide.querySelector('[data-blur-text="true"]');
    if (blurHeading) {
      playBlurText(blurHeading, {
        delay: 200,
        direction: 'top',
        onAnimationComplete: () => {
          console.log('Animation completed!');
        }
      });
    }

    /* TOOLKIT — stagger tool rows + fill bars */
    if (idx === 2) {
      const rows = slide.querySelectorAll('.tool-row');
      rows.forEach((row, i) => {
        setTimeout(() => {
          row.classList.add('visible');
          const fill = row.querySelector('.tool-fill');
          if (fill) {
            const target = fill.__target || fill.style.width || '60%';
            fill.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => { fill.style.width = target; }, 30);
            });
          }
        }, i * 50);
      });
    }

    /* CERTS — stagger cards */
    if (idx === 3) {
      slide.querySelectorAll('.cert-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 80 + i * 100);
      });
    }

    /* ABOUT — stagger blocks */
    if (idx === 4) {
      slide.querySelectorAll('.about-block').forEach((block, i) => {
        setTimeout(() => block.classList.add('visible'), 80 + i * 100);
      });
    }

    /* WORK — stagger case cards */
    if (idx === 1) {
      slide.querySelectorAll('.case-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(22px)';
        setTimeout(() => {
          card.style.transition = 'all 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 80 + i * 120);
      });
    }
  }

  /* ======================================================
     HAMBURGER MENU
     ====================================================== */
  function closeMob() {
    if (!hamburger) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    if (mobileMenu) {
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    }
  });

  document.addEventListener('click', e => {
    if (header && !header.contains(e.target)) closeMob();
  });

  /* ======================================================
     NAVIGATION CLICKS
     ====================================================== */
  function bindNavClicks(links) {
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetIdx = parseInt(link.dataset.slide, 10);
        if (!isNaN(targetIdx)) {
          scrollToSlide(targetIdx);
        }
        closeMob();
      });
    });
  }
  bindNavClicks(navLinks);
  bindNavClicks(mobLinks);

  /* Reel dots */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) scrollToSlide(idx);
    });
  });

  /* Header brand → home */
  document.getElementById('headerBrand')?.addEventListener('click', e => {
    e.preventDefault(); scrollToSlide(0); closeMob();
  });

  /* Header CTA → contact */
  document.getElementById('headerCta')?.addEventListener('click', e => {
    e.preventDefault();
    const idx = parseInt(e.currentTarget.dataset.slide, 10) || 5;
    scrollToSlide(idx);
    closeMob();
  });

  /* Hero buttons */
  ['heroWork', 'heroContact'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      e.preventDefault();
      const idx = parseInt(e.currentTarget.dataset.slide, 10);
      if (!isNaN(idx)) scrollToSlide(idx);
    });
  });

  /* ======================================================
     KEYBOARD NAVIGATION
     ====================================================== */
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (document.querySelector('.case-study-modal.active')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault();
      if (current < total - 1) scrollToSlide(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault();
      if (current > 0) scrollToSlide(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSlide(total - 1);
    }
  });

  /* ======================================================
     TOUCH / SWIPE
     ====================================================== */
  let touchY = 0;
  let touchT = 0;
  if (container) {
    container.addEventListener('touchstart', e => {
      touchY = e.touches[0].clientY;
      touchT = Date.now();
    }, { passive: true });

    container.addEventListener('touchend', e => {
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 60 && Date.now() - touchT < 450) {
        if (!isAnimating) {
          if (dy > 0 && current < total - 1) {
            scrollToSlide(current + 1);
          } else if (dy < 0 && current > 0) {
            scrollToSlide(current - 1);
          }
        }
      }
    }, { passive: true });
  }

  /* ======================================================
     CONTACT FORM — EmailJS
     ====================================================== */
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
    if (btn) {
      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;
    }

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
        await new Promise(r => setTimeout(r, 1000));
        throw new Error('EmailJS not configured yet.');
      }

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (btn) {
        btn.innerHTML = '<span>Send message</span><div class="btn-arrow">→</div>';
        btn.disabled = false;
      }
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.cssText = '';
        success.textContent = '✓ Message received. I\'ll respond to your inquiry within 24 hours.';
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
      }

    } catch (err) {
      console.warn('EmailJS notification:', err.message || err);
      if (btn) {
        btn.innerHTML = '<span>Send message</span><div class="btn-arrow">→</div>';
        btn.disabled = false;
      }
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.background = 'rgba(239, 68, 68, 0.2)';
        success.style.color = '#FCA5A5';
        success.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        success.textContent = (typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY')
          ? '⚠ Form submitted (Demo mode: configure EmailJS credentials in config/emailjs.config.js).'
          : '✓ Note received! Please feel free to email directly at bhuvanabakthavachalu@gmail.com.';
        success.classList.add('show');
        setTimeout(() => {
          success.classList.remove('show');
          success.style.cssText = '';
        }, 6000);
      }
    }
  });


  /* ======================================================
     HERO PARALLAX
     ====================================================== */
  if (container) {
    container.addEventListener('scroll', () => {
      const bgImg = slides[0]?.querySelector('.bg-img');
      if (bgImg && container.scrollTop < window.innerHeight) {
        bgImg.style.transform = `translateY(${container.scrollTop * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ======================================================
     SKILL CHIP MICRO-INTERACTION
     ====================================================== */
  document.querySelectorAll('.skill-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.style.transform = 'scale(0.96)';
      setTimeout(() => { chip.style.transform = ''; }, 140);
    });
  });

  /* ======================================================
     BLURTEXT ANIMATION ENGINE
     Adapted from ReactBits BlurText:
     - delay: 200ms
     - animateBy: 'words'
     - direction: 'top' (starts from y: -50px, blur: 10px, opacity: 0)
     - overshoot to y: 5px, blur: 5px, opacity: 0.5
     - settles to y: 0px, blur: 0px, opacity: 1
     - onAnimationComplete callback
     ====================================================== */
  function prepareBlurText(container) {
    if (!container || container.dataset.blurTextReady === 'true') return;

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || !text.trim()) return;

        const fragment = document.createDocumentFragment();
        const tokens = text.split(/(\s+)/);

        tokens.forEach(token => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'blur-text-word';
            span.textContent = token;
            fragment.appendChild(span);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('blur-text-word')) return;
        Array.from(node.childNodes).forEach(child => processNode(child));
      }
    }

    processNode(container);
    container.dataset.blurTextReady = 'true';
  }

  function playBlurText(container, options = {}) {
    if (!container) return;
    const {
      delay = 200,
      direction = 'top',
      onAnimationComplete = () => {
        console.log('Animation completed!');
      },
      stepDuration = 0.35
    } = options;

    prepareBlurText(container);
    const words = Array.from(container.querySelectorAll('.blur-text-word'));
    if (!words.length) return;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(words);
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const staggerSec = delay / 1000;

    if (reduceMotion || typeof gsap === 'undefined') {
      words.forEach(w => {
        w.style.opacity = '1';
        w.style.filter = 'blur(0px)';
        w.style.transform = 'none';
      });
      if (typeof onAnimationComplete === 'function') onAnimationComplete();
      return;
    }

    const yFrom = direction === 'top' ? -50 : 50;
    const yMid = direction === 'top' ? 5 : -5;

    // Set initial frame state
    gsap.set(words, {
      opacity: 0,
      filter: 'blur(10px)',
      y: yFrom,
      willChange: 'transform, filter, opacity'
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(words, { clearProps: 'transform,filter,willChange' });
        if (typeof onAnimationComplete === 'function') {
          onAnimationComplete();
        }
      }
    });

    words.forEach((word, index) => {
      const wordStartTime = index * staggerSec;
      tl.to(word, {
        opacity: 0.5,
        filter: 'blur(5px)',
        y: yMid,
        duration: stepDuration * 0.55,
        ease: 'power2.out'
      }, wordStartTime);

      tl.to(word, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: stepDuration * 0.45,
        ease: 'power2.out'
      }, wordStartTime + (stepDuration * 0.55));
    });

    return tl;
  }

  function initBlurText() {
    const blurTargets = document.querySelectorAll('[data-blur-text="true"]');
    blurTargets.forEach(target => {
      prepareBlurText(target);

      // Replay on hover
      target.addEventListener('mouseenter', () => {
        playBlurText(target, {
          delay: 200,
          direction: 'top',
          onAnimationComplete: () => {
            console.log('Animation completed!');
          }
        });
      });
    });

    window.replayHeroFoldText = () => {
      const hero = document.getElementById('heroTitle');
      if (hero) {
        playBlurText(hero, {
          delay: 200,
          direction: 'top',
          onAnimationComplete: () => {
            console.log('Animation completed!');
          }
        });
      }
    };
  }

  /* ======================================================
     INITIAL STATE & BAR TARGETS
     ====================================================== */
  document.querySelectorAll('.tool-fill').forEach(f => {
    f.__target = f.style.width || '60%';
    f.style.width = '0%';
  });

  initBlurText();
  updateUI(0);
  activateSlide(slides[0], 0);

  console.log('✅ Bhuvaneshwari B. — Portfolio application initialized successfully');
});
