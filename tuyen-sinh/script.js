const HUB_ITEMS = [
  { id: "quy-trinh", title: "Quy trình tuyển sinh", desc: "3 bước rõ ràng từ đăng ký đến nhập học.", icon: "01" },
  { id: "hoc-phi", title: "Học phí", desc: "Tra cứu theo cấp lớp, chương trình và cơ sở cho năm học 2026–2027.", icon: "02" },
  { id: "dieu-kien", title: "Điều kiện nhập học", desc: "Đánh giá năng lực theo từng cấp học và chương trình.", icon: "03" },
  { id: "faq", title: "Câu hỏi thường gặp", desc: "Những điều phụ huynh cần biết trước khi lựa chọn VAS.", icon: "04" },
  { id: "dang-ky", title: "Đặt lịch tham quan", desc: "Đến VAS, xem thực tế và nhận tư vấn trực tiếp.", icon: "05" },
];

const STEPS = [
  ["01", "Đăng ký dự tuyển", "Phụ huynh đăng ký thông tin và nhận tư vấn về cấp học, chương trình và cơ sở phù hợp."],
  ["02", "Kiểm tra kiến thức & năng lực đầu vào", "Mầm non: khảo sát tâm lý. Tiểu học và Trung học: Tiếng Anh, Tiếng Việt, Toán."],
  ["03", "Hoàn tất hồ sơ nhập học", "Đăng ký giữ chỗ → hoàn thành học phí → hoàn tất hồ sơ → nhận lớp và nhập học."],
];

const JOURNEY = [
  ["01", "Khám phá", "Tìm hiểu chương trình & cơ sở"],
  ["02", "Tham quan", "Đến trường và gặp đội ngũ tư vấn"],
  ["03", "Đánh giá", "Kiểm tra năng lực đầu vào"],
  ["04", "Lựa chọn", "Xác định chương trình phù hợp"],
  ["05", "Nhập học", "Hoàn tất hồ sơ & nhận lớp"],
];

const REQS = [
  "Học sinh không nhất thiết phải giỏi tiếng Anh ngay từ đầu; VAS có các hình thức hỗ trợ để con thích nghi và phát triển theo lộ trình.",
  "Đánh giá đầu vào theo cấp học giúp xác định mức độ phù hợp với chương trình, không nhằm tạo thêm áp lực.",
  "Gia đình có thể lựa chọn CEP, CAP hoặc CAPI theo năng lực, sở thích và định hướng học tập của học sinh.",
  "Học sinh có thể chuyển đổi lộ trình khi năng lực hoặc định hướng thay đổi, nếu đáp ứng yêu cầu của chương trình mới.",
];

const FAQ = [
  ["Con cần giỏi tiếng Anh mới vào VAS không?", "Không nhất thiết. Nhà trường có đánh giá đầu vào và các hình thức hỗ trợ để học sinh thích nghi với chương trình."],
  ["Con nên chọn CEP, CAP hay CAPI?", "Tùy mục tiêu học tập, năng lực và định hướng tương lai của học sinh. Ba lộ trình có mức độ tích hợp chương trình Cambridge khác nhau."],
  ["Con có thể chuyển chương trình sau khi nhập học không?", "Có, khi định hướng thay đổi và học sinh đáp ứng yêu cầu của lộ trình mới."],
  ["Bằng VAS có thể dùng để vào đại học Việt Nam không?", "Học sinh theo chương trình MOET vẫn có thể tham gia kỳ thi và xét tuyển đại học tại Việt Nam; các bằng Cambridge cũng mở thêm lựa chọn quốc tế."],
  ["Có thể tham quan trường trước khi đăng ký không?", "Có. VAS khuyến khích phụ huynh tham quan thực tế và liên hệ để được tư vấn chương trình, lộ trình phù hợp."],
];

document.getElementById("admissionsHub").innerHTML = HUB_ITEMS.map((item) => `
  <a class="hub-item" href="#${esc(item.id)}">
    <span class="hub-icon">${esc(item.icon)}</span>
    <span class="hub-copy"><strong>${esc(item.title)}</strong><small>${esc(item.desc)}</small></span>
    <span class="hub-arrow" aria-hidden="true">→</span>
  </a>`).join("");

document.getElementById("stepsGrid").innerHTML = STEPS.map(([n, t, d]) => `
  <article class="step"><span class="n">${esc(n)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join("");

document.getElementById("journeyGrid").innerHTML = JOURNEY.map(([n, t, d], index) => `
  <div class="journey-item"><span class="journey-number">${esc(n)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>${index < JOURNEY.length - 1 ? '<span class="journey-arrow" aria-hidden="true">↓</span>' : ''}</div>`).join("");

document.getElementById("reqList").innerHTML = REQS.map((r) => `<li>${esc(r)}</li>`).join("");

document.getElementById("faqList").innerHTML = FAQ.map(([q, a]) => `
  <details><summary>${esc(q)} <span class="mk" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join("");

/* form */
const form = document.getElementById("enquiryForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  document.getElementById("formMsg").hidden = false;
  form.querySelectorAll("input,select,textarea,button").forEach((c) => { if (c.type !== "reset") c.disabled = true; });
});
