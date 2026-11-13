const esc = window.esc || ((value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])));
const DATA = window.VAS_DECISION_DATA;
const track = (event, detail = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...detail }); };

const HUB_ITEMS = [
  { id: "quy-trinh", title: "Quy trình tuyển sinh", desc: "Ba bước rõ ràng từ đăng ký đến nhập học.", icon: "01" },
  { id: "hoc-phi", title: "Học phí", desc: "Ước tính theo cấp lớp, chương trình và cơ sở.", icon: "02" },
  { id: "dieu-kien", title: "Điều kiện nhập học", desc: "Đánh giá năng lực theo từng cấp học và chương trình.", icon: "03" },
  { id: "faq", title: "Câu hỏi thường gặp", desc: "Những điều phụ huynh cần biết trước khi lựa chọn VAS.", icon: "04" },
  { id: "ung-tuyen", title: "Nộp hồ sơ trực tuyến", desc: "Năm bước, lưu nháp được, nhận mã hồ sơ ngay.", icon: "05" },
  { id: "ho-so-cua-toi", title: "Hồ sơ của tôi", desc: "Xem, chỉnh sửa bản nháp hoặc rút hồ sơ.", icon: "06" },
  { id: "dang-ky", title: "Nhận tư vấn", desc: "Gửi câu hỏi cho đội ngũ tuyển sinh.", icon: "07" },
];
const STEPS = [
  ["01", "Đăng ký dự tuyển", "Phụ huynh đăng ký thông tin và nhận tư vấn về cấp học, chương trình và cơ sở phù hợp."],
  ["02", "Đánh giá năng lực đầu vào", "Mầm non: khảo sát phù hợp độ tuổi. Tiểu học và Trung học: đánh giá theo yêu cầu từng chương trình."],
  ["03", "Hoàn tất nhập học", "Giữ chỗ → hoàn thành học phí → hoàn tất hồ sơ → nhận lớp và chuẩn bị ngày đầu tiên."],
];
const JOURNEY = [
  ["01", "Tìm hiểu", "Đặt câu hỏi và nhận tư vấn"],
  ["02", "Tham quan", "Đến trường và gặp đội ngũ"],
  ["03", "Dự tuyển", "Bắt đầu hồ sơ của học sinh"],
  ["04", "Đánh giá", "Kiểm tra năng lực đầu vào"],
  ["05", "Kết quả", "Nhận thông tin và bước tiếp theo"],
  ["06", "Nhập học", "Hoàn tất hồ sơ và học phí"],
  ["07", "Ngày đầu tiên", "Sẵn sàng bắt đầu tại VAS"],
];
const REQS = [
  "Học sinh không nhất thiết phải giỏi tiếng Anh ngay từ đầu; VAS có các hình thức hỗ trợ để con thích nghi và phát triển theo lộ trình.",
  "Đánh giá đầu vào theo cấp học giúp xác định mức độ phù hợp với chương trình, không nhằm tạo thêm áp lực.",
  "Gia đình có thể lựa chọn CEP, CAP hoặc CAPI theo năng lực, sở thích và định hướng học tập của học sinh.",
  "Yêu cầu chi tiết có thể thay đổi theo cấp học và chính sách từng thời điểm; đội ngũ tuyển sinh sẽ tư vấn theo từng trường hợp.",
];
const FAQ = [
  ["Con tôi nên chọn CEP, CAP hay CAPI?", "Tùy mục tiêu học tập, năng lực và định hướng tương lai của học sinh. Ba lộ trình phục vụ các nhu cầu khác nhau, không phải thứ hạng tốt hơn hay kém hơn."],
  ["Cơ sở nào có cấp học và lộ trình của con?", "Gia đình có thể dùng Tìm lộ trình hoặc Tìm cơ sở để lọc theo cấp học và chương trình trước khi đặt lịch tham quan."],
  ["Có thể tham quan trường trước khi đăng ký không?", "Có. Phụ huynh có thể chọn cơ sở, ngày và khung giờ mong muốn ngay trong form tham quan."],
  ["Học phí bao gồm những gì?", "Học phí phụ thuộc cấp/lớp, lộ trình, cơ sở và hình thức thanh toán. Công cụ trên trang giúp gia đình hình dung mức chi phí trước khi trao đổi chi tiết."],
  ["Sau khi gửi form thì bước tiếp theo là gì?", "Đội ngũ tuyển sinh sẽ xác nhận nhu cầu, tư vấn lựa chọn phù hợp và hướng dẫn bước tiếp theo theo từng trường hợp."],
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
  visit: "Gửi mong muốn tham quan để được gọi lại, hoặc chọn ngay khung giờ còn trống tại trang Đặt lịch tham quan.",
  apply: "Gửi nhu cầu dự tuyển để được hướng dẫn, hoặc nộp hồ sơ đầy đủ ở mục Hồ sơ dự tuyển trực tuyến phía trên.",
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
  if (intent === "visit") intentDescription.insertAdjacentHTML("beforeend", ' <a href="../dat-lich-tham-quan/">Chọn khung giờ →</a>');
  if (intent === "apply") intentDescription.insertAdjacentHTML("beforeend", ' <a href="#ung-tuyen">Mở hồ sơ trực tuyến →</a>');
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
  formError.setAttribute("role", "alert");
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
    schemaVersion: form.dataset.formVersion || "admissions-v2",
    submittedAt,
    transmission: "prototype",
    source: query.get("source") || "prototype-site",
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
  };
};
const transmitLead = async (lead) => {
  const endpoint = form.dataset.endpoint || window.VAS_ADMISSIONS_ENDPOINT;
  if (!endpoint) {
    const proto = window.VASProto;
    if (!proto) throw new Error("Prototype store unavailable");
    await proto.request(() => proto.store.upsert("inquiries", { ...lead, ref: lead.ref }));
    return { status: "prototype", message: proto.PROTOTYPE_NOTE };
  }
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(lead), keepalive: true });
  if (!response.ok) throw new Error(`Admissions endpoint returned ${response.status}`);
  return { status: "remote", message: "Thông tin đã được chuyển tới hệ thống tuyển sinh." };
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
  if (intent === "visit" && !form.elements.date.value) return showError("Vui lòng chọn ngày mong muốn.", form.elements.date);
  if (intent === "visit" && !form.elements.time.value) return showError("Vui lòng chọn khung giờ mong muốn.", form.elements.time);
  if (intent === "apply" && !form.elements.program.value) return showError("Vui lòng chọn lộ trình quan tâm.", form.elements.program);
  if (!consent.checked) return showError("Vui lòng xác nhận đồng ý để VAS liên hệ.", consent);
  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true;
  submit.innerHTML = '<span class="prototype-spinner" aria-hidden="true"></span> Đang gửi…';
  form.setAttribute("aria-busy", "true");
  const lead = buildLeadPayload();
  lead.ref = window.VASProto ? window.VASProto.ref("TV") : `TV-${Date.now()}`;
  transmitLead(lead).then((result) => {
    lead.transmission = result.status;
    lead.transmittedAt = new Date().toISOString();
    window.__REDESIGNVAS_LAST_ADMISSIONS_PAYLOAD__ = lead;
    form.querySelectorAll("input, select, textarea, button, .form-progress, .intent-switch, .intent-description").forEach((control) => { control.hidden = true; });
    formMsg.hidden = false;
    const title = intent === "visit" ? "Đã nhận yêu cầu tham quan VAS." : intent === "apply" ? "Đã bắt đầu hồ sơ dự tuyển." : "Đã nhận nhu cầu tư vấn.";
    formMsg.innerHTML = `<strong>${title}</strong><span>Mã yêu cầu: <b data-ref>${esc(lead.ref)}</b></span><span class="form-proto-note">${esc(result.message)}</span><span>Khi kết nối hệ thống thật, chúng tôi sẽ dùng lựa chọn <b>${esc(lead.preferences.programmeCode || "chương trình phù hợp")}</b>${lead.preferences.campusName ? ` tại <b>${esc(lead.preferences.campusName)}</b>` : ""} để chuẩn bị bước tiếp theo.</span><span class="success-actions"><a class="btn btn-light" href="../find-my-path/?grade=${encodeURIComponent(state.grade || "3")}&program=${encodeURIComponent(state.program || "cap")}">Xem lại lộ trình</a><a class="btn btn-outline-light" href="../co-so/#tim-co-so">Xem cơ sở</a><a class="btn btn-outline-light" href="#hoc-phi">Ước tính học phí</a><button type="button" class="btn btn-outline-light" id="leadAgain">Gửi nhu cầu khác</button></span>`;
    document.getElementById("leadAgain").addEventListener("click", () => {
      form.reset();
      form.querySelectorAll("input, select, textarea, button, .form-progress, .intent-switch, .intent-description, .phase3-form-meter").forEach((control) => { control.hidden = false; });
      document.getElementById("visitFields").hidden = intent !== "visit";
      formMsg.hidden = true;
      formError.hidden = true;
      submit.disabled = false;
      setIntent(intent);
      form.elements.name.focus();
    });
    track(intent === "visit" ? "tour_submit" : intent === "apply" ? "apply_start" : "inquiry_submit", { lead });
    form.removeAttribute("aria-busy");
  }).catch((error) => {
    console.warn("Admissions transmission failed", error.message);
    formError.textContent = `${error.message || "Chưa thể gửi yêu cầu."} Thông tin bạn nhập vẫn còn nguyên, hãy bấm gửi lại.`;
    formError.hidden = false;
    submit.disabled = false;
    submit.textContent = intent === "visit" ? "Gửi yêu cầu tham quan" : intent === "apply" ? "Bắt đầu dự tuyển" : "Gửi nhu cầu";
    form.removeAttribute("aria-busy");
  });
});

/* Ước tính học phí: xem assets/vas-prototype-flows.js (dùng bảng phí trong vas-prototype-data.js). */
