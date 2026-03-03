/* ============================================================
   ROCK DE LOS 80 — script.js
   Vanilla JS: Custom cursor, scroll progress, parallax,
   Intersection Observer reveals, kinetic hero text,
   magnetic buttons, navbar scroll, hamburger menu
   ============================================================ */

(function () {
  'use strict';

  /* ---- Utility: run after DOM is ready ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {

    /* =========================================================
       1. SCROLL PROGRESS BAR
    ========================================================= */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (scrollProgress) {
        scrollProgress.style.width = pct + '%';
      }
    }

    /* =========================================================
       2. NAVBAR SCROLL EFFECT
    ========================================================= */
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
      if (!navbar) return;
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    /* =========================================================
       3. CUSTOM CURSOR
    ========================================================= */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // Follower lags behind the cursor for smooth trailing effect
    let followerX = 0;
    let followerY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerFrame;

    function moveCursor(e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top  = cursorY + 'px';
      }
    }

    function animateFollower() {
      // Ease the follower towards the cursor
      followerX += (cursorX - followerX) * 0.14;
      followerY += (cursorY - followerY) * 0.14;

      if (cursorFollower) {
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top  = followerY + 'px';
      }

      followerFrame = requestAnimationFrame(animateFollower);
    }

    if (cursor && cursorFollower) {
      window.addEventListener('mousemove', moveCursor, { passive: true });
      followerFrame = requestAnimationFrame(animateFollower);

      // Interactive elements toggle hover state
      const interactiveSelectors = 'a, button, .magnetic, .genre-card, .feature-item, .artist-card, .btn';
      document.querySelectorAll(interactiveSelectors).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cursor.classList.add('cursor-hover');
          cursorFollower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', function () {
          cursor.classList.remove('cursor-hover');
          cursorFollower.classList.remove('cursor-hover');
        });
      });
    }

    /* =========================================================
       4. KINETIC HERO TYPOGRAPHY
          Stagger each .char element with a delay
    ========================================================= */
    const chars = document.querySelectorAll('.hero-title .char');
    chars.forEach(function (char, i) {
      char.style.transitionDelay = (0.05 + i * 0.055) + 's';
      // Trigger after a short initial delay for cinematic effect
      setTimeout(function () {
        char.classList.add('visible');
      }, 100);
    });

    // Also reveal eyebrow & subtitle on load
    setTimeout(function () {
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.classList.add('visible');
    }, 100);

    setTimeout(function () {
      const subtitle = document.querySelector('.hero-subtitle');
      if (subtitle) subtitle.classList.add('visible');
    }, 100);

    setTimeout(function () {
      const cta = document.querySelector('.hero-cta');
      if (cta) cta.classList.add('visible');
    }, 100);

    /* =========================================================
       5. INTERSECTION OBSERVER — REVEAL ANIMATIONS
    ========================================================= */
    const revealSelectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale';
    const revealElements = document.querySelectorAll(revealSelectors);

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Once revealed, stop observing to save resources
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -60px 0px',
        }
      );

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: show all elements immediately
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }

    /* =========================================================
       6. PARALLAX EFFECT
          Move orbs and hero bg-number at different speeds
    ========================================================= */
    const parallaxOrbs = document.querySelectorAll('.orb');
    const heroBgNumber = document.querySelector('.hero-bg-number');

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxOrbs.forEach(function (orb, i) {
        const speed = 0.04 + i * 0.015;
        orb.style.transform = 'translateY(' + scrollY * speed + 'px)';
      });

      if (heroBgNumber) {
        heroBgNumber.style.transform = 'translateY(' + scrollY * 0.2 + 'px)';
      }
    }

    /* =========================================================
       7. MAGNETIC BUTTONS
          Subtle pull towards cursor on hover
    ========================================================= */
    const magneticEls = document.querySelectorAll('.magnetic');

    magneticEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.25;
        const dy = (e.clientY - centerY) * 0.25;
        el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });

    /* =========================================================
       8. HAMBURGER MENU
    ========================================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        // Prevent body scroll when menu open
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close menu when a link is clicked
      navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    /* =========================================================
       9. SMOOTH SCROLL (fallback for browsers without CSS support)
    ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* =========================================================
       10. UNIFIED SCROLL HANDLER (throttled with rAF)
    ========================================================= */
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateScrollProgress();
          updateNavbar();
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial state on load
    updateScrollProgress();
    updateNavbar();

  }); // end ready()

})();
