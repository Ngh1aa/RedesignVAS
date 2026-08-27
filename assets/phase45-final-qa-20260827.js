(function initVasPhase45Qa() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('vas-phase45');

  function visibleStickyBounds() {
    const header = $('.header');
    const sectionNav = $('.phase3-section-nav');
    const sticky = $('.sticky-bar');
    let top = 12;
    let bottom = 12;
    if (header && getComputedStyle(header).position === 'fixed') {
      top = Math.max(top, header.getBoundingClientRect().bottom + 8);
    }
    if (sectionNav && getComputedStyle(sectionNav).position === 'sticky') {
      const rect = sectionNav.getBoundingClientRect();
      if (rect.top <= top + 8 && rect.bottom > 0) top = Math.max(top, rect.bottom + 8);
    }
    if (sticky && getComputedStyle(sticky).display !== 'none') {
      bottom = Math.max(bottom, window.innerHeight - sticky.getBoundingClientRect().top + 8);
    }
    return { top, bottom };
  }

  function initFocusVisibility() {
    document.addEventListener('focusin', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches('a,button,input,select,textarea,summary,[tabindex]')) return;
      requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const { top, bottom } = visibleStickyBounds();
        const viewportBottom = window.innerHeight - bottom;
        if (rect.top < top) {
          window.scrollBy({ top: rect.top - top - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
        } else if (rect.bottom > viewportBottom) {
          window.scrollBy({ top: rect.bottom - viewportBottom + 8, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    }, true);
  }

  function initDialogReliability() {
    const lastFocus = new WeakMap();

    const rememberState = (dialog) => {
      if (!dialog.hidden) {
        if (!dialog.contains(document.activeElement)) lastFocus.set(dialog, document.activeElement);
      } else {
        const previous = lastFocus.get(dialog);
        if (previous instanceof HTMLElement && previous.isConnected) {
          requestAnimationFrame(() => previous.focus({ preventScroll: true }));
        }
        lastFocus.delete(dialog);
      }
    };

    const watch = (dialog) => {
      if (dialog.dataset.phase45DialogReady === 'true') return;
      dialog.dataset.phase45DialogReady = 'true';
      rememberState(dialog);
      new MutationObserver(() => rememberState(dialog))
        .observe(dialog, { attributes: true, attributeFilter: ['hidden'] });
    };

    const scan = () => $$('.phase3-dialog, .vas-search').forEach(watch);
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (event) => {
      const backdrop = event.target.closest?.('.phase3-dialog-backdrop, .phase3-lightbox-backdrop, .vas-search-backdrop');
      if (!backdrop || event.target !== backdrop) return;
      const host = backdrop.closest('.phase3-dialog, .vas-search');
      const close = $('[data-dialog-close], [data-search-close]', host || document);
      close?.click();
    }, true);
  }

  function initImageFallback() {
    $$('main img').forEach((image) => {
      if (image.dataset.phase45ImageReady === 'true') return;
      image.dataset.phase45ImageReady = 'true';
      const markBroken = () => {
        image.classList.add('phase45-image-error');
        const media = image.closest('.media, [class*="-media"], [class*="-thumb"], figure');
        media?.classList.add('phase45-media-error');
      };
      image.addEventListener('error', markBroken, { once: true });
      if (image.complete && image.naturalWidth === 0) markBroken();
    });
  }

  function initHorizontalKeyboardScroll() {
    $$('.phase3-section-scroll, .pathway-tabs, .phase3-news-filter').forEach((rail) => {
      if (rail.dataset.phase45RailReady === 'true') return;
      rail.dataset.phase45RailReady = 'true';
      rail.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        const items = $$('a,button,[role="tab"]', rail).filter((item) => !item.disabled && item.offsetParent !== null);
        const current = items.indexOf(document.activeElement);
        if (current < 0) return;
        event.preventDefault();
        const next = event.key === 'ArrowRight'
          ? Math.min(items.length - 1, current + 1)
          : Math.max(0, current - 1);
        items[next]?.focus();
        items[next]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  }

  function initViewportClass() {
    const sync = () => {
      document.documentElement.style.setProperty('--phase45-vh', `${window.innerHeight}px`);
      document.documentElement.classList.toggle('phase45-compact-height', window.innerHeight < 700);
    };
    addEventListener('resize', sync, { passive: true });
    window.visualViewport?.addEventListener('resize', sync, { passive: true });
    sync();
  }

  function initLoadingGuard() {
    addEventListener('load', () => document.documentElement.classList.add('phase45-loaded'), { once: true });
    setTimeout(() => document.documentElement.classList.add('phase45-loaded'), 1800);
  }

  function boot() {
    initFocusVisibility();
    initDialogReliability();
    initImageFallback();
    initHorizontalKeyboardScroll();
    initViewportClass();
    initLoadingGuard();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
