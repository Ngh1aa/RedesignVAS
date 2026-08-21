/* Chương trình — bản đồ lộ trình học tập */
const clean = window.esc || ((value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char])));

const PATHWAYS = [
  {
    code: "CEP",
    name: "Cambridge English Programme",
    strap: "Giữ nền tảng Việt Nam. Mở rộng năng lực tiếng Anh quốc tế.",
    description: "CEP kết hợp Chương trình Giáo dục Quốc gia (MOET) với Chương trình Tiếng Anh Cambridge. Đây là lựa chọn phù hợp với học sinh muốn theo đầy đủ chương trình Việt Nam nhưng học tập trong môi trường tiếng Anh quốc tế.",
    fit: ["Muốn con học chương trình Việt Nam đầy đủ.", "Muốn tiếng Anh tốt nhưng không nhất thiết theo Cambridge học thuật toàn diện.", "Muốn giữ nhiều lựa chọn đại học tại Việt Nam.", "Muốn có khả năng chuyển sang CAP/CAPI khi định hướng thay đổi."],
    journey: ["Mầm non → Tiểu học → THCS → THPT", "Cambridge English theo cấp học", "Cambridge English / IELTS"],
    outcome: "THPT Việt Nam + Cambridge English + IELTS",
    note: "VAS hiện nêu mục tiêu IELTS khoảng 6.0+ vào cuối Lớp 12 trên trang tuyển sinh."
  },
  {
    code: "CAP",
    name: "Cambridge Academic Programme",
    strap: "Nền tảng Việt Nam. Tư duy Cambridge.",
    description: "CAP kết hợp Chương trình Giáo dục Quốc gia với Chương trình Giáo dục Phổ thông Cambridge, giúp học sinh phát triển song song nền tảng học thuật Việt Nam và năng lực học tập quốc tế.",
    fit: ["Muốn song song nền tảng Việt Nam và Cambridge.", "Muốn con phát triển tư duy học thuật bằng tiếng Anh.", "Muốn có thể điều chỉnh hướng đi sau mỗi giai đoạn.", "Muốn tiếp tục hoặc chuyển sang CAPI/CEP tùy định hướng."],
    journey: ["Lớp 1–5 → Primary Checkpoint", "Lớp 6–8 → Secondary Checkpoint", "Lớp 9–10 → IGCSE", "Sau Lớp 10 → có thể tiếp tục/chuyển lộ trình"],
    outcome: "IGCSE và khả năng chuyển tiếp theo định hướng",
    note: "CAP giúp học sinh không phải lựa chọn hoàn toàn giữa chương trình Việt Nam và chương trình quốc tế."
  },
  {
    code: "CAPI",
    name: "Cambridge Academic Programme International",
    strap: "Học thuật quốc tế từ sớm. Sẵn sàng cho đại học toàn cầu.",
    description: "CAPI là lộ trình tích hợp chuyên sâu chương trình Cambridge cùng một số môn của chương trình MOET theo quy định. Đây là bản đồ rõ nhất cho hành trình từ Lớp 1 đến A Level.",
    fit: ["Gia đình định hướng đại học quốc tế mạnh.", "Con hứng thú với các môn học thuật bằng tiếng Anh.", "Muốn theo chuỗi Checkpoint → IGCSE → AS Level → A Level.", "Muốn có thể hướng tới IELTS 6.5+ và vẫn có lựa chọn thi tốt nghiệp THPT Việt Nam."],
    journey: ["Lớp 1–5 → Cambridge Primary / Primary Checkpoint", "Lớp 6–8 → Cambridge Lower Secondary / Secondary Checkpoint", "Lớp 9–10 → IGCSE", "Lớp 11 → AS Level", "Lớp 12 → A Level"],
    outcome: "A Level + IELTS; có thể lấy bằng THPT Việt Nam",
    note: "VAS hiện xác định Checkpoint → IGCSE → AS Level → A Level là chuỗi chứng chỉ chính của CAPI."
  }
];

const QUIZ = [
  { label: "Con đang học lớp nào?", options: ["Mầm non", "Lớp 1–5", "Lớp 6–8", "Lớp 9–12"] },
  { label: "Gia đình ưu tiên điều gì?", options: ["Đại học Việt Nam", "Song song Việt Nam + quốc tế", "Đại học quốc tế"] },
  { label: "Mức độ tiếng Anh hiện tại?", options: ["Đang xây nền", "Khá", "Tốt"] },
  { label: "Con thích học các môn học thuật bằng tiếng Anh?", options: ["Có", "Một phần", "Chưa chắc"] }
];

const quizState = { step: 0, answers: [] };
const quizContent = document.getElementById("quizContent");
const quizProgressLabel = document.getElementById("quizProgressLabel");
const quizProgressBar = document.getElementById("quizProgressBar");

