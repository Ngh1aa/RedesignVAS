/* =====================================================================
   VAS — SHARED HEADER / FOOTER / BEHAVIOUR (shared.js)
   Tự dựng header + mega menu + mobile menu + footer + sticky bar cho các
   trang con, đồng nhất với trang chủ. Đặt các placeholder trong HTML:
     <div id="site-header"></div> ... <div id="site-footer"></div>
     <div id="site-sticky"></div>
   và thêm data-depth (số cấp thư mục) + data-page (key trang hiện tại)
   trên <body>. Các trang con đặt data-depth="1".
   ===================================================================== */
(function () {
  const LOGO = "https://www.vas.edu.vn/asset/svg/logo-top.svg";
  const HOTLINE = "0911267755";

  const PAGE = {
    "Về VAS": "ve-vas/",
    "Chương trình": "chuong-trinh/",
    "Các cơ sở": "co-so/",
    "Tuyển sinh": "tuyen-sinh/",
    "Tin tức": "tin-tuc/",
    "Vòng quanh VAS": "vong-quanh-vas/",
  };

  const MENU = {
    "Về VAS": {
      heading: "20 năm dẫn đầu khối song ngữ",
      note: "Bằng chứng, không phải lời nói.",
      links: ["Câu chuyện VAS", "Ban lãnh đạo", "Đội ngũ giáo viên", "Thành tích học sinh", "Lộ trình vào đại học", "Giá trị cốt lõi"],
    },
    "Chương trình": {
      heading: "Hành trình xuyên cấp 16 năm",
      note: "Một lộ trình liền mạch, từ Mầm non đến Lớp 12.",
      links: ["Mầm non", "Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Cambridge toàn phần (CAPI)", "Song ngữ Cambridge (CAP)", "Tiếng Anh Cambridge (CEP)"],
    },
    "Các cơ sở": {
      heading: "6 cơ sở trên khắp TP.HCM",
      note: "Tìm cơ sở phù hợp với gia đình bạn.",
      links: ["Tất cả cơ sở", "Ba Tháng Hai", "Riverside", "Sunrise", "Sala", "Garden Hills", "Hoàng Văn Thụ"],
    },
    "Tuyển sinh": {
      heading: "Bước tiếp theo bắt đầu từ đây",
      note: "Rõ ràng, ấm áp và không áp lực.",
      links: ["Quy trình tuyển sinh", "Học phí", "Điều kiện nhập học", "Câu hỏi thường gặp", "Đăng ký tư vấn"],
    },
    "Tin tức": {
      heading: "Câu chuyện & sự kiện tại VAS",
      note: "Những điều đang diễn ra trong cộng đồng VAS.",
      links: ["Tin tức mới nhất", "Sự kiện sắp tới", "Câu chuyện học sinh", "Hoạt động ngoại khóa", "Thư viện ảnh"],
    },
    "Vòng quanh VAS": {
      heading: "Một ngày của con tại VAS",
      note: "Cảm nhận không gian học tập trước khi ghé thăm.",
      links: ["Đời sống học đường", "Thể thao", "Nghệ thuật", "Câu lạc bộ", "Cộng đồng", "Chăm sóc học sinh"],
    },
  };

  const FOOT = {
    "Chương trình": ["Mầm non", "Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Lộ trình Cambridge"],
    "Các cơ sở": ["Ba Tháng Hai", "Riverside", "Sunrise", "Sala", "Garden Hills", "Hoàng Văn Thụ"],
    "Về VAS": ["Câu chuyện VAS", "Đội ngũ giáo viên", "Thành tích", "Lộ trình vào đại học"],
    "Tuyển sinh": ["Quy trình tuyển sinh", "Học phí", "Đăng ký tư vấn", "Câu hỏi thường gặp", "Liên hệ"],
  };

  /* ---------- helpers (exposed globally) ---------- */
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
  window.esc = esc; window.el = el; window.img = img;

  const depth = Number(document.body.dataset.depth || 0);
  const BASE = "../".repeat(depth);
  const current = document.body.dataset.page || "";
  const home = BASE + "index.html";
  const url = (k) => BASE + PAGE[k];
  const admissions = BASE + PAGE["Tuyển sinh"];
  window.SITE_BASE = BASE;

  const navKeys = Object.keys(MENU);

  /* ---------- header ---------- */
  const headerHost = document.getElementById("site-header");
  if (headerHost) {
    headerHost.innerHTML = `
      <header class="header" id="header">
        <div class="header-inner">
          <a href="${home}" class="logo" aria-label="Trường Quốc tế Việt Úc (VAS) — Trang chủ">
            <span class="logo-pill"><img src="${LOGO}" alt="Trường Quốc tế Việt Úc (VAS)" /></span>
          </a>
          <nav class="nav" id="nav"></nav>
          <div class="header-actions">
            <button class="icon-btn" aria-label="Tìm kiếm">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <a href="${admissions}" class="btn btn-red header-cta">Đăng ký tư vấn</a>
            <button class="burger" id="burger" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        <div class="mega" id="mega"></div>
        <div class="mobile-menu" id="mobileMenu"></div>
      </header>`;
  }

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const mega = document.getElementById("mega");
  const mobileMenu = document.getElementById("mobileMenu");
  let openKey = null;

  navKeys.forEach((k) => {
    const a = el(`<a class="nav-item ${k === current ? "active" : ""}" href="${url(k)}">${esc(k)}</a>`);
    a.addEventListener("mouseenter", () => openMega(k));
    a.addEventListener("focus", () => openMega(k));
    nav.appendChild(a);
  });

  function renderMega(k) {
    const m = MENU[k];
    mega.innerHTML = `
      <div class="mega-inner">
        <div>
          <p class="mega-heading">${esc(m.heading)}</p>
          <p class="mega-note">${esc(m.note)}</p>
          <a href="${admissions}" class="mega-cta">Đăng ký tư vấn <span aria-hidden="true">→</span></a>
        </div>
        <ul class="mega-links">
          ${m.links.map((l) => `<li><a href="${url(k)}">${esc(l)} <span aria-hidden="true">→</span></a></li>`).join("")}
        </ul>
      </div>`;
  }
  function openMega(k) {
    openKey = k;
    renderMega(k);
    mega.classList.add("open");
    [...nav.children].forEach((c) => c.classList.toggle("active", c.textContent === k || c.textContent === current));
    setSolid();
  }
  function closeMega() {
    openKey = null;
    mega.classList.remove("open");
    [...nav.children].forEach((c) => c.classList.toggle("active", c.textContent === current));
    setSolid();
  }
  header.addEventListener("mouseleave", closeMega);

  function setSolid() {
    const solid = window.scrollY > 24 || openKey;
    header.classList.toggle("solid", !!solid);
  }
  window.addEventListener("scroll", setSolid, { passive: true });
  setSolid();

  /* mobile */
  navKeys.forEach((k) => {
    const d = el(`
      <details>
        <summary>${esc(k)} <span aria-hidden="true" style="color:var(--vas-red)">→</span></summary>
        <ul>
          <li><a href="${url(k)}" style="font-weight:600;color:var(--vas-red)">Xem trang ${esc(k)}</a></li>
          ${MENU[k].links.map((l) => `<li><a href="${url(k)}">${esc(l)}</a></li>`).join("")}
        </ul>
      </details>`);
    mobileMenu.appendChild(d);
  });
  mobileMenu.appendChild(el(`<a href="${admissions}" class="btn btn-red">Đăng ký tư vấn</a>`));
  document.getElementById("burger").addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    header.classList.add("solid");
  });
  mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) mobileMenu.classList.remove("open"); });

  /* ---------- footer ---------- */
  const footerHost = document.getElementById("site-footer");
  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="footer">
        <div class="wrap">
          <div class="footer-top">
            <div class="footer-brand">
              <a href="${home}" class="mark"><img src="${LOGO}" alt="Trường Quốc tế Việt Úc (VAS)" /></a>
              <p>Không chỉ là một ngôi trường. Là một hành trình cho cả cuộc đời của con.</p>
              <a href="${admissions}" class="btn btn-light">Đăng ký tư vấn →</a>
            </div>
            <div class="footer-cols">
              ${Object.entries(FOOT).map(([h, links]) => `
                <div><h4>${esc(h)}</h4><ul>${links.map((l) => `<li><a href="${url(h)}">${esc(l)}</a></li>`).join("")}</ul></div>`).join("")}
            </div>
          </div>
          <div class="footer-bottom">
            <div class="addr">
              <p><b>Công ty Cổ phần Giáo dục Quốc tế Việt Úc</b></p>
              <p>Trụ sở chính: 594 Ba Tháng Hai, Phường 14, Quận 10, TP.HCM</p>
              <p>Hotline: 0911 267 755 · admissions@vas.edu.vn</p>
            </div>
            <p>© 2026 Trường Quốc tế Việt Úc (VAS). Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- sticky bar ---------- */
  const stickyHost = document.getElementById("site-sticky");
  if (stickyHost) {
    stickyHost.innerHTML = `
      <div class="sticky-bar">
        <a href="tel:${HOTLINE}" class="call">Gọi tư vấn</a>
        <a href="${admissions}" class="visit">Đăng ký tư vấn</a>
      </div>`;
  }

  /* ---------- reveal + count-up (run after page scripts populate DOM) ---------- */
  function initObservers() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countIO.unobserve(e.target);
        const target = +e.target.dataset.count;
        const suffix = e.target.dataset.suffix || "";
        if (reduce) { e.target.textContent = target.toLocaleString("en-US") + suffix; return; }
        const dur = 1600, start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(eased * target).toLocaleString("en-US") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-count]").forEach((n) => countIO.observe(n));
  }
  window.VAS_initObservers = initObservers;
  window.addEventListener("load", initObservers);
})();
