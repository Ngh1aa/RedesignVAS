/* Trang Tuyển sinh */
const STEPS = [
  ["01", "Chia sẻ về con của bạn", "Một cuộc trò chuyện ngắn về độ tuổi, sở thích và điểm xuất phát của con."],
  ["02", "Khám phá lộ trình phù hợp", "Chúng tôi giúp bạn hiểu rõ CAPI, CAP và CEP — và đâu là lựa chọn hợp với gia đình."],
  ["03", "Tham quan cơ sở", "Ghé thăm lớp học, gặp gỡ thầy cô và cảm nhận cộng đồng bằng chính trải nghiệm của bạn."],
  ["04", "Gặp gỡ đội ngũ tuyển sinh", "Giải đáp rõ ràng về đánh giá đầu vào, học phí và các mốc thời gian quan trọng."],
  ["05", "Bắt đầu hành trình VAS", "Chúng tôi mong được chào đón gia đình bạn."],
];

const PRICING = [
  { code: "CEP", name: "Tiếng Anh Cambridge", note: "Nền tảng tiếng Anh", amt: "Liên hệ", pts: ["Chương trình quốc gia Việt Nam", "Tiếng Anh Cambridge tăng cường", "Đầy đủ hoạt động ngoại khóa"] },
  { code: "CAP", name: "Song ngữ Cambridge", note: "Lộ trình cân bằng", amt: "Liên hệ", feature: true, pts: ["~50% chương trình bằng tiếng Anh", "Kết hợp chương trình quốc gia & Cambridge", "Chứng chỉ Cambridge quốc tế", "Cố vấn hướng nghiệp"] },
  { code: "CAPI", name: "Cambridge Toàn phần", note: "Quốc tế nhất", amt: "Liên hệ", pts: ["Đến 70% chương trình bằng tiếng Anh", "Định hướng đại học nước ngoài", "Cambridge IGCSE & A Level", "Luyện IELTS & hồ sơ du học"] },
];

const REQS = [
  "Phù hợp độ tuổi từng cấp học (Mầm non 2 tuổi trở lên).",
  "Buổi gặp gỡ / đánh giá đầu vào nhẹ nhàng để hiểu con, không tạo áp lực.",
  "Hồ sơ cơ bản: giấy khai sinh, học bạ (nếu có), ảnh thẻ.",
  "Với lộ trình CAPI/CAP: đánh giá năng lực tiếng Anh để xếp lớp phù hợp.",
];

const FAQ = [
  ["Khi nào có thể nộp hồ sơ?", "VAS tuyển sinh quanh năm, tùy tình trạng chỗ trống của từng khối lớp và cơ sở. Bạn nên liên hệ sớm để được tư vấn thời điểm phù hợp nhất."],
  ["Con tôi chưa giỏi tiếng Anh, có theo được không?", "Hoàn toàn được. Lộ trình CEP và CAP được thiết kế để xây dựng nền tảng tiếng Anh từng bước, phù hợp với học sinh xuất phát ở nhiều trình độ khác nhau."],
  ["Học phí đã bao gồm những gì?", "Học phí và các khoản phí đi kèm khác nhau theo lộ trình, cấp học và cơ sở. Đội ngũ tuyển sinh sẽ cung cấp bảng chi tiết minh bạch khi bạn liên hệ."],
  ["Tôi có thể tham quan trước khi quyết định không?", "Chắc chắn. Chúng tôi khuyến khích mọi gia đình đặt lịch tham quan cá nhân để trực tiếp cảm nhận lớp học, gặp gỡ thầy cô và cộng đồng VAS."],
];

document.getElementById("stepsGrid").innerHTML = STEPS.map(([n, t, d]) => `
  <div class="step"><span class="n">${esc(n)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></div>`).join("");

document.getElementById("priceGrid").innerHTML = PRICING.map((p) => `
  <article class="price ${p.feature ? "feature-price" : ""}">
    <span class="code">${esc(p.code)}</span>
    <span class="tagname">${esc(p.name)} · ${esc(p.note)}</span>
    <div class="amt">${esc(p.amt)} <span>báo giá theo cơ sở</span></div>
    <ul class="pts">${p.pts.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <a href="#dang-ky" class="btn ${p.feature ? "btn-light" : "btn-outline"}">Nhận báo giá</a>
  </article>`).join("");

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
