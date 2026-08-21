/* Trang Về VAS — nội dung động */
const VALUES = [
  { ic: "◆", t: "Tôn trọng", d: "Trân trọng cá tính, gốc rễ và tốc độ phát triển riêng của mỗi học sinh." },
  { ic: "✦", t: "Chính trực", d: "Nuôi dưỡng sự trung thực, trách nhiệm và lòng tự trọng ở người trẻ." },
  { ic: "❖", t: "Ham học hỏi", d: "Khơi dậy sự tò mò và niềm vui khám phá suốt đời." },
  { ic: "✧", t: "Bản sắc Việt", d: "Vươn ra thế giới với niềm tự hào sâu sắc về nơi mình sinh ra." },
];

const HISTORY = [
  { yr: "2004", h: "VAS ra đời", p: "Cơ sở đầu tiên khai giảng, mang chương trình song ngữ chuẩn quốc tế đến TP.HCM." },
  { yr: "2010", h: "Mở rộng hệ thống", p: "Nhiều cơ sở mới được thành lập, phục vụ cộng đồng phụ huynh ngày càng lớn." },
  { yr: "2015", h: "Chuẩn Cambridge toàn diện", p: "Triển khai đầy đủ ba lộ trình CAPI, CAP, CEP xuyên suốt các cấp học." },
  { yr: "2020", h: "Dẫn đầu khối song ngữ", p: "Trở thành hệ thống chuẩn Cambridge lớn nhất TP.HCM với thành tích học sinh nổi bật." },
  { yr: "2026", h: "Gần 8.000 học sinh", p: "6 cơ sở trên khắp thành phố, cựu học sinh theo học tại 200+ đại học toàn cầu." },
];

const STATS = [
  { n: 20, s: " năm", l: "dẫn đầu khối song ngữ" },
  { n: 6, s: " cơ sở", l: "trên khắp TP.HCM" },
  { n: 8000, s: "+", l: "học sinh mỗi năm học" },
  { n: 200, s: "+", l: "điểm đến đại học toàn cầu" },
];

const PEOPLE = [
  { name: "TS. Emma Whitfield", role: "Trưởng Chương trình Cambridge", exp: "18 năm · Cambridge, Anh Quốc", img: "1581065178047-8ee15951ede6" },
  { name: "Cô Nguyễn Thu Hà", role: "Trưởng khối Tiểu học · Riverside", exp: "14 năm · Mầm non & Tiểu học", img: "1573496527892-904f897eb744" },
  { name: "Thầy James Okoro", role: "Cố vấn Đại học & Hướng nghiệp", exp: "12 năm · Tuyển sinh toàn cầu", img: "1590650213165-c1fef80648c4" },
];

document.getElementById("valueGrid").innerHTML = VALUES.map((v) => `
  <article class="feature">
    <span class="ic">${v.ic}</span>
    <h3>${esc(v.t)}</h3><p>${esc(v.d)}</p>
  </article>`).join("");

document.getElementById("historyList").innerHTML = HISTORY.map((h) => `
  <li><span class="dot"><i></i></span>
    <span class="yr">${esc(h.yr)}</span>
    <h4>${esc(h.h)}</h4><p>${esc(h.p)}</p>
  </li>`).join("");

document.getElementById("statGrid").innerHTML = STATS.map((s) => `
  <div class="stat-cell">
    <div class="stat-num" data-count="${s.n}" data-suffix="${esc(s.s)}">0</div>
    <p>${esc(s.l)}</p>
  </div>`).join("");

document.getElementById("peopleGrid").innerHTML = PEOPLE.map((m) => `
  <article class="person">
    <div class="pic"><img src="${img(m.img, 720, 900)}" alt="Chân dung ${esc(m.name)}" loading="lazy" /></div>
    <div class="body">
      <p class="name">${esc(m.name)}</p>
      <p class="role">${esc(m.role)}</p>
      <p class="exp">${esc(m.exp)}</p>
    </div>
  </article>`).join("");
