/* Trang Về VAS — nội dung động */
const VALUES = [
  { ic: "01", t: "Tự tin", d: "Đương đầu thử thách và mạnh dạn thể hiện quan điểm." },
  { ic: "02", t: "Xuất sắc", d: "Đặt ra và theo đuổi những tiêu chuẩn cao." },
  { ic: "03", t: "Chính trực", d: "Trung thực, có trách nhiệm và giữ lời cam kết." },
  { ic: "04", t: "Tự hào dân tộc", d: "Hiểu và trân trọng di sản, văn hóa và ngôn ngữ Việt Nam." },
  { ic: "05", t: "Đam mê", d: "Nuôi dưỡng tinh thần học tập và khám phá suốt đời." },
  { ic: "06", t: "Tôn trọng", d: "Chấp nhận sự khác biệt và tôn trọng cộng đồng." },
  { ic: "07", t: "Đồng đội", d: "Hợp tác, truyền cảm hứng và phát triển tố chất lãnh đạo." },
];

const HISTORY = [
  { yr: "2004", h: "VAS ra đời", p: "Bắt đầu với 430 học sinh, VAS đặt nền móng cho mô hình giáo dục song ngữ kết hợp Chương trình Giáo dục Quốc gia Việt Nam với chương trình Cambridge." },
  { yr: "2024", h: "Một cộng đồng đang lớn lên", p: "VAS đạt gần 8.000 học sinh tại 6 cơ sở và cung cấp 3 lộ trình học tập xuyên suốt từ Mầm non đến lớp 12: CEP, CAP và CAPI." },
  { yr: "2025–2026", h: "Bằng chứng, không phải lời nói", p: "Học sinh VAS đạt hơn 2.600 giải thưởng, hơn 150 suất học bổng đại học trị giá 6,47 triệu USD và thêm 2 danh hiệu Top in Vietnam Cambridge." },
  { yr: "Tiếp nối", h: "Sẵn sàng tạo nên thay đổi", p: "VAS tiếp tục nuôi dưỡng những công dân toàn cầu vững vàng về học thuật, giàu bản sắc Việt và có trách nhiệm với cộng đồng." },
];

const STATS = [
  { n: 2600, s: "+", l: "Giải thưởng trong nước & quốc tế" },
  { n: 150, s: "+", l: "Suất học bổng đại học" },
  { value: "6,47 triệu USD", l: "Tổng giá trị học bổng 2025–2026" },
  { n: 2, s: "", l: "Danh hiệu Top in Vietnam Cambridge" },
];

const JOURNEY = [
  { step: "01", t: "Khám phá bản thân", d: "Khảo sát tính cách và thiên hướng nghề nghiệp." },
  { step: "02", t: "Định hướng", d: "Làm việc cùng chuyên gia tư vấn để hiểu rõ năng lực và sở thích." },
  { step: "03", t: "Lập kế hoạch", d: "Xây dựng kế hoạch học tập theo mục tiêu tương lai." },
  { step: "04", t: "Khám phá đại học", d: "Tìm hiểu trường, ngành và yêu cầu tuyển sinh phù hợp." },
  { step: "05", t: "Chinh phục", d: "Hoàn thiện hồ sơ và chuẩn bị chiến lược học bổng." },
];

const PEOPLE = [
  { name: "Hơn 1.000 giáo viên", role: "Trong và ngoài nước", exp: "Chuyên môn quốc tế · Am hiểu giáo dục Việt Nam", img: "1524178232363-1fb2b075b655" },
  { name: "Trung tâm đào tạo giáo viên quốc tế", role: "Đối tác Cambridge được ủy quyền", exp: "Phát triển năng lực giáo viên tại Việt Nam", img: "1524178923640-23b2e4c7b4f6" },
  { name: "XCL Education", role: "Hệ thống giáo dục tại Đông Nam Á", exp: "Nuôi dưỡng học thuật · kỹ năng · sự đồng cảm", img: "1546410531-bb4caa6b424d" },
];

document.getElementById("valueGrid").innerHTML = VALUES.map((v) => `
  <article class="feature">
    <span class="ic">${esc(v.ic)}</span>
    <h3>${esc(v.t)}</h3><p>${esc(v.d)}</p>
  </article>`).join("");

document.getElementById("historyList").innerHTML = HISTORY.map((h) => `
  <li><span class="dot"><i></i></span>
    <span class="yr">${esc(h.yr)}</span>
    <h4>${esc(h.h)}</h4><p>${esc(h.p)}</p>
  </li>`).join("");

document.getElementById("statGrid").innerHTML = STATS.map((s) => `
  <div class="stat-cell">
    ${s.value ? `<div class="stat-num stat-static">${esc(s.value)}</div>` : `<div class="stat-num" data-count="${s.n}" data-suffix="${esc(s.s)}">0</div>`}
    <p>${esc(s.l)}</p>
  </div>`).join("");

document.getElementById("journeyList").innerHTML = JOURNEY.map((j) => `
  <li><span class="step">${esc(j.step)}</span><div><h3>${esc(j.t)}</h3><p>${esc(j.d)}</p></div></li>`).join("");

document.getElementById("peopleGrid").innerHTML = PEOPLE.map((m) => `
  <article class="person">
    <div class="pic"><img src="${img(m.img, 720, 900)}" alt="${esc(m.name)}" loading="lazy" /></div>
    <div class="body">
      <p class="name">${esc(m.name)}</p>
      <p class="role">${esc(m.role)}</p>
      <p class="exp">${esc(m.exp)}</p>
    </div>
  </article>`).join("");
