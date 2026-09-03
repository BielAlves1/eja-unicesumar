/**
 * OnlineJA — Main JavaScript (refatorado)
 * Footer year, mobile menu, header scroll, FAQ accordion, smooth scroll,
 * Swiper (hero + galeria), GSAP animações
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
      mobileMenu.classList.remove('is-open');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      menuToggle.setAttribute('aria-expanded', 'true');
    };

    const toggleMenu = () => {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
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

  // FAQ accordion
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqToggles = document.querySelectorAll('.faq-toggle');

    if (!faqToggles.length) return;

    faqToggles.forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;

        const isOpen = item.classList.contains('open');

        faqItems.forEach((el) => {
          el.classList.remove('open');
          el.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
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

  // Hero Swiper + Ken Burns
  function initHeroSwiper() {
    if (typeof Swiper === 'undefined') return;

    const el = document.querySelector('.hero-swiper');
    if (!el) return;

    new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 900,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.hero-swiper-next',
        prevEl: '.hero-swiper-prev',
      },
      on: {
        slideChangeTransitionStart: function () {
          // Reinicia animação Ken Burns no slide ativo
          const slides = this.slides;
          slides.forEach((slide) => {
            const img = slide.querySelector('.hero-slide-bg');
            if (img) {
              img.style.animation = 'none';
              // force reflow
              void img.offsetWidth;
              img.style.animation = '';
            }
          });
        },
      },
    });
  }

  // Gallery Swiper
  function initGallerySwiper() {
    if (typeof Swiper === 'undefined') return;

    const el = document.querySelector('.gallery-swiper');
    if (!el) return;

    new Swiper('.gallery-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.gallery-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.gallery-next',
        prevEl: '.gallery-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 3, spaceBetween: 28 },
      },
    });
  }

  // GSAP animations
  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger não carregou. Animações ignoradas.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('body *', { clearProps: 'transform,opacity,visibility' });
      return;
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    ScrollTrigger.defaults({
      toggleActions: isMobile ? 'play none none none' : 'play reverse play reverse',
    });

    const sectionHeading = (sectionSelector) => {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const eyebrow = section.querySelector('div > span');
      const title = section.querySelector('h2');
      const description = section.querySelector('h2 + p');
      const targets = [eyebrow, title, description].filter(Boolean);

      if (!targets.length) return;

      gsap.from(targets, {
        autoAlpha: 0,
        y: isMobile ? 20 : 35,
        duration: isMobile ? 0.5 : 0.75,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 88%' },
      });
    };

    // Hero entrance (conteúdo sobre o slider)
    const hero = document.querySelector('#hero');
    if (hero) {
      const heroContent = hero.querySelector('.hero-content-layer .text-center') || hero.querySelector('.text-center.lg\\:text-left');
      if (heroContent) {
        const heroTitle = heroContent.querySelector('h1');
        const heroDescription = heroContent.querySelector('h1 + p');
        const heroButtons = heroContent.querySelector('.hero-buttons');
        const heroBenefits = heroContent.querySelector('.hero-checks');
        const heroBadge = heroContent.querySelector('.inline-flex.items-center.gap-2');

        if (heroButtons) gsap.set(heroButtons.children, { autoAlpha: 0, y: 18 });
        if (heroBenefits) gsap.set(heroBenefits.children, { autoAlpha: 0, y: 14 });
        if (heroBadge) gsap.set(heroBadge, { autoAlpha: 0, y: 12 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (heroTitle) tl.from(heroTitle, { autoAlpha: 0, y: isMobile ? 24 : 40, duration: 0.75 });
        if (heroDescription) tl.from(heroDescription, { autoAlpha: 0, y: 20, duration: 0.55 }, '-=0.45');
        if (heroButtons) {
          tl.to(heroButtons.children, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.3');
        }
        if (heroBenefits) {
          tl.to(heroBenefits.children, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2');
        }
        if (heroBadge) tl.to(heroBadge, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.15');
      }
    }

    ['#cursos', '#beneficios', '#galeria', '#como-funciona', '#sobre', '#faq'].forEach(sectionHeading);

    // Cards cursos
    document.querySelectorAll('#cursos article').forEach((card, index) => {
      const anim = {
        autoAlpha: 0,
        y: isMobile ? 28 : 50,
        scale: isMobile ? 0.98 : 0.96,
        duration: isMobile ? 0.55 : 0.75,
        delay: isMobile ? 0 : index * 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      };
      if (!isMobile) {
        anim.x = index % 2 ? 20 : -20;
      }
      gsap.from(card, anim);
    });

    // Cards benefícios
    document.querySelectorAll('#beneficios .benefit-card').forEach((card, index) => {
      gsap.from(card, {
        autoAlpha: 0,
        y: isMobile ? 24 : 45,
        duration: isMobile ? 0.5 : 0.7,
        delay: isMobile ? 0 : index * 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 92%' },
      });
    });

    // Galeria
    const gallerySection = document.querySelector('#galeria');
    if (gallerySection) {
      gsap.from(gallerySection.querySelector('.gallery-swiper'), {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: gallerySection, start: 'top 85%' },
      });
    }

    // Como funciona
    const comoFunciona = document.querySelector('#como-funciona');

    if (comoFunciona) {
      const timelineCol = comoFunciona.querySelector('.grid > div:first-child');
      const imageCol = comoFunciona.querySelector('.grid > div:last-child');
      const steps = comoFunciona.querySelectorAll('.timeline-step');
      const timelineLine = comoFunciona.querySelector('.absolute.left-1\\/2');
      const mobileLine = comoFunciona.querySelector('.timeline-line-mobile');
      const mobileNumbers = comoFunciona.querySelectorAll('.timeline-number');

      if (imageCol) {
        gsap.from(imageCol, {
          autoAlpha: 0,
          x: 65,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: comoFunciona,
            start: 'top 25%',
          },
        });
      }

      if (window.innerWidth >= 768) {
        if (steps.length) {
          gsap.from(steps, {
            autoAlpha: 0,
            y: 35,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.14,
            scrollTrigger: {
              trigger: timelineCol,
              start: 'top 78%',
            },
          });
        }

        if (timelineLine) {
          gsap.fromTo(
            timelineLine,
            {
              scaleY: 0,
              transformOrigin: 'top center',
            },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineCol,
                start: 'top 70%',
                end: 'bottom 80%',
                scrub: 0.7,
              },
            },
          );
        }
      }

      if (window.innerWidth < 768) {
        if (steps.length && mobileLine) {
          gsap.set(steps, {
            autoAlpha: 0,
            y: 40,
          });

          gsap.set(mobileNumbers, {
            scale: 0.7,
          });

          gsap.set(mobileLine, {
            scaleY: 0,
            transformOrigin: 'top center',
          });

          const mobileTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: timelineCol,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          mobileTimeline.to(
            mobileLine,
            {
              scaleY: 1,
              ease: 'none',
              duration: 1,
            },
            0,
          );

          steps.forEach((step, index) => {
            mobileTimeline.to(
              step,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.35,
                ease: 'power2.out',
              },
              index * 0.18,
            );

            mobileTimeline.to(
              mobileNumbers[index],
              {
                scale: 1,
                duration: 0.25,
                ease: 'back.out(1.7)',
              },
              index * 0.18,
            );
          });
        }
      }
    }

    // Sobre
    const aboutSection = document.querySelector('#sobre');
    if (aboutSection) {
      const columns = aboutSection.querySelectorAll('.grid > div');
      if (columns[0]) {
        gsap.from(columns[0], {
          autoAlpha: 0,
          x: -65,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: aboutSection, start: 'top 75%' },
        });
      }
      if (columns[1]) {
        gsap.from(columns[1], {
          autoAlpha: 0,
          x: 65,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: aboutSection, start: 'top 75%' },
        });
      }
    }

    // FAQ
    const faqItems = document.querySelectorAll('#faq-list .faq-item');
    if (faqItems.length) {
      gsap.from(faqItems, {
        autoAlpha: 0,
        y: 20,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#faq-list', start: 'top 85%' },
      });
    }

    // CTA final
    const finalCta = document.querySelector('main > section:last-of-type');
    if (finalCta) {
      gsap.from(finalCta.querySelectorAll('h2, p, .flex'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: finalCta, start: 'top 88%' },
      });
    }

    // WhatsApp float
    const whatsappButton = document.querySelector('a[aria-label="Fale conosco no WhatsApp"]');
    if (whatsappButton) {
      gsap.set(whatsappButton, { clearProps: 'opacity,visibility,transform' });
      gsap.from(whatsappButton, {
        autoAlpha: 0,
        scale: 0.7,
        duration: 0.55,
        delay: 0.6,
        ease: 'back.out(1.6)',
        onComplete: () => gsap.set(whatsappButton, { clearProps: 'all' }),
      });
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }

  // Init
  function init() {
    initFooterYear();
    initMobileMenu();
    initHeaderScroll();
    initFaq();
    initSmoothScroll();
    initHeroSwiper();
    initGallerySwiper();
    initGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