function renderQuiz() {
  if (!quizContent) return;
  if (quizState.step >= QUIZ.length) return renderQuizResult();
  const question = QUIZ[quizState.step];
  quizProgressLabel.textContent = `Câu ${quizState.step + 1} / ${QUIZ.length}`;
  quizProgressBar.style.width = `${((quizState.step + 1) / QUIZ.length) * 100}%`;
  quizContent.innerHTML = `<p class="quiz-kicker">Tìm lộ trình phù hợp cho con</p><h3>${clean(question.label)}</h3><div class="quiz-options">${question.options.map((option, index) => `<button class="quiz-option" type="button" data-option="${index}">${clean(option)}<span aria-hidden="true">→</span></button>`).join("")}</div>${quizState.step ? `<button class="quiz-back" type="button" id="quizBack">← Câu trước</button>` : ""}`;
  quizContent.querySelectorAll(".quiz-option").forEach((button) => button.addEventListener("click", () => {
    quizState.answers[quizState.step] = Number(button.dataset.option);
    quizState.step += 1;
    renderQuiz();
  }));
  const back = document.getElementById("quizBack");
  if (back) back.addEventListener("click", () => { quizState.step -= 1; renderQuiz(); });
}

function renderQuizResult() {
  const priority = quizState.answers[1];
  const english = quizState.answers[2];
  const academic = quizState.answers[3];
  let code = "CAP";
  if (priority === 0) code = "CEP";
  if (priority === 2 && english >= 1 && academic === 0) code = "CAPI";
  const result = PATHWAYS.find((path) => path.code === code);
  quizProgressLabel.textContent = "Hoàn thành";
  quizProgressBar.style.width = "100%";
  quizContent.innerHTML = `<p class="quiz-kicker">Gợi ý ban đầu</p><div class="quiz-result-code">${clean(result.code)}</div><h3>Lộ trình đề xuất: ${clean(result.code)}</h3><p class="quiz-result-text">${clean(result.note)} ${clean(result.strap)}</p><div class="quiz-result-actions"><button class="btn btn-light" type="button" id="viewSuggested">Xem lộ trình ${clean(result.code)} <span aria-hidden="true">→</span></button><a class="btn btn-outline-light" href="../tuyen-sinh/#dang-ky">Đăng ký tư vấn <span aria-hidden="true">→</span></a></div><button class="quiz-back" type="button" id="quizReset">Làm lại từ đầu</button>`;
  document.getElementById("viewSuggested").addEventListener("click", () => {
    const index = PATHWAYS.findIndex((path) => path.code === result.code);
    renderPathway(index);
    document.getElementById("chi-tiet-lo-trinh").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("quizReset").addEventListener("click", () => { quizState.step = 0; quizState.answers = []; renderQuiz(); });
}
renderQuiz();

const pathwayTabs = document.getElementById("pathwayTabs");
const pathwayPanel = document.getElementById("pathwayPanel");
function renderPathway(index) {
  const path = PATHWAYS[index];
  pathwayTabs.querySelectorAll("[role=tab]").forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  pathwayPanel.innerHTML = `<div class="pathway-panel-head"><div><span class="pathway-code">${clean(path.code)}</span><h3>${clean(path.name)}</h3><p class="pathway-strap">${clean(path.strap)}</p></div><a href="../tuyen-sinh/#dang-ky" class="btn btn-red">Đăng ký tư vấn <span aria-hidden="true">→</span></a></div><div class="pathway-content"><div><p class="pathway-label">Tổng quan</p><p>${clean(path.description)}</p><p class="pathway-label">Hành trình</p><ul class="journey-list">${path.journey.map((item) => `<li>${clean(item)}</li>`).join("")}</ul></div><div class="pathway-fit"><p class="pathway-label">Phù hợp với gia đình</p><ul>${path.fit.map((item) => `<li>${clean(item)}</li>`).join("")}</ul><div class="pathway-outcome"><span>Đầu ra nổi bật</span><strong>${clean(path.outcome)}</strong></div></div></div><p class="pathway-note">${clean(path.note)}</p>`;
}
PATHWAYS.forEach((path, index) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "pathway-tab";
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-selected", "false");
  tab.innerHTML = `<span class="pathway-tab-code">${clean(path.code)}</span><span>${clean(path.strap)}</span><b aria-hidden="true">→</b>`;
  tab.addEventListener("click", () => renderPathway(index));
  pathwayTabs.appendChild(tab);
});
renderPathway(0);

/* Keep details native but ensure the plus sign reflects open/closed state in browsers without CSS support. */
document.querySelectorAll(".faq details").forEach((detail) => detail.addEventListener("toggle", () => {
  const mark = detail.querySelector(".mk");
  if (mark) mark.textContent = detail.open ? "−" : "+";
}));
