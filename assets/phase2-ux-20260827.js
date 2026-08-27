(function initVasPhase2Ux() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const BASE = window.SITE_BASE || (location.pathname.includes('/') && !/\/RedesignVAS\/?$/.test(location.pathname) ? '../' : '');
  const normalizeHref = (path) => /^(https?:|tel:|mailto:|#)/.test(path) ? path : BASE + path;

  const deepLinks = {
    'Về VAS': {
      'Câu chuyện VAS': 've-vas/#cau-chuyen',
      'Ban lãnh đạo': 've-vas/#doi-ngu',
      'Đội ngũ giáo viên': 've-vas/#doi-ngu',
      'Thành tích học sinh': 've-vas/#thanh-tich',
      'Lộ trình vào đại học': 've-vas/#dau-ra',
      'Giá trị cốt lõi': 've-vas/#gia-tri'
    },
    'Chương trình': {
      'Mầm non': 'chuong-trinh/#hanh-trinh-16-nam',
      'Tiểu học': 'chuong-trinh/#hanh-trinh-16-nam',
      'Trung học cơ sở': 'chuong-trinh/#hanh-trinh-16-nam',
      'Trung học phổ thông': 'chuong-trinh/#hanh-trinh-16-nam',
      'Cambridge toàn phần (CAPI)': 'chuong-trinh/#chi-tiet-lo-trinh',
      'Song ngữ Cambridge (CAP)': 'chuong-trinh/#chi-tiet-lo-trinh',
      'Tiếng Anh Cambridge (CEP)': 'chuong-trinh/#chi-tiet-lo-trinh'
    },
    'Các cơ sở': {
      'Tất cả cơ sở': 'co-so/#cac-co-so',
      'Ba Tháng Hai': 'co-so/?campus=ba-thang-hai#cac-co-so',
      'Riverside': 'co-so/?campus=riverside#cac-co-so',
      'Sunrise': 'co-so/?campus=sunrise#cac-co-so',
      'Sala': 'co-so/?campus=sala#cac-co-so',
      'Garden Hills': 'co-so/?campus=garden-hills#cac-co-so',
      'Hoàng Văn Thụ': 'co-so/?campus=hoang-van-thu#cac-co-so'
    },
    'Tuyển sinh': {
      'Quy trình tuyển sinh': 'tuyen-sinh/#quy-trinh',
      'Học phí': 'tuyen-sinh/#hoc-phi',
      'Điều kiện nhập học': 'tuyen-sinh/#dieu-kien',
      'Câu hỏi thường gặp': 'tuyen-sinh/#faq',
      'Đăng ký tư vấn': 'tuyen-sinh/?intent=inquire#dang-ky'
    },
    'Tin tức': {
      'Tin tức mới nhất': 'tin-tuc/#tin-moi-nhat',
      'Sự kiện sắp tới': 'tin-tuc/#su-kien',
      'Câu chuyện học sinh': 'tin-tuc/#cau-chuyen-hoc-sinh',
      'Hoạt động ngoại khóa': 'tin-tuc/#hoat-dong-ngoai-khoa',
      'Thư viện ảnh': 'tin-tuc/#thu-vien-anh'
    },
    'Vòng quanh VAS': {
      'Đời sống học đường': 'vong-quanh-vas/#doi-song-hoc-duong',
      'Thể thao': 'vong-quanh-vas/#the-thao',
      'Nghệ thuật': 'vong-quanh-vas/#nghe-thuat',
      'Câu lạc bộ': 'vong-quanh-vas/#cau-lac-bo',
      'Cộng đồng': 'vong-quanh-vas/#cong-dong',
      'Chăm sóc học sinh': 'vong-quanh-vas/#cham-soc-hoc-sinh'
    }
  };

  function labelOf(link) {
    return link.textContent.replace(/→/g, '').trim();
  }

  function fixNavigation() {
    $$('.mega-links a').forEach((link) => {
      const label = labelOf(link);
      const group = Object.keys(deepLinks).find((key) => deepLinks[key][label]);
      if (group) link.href = normalizeHref(deepLinks[group][label]);
    });
    $$('.mobile-menu details').forEach((details) => {
      const group = $('summary', details)?.textContent.replace(/→/g, '').trim();
      if (!deepLinks[group]) return;
      $$('li a', details).forEach((link) => {
        const label = link.textContent.trim();
        if (deepLinks[group][label]) link.href = normalizeHref(deepLinks[group][label]);
      });
    });
    $$('.nav-item.active').forEach((link) => link.setAttribute('aria-current', 'page'));
  }

  function setAboutAnchors() {
    if (document.body.dataset.page !== 'Về VAS') return;
    const ids = new Map([
      ['Câu chuyện VAS', 'cau-chuyen'],
      ['Giá trị cốt lõi', 'gia-tri'],
      ['Dòng thời gian', 'lich-su'],
      ['Thành tích học sinh · 2025–2026', 'thanh-tich'],
      ['Lộ trình vào đại học', 'dau-ra'],
      ['Ban lãnh đạo & đội ngũ giáo viên', 'doi-ngu']
    ]);
    $$('main section').forEach((section) => {
      const eyebrow = $('.eyebrow', section)?.textContent.trim();
      if (ids.has(eyebrow)) section.id = ids.get(eyebrow);
    });
    const meta = $('meta[name="description"]');
    if (meta) meta.content = 'Tìm hiểu hơn 20 năm phát triển của VAS, 6 cơ sở, 8.000+ học sinh, đội ngũ giáo viên, thành tích, lộ trình đại học và 7 giá trị cốt lõi.';
    $$('.story-proof > div').forEach((item) => {
      const label = $('span', item)?.textContent || '';
      if (/Học sinh năm 2024/i.test(label)) {
        const strong = $('strong', item);
        if (strong) strong.textContent = '8.000+';
        $('span', item).textContent = 'Học sinh toàn hệ thống';
      }
    });
  }

  function localizeEditorialLabels() {
    const exact = new Map([
      ['Campus finder', 'Tìm cơ sở'],
      ['03 — Campus life', '03 — Trải nghiệm tại cơ sở'],
      ['News', 'Tin mới'],
      ['Stories', 'Câu chuyện'],
      ['Events', 'Sự kiện'],
      ['Life at VAS', 'Hoạt động tại VAS'],
      ['Visual archive', 'Thư viện ảnh'],
      ['Admissions journey', 'Các bước tuyển sinh'],
      ['02 — Decision tool', '02 — Gợi ý lộ trình'],
      ['04 — Cambridge journey', '04 — Lộ trình Cambridge']
    ]);
    $$('main .eyebrow').forEach((node) => {
      const text = node.textContent.trim();
      if (exact.has(text)) node.textContent = exact.get(text);
    });
    $$('.image-caption').forEach((node) => {
      if (/Classroom · Projects/i.test(node.textContent)) node.textContent = 'Lớp học · Dự án · Giờ nghỉ · Thư viện · Đời sống học đường';
    });
  }

  function refineHome() {
    if (document.body.dataset.page) return;
    const heroCopy = $('.hero-inner > p');
    if (heroCopy) heroCopy.textContent = 'Từ Mầm non đến Lớp 12, VAS kết hợp chương trình Việt Nam và Cambridge để học sinh phát triển học thuật, kỹ năng và bản lĩnh.';
    const heroTag = $('.hero-tag');
    if (heroTag) heroTag.textContent = 'Mầm non → Lớp 12 · CEP · CAP · CAPI · 6 cơ sở';
    const peopleHeading = $$('.section-head h2').find((node) => /Những người thầy đứng sau/i.test(node.textContent));
    if (peopleHeading) peopleHeading.innerHTML = 'Những người thầy <span class="italic text-red">đồng hành cùng con.</span>';
    const storyLink = $('.stories-head > a');
    if (storyLink) storyLink.textContent = 'Đọc câu chuyện học sinh →';
  }

  function refineNews() {
    if (document.body.dataset.page !== 'Tin tức') return;
    $$('.cms-note').forEach((node) => node.remove());
    const heroCta = $('.editorial-copy .btn-red');
    if (heroCta) {
      heroCta.href = '#tin-moi-nhat';
      heroCta.innerHTML = 'Xem tin mới nhất <span aria-hidden="true">↓</span>';
    }
    const allNews = $$('#tin-moi-nhat a.text-link').find((link) => /Xem tất cả tin tức/i.test(link.textContent));
    if (allNews) allNews.href = 'https://www.vas.edu.vn/tin-tuc';
    const eventCta = $('#su-kien .events .btn-red');
    if (eventCta) eventCta.remove();
  }

  let bthCardHtml = '';
  function correctCampusRenderedData() {
    if (document.body.dataset.page !== 'Các cơ sở') return;
    const bth = $('[data-campus-card="ba-thang-hai"]');
    if (bth) {
      const level = $('.campus-card-level', bth);
      if (level) level.textContent = 'Mầm non — THPT';
      $$('.tag-list span', bth).forEach((tag) => { if (/Tiểu học → THPT/.test(tag.textContent)) tag.textContent = 'Mầm non → THPT'; });
      bthCardHtml = bth.outerHTML;
    }
    $$('#comparisonBody tr').forEach((row) => {
      if (/Ba Tháng Hai/.test(row.textContent)) {
        const cells = $$('td', row);
        if (cells[1]) cells[1].textContent = 'Mầm non — THPT';
      }
    });
    const mapCard = $('#mapCard');
    if (mapCard && /Ba Tháng Hai/.test(mapCard.textContent)) {
      const meta = $$('.map-card-meta span', mapCard);
      if (meta[0]) meta[0].textContent = 'Mầm non — THPT';
      if (meta[1] && !$('a', meta[1])) {
        const phone = meta[1].textContent.trim();
        meta[1].innerHTML = `<a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>`;
      }
    }
    const firstFaq = $('.faq-list details:first-child p');
    if (firstFaq) firstFaq.textContent = 'Sala, Riverside, Garden Hills, Sunrise và Ba Tháng Hai đào tạo từ Mầm non đến THPT. Hoàng Văn Thụ đào tạo từ Tiểu học đến THPT.';
    const count = $('#finderCount');
    if (count) count.setAttribute('aria-live', 'polite');
  }

  function syncBthKindergartenResult() {
    if (!bthCardHtml || document.body.dataset.page !== 'Các cơ sở') return;
    const active = (key) => $(`[data-filter="${key}"][aria-pressed="true"]`)?.dataset.value || 'all';
    if (active('level') !== 'mam-non') return;
    const districtOk = ['all', 'quan-10'].includes(active('district'));
    const priorityOk = ['all', 'gan-nha', 'xuyen-cap', 'the-thao'].includes(active('priority'));
    if (!districtOk || !priorityOk) return;
    const grid = $('#campusGrid');
    if (!grid || $('[data-campus-card="ba-thang-hai"]', grid)) return;
    if ($('.finder-empty', grid)) grid.innerHTML = '';
    grid.insertAdjacentHTML('beforeend', bthCardHtml);
    correctCampusRenderedData();
    const count = $('#finderCount');
    if (count) {
      const n = Number((count.textContent.match(/\d+/) || ['0'])[0]);
      count.textContent = `${n + 1} cơ sở phù hợp với bạn`;
    }
  }

  function focusCampusFromQuery() {
    if (document.body.dataset.page !== 'Các cơ sở') return;
    const id = new URLSearchParams(location.search).get('campus');
    if (!id) return;
    requestAnimationFrame(() => {
      const card = $(`[data-campus-card="${CSS.escape(id)}"]`);
      if (card) {
        card.classList.add('phase2-focus');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function refineAroundVas() {
    if (document.body.dataset.page !== 'Vòng quanh VAS') return;
    const sportLink = $('#the-thao a.text-link');
    if (sportLink && sportLink.getAttribute('href') === '#the-thao') {
      sportLink.href = 'https://www.vas.edu.vn/tin-tuc';
      sportLink.innerHTML = 'Xem tin thể thao VAS <span aria-hidden="true">→</span>';
    }
    const community = $('#cong-dong a.btn-light');
    if (community && community.getAttribute('href') === '#cong-dong') {
      community.href = 'https://www.vas.edu.vn/tin-tuc';
      community.innerHTML = 'Xem hoạt động cộng đồng <span aria-hidden="true">→</span>';
    }
    const alumni = $('#cuu-hoc-sinh a.text-link');
    if (alumni) alumni.href = '../ve-vas/#dau-ra';
  }

  function refineAdmissions() {
    if (document.body.dataset.page !== 'Tuyển sinh') return;
    const journeyHeading = $('#hanh-trinh .section-head h2');
    if (journeyHeading) journeyHeading.textContent = 'Từ tìm hiểu đến ngày đầu tiên.';
    const journeyEyebrow = $('#hanh-trinh .eyebrow');
    if (journeyEyebrow) journeyEyebrow.textContent = 'Các bước tuyển sinh';
    const feeIntro = $('#hoc-phi .tuition-preview-copy > p');
    if (feeIntro) feeIntro.textContent = 'Chọn cấp lớp, lộ trình và cơ sở để VAS chuẩn bị đúng biểu phí cho gia đình.';
  }

  function addUtilityLinks() {
    const footer = $('.footer');
    if (!footer || $('.phase2-utility-links', footer)) return;
    const host = $('.footer-bottom', footer) || $('.wrap', footer);
    if (!host) return;
    const nav = document.createElement('nav');
    nav.className = 'phase2-utility-links';
    nav.setAttribute('aria-label', 'Tiện ích VAS');
    nav.innerHTML = [
      ['Cổng phụ huynh & học sinh', 'https://parents.vas.edu.vn/en/handbook'],
      ['Thanh toán học phí', 'https://onlinepayment.vas.edu.vn/'],
      ['Tuyển dụng', 'https://careers.vas.edu.vn/'],
      ['Liên hệ', 'https://www.vas.edu.vn/lien-he']
    ].map(([label, href]) => `<a href="${href}">${label}<span aria-hidden="true">↗</span></a>`).join('');
    host.parentNode.insertBefore(nav, host);
  }

  function improveAnchoringAndAccessibility() {
    $$('main section[id]').forEach((section) => section.classList.add('phase2-anchor'));
    $$('.breadcrumb').forEach((nav) => nav.setAttribute('aria-label', 'Breadcrumb'));
    $$('.text-link, .btn, .choice, summary, .map-marker').forEach((node) => {
      if (node.tagName === 'A' && node.getAttribute('href') === '#') node.removeAttribute('href');
    });
  }

  function applyAll() {
    setAboutAnchors();
    fixNavigation();
    localizeEditorialLabels();
    refineHome();
    refineNews();
    correctCampusRenderedData();
    refineAroundVas();
    refineAdmissions();
    addUtilityLinks();
    improveAnchoringAndAccessibility();
  }

  window.addEventListener('load', () => {
    applyAll();
    focusCampusFromQuery();
    setTimeout(syncBthKindergartenResult, 0);

    const mega = $('#mega');
    if (mega) new MutationObserver(() => fixNavigation()).observe(mega, { childList: true, subtree: true });
    const campusGrid = $('#campusGrid');
    if (campusGrid) new MutationObserver(() => { correctCampusRenderedData(); setTimeout(syncBthKindergartenResult, 0); }).observe(campusGrid, { childList: true, subtree: true });
    const mapCard = $('#mapCard');
    if (mapCard) new MutationObserver(correctCampusRenderedData).observe(mapCard, { childList: true, subtree: true });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-filter], #resetFinder')) setTimeout(syncBthKindergartenResult, 0);
    });
  }, { once: true });
})();
