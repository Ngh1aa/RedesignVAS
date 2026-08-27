(function initProductionUpgrade() {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BASE = window.SITE_BASE || "";
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalizeHref = (path) => /^(https?:|tel:|mailto:|#)/.test(path) ? path : BASE + path;

  const searchIndex = [
    ["Về VAS", "Câu chuyện, đội ngũ, thành tích và giá trị VAS", "ve-vas/"],
    ["Chương trình học", "CEP, CAP, CAPI và hành trình từ Mầm non đến Lớp 12", "chuong-trinh/"],
    ["Tìm lộ trình phù hợp", "Gợi ý lộ trình dựa trên nhu cầu của gia đình", "find-my-path/"],
    ["Các cơ sở", "Tìm cơ sở VAS phù hợp tại TP.HCM", "co-so/#tim-co-so"],
    ["Quy trình tuyển sinh", "Các bước đăng ký, đánh giá và nhập học", "tuyen-sinh/#quy-trinh"],
    ["Học phí", "Xem mức học phí minh họa theo cấp học, lộ trình và cơ sở", "tuyen-sinh/#hoc-phi"],
    ["Điều kiện nhập học", "Yêu cầu đầu vào theo cấp học", "tuyen-sinh/#dieu-kien"],
    ["Đăng ký tư vấn", "Thử flow nhận tư vấn như website thật", "tuyen-sinh/?intent=inquire#dang-ky"],
    ["Tham quan VAS", "Chọn cơ sở và lịch tham quan", "tuyen-sinh/?intent=visit#dang-ky"],
    ["Tin tức", "Tin tức, sự kiện và câu chuyện từ cộng đồng VAS", "tin-tuc/"],
    ["Vòng quanh VAS", "Đời sống học đường, thể thao, nghệ thuật và câu lạc bộ", "vong-quanh-vas/"]
  ];

  function initSearch() {
    const buttons = $$('.icon-btn[aria-label="Tìm kiếm"], .icon-btn[aria-label="Search"]');
    if (!buttons.length || $('#vasSearchDialog')) return;
    const dialog = document.createElement('div');
    dialog.id = 'vasSearchDialog';
    dialog.className = 'vas-search';
    dialog.hidden = true;
    dialog.innerHTML = `<div class="vas-search-backdrop" data-search-close></div><section class="vas-search-panel" role="dialog" aria-modal="true" aria-labelledby="vasSearchTitle"><div class="vas-search-head"><div><span class="eyebrow">Tìm nhanh</span><h2 id="vasSearchTitle">Bạn đang tìm gì?</h2></div><button type="button" class="vas-search-close" data-search-close aria-label="Đóng tìm kiếm">×</button></div><label class="vas-search-field"><span class="sr-only">Từ khóa tìm kiếm</span><input type="search" id="vasSearchInput" placeholder="Ví dụ: học phí, CAPI, Sala…" autocomplete="off" /></label><div class="vas-search-results" id="vasSearchResults"></div><p class="vas-search-hint">Nhấn <kbd>Esc</kbd> để đóng · <kbd>/</kbd> để mở tìm kiếm</p></section>`;
    document.body.appendChild(dialog);
    const input = $('#vasSearchInput');
    const results = $('#vasSearchResults');
    let lastFocus = null;

    const render = (q = '') => {
      const s = q.trim().toLocaleLowerCase('vi');
      const rows = searchIndex.filter(([t, d]) => !s || `${t} ${d}`.toLocaleLowerCase('vi').includes(s)).slice(0, 8);
      results.innerHTML = rows.length
        ? rows.map(([t, d, h]) => `<a href="${esc(normalizeHref(h))}"><strong>${esc(t)}</strong><span>${esc(d)}</span><i aria-hidden="true">→</i></a>`).join('')
        : `<p class="vas-search-empty">Chưa tìm thấy nội dung phù hợp. Thử “học phí”, “CAPI”, “cơ sở” hoặc “tuyển sinh”.</p>`;
    };
    const open = () => {
      lastFocus = document.activeElement;
      dialog.hidden = false;
      document.documentElement.classList.add('search-open');
      render('');
      requestAnimationFrame(() => input.focus());
    };
    const close = () => {
      dialog.hidden = true;
      document.documentElement.classList.remove('search-open');
      lastFocus?.focus?.();
    };
    buttons.forEach((button) => button.addEventListener('click', open));
    $$('[data-search-close]', dialog).forEach((button) => button.addEventListener('click', close));
    input.addEventListener('input', () => render(input.value));
    document.addEventListener('keydown', (event) => {
      if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) { event.preventDefault(); open(); }
      if (event.key === 'Escape' && !dialog.hidden) close();
    });
  }

  function cleanPublicCopy() {
    const replacements = new Map([
      ["Decision tool", "Gợi ý lộ trình"],
      ["Admissions journey", "Các bước tuyển sinh"],
      ["Cambridge journey", "Lộ trình Cambridge"]
    ]);
    $$('main *').forEach((node) => {
      if (node.children.length) return;
      const text = node.textContent.trim();
      replacements.forEach((to, from) => { if (text.includes(from)) node.textContent = text.replace(from, to); });
      if (text.includes('Section này chỉ giới thiệu các giai đoạn.')) node.textContent = 'Bốn giai đoạn giúp gia đình hình dung hành trình học tập xuyên suốt từ Mầm non đến Lớp 12.';
    });
  }

  function markPrototypeMode() {
    document.documentElement.dataset.prototype = 'true';
    const form = $('#enquiryForm');
    if (form) form.classList.add('is-prototype-form');
  }

  function init() {
    initSearch();
    cleanPublicCopy();
    markPrototypeMode();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
