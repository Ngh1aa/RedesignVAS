(() => {
  const DATA = window.VAS_DECISION_DATA;
  const esc = window.esc;
  const fitContent = document.getElementById("fitContent");
  const progressLabel = document.getElementById("fitProgressLabel");
  const progressBar = document.getElementById("fitProgressBar");
  const recommendation = document.getElementById("recommendation");
  const fitResult = document.getElementById("fitResult");
  const params = new URLSearchParams(window.location.search);
  const state = {
    step: params.get("direction") ? 2 : params.get("grade") ? 1 : 0,
    grade: params.get("grade") || "",
    direction: params.get("direction") || "",
    program: params.get("program") || "",
    campus: params.get("campus") || "",
  };
  let completionTracked = false;

  const gradeOptions = [
    ["mam-non", "Mầm non", "2–5 tuổi"],
    ["3", "Lớp 1–5", "Ví dụ: Lớp 3"],
    ["7", "Lớp 6–8", "Ví dụ: Lớp 7"],
    ["10", "Lớp 9–12", "Ví dụ: Lớp 10"],
  ];
  const directionOptions = [
    ["vn", "Chương trình Việt Nam vững chắc + tăng cường Cambridge English"],
    ["balanced", "Song song học thuật Cambridge và chương trình Việt Nam"],
    ["international", "Chương trình Cambridge chuyên sâu hướng đến IGCSE / A Level"],
    ["unsure", "Tôi chưa chắc — cần VAS tư vấn"],
  ];

  const track = (name, detail = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...detail });
  };
  const levelFromGrade = (grade) => grade === "mam-non" ? "mam-non" : grade === "3" ? "tieu-hoc" : grade === "7" ? "thcs" : "thpt";
  const gradeLabel = (grade) => gradeOptions.find((item) => item[0] === grade)?.[1] || "Chưa chọn";
  const directionToProgram = (direction, grade) => {
    if (direction === "vn") return "cep";
    if (direction === "international" && grade !== "mam-non") return "capi";
    return "cap";
  };
  const programme = () => DATA.programmeById(state.program || directionToProgram(state.direction, state.grade));
  const selectedCampus = () => DATA.campusById(state.campus);
  const matchingCampuses = () => DATA.matchingCampuses(levelFromGrade(state.grade), programme()?.id || "cap");
  const syncUrl = () => {
    const next = new URL(window.location.href);
    ["grade", "direction", "program", "campus"].forEach((key) => { if (state[key]) next.searchParams.set(key, state[key]); else next.searchParams.delete(key); });
    history.replaceState({}, "", next);
  };

  function renderQuestion(title, kicker, options, currentValue, step) {
    progressLabel.textContent = `Bước ${step} / 3`;
    progressBar.style.width = `${step === 1 ? 33 : 66}%`;
    fitContent.innerHTML = `<p class="fit-kicker">${esc(kicker)}</p><h3>${esc(title)}</h3><div class="fit-options">${options.map(([value, label, note]) => `<button class="fit-option" type="button" data-value="${esc(value)}"><span><strong>${esc(label)}</strong>${note ? `<small>${esc(note)}</small>` : ""}</span><span aria-hidden="true">→</span></button>`).join("")}</div>${step > 1 ? `<button class="fit-back" type="button" id="fitBack">← Quay lại bước trước</button>` : ""}`;
    fitContent.querySelectorAll(".fit-option").forEach((button) => button.addEventListener("click", () => {
      if (step === 1) { state.grade = button.dataset.value; state.direction = ""; state.program = ""; state.campus = ""; state.step = 1; track("find_my_path_grade_select", { grade: state.grade }); }
      else { state.direction = button.dataset.value; state.program = directionToProgram(state.direction, state.grade); state.campus = ""; state.step = 2; track("find_my_path_direction_select", { direction: state.direction, program: state.program }); }
      syncUrl();
      render();
    }));
    const back = document.getElementById("fitBack");
    if (back) back.addEventListener("click", () => { state.step -= 1; if (state.step === 0) { state.grade = ""; state.direction = ""; state.program = ""; state.campus = ""; } else { state.direction = ""; state.program = ""; state.campus = ""; } syncUrl(); render(); });
  }

  function campusTemplate(campus) {
    const selected = campus.id === state.campus;
    return `<article class="fit-campus ${selected ? "is-selected" : ""}"><div><strong>${esc(campus.name)}</strong><p>${esc(campus.district)} · ${esc(campus.address)}</p><small>✓ ${esc(gradeLabel(state.grade))} · ✓ ${esc(programme().code)}</small></div><button class="text-link" type="button" data-campus-select="${esc(campus.id)}">${selected ? "Đã chọn" : "Chọn cơ sở →"}</button></article>`;
  }

  function feeTemplate() {
    const campus = selectedCampus();
    const record = DATA.tuition.records.find((item) => item.schoolYear === DATA.tuition.schoolYear && item.campusId === state.campus && item.grade === state.grade && item.programme === state.program);
    if (record) return `<div class="fit-fee"><span>Học phí dự kiến · ${esc(DATA.tuition.schoolYear)}</span><strong>${Number(record.amount).toLocaleString("vi-VN")} ₫ / năm</strong><p>Hình thức thanh toán: ${esc(DATA.labels.paymentPlans[record.paymentPlan] || record.paymentPlan)}.</p></div>`;
    return `<div class="fit-fee"><span>Học phí dự kiến · ${esc(DATA.tuition.schoolYear)}</span><strong>Chưa có bảng phí kết nối</strong><p>Gia đình có thể xem cấu trúc tính phí và nhận xác nhận chính thức từ admissions.</p></div>`;
  }

  function renderResult() {
    const path = programme();
    const available = matchingCampuses();
    progressLabel.textContent = "Hoàn thành";
    progressBar.style.width = "100%";
    recommendation.hidden = false;
    fitContent.innerHTML = `<p class="fit-kicker">Bước 3 / 3 · Gợi ý để tìm hiểu</p><h3>${esc(path.code)} có thể là một điểm bắt đầu phù hợp.</h3><p class="fit-result-lead">${esc(path.summary)}</p><div class="fit-context"><div class="fit-context-item"><span>Cấp học</span><strong>${esc(gradeLabel(state.grade))}</strong></div><div class="fit-context-item"><span>Định hướng</span><strong>${esc(state.direction === "unsure" ? "Cần VAS tư vấn thêm" : path.code)}</strong></div><div class="fit-context-item"><span>Tiếp theo</span><strong>Chọn cơ sở phù hợp</strong></div></div><button class="fit-restart" type="button" id="fitRestart">Làm lại từ đầu</button>`;
    fitResult.innerHTML = `<article class="fit-result-card"><span class="fit-code">${esc(path.code)}</span><h3>${esc(path.name)}</h3><p>${esc(path.fit)}</p><div class="fit-actions"><a class="btn btn-red" href="../chuong-trinh/?program=${encodeURIComponent(path.id)}#chi-tiet-lo-trinh">Khám phá ${esc(path.code)} <span aria-hidden="true">→</span></a><a class="btn btn-outline" href="../chuong-trinh/#so-sanh">So sánh lộ trình</a></div></article><article class="fit-result-card"><span class="eyebrow">Cơ sở phù hợp</span><h3>Chọn nơi con sẽ lớn lên.</h3><p>Chỉ hiển thị những cơ sở đang có cấp học và lộ trình tương ứng trong dữ liệu trải nghiệm này.</p><div class="fit-campus-list">${available.length ? available.map(campusTemplate).join("") : `<p>Chưa có cơ sở phù hợp với tổ hợp này. Hãy để đội ngũ VAS tư vấn thêm.</p>`}</div>${state.campus ? feeTemplate() : "<p class=\"fit-selection-note\">Chọn một cơ sở để xem hành động và thông tin học phí.</p>"}<div class="fit-next">${state.campus ? `<h4>Bước tiếp theo cho gia đình</h4><div class="fit-actions"><a class="btn btn-red" href="../tuyen-sinh/?intent=visit&grade=${encodeURIComponent(state.grade)}&program=${encodeURIComponent(path.id)}&campus=${encodeURIComponent(state.campus)}#dang-ky">Tham quan ${esc(selectedCampus()?.name || "cơ sở")} <span aria-hidden="true">→</span></a><a class="btn btn-outline" href="../tuyen-sinh/?intent=inquire&grade=${encodeURIComponent(state.grade)}&program=${encodeURIComponent(path.id)}&campus=${encodeURIComponent(state.campus)}#dang-ky">Nhận tư vấn</a><a class="btn btn-outline" href="../tuyen-sinh/#hoc-phi">Xem học phí</a></div>` : ""}</div></article>`;
    fitResult.querySelectorAll("[data-campus-select]").forEach((button) => button.addEventListener("click", () => { state.campus = button.dataset.campusSelect; syncUrl(); renderResult(); track("find_my_path_campus_select", { campus: state.campus, program: path.id }); }));
    document.getElementById("fitRestart").addEventListener("click", () => { state.step = 0; state.grade = ""; state.direction = ""; state.program = ""; state.campus = ""; syncUrl(); recommendation.hidden = true; render(); document.getElementById("find-path").scrollIntoView({ behavior: "smooth" }); });
    if (!completionTracked) { completionTracked = true; track("find_my_path_complete", { grade: state.grade, program: path.id, campus: state.campus || null }); }
  }

  function render() {
    if (state.step === 0) return renderQuestion("Con đang học cấp/lớp nào?", "Bước 1 · Điểm xuất phát", gradeOptions, state.grade, 1);
    if (state.step === 1) return renderQuestion("Gia đình đang ưu tiên điều gì?", "Bước 2 · Định hướng", directionOptions, state.direction, 2);
    renderResult();
  }

  render();
})();
