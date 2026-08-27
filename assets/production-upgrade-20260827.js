(function initProductionUpgrade() {
  const BASE = window.SITE_BASE || "";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  const deepLinks = {
    "Về VAS": {
      "Câu chuyện VAS": "ve-vas/#cau-chuyen",
      "Ban lãnh đạo": "ve-vas/#lanh-dao",
      "Đội ngũ giáo viên": "ve-vas/#doi-ngu",
      "Thành tích học sinh": "ve-vas/#thanh-tich",
      "Lộ trình vào đại học": "ve-vas/#dau-ra",
      "Giá trị cốt lõi": "ve-vas/#gia-tri"
    },
    "Chương trình": {
      "Mầm non": "chuong-trinh/#hanh-trinh-16-nam",
      "Tiểu học": "chuong-trinh/#hanh-trinh-16-nam",
      "Trung học cơ sở": "chuong-trinh/#hanh-trinh-16-nam",
      "Trung học phổ thông": "chuong-trinh/#hanh-trinh-16-nam",
      "Cambridge toàn phần (CAPI)": "chuong-trinh/#chi-tiet-lo-trinh",
      "Song ngữ Cambridge (CAP)": "chuong-trinh/#chi-tiet-lo-trinh",
      "Tiếng Anh Cambridge (CEP)": "chuong-trinh/#chi-tiet-lo-trinh"
    },
    "Các cơ sở": {
      "Tất cả cơ sở": "co-so/#tim-co-so",
      "Ba Tháng Hai": "co-so/#tim-co-so",
      "Riverside": "co-so/#tim-co-so",
      "Sunrise": "co-so/#tim-co-so",
      "Sala": "co-so/#tim-co-so",
      "Garden Hills": "co-so/#tim-co-so",
      "Hoàng Văn Thụ": "co-so/#tim-co-so"
    },
    "Tuyển sinh": {
      "Quy trình tuyển sinh": "tuyen-sinh/#quy-trinh",
      "Học phí": "tuyen-sinh/#hoc-phi",
      "Điều kiện nhập học": "tuyen-sinh/#dieu-kien",
      "Câu hỏi thường gặp": "tuyen-sinh/#faq",
      "Đăng ký tư vấn": "tuyen-sinh/?intent=inquire#dang-ky"
    },
    "Tin tức": {
      "Tin tức mới nhất": "tin-tuc/",
      "Sự kiện sắp tới": "tin-tuc/#su-kien",
      "Câu chuyện học sinh": "tin-tuc/#cau-chuyen",
      "Hoạt động ngoại khóa": "vong-quanh-vas/#hoat-dong",
      "Thư viện ảnh": "vong-quanh-vas/#thu-vien"
    },
    "Vòng quanh VAS": {
      "Đời sống học đường": "vong-quanh-vas/#doi-song",
      "Thể thao": "vong-quanh-vas/#the-thao",
      "Nghệ thuật": "vong-quanh-vas/#nghe-thuat",
      "Câu lạc bộ": "vong-quanh-vas/#cau-lac-bo",
      "Cộng đồng": "vong-quanh-vas/#cong-dong",
      "Chăm sóc học sinh": "vong-quanh-vas/#cham-soc"
    }
  };

  function normalizeHref(path) {
    if (!path) return "#";
    if (path.startsWith("http") || path.startsWith("#") || path.startsWith("tel:") || path.startsWith("mailto:")) return path;
    return BASE + path;
  }

  function improveNavigation() {
    const navLabels = $$(".nav-item").map(a => a.textContent.trim());
    $$(".mega-links").forEach(list => {
      const activeLabel = navLabels.find(label => $(".nav-item.active")?.textContent.trim() === label) || null;
      $$('a', list).forEach(a => {
        const label = a.textContent.replace('→','').trim();
        const group = Object.keys(deepLinks).find(k => deepLinks[k][label]);
        if (group) a.href = normalizeHref(deepLinks[group][label]);
      });
    });
    $$(".mobile-menu details").forEach(details => {
      const group = $("summary", details)?.textContent.replace('→','').trim();
      if (!group || !deepLinks[group]) return;
      $$('li a', details).forEach(a => {
        const label = a.textContent.trim();
        if (deepLinks[group][label]) a.href = normalizeHref(deepLinks[group][label]);
      });
    });
  }

  const searchIndex = [
    ["Về VAS", "Câu chuyện, đội ngũ, thành tích và giá trị VAS", "ve-vas/"],
    ["Chương trình học", "CEP, CAP, CAPI và hành trình từ Mầm non đến Lớp 12", "chuong-trinh/"],
    ["Tìm lộ trình phù hợp", "Gợi ý lộ trình dựa trên nhu cầu của gia đình", "find-my-path/"],
    ["Các cơ sở", "Tìm cơ sở VAS phù hợp tại TP.HCM", "co-so/#tim-co-so"],
    ["Quy trình tuyển sinh", "Các bước đăng ký, đánh giá và nhập học", "tuyen-sinh/#quy-trinh"],
    ["Học phí", "Thông tin học phí và yêu cầu nhận biểu phí", "tuyen-sinh/#hoc-phi"],
    ["Điều kiện nhập học", "Yêu cầu đầu vào theo cấp học", "tuyen-sinh/#dieu-kien"],
    ["Đăng ký tư vấn", "Nhận tư vấn chương trình và cơ sở", "tuyen-sinh/?intent=inquire#dang-ky"],
    ["Tham quan VAS", "Gửi yêu cầu tham quan cơ sở", "tuyen-sinh/?intent=visit#dang-ky"],
    ["Tin tức", "Tin tức và câu chuyện từ cộng đồng VAS", "tin-tuc/"],
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
      const rows = searchIndex.filter(([t,d]) => !s || `${t} ${d}`.toLocaleLowerCase('vi').includes(s)).slice(0, 8);
      results.innerHTML = rows.length ? rows.map(([t,d,h]) => `<a href="${esc(normalizeHref(h))}"><strong>${esc(t)}</strong><span>${esc(d)}</span><i aria-hidden="true">→</i></a>`).join('') : `<p class="vas-search-empty">Chưa tìm thấy nội dung phù hợp. Bạn có thể thử “học phí”, “CAPI”, “cơ sở” hoặc “tuyển sinh”.</p>`;
    };
    const open = () => { lastFocus = document.activeElement; dialog.hidden = false; document.documentElement.classList.add('search-open'); render(''); requestAnimationFrame(() => input.focus()); };
    const close = () => { dialog.hidden = true; document.documentElement.classList.remove('search-open'); lastFocus?.focus?.(); };
    buttons.forEach(b => b.addEventListener('click', open));
    $$('[data-search-close]', dialog).forEach(b => b.addEventListener('click', close));
    input.addEventListener('input', () => render(input.value));
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) { e.preventDefault(); open(); }
      if (e.key === 'Escape' && !dialog.hidden) close();
    });
  }

  function cleanPublicCopy() {
    const replacements = new Map([
      ["Decision tool", "Gợi ý lộ trình"],
      ["Admissions journey", "Các bước tuyển sinh"],
      ["Cambridge journey", "Lộ trình Cambridge"]
    ]);
    $$('main *').forEach(node => {
      if (node.children.length) return;
      const text = node.textContent.trim();
      replacements.forEach((to, from) => { if (text.includes(from)) node.textContent = text.replace(from, to); });
      if (text.includes('Section này chỉ giới thiệu các giai đoạn.')) node.textContent = 'Bốn giai đoạn giúp gia đình hình dung hành trình học tập xuyên suốt từ Mầm non đến Lớp 12.';
    });
  }

  function makeFeesTruthful() {
    const calc = $('#feeCalculator');
    if (!calc) return;
    const amount = $('#feeAmount');
    const note = $('#feeNote');
    if (amount && /Chưa có bảng phí/i.test(amount.textContent)) {
      amount.textContent = 'Nhận biểu phí chính thức 2026–2027';
      if (note) note.textContent = 'Học phí phụ thuộc cấp/lớp, lộ trình, cơ sở và chính sách áp dụng. VAS sẽ xác nhận biểu phí phù hợp với nhu cầu của gia đình.';
      $$('.fee-fields select', calc).forEach(s => s.addEventListener('change', () => {
        const params = new URLSearchParams();
        const grade = $('#feeGrade')?.value; const program = $('#feeProgramme')?.value; const campus = $('#feeCampus')?.value;
        if (grade) params.set('grade', grade); if (program) params.set('program', program); if (campus) params.set('campus', campus);
        $$('.fee-actions a', calc).forEach(a => { if (a.dataset.feeAction === 'inquire') a.href = `#dang-ky`; });
      }));
    }
  }

  function preventFakeAdmissionsSuccess() {
    const form = $('#enquiryForm');
    if (!form) return;
    const endpoint = form.dataset.endpoint || window.VAS_ADMISSIONS_ENDPOINT;
    if (endpoint) return;
    form.classList.add('is-preview-form');
    const submit = $('button[type="submit"]', form);
    if (submit) submit.innerHTML = 'Kiểm tra thông tin <span aria-hidden="true">→</span>';
    form.addEventListener('submit', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const error = $('#formError');
      if (error) {
        error.hidden = false;
        error.textContent = 'Bản demo hiện chưa kết nối hệ thống tuyển sinh. Vui lòng gọi 0911 267 755 hoặc email admissions@vas.edu.vn để được hỗ trợ ngay.';
        error.setAttribute('role', 'alert');
        error.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, true);
  }

  function init() {
    improveNavigation();
    initSearch();
    cleanPublicCopy();
    makeFeesTruthful();
    preventFakeAdmissionsSuccess();
    const observer = new MutationObserver(() => improveNavigation());
    const mega = $('#mega');
    if (mega) observer.observe(mega, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
