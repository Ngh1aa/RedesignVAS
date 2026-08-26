/*
 * VAS content/data upgrades — 2026-08-26
 * Purpose: enrich verified content and decision UX without changing existing HTML/CSS layout.
 * Source basis: official VAS pages for 2025–2026 outcomes, admissions, tuition and parent/student care.
 */
(function initVasContentUpgrades() {
  const DATA = window.VAS_DECISION_DATA;
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isHome = /\/RedesignVAS$/.test(path) || /\/RedesignVAS\/index\.html$/.test(path) || path === "/" || /\/index\.html$/.test(path) && !/\/(ve-vas|chuong-trinh|co-so|find-my-path|vong-quanh-vas|tuyen-sinh|tin-tuc)\//.test(path);
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

  const verifiedOutcomes = [
    { value: "2.600+", label: "giải thưởng trong nước & quốc tế · 2025–2026" },
    { value: "154", label: "suất học bổng đại học · tính đến 05/2026" },
    { value: "6,47 triệu USD", label: "tổng giá trị học bổng · 2025–2026" },
  ];

  const verifiedVoices = [
    {
      stage: "Gia đình VAS",
      quote: "Điều chúng mình rất hài lòng khi hai bé theo học chương trình Cambridge tại VAS là đội ngũ giáo viên tận tâm, luôn quan tâm và chăm sóc các con một cách chu đáo.",
      name: "Gia đình diễn viên Đinh Ngọc Diệp – đạo diễn Victor Vũ",
    },
    {
      stage: "Phụ huynh",
      quote: "Mình rất ấn tượng với phong thái tự tin trước đám đông và khả năng nói tiếng Anh của các em học sinh VAS, ngay từ bậc Tiểu học.",
      name: "Phụ huynh Mai Bảo Ngọc",
    },
    {
      stage: "Phụ huynh & cựu học sinh",
      quote: "Điều tôi tâm đắc nhất là các con được chăm sóc rất chu đáo; từ giáo viên, bảo mẫu đến đội ngũ nhà trường đều hiểu và quan tâm đến từng bé.",
      name: "Phụ huynh kiêm cựu học sinh Huỳnh Mai Mỹ",
    },
  ];

  function patchHomeOutcomes() {
    if (!isHome) return;
    const grid = document.getElementById("outcomesGrid");
    if (!grid) return;
    const items = grid.querySelectorAll(".outcome");
    if (items.length < 3) return;
    verifiedOutcomes.forEach((item, index) => {
      const node = items[index];
      const number = node.querySelector(".num");
      const label = node.querySelector("p");
      if (number) {
        number.removeAttribute("data-count");
        number.removeAttribute("data-suffix");
        number.textContent = item.value;
      }
      if (label) label.textContent = item.label;
    });
  }

  function patchHomeVoices() {
    if (!isHome) return;
    const tabs = document.getElementById("voiceTabs");
    const quote = document.getElementById("voiceQuote");
    if (!tabs || !quote) return;

    const render = (index) => {
      const voice = verifiedVoices[index];
      tabs.querySelectorAll(".voice-tab").forEach((tab, tabIndex) => tab.classList.toggle("active", tabIndex === index));
      quote.classList.remove("animate-rise");
      void quote.offsetWidth;
      quote.classList.add("animate-rise");
      quote.innerHTML = `<p>“${esc(voice.quote)}”</p><footer>${esc(voice.name)}</footer>`;
    };

    tabs.innerHTML = "";
    verifiedVoices.forEach((voice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "voice-tab";
      button.textContent = voice.stage;
      button.addEventListener("click", () => render(index));
      tabs.appendChild(button);
    });
    render(0);
  }

  function patchAdmissions() {
    if (!/\/tuyen-sinh(?:\/|$)/.test(path)) return;

    const steps = document.getElementById("stepsGrid");
    if (steps) {
      const verifiedSteps = [
        ["01", "Đăng ký dự tuyển", "Phụ huynh đăng ký thông tin và nhận tư vấn về cấp học, lộ trình và cơ sở phù hợp."],
        ["02", "Kiểm tra kiến thức & năng lực đầu vào", "Mầm non: khảo sát tâm lý. Tiểu học và Trung học: Tiếng Anh, Tiếng Việt và Toán."],
        ["03", "Hoàn tất hồ sơ nhập học", "Đăng ký giữ chỗ → hoàn thành học phí → hoàn tất hồ sơ → nhận lớp và nhập học."],
      ];
      steps.innerHTML = verifiedSteps.map(([n, title, desc]) => `<article class="step"><span class="n">${esc(n)}</span><h4>${esc(title)}</h4><p>${esc(desc)}</p></article>`).join("");
    }

    const faq = document.getElementById("faqList");
    if (faq) {
      const verifiedFaq = [
        ["Assessment đầu vào gồm những gì?", "Mầm non thực hiện khảo sát tâm lý; Tiểu học và Trung học được đánh giá Tiếng Anh, Tiếng Việt và Toán theo quy trình tuyển sinh hiện hành của VAS."],
        ["Con chưa giỏi tiếng Anh có thể học tại VAS không?", "Có thể. VAS có các hình thức hỗ trợ/củng cố tiếng Anh để học sinh thích nghi và theo kịp lộ trình phù hợp."],
        ["Có thể tham quan trường trước khi đăng ký không?", "Có. Gia đình có thể đặt lịch tham quan cơ sở trước khi quyết định dự tuyển."],
        ["Học phí có những khoản nào ngoài học phí chính khóa?", "Biểu phí VAS còn có các nhóm chi phí như phí giữ chỗ, tiền ăn, xe đưa rước, sách giáo khoa/học cụ và các khoản tạm thu khác."],
        ["Học phí có điều chỉnh theo năm không?", "VAS công bố biểu phí theo từng năm học. Gia đình nên kiểm tra biểu phí 2026–2027 và phương án thanh toán hiện hành trước khi hoàn tất nhập học."],
      ];
      faq.innerHTML = verifiedFaq.map(([q, a]) => `<details><summary>${esc(q)} <span class="mk" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join("");
      faq.querySelectorAll("details").forEach((detail) => detail.addEventListener("toggle", () => {
        const mark = detail.querySelector(".mk");
        if (mark) mark.textContent = detail.open ? "−" : "+";
      }));
    }

    const feeAmount = document.getElementById("feeAmount");
    const feeNote = document.getElementById("feeNote");
    const feeGrade = document.getElementById("feeGrade");
    const feeProgramme = document.getElementById("feeProgramme");
    const feeCampus = document.getElementById("feeCampus");
    const feePlan = document.getElementById("feePlan");
    if (feeAmount && feeNote && feeGrade && feeProgramme && feeCampus && feePlan) {
      const enhanceFeeCopy = () => {
        if (feeAmount.textContent.includes("Chưa có bảng phí kết nối")) feeAmount.textContent = "Biểu phí chính thức 2026–2027";
        if (!feeAmount.textContent.includes("khả dụng")) {
          feeNote.textContent = "Biểu phí phụ thuộc cấp/lớp, lộ trình, cơ sở và phương án thanh toán. Các khoản khác có thể gồm phí giữ chỗ, tiền ăn, xe đưa rước, sách/học cụ và khoản tạm thu. Vui lòng đối chiếu biểu phí VAS chính thức trước khi đăng ký.";
        }
        document.querySelectorAll("[data-fee-action]").forEach((link) => {
          link.href = `?intent=${link.dataset.feeAction}&grade=${encodeURIComponent(feeGrade.value)}&program=${encodeURIComponent(feeProgramme.value)}&campus=${encodeURIComponent(feeCampus.value)}#dang-ky`;
          link.dataset.tuitionSource = DATA?.tuition?.sourceUrl || "https://www.vas.edu.vn/hoc-phi";
        });
      };
      [feeGrade, feeProgramme, feeCampus, feePlan].forEach((select) => select.addEventListener("change", () => setTimeout(enhanceFeeCopy, 0)));
      enhanceFeeCopy();
    }
  }

  function patchCampusLinks() {
    if (!/\/co-so(?:\/|$)/.test(path)) return;
    const update = () => {
      document.querySelectorAll("[data-campus-card]").forEach((card) => {
        const campusId = card.getAttribute("data-campus-card");
        const links = card.querySelectorAll(".campus-card-actions a");
        links.forEach((link) => {
          if (link.textContent.includes("Học phí")) link.href = `../tuyen-sinh/?campus=${encodeURIComponent(campusId)}#hoc-phi`;
        });
      });
    };
    update();
    const grid = document.getElementById("campusGrid");
    if (grid) new MutationObserver(update).observe(grid, { childList: true, subtree: true });
  }

  function patchFindMyPathFee() {
    if (!/\/find-my-path(?:\/|$)/.test(path)) return;
    const result = document.getElementById("fitResult");
    if (!result) return;
    const update = () => {
      result.querySelectorAll(".fit-fee").forEach((fee) => {
        const strong = fee.querySelector("strong");
        const copy = fee.querySelector("p");
        if (strong?.textContent.includes("Chưa có bảng phí kết nối")) strong.textContent = "Xem biểu phí VAS 2026–2027";
        if (copy && strong?.textContent.includes("biểu phí")) copy.textContent = "Học phí thay đổi theo cấp/lớp, lộ trình, cơ sở và phương án thanh toán; admissions sẽ xác nhận theo biểu phí chính thức.";
      });
      result.querySelectorAll('a[href="../tuyen-sinh/#hoc-phi"]').forEach((link) => {
        const url = new URL(link.href, window.location.href);
        link.href = `${url.pathname}?grade=${encodeURIComponent(new URLSearchParams(location.search).get("grade") || "")}&program=${encodeURIComponent(new URLSearchParams(location.search).get("program") || "")}&campus=${encodeURIComponent(new URLSearchParams(location.search).get("campus") || "")}#hoc-phi`;
      });
    };
    update();
    new MutationObserver(update).observe(result, { childList: true, subtree: true });
  }

  function start() {
    patchHomeOutcomes();
    patchHomeVoices();
    patchAdmissions();
    patchCampusLinks();
    patchFindMyPathFee();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else setTimeout(start, 0);
})();
