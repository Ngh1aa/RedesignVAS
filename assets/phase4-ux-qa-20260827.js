(function initVasPhase4UxQa() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  document.documentElement.classList.add('vas-phase4');

  function initScrollProgress() {
    if ($('#phase4ScrollProgress')) return;
    const progress = document.createElement('div');
    progress.id = 'phase4ScrollProgress';
    progress.className = 'phase4-scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, Math.max(0, window.scrollY / max * 100))}%`;
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request, { passive: true });
    update();
  }

  function initMobileNavigation() {
    const burger = $('#burger');
    const menu = $('#mobileMenu');
    if (!burger || !menu || burger.dataset.phase4Ready === 'true') return;
    burger.dataset.phase4Ready = 'true';
    burger.setAttribute('aria-controls', 'mobileMenu');
    burger.setAttribute('aria-expanded', 'false');
    const menuIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    const closeIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg>';

    const sync = () => {
      const open = menu.classList.contains('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      burger.classList.toggle('is-open', open);
      burger.innerHTML = open ? closeIcon : menuIcon;
      document.documentElement.classList.toggle('phase4-menu-open', open);
      document.body.classList.toggle('phase4-menu-open', open);
    };

    const close = (restoreFocus = false) => {
      menu.classList.remove('open');
      sync();
      if (restoreFocus) burger.focus();
    };

    burger.addEventListener('click', () => requestAnimationFrame(sync));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) requestAnimationFrame(sync);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) close(true);
    });

    $$('details', menu).forEach((details) => details.addEventListener('toggle', () => {
      if (!details.open) return;
      $$('details', menu).forEach((other) => { if (other !== details) other.open = false; });
    }));

    const mq = matchMedia('(min-width: 1024px)');
    const handleMq = () => { if (mq.matches && menu.classList.contains('open')) close(); };
    mq.addEventListener?.('change', handleMq);
    sync();
  }

  function initSectionNavAutoPan() {
    let attached = false;
    let previous = null;
    const attach = () => {
      if (attached) return true;
      const nav = $('.phase3-section-nav');
      if (!nav) return false;
      attached = true;
      const update = () => {
        const active = $('.phase3-section-scroll a.is-active', nav);
        if (!active || active === previous) return;
        previous = active;
        active.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      };
      new MutationObserver(update).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
      update();
      return true;
    };
    if (attach()) return;
    const waitForNav = new MutationObserver(() => {
      if (attach()) waitForNav.disconnect();
    });
    waitForNav.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => waitForNav.disconnect(), 5000);
  }

  function initHorizontalScrollHints() {
    const setup = () => {
      $$('.comparison-wrap, .comparison-table-wrap').forEach((wrap) => {
        if (wrap.dataset.phase4HintReady === 'true') return;
        wrap.dataset.phase4HintReady = 'true';
        const hint = document.createElement('div');
        hint.className = 'phase4-swipe-hint';
        hint.innerHTML = '<span>Vuốt để xem thêm</span><span aria-hidden="true">→</span>';
        wrap.insertAdjacentElement('afterend', hint);
        const sync = () => {
          const scrollable = wrap.scrollWidth > wrap.clientWidth + 8;
          const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 12;
          hint.hidden = !scrollable || atEnd || wrap.scrollLeft > 18;
        };
        wrap.addEventListener('scroll', sync, { passive: true });
        addEventListener('resize', sync, { passive: true });
        sync();
      });
    };
    setup();
    const dynamicTables = new MutationObserver(setup);
    dynamicTables.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => dynamicTables.disconnect(), 5000);
  }

  function initDialogFocusTrap() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const dialog = $$('.phase3-dialog:not([hidden]), .vas-search:not([hidden])').find((node) => node.offsetParent !== null);
      if (!dialog) return;
      const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', dialog)
        .filter((node) => !node.hidden && node.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);
  }

  function initFaqAccordion() {
    $$('.faq, .faq-list').forEach((group) => {
      $$('details', group).forEach((detail) => {
        if (detail.dataset.phase4Accordion === 'true') return;
        detail.dataset.phase4Accordion = 'true';
        detail.addEventListener('toggle', () => {
          if (!detail.open) return;
          $$('details', group).forEach((other) => { if (other !== detail) other.open = false; });
        });
      });
    });
  }

  function enhanceImages() {
    const heroImages = new Set($$('.hero > img, .page-hero > img'));
    $$('img').forEach((image) => {
      image.decoding = 'async';
      if (!heroImages.has(image) && !image.hasAttribute('loading')) image.loading = 'lazy';
      if (heroImages.has(image)) image.fetchPriority = 'high';
    });
  }

  function improveFormState() {
    $$('form').forEach((form) => {
      $$('input, select, textarea', form).forEach((field) => {
        const sync = () => field.classList.toggle('has-value', field.type === 'checkbox' ? field.checked : Boolean(field.value));
        field.addEventListener('input', sync);
        field.addEventListener('change', sync);
        sync();
      });
    });
  }

  function fixExternalUtilities() {
    $$('.phase2-utility-links a[target="_blank"]').forEach((link) => link.setAttribute('rel', 'noopener noreferrer'));
  }

  function boot() {
    initScrollProgress();
    initMobileNavigation();
    initSectionNavAutoPan();
    initHorizontalScrollHints();
    initDialogFocusTrap();
    initFaqAccordion();
    enhanceImages();
    improveFormState();
    fixExternalUtilities();
  }

  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot, { once: true });
})();
