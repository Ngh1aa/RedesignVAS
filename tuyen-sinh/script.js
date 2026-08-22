const esc = window.esc || ((value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])));
const DATA = window.VAS_DECISION_DATA;
const track = (event, detail = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...detail }); };

const HUB_ITEMS = [
  { id: "quy-trinh", title: "Quy trình tuyển sinh", desc: "Ba bước rõ ràng từ đăng ký đến nhập học.", icon: "01" },
  { id: "hoc-phi", title: "Học phí", desc: "Tra cứu theo cấp lớp, chương trình và cơ sở cho năm học 2026–2027.", icon: "02" },
  { id: "dieu-kien", title: "Điều kiện nhập học", desc: "Đánh giá năng lực theo từng cấp học và chương trình.", icon: "03" },
  { id: "faq", title: "Câu hỏi thường gặp", desc: "Những điều phụ huynh cần biết trước khi lựa chọn VAS.", icon: "04" },
  { id: "dang-ky", title: "Bắt đầu với admissions", desc: "Nhận tư vấn, đặt lịch tham quan hoặc bắt đầu dự tuyển.", icon: "05" },
];
const STEPS = [
  ["01", "Đăng ký dự tuyển", "Phụ huynh đăng ký thông tin và nhận tư vấn về cấp học, chương trình và cơ sở phù hợp."],
  ["02", "Kiểm tra kiến thức & năng lực đầu vào", "Mầm non: khảo sát phù hợp độ tuổi. Tiểu học và Trung học: đánh giá theo yêu cầu hiện hành."],
  ["03", "Hoàn tất hồ sơ nhập học", "Đăng ký giữ chỗ → hoàn thành học phí → hoàn tất hồ sơ → nhận lớp và nhập học."],
];
const JOURNEY = [
  ["01", "Inquire", "Đặt câu hỏi và nhận tư vấn"], ["02", "Visit", "Đến trường và gặp đội ngũ"], ["03", "Apply", "Bắt đầu hồ sơ dự tuyển"], ["04", "Assessment", "Kiểm tra năng lực đầu vào"], ["05", "Offer", "Nhận thông tin kết quả"], ["06", "Enrollment", "Hoàn tất hồ sơ nhập học"], ["07", "First Day", "Chuẩn bị ngày đầu đến trường"],
];
const REQS = [
  "Học sinh không nhất thiết phải giỏi tiếng Anh ngay từ đầu; VAS có các hình thức hỗ trợ để con thích nghi và phát triển theo lộ trình.",
  "Đánh giá đầu vào theo cấp học giúp xác định mức độ phù hợp với chương trình, không nhằm tạo thêm áp lực.",
  "Gia đình có thể lựa chọn CEP, CAP hoặc CAPI theo năng lực, sở thích và định hướng học tập của học sinh.",
  "Yêu cầu chi tiết có thể thay đổi theo cấp học và chính sách hiện hành; đội ngũ admissions sẽ xác nhận trong từng trường hợp.",
];
const FAQ = [
  ["Con tôi nên chọn CEP, CAP hay CAPI?", "Tùy mục tiêu học tập, năng lực và định hướng tương lai của học sinh. Ba lộ trình phục vụ các định hướng khác nhau, không phải thứ hạng tốt hơn hay kém hơn."],
  ["Cơ sở nào có cấp học và lộ trình của con?", "Gia đình có thể bắt đầu từ Find My Path hoặc Campus Finder để lọc theo cấp học và lộ trình, sau đó xác nhận chỗ học với admissions."],
  ["Có thể tham quan trường trước khi đăng ký không?", "Có. VAS khuyến khích phụ huynh đặt lịch tham quan trực tiếp hoặc chọn hình thức tư vấn online để hiểu rõ môi trường học tập."],
  ["Học phí bao gồm những gì?", "Học phí thay đổi theo năm học, cấp/lớp, lộ trình, cơ sở và hình thức thanh toán. Trang này hiển thị cấu trúc lựa chọn trước khi đội ngũ gửi xác nhận chính thức."],
  ["Mất bao lâu để admissions liên hệ?", "Sau khi nhận nhu cầu, đội ngũ tuyển sinh sẽ xác nhận lại thông tin và bước tiếp theo với gia đình."],
];

