(function initVasPhase3Interactions() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

  function toast(message) {
    let host = $('#phase3Toast');
    if (!host) {
      host = document.createElement('div');
      host.id = 'phase3Toast';
      host.className = 'phase3-toast';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    host.textContent = message;
    host.classList.add('is-visible');
    clearTimeout(host._timer);
    host._timer = setTimeout(() => host.classList.remove('is-visible'), 2400);
  }

  function createDialog(id, className) {
    let dialog = document.getElementById(id);
    if (dialog) return dialog;
    dialog = document.createElement('div');
    dialog.id = id;
    dialog.className = className;
    dialog.hidden = true;
    document.body.appendChild(dialog);
    return dialog;
  }

  function openDialog(dialog, html, focusSelector = '[data-dialog-close]') {
    dialog.innerHTML = html;
    dialog.hidden = false;
    document.documentElement.classList.add('phase3-dialog-open');
    requestAnimationFrame(() => $(focusSelector, dialog)?.focus());
    const close = () => {
      dialog.hidden = true;
      document.documentElement.classList.remove('phase3-dialog-open');
    };
    $$('[data-dialog-close]', dialog).forEach((button) => button.addEventListener('click', close));
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); }, { once: true });
    const onKey = (event) => {
      if (event.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    };
    document.addEventListener('keydown', onKey);
    return close;
  }

  function initSectionNav() {
    if (!document.body.dataset.page || $('.phase3-section-nav')) return;
    const sections = $$('main section[id]').filter((section) => {
      const id = section.id;
      return id && !['top'].includes(id);
    });
    if (sections.length < 3) return;
    const items = sections.slice(0, 8).map((section) => {
      const label = $('.eyebrow', section)?.textContent.trim() || $('h2', section)?.textContent.trim() || section.id;
      return [section.id, label.replace(/^\d+\s*[—-]\s*/, '')];
    });
    const nav = document.createElement('nav');
    nav.className = 'phase3-section-nav';
    nav.setAttribute('aria-label', 'Khám phá trang');
    nav.innerHTML = `<span class="phase3-section-label">Khám phá</span><div class="phase3-section-scroll">${items.map(([id, label]) => `<a href="#${esc(id)}" data-section-link="${esc(id)}">${esc(label)}</a>`).join('')}</div>`;
    const main = $('main');
    main.insertBefore(nav, main.firstElementChild?.nextSibling || main.firstElementChild);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('[data-section-link]', nav).forEach((link) => link.classList.toggle('is-active', link.dataset.sectionLink === entry.target.id));
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  function initCampusCompare() {
    if (document.body.dataset.page !== 'Các cơ sở') return;
    const grid = $('#campusGrid');
    if (!grid) return;
    const selected = new Set();
    const tray = document.createElement('div');
    tray.className = 'phase3-compare-tray';
    tray.hidden = true;
    tray.innerHTML = `<span><b data-compare-count>0</b> cơ sở đã chọn</span><div><button type="button" class="phase3-compare-clear">Xóa</button><button type="button" class="phase3-compare-open">So sánh</button></div>`;
    document.body.appendChild(tray);
    const dialog = createDialog('phase3CompareDialog', 'phase3-dialog phase3-compare-dialog');

    const getCardData = (card) => ({
      id: card.dataset.campusCard,
      name: $('h3', card)?.textContent.trim() || '',
      location: $$('.campus-card-kicker span', card)[1]?.textContent.trim() || '',
      level: $('.campus-card-level', card)?.textContent.trim() || '',
      tagline: $('.campus-tagline', card)?.textContent.trim() || '',
      tags: $$('.tag-list span', card).map((node) => node.textContent.trim()).slice(0, 4),
      image: $('.campus-card-media img', card)?.src || '',
      visit: $$('.campus-card-actions a', card).find((link) => /Tham quan/.test(link.textContent))?.href || '#'
    });

    function syncTray() {
      $('[data-compare-count]', tray).textContent = selected.size;
      tray.hidden = selected.size === 0;
      $$('.phase3-compare-toggle', grid).forEach((button) => {
        const active = selected.has(button.dataset.compareCampus);
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
        button.textContent = active ? 'Đã chọn ✓' : 'So sánh +';
      });
    }

    function ensureButtons() {
      $$('[data-campus-card]', grid).forEach((card) => {
        if ($('.phase3-compare-toggle', card)) return;
        const actions = $('.campus-card-actions', card);
        if (!actions) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'text-link phase3-compare-toggle';
        button.dataset.compareCampus = card.dataset.campusCard;
        button.setAttribute('aria-pressed', 'false');
        button.textContent = 'So sánh +';
        actions.prepend(button);
      });
      syncTray();
    }

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('.phase3-compare-toggle');
      if (!button) return;
      const id = button.dataset.compareCampus;
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < 3) selected.add(id);
      else return toast('Bạn có thể so sánh tối đa 3 cơ sở.');
      syncTray();
    });
    $('.phase3-compare-clear', tray).addEventListener('click', () => { selected.clear(); syncTray(); });
    $('.phase3-compare-open', tray).addEventListener('click', () => {
      if (selected.size < 2) return toast('Chọn ít nhất 2 cơ sở để so sánh.');
      const cards = [...selected].map((id) => $(`[data-campus-card="${CSS.escape(id)}"]`, grid)).filter(Boolean).map(getCardData);
      openDialog(dialog, `<div class="phase3-dialog-backdrop" data-dialog-close></div><section class="phase3-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="compareTitle"><header><div><span class="eyebrow">So sánh cơ sở</span><h2 id="compareTitle">Đặt các lựa chọn cạnh nhau.</h2></div><button type="button" data-dialog-close aria-label="Đóng">×</button></header><div class="phase3-compare-grid">${cards.map((campus) => `<article><img src="${esc(campus.image)}" alt="${esc(campus.name)}" /><span>${esc(campus.location)}</span><h3>${esc(campus.name)}</h3><p>${esc(campus.level)}</p><p class="phase3-compare-quote">${esc(campus.tagline)}</p><div class="phase3-compare-tags">${campus.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div><a class="btn btn-red" href="${esc(campus.visit)}">Tham quan cơ sở</a></article>`).join('')}</div></section>`);
    });
    ensureButtons();
    new MutationObserver(ensureButtons).observe(grid, { childList: true, subtree: true });
  }

  function initNewsInteractions() {
    if (document.body.dataset.page !== 'Tin tức') return;
    const latest = $('#latestNews');
    if (!latest) return;
    const filter = document.createElement('div');
    filter.className = 'phase3-news-filter';
    filter.setAttribute('aria-label', 'Lọc tin tức');
    filter.innerHTML = `<button type="button" class="is-active" data-news-filter="all">Tất cả</button>${[...new Set($$('.latest-card .meta b', latest).map((node) => node.textContent.trim()))].map((cat) => `<button type="button" data-news-filter="${esc(cat)}">${esc(cat)}</button>`).join('')}`;
    latest.before(filter);
    filter.addEventListener('click', (event) => {
      const button = event.target.closest('[data-news-filter]');
      if (!button) return;
      $$('[data-news-filter]', filter).forEach((item) => item.classList.toggle('is-active', item === button));
      const value = button.dataset.newsFilter;
      $$('.latest-card', latest).forEach((card) => {
        const cat = $('.meta b', card)?.textContent.trim();
        card.hidden = value !== 'all' && cat !== value;
      });
    });

    const storyDialog = createDialog('phase3StoryDialog', 'phase3-dialog phase3-story-dialog');
    latest.addEventListener('click', (event) => {
      const link = event.target.closest('a.text-link');
      if (!link) return;
      event.preventDefault();
      const card = link.closest('.latest-card');
      const title = $('h3', card)?.textContent.trim() || '';
      const excerpt = $('.latest-body > p:not(.meta)', card)?.textContent.trim() || '';
      const image = $('.latest-thumb img', card)?.src || '';
      const meta = $('.meta', card)?.textContent.replace(/\s+/g, ' ').trim() || '';
      openDialog(storyDialog, `<div class="phase3-dialog-backdrop" data-dialog-close></div><article class="phase3-story-panel" role="dialog" aria-modal="true" aria-labelledby="storyTitle"><button type="button" class="phase3-story-close" data-dialog-close aria-label="Đóng">×</button><img src="${esc(image)}" alt="${esc(title)}" /><div><span class="eyebrow">${esc(meta)}</span><h2 id="storyTitle">${esc(title)}</h2><p>${esc(excerpt)}</p><p>Trong prototype, đây là màn hình đọc nhanh để kiểm thử flow từ danh sách tin sang nội dung chi tiết mà không cần dựng backend bài viết.</p><a href="#cau-chuyen-hoc-sinh" class="btn btn-red" data-dialog-close>Khám phá thêm câu chuyện</a></div></article>`);
    });

    const eventDialog = createDialog('phase3EventDialog', 'phase3-dialog phase3-event-dialog');
    $('#eventsList')?.addEventListener('click', (event) => {
      const link = event.target.closest('.event');
      if (!link) return;
      event.preventDefault();
      const date = $('.date', link)?.textContent.replace(/\s+/g, ' ').trim() || '';
      const title = $('.info b', link)?.textContent.trim() || '';
      const place = $('.info span', link)?.textContent.trim() || '';
      const close = openDialog(eventDialog, `<div class="phase3-dialog-backdrop" data-dialog-close></div><section class="phase3-event-panel" role="dialog" aria-modal="true" aria-labelledby="eventTitle"><header><span class="phase3-event-date">${esc(date)}</span><button type="button" data-dialog-close aria-label="Đóng">×</button></header><span class="eyebrow">Sự kiện VAS</span><h2 id="eventTitle">${esc(title)}</h2><p>${esc(place)}</p><div class="phase3-event-detail"><span>09:00 – 11:00</span><span>Dành cho phụ huynh & học sinh</span><span>Xác nhận sau khi đăng ký</span></div><button type="button" class="btn btn-red" data-event-register>Đăng ký tham gia</button></section>`);
      $('[data-event-register]', eventDialog)?.addEventListener('click', () => { close(); toast('Đã ghi nhận đăng ký sự kiện.'); });
    });

    const lightbox = createDialog('phase3Lightbox', 'phase3-dialog phase3-lightbox');
    $('#archiveGrid')?.addEventListener('click', (event) => {
      const card = event.target.closest('.archive-card');
      if (!card) return;
      event.preventDefault();
      const image = $('img', card)?.src || '';
      const title = $('strong', card)?.textContent.trim() || '';
      openDialog(lightbox, `<div class="phase3-lightbox-backdrop" data-dialog-close></div><figure role="dialog" aria-modal="true" aria-label="${esc(title)}"><button type="button" data-dialog-close aria-label="Đóng">×</button><img src="${esc(image)}" alt="${esc(title)}" /><figcaption>${esc(title)}</figcaption></figure>`);
    });
  }

  function initPrototypeFormProgress() {
    if (document.body.dataset.page !== 'Tuyển sinh') return;
    const form = $('#enquiryForm');
    if (!form || $('.phase3-form-meter', form)) return;
    const meter = document.createElement('div');
    meter.className = 'phase3-form-meter';
    meter.innerHTML = `<span><b data-meter-value>0%</b> hoàn tất</span><i><b data-meter-bar></b></i>`;
    form.prepend(meter);
    const update = () => {
      const fields = $$('input[required], select[required]', form).filter((field) => !field.closest('[hidden]'));
      if (!fields.length) return;
      const done = fields.filter((field) => field.type === 'checkbox' ? field.checked : Boolean(field.value.trim())).length;
      const percent = Math.round(done / fields.length * 100);
      $('[data-meter-value]', meter).textContent = `${percent}%`;
      $('[data-meter-bar]', meter).style.width = `${percent}%`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  }

  function boot() {
    initSectionNav();
    initCampusCompare();
    initNewsInteractions();
    initPrototypeFormProgress();
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
