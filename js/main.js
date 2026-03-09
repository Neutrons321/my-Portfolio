/* ============================================================
   PORTFOLIO - MAIN JAVASCRIPT
   Author: Your Name
   Description: All interactive features and animations
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. DOM READY
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initCustomCursor();
    initScrollProgress();
    initNavbar();
    initMobileNav();
    initAOS();
    initSkillBars();
    initCardMouseEffect();
    initTypingEffect();
    initContactForm();
    initSmoothScrollLinks();
    setActiveNavLink();
  });

  /* ============================================================
     2. PRELOADER
     ============================================================ */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('off');
        // Remove from DOM after transition
        setTimeout(function () {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }, 500);
    });
  }

  /* ============================================================
     3. CUSTOM CURSOR
     ============================================================ */
  function initCustomCursor() {
    // Don't run on touch devices
    if ('ontouchstart' in window) return;

    var cursor       = document.querySelector('.cursor');
    var follower     = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    var mouseX = 0, mouseY = 0;
    var followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Cursor snaps immediately
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Follower lags behind (smooth lerp)
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    var hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .nav-toggle, input, textarea');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ============================================================
     4. SCROLL PROGRESS BAR
     ============================================================ */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var progress   = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ============================================================
     5. NAVBAR (scroll effect + active state)
     ============================================================ */
  function initNavbar() {
    var header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function setActiveNavLink() {
    var links    = document.querySelectorAll('.nav-link');
    var current  = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     6. MOBILE NAV TOGGLE
     ============================================================ */
  function initMobileNav() {
    var toggle  = document.querySelector('.nav-toggle');
    var menu    = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     7. AOS (Animate on Scroll) INIT
     ============================================================ */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-quart',
        once: true,
        offset: 60,
      });
    }
  }

  /* ============================================================
     8. SKILL BARS ANIMATION
        Triggers when bars scroll into view
     ============================================================ */
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill    = entry.target;
          var percent = fill.getAttribute('data-width') || '0';
          setTimeout(function () {
            fill.style.width = percent + '%';
          }, 200);
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  /* ============================================================
     9. CARD MOUSE SPOTLIGHT EFFECT
        Cards glow where your mouse hovers
     ============================================================ */
  function initCardMouseEffect() {
    var cards = document.querySelectorAll('.card, .project-card, .service-card, .contact-form');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect   = card.getBoundingClientRect();
        var x      = ((e.clientX - rect.left) / rect.width) * 100;
        var y      = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  /* ============================================================
     10. TYPING EFFECT (hero title)
         Cycles through roles
     ============================================================ */
  function initTypingEffect() {
    var el = document.querySelector('.typing-text');
    if (!el) return;

    var roles   = el.getAttribute('data-roles') ? el.getAttribute('data-roles').split('|') : [];
    if (!roles.length) return;

    var current = 0;
    var charIdx = 0;
    var deleting = false;
    var speed   = 90;

    function type() {
      var role    = roles[current];
      var display = deleting ? role.substring(0, charIdx--) : role.substring(0, charIdx++);
      el.textContent = display;
      el.classList.add('typing');

      var next = speed;

      if (!deleting && charIdx > role.length) {
        next     = 1800; // Pause at end
        deleting = true;
      } else if (deleting && charIdx < 0) {
        deleting = false;
        current  = (current + 1) % roles.length;
        charIdx  = 0;
        next     = 300;
      }

      setTimeout(type, next + (Math.random() * 40 - 20));
    }

    type();
  }

  /* ============================================================
     11. CONTACT FORM (EmailJS integration)
         Replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY below
     ============================================================ */
  function initContactForm() {
    var form = document.querySelector('.js-contact-form');
    if (!form) return;

    var msgEl   = form.querySelector('.form-message');
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var name    = form.querySelector('[name="full-name"]');
      var email   = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        showMessage(msgEl, 'error', 'Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email.value)) {
        showMessage(msgEl, 'error', 'Please enter a valid email address.');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      /* ---- EMAILJS ----
         Uncomment when you have set up EmailJS:

         emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY')
           .then(function() {
             showMessage(msgEl, 'success', '🎉 Message sent! I\'ll be in touch soon.');
             form.reset();
             submitBtn.disabled = false;
             submitBtn.textContent = 'Send Message';
           })
           .catch(function(err) {
             showMessage(msgEl, 'error', 'Something went wrong. Please try again.');
             submitBtn.disabled = false;
             submitBtn.textContent = 'Send Message';
           });
      */

      // DEMO: Simulate success (remove when you add EmailJS)
      emailjs.init('dKY38DMduWa_uUOBw'); // ← paste your public key

emailjs.sendForm('service_61yhb1m', 'template_p39gq9c', form)
  .then(function() {
    showMessage(msgEl, 'success', '🎉 Message sent! I\'ll be in touch soon.');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="iconoir-send-mail"></i>';
  })
  .catch(function(err) {
    showMessage(msgEl, 'error', 'Something went wrong. Please try again.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="iconoir-send-mail"></i>';
    console.error('EmailJS error:', err);
  });
    });
  }

  function showMessage(el, type, text) {
    if (!el) return;
    el.className = 'form-message ' + type;
    el.textContent = text;
    setTimeout(function () {
      el.className = 'form-message';
      el.textContent = '';
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     12. SMOOTH SCROLL for anchor links
     ============================================================ */
  function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     13. COUNTER ANIMATION (stats numbers)
     ============================================================ */
  function animateCounter(el, target, duration) {
    var start   = 0;
    var step    = target / (duration / 16);
    var timer   = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  // Trigger counters when visible
  var counters = document.querySelectorAll('.counter-num');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el     = entry.target;
          var target = parseInt(el.getAttribute('data-target') || '0', 10);
          animateCounter(el, target, 1500);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

})();
