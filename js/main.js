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

    const closeItem = (item) => {
      const content = item.querySelector('.faq-content');
      if (!content) return;

      // Captura a altura atual para animar o fechamento
      content.style.maxHeight = content.scrollHeight + 'px';
      content.offsetHeight; // force reflow
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.paddingBottom = '0';

      item.classList.remove('active');
      item.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
    };

    const openItem = (item, button) => {
      const content = item.querySelector('.faq-content');
      if (!content) return;

      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');

      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
      content.style.paddingBottom = '1.25rem';
    };

    faqToggles.forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;

        const isActive = item.classList.contains('active');

        // Fecha todos os itens
        faqItems.forEach(closeItem);

        // Abre o clicado se estava fechado
        if (!isActive) {
          openItem(item, button);
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
