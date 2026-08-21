/**
 * OnlineJA — Main JavaScript
 * Footer year, mobile menu, header scroll, FAQ accordion, smooth scroll
 */

(function () {
  'use strict';

  // Footer year
  function initFooterYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  // Mobile menu
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (!menuToggle || !mobileMenu) return;

    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconOpen?.classList.toggle('hidden', !isOpen);
      iconClose?.classList.toggle('hidden', isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('.mobile-link, a[href^="http"]').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Header scroll effect
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // FAQ accordion — smooth height + opacity transition
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqToggles = document.querySelectorAll('.faq-toggle');

    if (!faqToggles.length) return;

    faqToggles.forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;

        const isActive = item.classList.contains('active');

        // Fecha todos
        faqItems.forEach((el) => {
          el.classList.remove('active');
          el.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
        });

        // Abre o clicado (se estava fechado)
        if (!isActive) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // Smooth scroll for anchors
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;

        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();

        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      });
    });
  }

  // Init
  function init() {
    initFooterYear();
    initMobileMenu();
    initHeaderScroll();
    initFaq();
    initSmoothScroll();
  }

  init();
})();
