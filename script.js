/* ============================================
   🎸 ROCK DE LOS 80 — AWWWARDS EXPERIENCE
   JavaScript: Animations, Interactions & Mechanics
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  let progress = 0;

  function updatePreloader() {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    preloaderFill.style.width = progress + '%';

    if (progress < 100) {
      requestAnimationFrame(function () {
        setTimeout(updatePreloader, 100);
      });
    } else {
      setTimeout(function () {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
      }, 400);
    }
  }

  document.body.style.overflow = 'hidden';
  updatePreloader();

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  if (cursor && cursorFollower) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effect on interactive elements
    var hoverTargets = document.querySelectorAll('a, button, .glass-card, .subgenre-item, .artist-card, .magnetic-btn');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      });
    });
  }

  // ==========================================
  // MAGNETIC BUTTON EFFECT
  // ==========================================
  var magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ==========================================
  // NAVIGATION
  // ==========================================
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');

  // Scroll effect
  var lastScrollY = 0;
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    if (scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  });

  // Hamburger menu
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // REVEAL ANIMATIONS (Hero)
  // ==========================================
  function initRevealAnimations() {
    var revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      el.style.animationDelay = delay + 'ms';
    });
  }

  // ==========================================
  // SCROLL REVEAL (Intersection Observer)
  // ==========================================
  var scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Add staggered delay based on element index within parent
        var parent = entry.target.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll('.scroll-reveal');
          var index = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = (index * 0.1) + 's';
        }
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollRevealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ==========================================
  // TILT EFFECT ON CARDS
  // ==========================================
  var tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;
      el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  var statNumbers = document.querySelectorAll('.stat-number[data-count]');

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 2000;
        var startTime = null;

        function animate(currentTime) {
          if (!startTime) startTime = currentTime;
          var elapsed = currentTime - startTime;
          var progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          el.textContent = current.toLocaleString() + '+';
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });

  // ==========================================
  // PARALLAX EFFECT
  // ==========================================
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      heroContent.style.opacity = 1 - (scrollY / 700);
    }

    // Parallax on section numbers
    var sectionNumbers = document.querySelectorAll('.section-number');
    sectionNumbers.forEach(function (num) {
      var rect = num.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var speed = 0.1;
        var yPos = (rect.top - window.innerHeight / 2) * speed;
        num.style.transform = 'translateY(' + yPos + 'px)';
      }
    });
  });

  // ==========================================
  // PARTICLE SYSTEM (Canvas)
  // ==========================================
  var canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '255, 0, 100' : '0, 240, 255';
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Mouse attraction
      var dx = mouseX - this.x;
      var dy = mouseY - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
        this.opacity = 0.8;
      } else {
        this.opacity += (0.2 - this.opacity) * 0.05;
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';
      ctx.fill();
    };

    // Initialize particles
    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            var opacity = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = 'rgba(255, 0, 100, ' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // SMOOTH SCROLL (for nav links)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================
  // DYNAMIC GLOW ON GLASS CARDS (follow mouse)
  // ==========================================
  document.querySelectorAll('.glass-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var glow = card.querySelector('.card-glow');
      if (glow) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }
    });
  });

  // ==========================================
  // TIMELINE LINE ANIMATION
  // ==========================================
  var timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    var timelineContainer = document.querySelector('.timeline-container');
    window.addEventListener('scroll', function () {
      if (timelineContainer) {
        var rect = timelineContainer.getBoundingClientRect();
        var containerTop = rect.top;
        var containerHeight = rect.height;
        var windowHeight = window.innerHeight;

        if (containerTop < windowHeight && containerTop + containerHeight > 0) {
          var scrollProgress = Math.min(
            Math.max((windowHeight - containerTop) / (containerHeight + windowHeight), 0),
            1
          );
          timelineLine.style.background =
            'linear-gradient(to bottom, var(--primary) 0%, var(--secondary) ' +
            (scrollProgress * 100) + '%, rgba(255,255,255,0.1) ' +
            (scrollProgress * 100) + '%)';
        }
      }
    });
  }

})();
