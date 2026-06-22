/* ============================================================
   Scroll Animations — Intersection Observer based reveal
   ============================================================ */

(function () {
  'use strict';

  // ---- Animate on Scroll (AOS) via IntersectionObserver ----
  const animateElements = () => {
    const elements = document.querySelectorAll('[data-aos]');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;

            setTimeout(() => {
              el.classList.add('aos-animate');
            }, delay);

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  };

  // ---- Animated Counter ----
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            const duration = 1500;
            const startTime = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              el.textContent = current;

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = target;
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  };

  // ---- Navbar scroll effect ----
  const handleNavbarScroll = () => {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  };

  // ---- Code Tab Switching ----
  const initCodeTabs = () => {
    const tabs = document.querySelectorAll('.tab-btn');

    if (!tabs.length) return;

    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Remove active from all tabs
        tabs.forEach((b) => b.classList.remove('active'));

        // Hide all panels
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));

        // Activate clicked tab
        btn.classList.add('active');

        // Show corresponding panel
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  };

  // ---- Smooth scroll for nav links ----
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  };

  // ---- Mobile menu toggle ----
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = 'var(--nav-height)';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(10,10,15,0.95)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.padding = '24px';
        navLinks.style.gap = '16px';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });

    // Reset on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.style.display = '';
        navLinks.style.flexDirection = '';
        navLinks.style.position = '';
        navLinks.style.top = '';
        navLinks.style.left = '';
        navLinks.style.right = '';
        navLinks.style.background = '';
        navLinks.style.backdropFilter = '';
        navLinks.style.padding = '';
        navLinks.style.gap = '';
        navLinks.style.borderBottom = '';
      }
    });
  };

  // ---- Init on DOM ready ----
  document.addEventListener('DOMContentLoaded', () => {
    animateElements();
    animateCounters();
    handleNavbarScroll();
    initCodeTabs();
    initSmoothScroll();
    initMobileMenu();
  });
})();