document.getElementById("admissionsHub").innerHTML = HUB_ITEMS.map((item) => `<a class="hub-item" href="#${esc(item.id)}"><span class="hub-icon">${esc(item.icon)}</span><span class="hub-copy"><strong>${esc(item.title)}</strong><small>${esc(item.desc)}</small></span><span class="hub-arrow" aria-hidden="true">→</span></a>`).join("");
document.getElementById("stepsGrid").innerHTML = STEPS.map(([n, t, d]) => `<article class="step"><span class="n">${esc(n)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join("");
document.getElementById("journeyGrid").innerHTML = JOURNEY.map(([n, t, d], index) => `<div class="journey-item"><span class="journey-number">${esc(n)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>${index < JOURNEY.length - 1 ? '<span class="journey-arrow" aria-hidden="true">↓</span>' : ""}</div>`).join("");
document.getElementById("reqList").innerHTML = REQS.map((r) => `<li>${esc(r)}</li>`).join("");
document.getElementById("faqList").innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)} <span class="mk" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join("");

document.querySelectorAll(".faq details").forEach((detail) => detail.addEventListener("toggle", () => { const mark = detail.querySelector(".mk"); if (mark) mark.textContent = detail.open ? "−" : "+"; }));

const form = document.getElementById("enquiryForm");
const intentDescription = document.getElementById("intentDescription");
const visitFields = document.getElementById("visitFields");
const formError = document.getElementById("formError");
const formMsg = document.getElementById("formMsg");
const intentCopy = {
  inquire: "Dành cho gia đình đang tìm hiểu chương trình, cấp học hoặc cơ sở phù hợp.",
  visit: "Chọn cơ sở và thời gian mong muốn. Admissions sẽ xác nhận lịch; đây không phải slot realtime.",
  apply: "Dành cho gia đình đã sẵn sàng bắt đầu quy trình dự tuyển. Hồ sơ chi tiết sẽ được hướng dẫn ở bước tiếp theo.",
};
let intent = new URLSearchParams(window.location.search).get("intent") || "inquire";
if (!["inquire", "visit", "apply"].includes(intent)) intent = "inquire";
const query = new URLSearchParams(window.location.search);
const state = { grade: query.get("grade") || "", program: query.get("program") || "", campus: query.get("campus") || "" };

function applyContext() {
  const programMap = { cep: "CEP — Tiếng Anh Cambridge", cap: "CAP — Cambridge học thuật", capi: "CAPI — Tích hợp quốc tế toàn phần Cambridge" };
  if (state.campus) { const campus = DATA.campusById(state.campus); if (campus) form.elements.campus.value = campus.name; }
  if (state.program && programMap[state.program]) form.elements.program.value = programMap[state.program];
  if (state.grade) form.elements.student.value = state.grade === "mam-non" ? "Mầm non" : state.grade === "1-5" ? "Lớp 1–5" : state.grade === "6-8" ? "Lớp 6–8" : "Lớp 9–12";
}
function setIntent(next) {
  intent = next;
  document.querySelectorAll("[data-intent]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.intent === intent)));
  intentDescription.textContent = intentCopy[intent];
  visitFields.hidden = intent !== "visit";
  form.elements.intentReason.value = intent === "visit" ? "visit" : intent === "apply" ? "apply" : "";
  form.querySelector("button[type=submit]").innerHTML = `${intent === "visit" ? "Gửi yêu cầu tham quan" : intent === "apply" ? "Bắt đầu dự tuyển" : "Gửi nhu cầu"} <span aria-hidden="true">→</span>`;
}
document.querySelectorAll("[data-intent]").forEach((button) => button.addEventListener("click", () => { setIntent(button.dataset.intent); track("admissions_intent_select", { intent }); }));
applyContext();
setIntent(intent);

function showError(message, field) {
  formError.textContent = message;
  formError.hidden = false;
  if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
}
function clearErrors() {
  formError.hidden = true;
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const reason = form.elements.intentReason;
  const consent = form.elements.consent;
  if (!name.value.trim()) return showError("Vui lòng nhập tên phụ huynh.", name);
  if (!/^0\d{8,10}$/.test(phone.value.replace(/\s+/g, ""))) return showError("Vui lòng nhập số điện thoại gồm 9–11 chữ số và bắt đầu bằng 0.", phone);
  if (!reason.value) return showError("Vui lòng chọn nhu cầu của gia đình.", reason);
  if (!consent.checked) return showError("Vui lòng xác nhận đồng ý để VAS liên hệ.", consent);
  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true;
  submit.textContent = "Đang gửi…";
  form.setAttribute("aria-busy", "true");
  setTimeout(() => {
    const grade = form.elements.student.value || "chưa chọn cấp/lớp";
    const program = form.elements.program.value || "chưa chọn lộ trình";
    const campus = form.elements.campus.value || "VAS";
    const lead = { source: "static-site", landingPage: window.location.pathname, parentName: name.value.trim(), phone: phone.value.trim(), email: form.elements.email.value.trim(), childGrade: grade, preferredProgram: program, preferredCampus: campus, intent, message: form.elements.note.value.trim() };
    localStorage.setItem("redesignvas-last-lead", JSON.stringify(lead));
    form.querySelectorAll("input, select, textarea, button, .form-progress, .intent-switch, .intent-description").forEach((control) => { control.hidden = true; });
    formMsg.hidden = false;
    formMsg.innerHTML = `<strong>${intent === "visit" ? "Đã nhận yêu cầu tham quan VAS." : intent === "apply" ? "Đã nhận yêu cầu bắt đầu dự tuyển." : "Cảm ơn anh/chị."}</strong><span>VAS đã nhận nhu cầu cho <b>${esc(grade)} · ${esc(program)} · ${esc(campus)}</b>. Đội ngũ tuyển sinh sẽ liên hệ để xác nhận bước tiếp theo.</span><span class="success-actions"><a class="btn btn-light" href="../find-my-path/?grade=${encodeURIComponent(state.grade || "3")}&program=${encodeURIComponent(state.program || "cap")}">Tìm lại lộ trình</a><a class="btn btn-outline-light" href="../co-so/#tim-co-so">Tìm cơ sở</a><a class="btn btn-outline-light" href="#hoc-phi">Xem học phí</a></span>`;
    track(intent === "visit" ? "tour_submit" : intent === "apply" ? "apply_start" : "inquiry_submit", { lead });
    form.removeAttribute("aria-busy");
  }, 420);
});

const feeGrade = document.getElementById("feeGrade");
const feeProgramme = document.getElementById("feeProgramme");
const feeCampus = document.getElementById("feeCampus");
const feePlan = document.getElementById("feePlan");
const feeAmount = document.getElementById("feeAmount");
const feeNote = document.getElementById("feeNote");
function updateFee() {
  const level = DATA.gradeToLevel(feeGrade.value);
  const programme = DATA.programmeById(feeProgramme.value);
  const campus = DATA.campusById(feeCampus.value);
  const valid = programme && campus && programme.levels.includes(level) && campus.levels.includes(level) && campus.programmes.includes(programme.id);
  feeAmount.textContent = valid ? "Chưa có bảng phí kết nối" : "Tổ hợp này chưa khả dụng";
  feeNote.textContent = valid ? `Học phí ${DATA.tuition.schoolYear} cần xác nhận theo chính sách hiện hành. Bạn có thể nhận tư vấn hoặc đặt lịch tham quan với lựa chọn này.` : "Hãy chọn lại cấp/lớp, lộ trình hoặc cơ sở để xem tổ hợp phù hợp.";
  document.querySelectorAll("[data-fee-action]").forEach((link) => { link.href = `?intent=${link.dataset.feeAction}&grade=${encodeURIComponent(feeGrade.value)}&program=${encodeURIComponent(feeProgramme.value)}&campus=${encodeURIComponent(feeCampus.value)}#dang-ky`; });
  track("fee_calculator_change", { grade: feeGrade.value, program: feeProgramme.value, campus: feeCampus.value, paymentPlan: feePlan.value });
}
[feeGrade, feeProgramme, feeCampus, feePlan].forEach((select) => select.addEventListener("change", updateFee));
updateFee();
