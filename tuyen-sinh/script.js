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
const query = new URLSearchParams(window.location.search);
const canonicalValue = (value) => String(value || "").trim().toLowerCase();
const campusFromValue = (value) => DATA.campusById(canonicalValue(value)) || DATA.campuses.find((campus) => canonicalValue(campus.name) === canonicalValue(value));
const programmeFromValue = (value) => DATA.programmeById(canonicalValue(value)) || DATA.programmes.find((programme) => canonicalValue(programme.code) === canonicalValue(value) || canonicalValue(programme.name) === canonicalValue(value));
let intent = query.get("intent") || "inquire";
if (!["inquire", "visit", "apply"].includes(intent)) intent = "inquire";
const contextCampus = campusFromValue(query.get("campus"));
const contextProgramme = programmeFromValue(query.get("program"));
const state = { grade: query.get("grade") || "", program: contextProgramme?.id || "", campus: contextCampus?.id || "" };

function applyContext() {
  if (state.campus) form.elements.campus.value = state.campus;
  if (state.program) form.elements.program.value = state.program;
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
const buildLeadPayload = () => {
  const submittedAt = new Date().toISOString();
  const campus = campusFromValue(form.elements.campus.value) || campusFromValue(state.campus);
  const programme = programmeFromValue(form.elements.program.value) || programmeFromValue(state.program);
  const grade = form.elements.student.value.trim();
  const email = form.elements.email.value.trim();
  const phone = form.elements.phone.value.replace(/\s+/g, "");
  return {
    schemaVersion: form.dataset.formVersion || "admissions-v1",
    submittedAt,
    transmission: "local-only",
    source: query.get("source") || "static-site",
    landingPage: window.location.pathname,
    intent,
    intentReason: form.elements.intentReason.value,
    context: { grade: state.grade || null, programmeId: state.program || null, campusId: state.campus || null },
    parent: { name: form.elements.name.value.trim(), phone, email: email || null },
    student: { grade: grade || null },
    preferences: { campusId: campus?.id || null, campusName: campus?.name || null, programmeId: programme?.id || null, programmeCode: programme?.code || null, programmeName: programme?.name || null },
    visit: intent === "visit" ? { type: form.elements.visitType.value, preferredDate: form.elements.date.value || null, preferredTime: form.elements.time.value || null } : null,
    message: form.elements.note.value.trim() || null,
    consent: { accepted: form.elements.consent.checked, acceptedAt: submittedAt },
    parentName: form.elements.name.value.trim(),
    phone,
    email: email || null,
    childGrade: grade || null,
    preferredProgram: programme?.id || null,
    preferredCampus: campus?.id || null,
  };
};
const transmitLead = async (lead) => {
  const endpoint = form.dataset.endpoint || window.VAS_ADMISSIONS_ENDPOINT;
  if (!endpoint) return { status: "local-only", message: "Bản preview chưa kết nối CRM hoặc email admissions." };
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(lead), keepalive: true });
  if (!response.ok) throw new Error(`Admissions endpoint returned ${response.status}`);
  return { status: "remote", message: "Thông tin đã được chuyển tới hệ thống admissions." };
};
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const email = form.elements.email;
  const reason = form.elements.intentReason;
  const consent = form.elements.consent;
  if (!name.value.trim()) return showError("Vui lòng nhập tên phụ huynh.", name);
  if (!/^0\d{8,10}$/.test(phone.value.replace(/\s+/g, ""))) return showError("Vui lòng nhập số điện thoại gồm 9–11 chữ số và bắt đầu bằng 0.", phone);
  if (email.value && !email.validity.valid) return showError("Vui lòng kiểm tra lại địa chỉ email.", email);
  if (!reason.value) return showError("Vui lòng chọn nhu cầu của gia đình.", reason);
  if (intent === "visit" && !form.elements.campus.value) return showError("Vui lòng chọn cơ sở muốn tham quan.", form.elements.campus);
  if (intent === "visit" && !form.elements.date.value) return showError("Vui lòng chọn ngày mong muốn để VAS xác nhận lịch.", form.elements.date);
  if (intent === "visit" && !form.elements.time.value) return showError("Vui lòng chọn khung giờ mong muốn để VAS xác nhận lịch.", form.elements.time);
  if (intent === "apply" && !form.elements.program.value) return showError("Vui lòng chọn lộ trình quan tâm trước khi bắt đầu dự tuyển.", form.elements.program);
  if (!consent.checked) return showError("Vui lòng xác nhận đồng ý để VAS liên hệ.", consent);
  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true;
  submit.textContent = "Đang kiểm tra…";
  form.setAttribute("aria-busy", "true");
  const lead = buildLeadPayload();
  transmitLead(lead).then((result) => {
    lead.transmission = result.status;
    lead.transmittedAt = result.status === "remote" ? new Date().toISOString() : null;
    localStorage.setItem("redesignvas-last-lead", JSON.stringify(lead));
    window.__REDESIGNVAS_LAST_ADMISSIONS_PAYLOAD__ = lead;
    form.querySelectorAll("input, select, textarea, button, .form-progress, .intent-switch, .intent-description").forEach((control) => { control.hidden = true; });
    formMsg.hidden = false;
    formMsg.innerHTML = `<strong>${result.status === "remote" ? (intent === "visit" ? "Đã nhận yêu cầu tham quan VAS." : intent === "apply" ? "Đã nhận yêu cầu bắt đầu dự tuyển." : "Đã nhận nhu cầu tư vấn.") : "Đã tạo bản ghi kiểm thử."}</strong><span>${result.message} Dữ liệu được chuẩn hóa theo <b>${esc(lead.schemaVersion)}</b>: <b>${esc(lead.parent.name)} · ${esc(lead.preferences.programmeCode || "chưa chọn lộ trình")} · ${esc(lead.preferences.campusName || "chưa chọn cơ sở")}</b>.</span>${result.status === "local-only" ? "<span class=\"form-warning\">Đây là bản GitHub Pages tĩnh: chưa có dữ liệu nào được gửi ra ngoài trình duyệt.</span>" : ""}<span class="success-actions"><a class="btn btn-light" href="../find-my-path/?grade=${encodeURIComponent(state.grade || "3")}&program=${encodeURIComponent(state.program || "cap")}">Tìm lại lộ trình</a><a class="btn btn-outline-light" href="../co-so/#tim-co-so">Tìm cơ sở</a><a class="btn btn-outline-light" href="#hoc-phi">Xem học phí</a></span>`;
    track(intent === "visit" ? "tour_submit" : intent === "apply" ? "apply_start" : "inquiry_submit", { lead });
    form.removeAttribute("aria-busy");
  }).catch((error) => {
    console.error("Admissions transmission failed", error);
    formError.textContent = "Chưa thể gửi dữ liệu. Vui lòng thử lại hoặc gọi hotline 0911 267 755.";
    formError.hidden = false;
    submit.disabled = false;
    submit.textContent = intent === "visit" ? "Gửi yêu cầu tham quan" : intent === "apply" ? "Bắt đầu dự tuyển" : "Gửi nhu cầu";
    form.removeAttribute("aria-busy");
  });
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
