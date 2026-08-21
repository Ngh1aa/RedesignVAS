/* ================= data ================= */
const img = (id, w, h) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const MENU = {
  "Về VAS": {
    heading: "20 năm dẫn đầu khối song ngữ",
    note: "Bằng chứng, không phải lời nói.",
    links: ["Câu chuyện VAS", "Ban lãnh đạo", "Đội ngũ giáo viên", "Thành tích học sinh", "Lộ trình vào đại học", "Giá trị cốt lõi"],
  },
  "Chương trình": {
    heading: "Hành trình xuyên cấp 16 năm",
    note: "Một lộ trình liền mạch, từ Mầm non đến Lớp 12.",
    links: ["Mầm non", "Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Cambridge toàn phần (CAPI)", "Song ngữ Cambridge (CAP)", "Tiếng Anh Cambridge (CEP)"],
  },
  "Các cơ sở": {
    heading: "6 cơ sở trên khắp TP.HCM",
    note: "Tìm cơ sở phù hợp với gia đình bạn.",
    links: ["Tất cả cơ sở", "Ba Tháng Hai", "Riverside", "Sunrise", "Sala", "Garden Hills", "Hoàng Văn Thụ"],
  },
  "Tuyển sinh": {
    heading: "Bước tiếp theo bắt đầu từ đây",
    note: "Rõ ràng, ấm áp và không áp lực.",
    links: ["Quy trình tuyển sinh", "Học phí", "Điều kiện nhập học", "Câu hỏi thường gặp", "Đặt lịch tham quan"],
  },
  "Tin tức": {
    heading: "Câu chuyện & sự kiện tại VAS",
    note: "Những điều đang diễn ra trong cộng đồng VAS.",
    links: ["Tin tức mới nhất", "Sự kiện sắp tới", "Câu chuyện học sinh", "Hoạt động ngoại khóa", "Thư viện ảnh"],
  },
  "Vòng quanh VAS": {
    heading: "Một ngày của con tại VAS",
    note: "Cảm nhận không gian học tập trước khi ghé thăm.",
    links: ["Đời sống học đường", "Thể thao", "Nghệ thuật", "Câu lạc bộ", "Cộng đồng", "Chăm sóc học sinh"],
  },
};

const PROOF = [
  { n: 20, suffix: " năm", label: "dẫn đầu khối song ngữ", note: "Kể từ 2004, lớn lên cùng các gia đình Việt." },
  { n: 6, suffix: " cơ sở", label: "trên khắp TP.HCM", note: "Luôn có một cộng đồng VAS gần bạn." },
  { n: 8000, suffix: "+", label: "học sinh mỗi năm học", note: "Một trong những cộng đồng trường học lớn nhất." },
  { n: 16, suffix: " năm", label: "học xuyên cấp liền mạch", note: "Một lộ trình, từ Mầm non đến Lớp 12." },
];

const DIFF = [
  { t: "Chuẩn Cambridge", d: "Chương trình được công nhận toàn cầu, mở ra cánh cửa đến các đại học trên khắp thế giới.", img: "1758685734062-165cc0094e61" },
  { t: "Tiềm năng cá nhân", d: "Mỗi đứa trẻ học theo một cách riêng. Chúng tôi tạo không gian và sự hỗ trợ để con phát triển.", img: "1581726707445-75cbe4efc586" },
  { t: "Giáo dục song ngữ", d: "Thành thạo cả tiếng Anh và tiếng Việt — tầm nhìn toàn cầu, giữ vững gốc rễ quê hương.", img: "1561089489-f13d5e730d72" },
  { t: "Bản sắc Việt Nam", d: "Tự tin bước ra thế giới, với niềm tự hào sâu sắc về nơi mình sinh ra.", img: "1677128346173-f460d0e2560a" },
];

const STAGES = [
  { age: "2–5 tuổi", t: "Mầm non", d: "Vui chơi, tò mò và niềm vui của những khám phá đầu đời." },
  { age: "6–10 tuổi", t: "Tiểu học", d: "Nền tảng vững chắc về ngôn ngữ, tư duy và nhân cách." },
  { age: "11–14 tuổi", t: "Trung học cơ sở", d: "Sự tò mò được rèn thành bản lĩnh học thuật thực thụ." },
  { age: "15–18 tuổi", t: "Trung học phổ thông", d: "Chứng chỉ Cambridge và con đường vào đại học." },
];

const PROGRAMMES = [
  { code: "CAPI", name: "Chương trình Cambridge Toàn phần", tag: "Quốc tế nhất", english: "Đến 70% bằng tiếng Anh", d: "Mức độ hội nhập quốc tế cao nhất tại VAS — lộ trình Cambridge dành cho các gia đình hướng đến những đại học hàng đầu ở nước ngoài, với tiếng Anh xuyên suốt mọi môn học.", for: "Học sinh hướng tới nền giáo dục toàn cầu, ưu tiên tiếng Anh." },
  { code: "CAP", name: "Chương trình Song ngữ Cambridge", tag: "Lộ trình cân bằng", english: "~50% bằng tiếng Anh", d: "Lộ trình song ngữ cân bằng, kết hợp trọn vẹn chương trình quốc gia Việt Nam với các môn Cambridge — vừa vững gốc rễ, vừa vươn tầm quốc tế.", for: "Gia đình muốn con vừa giỏi tiếng Việt vừa hội nhập quốc tế." },
  { code: "CEP", name: "Chương trình Tiếng Anh Cambridge", tag: "Nền tảng tiếng Anh", english: "Tiếng Anh tăng cường", d: "Chương trình quốc gia Việt Nam được làm giàu bằng chương trình Tiếng Anh Cambridge chuẩn mực — xây dựng khả năng giao tiếp tự tin ngay từ những ngày đầu.", for: "Học sinh từng bước tiến tới học tập quốc tế theo thời gian." },
];

const PEOPLE = [
  { name: "TS. Emma Whitfield", role: "Trưởng Chương trình Cambridge", exp: "18 năm · Cambridge, Anh Quốc", quote: "Nhiệm vụ của tôi là giúp mỗi học sinh tìm ra câu hỏi khiến em bừng sáng.", img: "1581065178047-8ee15951ede6" },
  { name: "Cô Nguyễn Thu Hà", role: "Trưởng khối Tiểu học · Riverside", exp: "14 năm · Mầm non & Tiểu học", quote: "Sự tự tin của con bắt đầu từ cảm giác được thấu hiểu và yêu thương.", img: "1573496527892-904f897eb744" },
  { name: "Thầy James Okoro", role: "Cố vấn Đại học & Hướng nghiệp", exp: "12 năm · Tuyển sinh toàn cầu", quote: "Chúng tôi vạch lối đến đúng ngôi trường — không chỉ một cái tên nổi tiếng.", img: "1590650213165-c1fef80648c4" },
];

const DAY = [
  ["07:30", "Đến trường & lời chào buổi sáng"],
  ["08:00", "Các tiết học chính khóa"],
  ["10:30", "Giờ ra chơi & vui chơi tự do"],
  ["11:00", "Học qua dự án & tìm tòi"],
  ["12:30", "Bữa trưa cùng bạn bè"],
  ["14:00", "Thí nghiệm, ngôn ngữ & nghệ thuật"],
  ["15:30", "Thể thao, âm nhạc & câu lạc bộ"],
  ["17:00", "Về nhà, háo hức kể chuyện một ngày"],
];

const CAMPUSES = [
  { name: "Ba Tháng Hai", district: "Quận 10", ages: "2–18 tuổi", img: "1786013522160-00ac876da3ab", note: "Cơ sở chính, trụ sở của hệ thống ngay trung tâm thành phố." },
  { name: "Riverside", district: "Quận 7", ages: "2–18 tuổi", img: "1781877641721-dc3d4974bf25", note: "Không gian ven sông yên bình với cơ sở vật chất quốc tế." },
  { name: "Sunrise", district: "Quận 7", ages: "2–18 tuổi", img: "1780247723262-bf9fab11592c", note: "Không gian hiện đại, tươi sáng tại khu Phú Mỹ Hưng." },
  { name: "Sala", district: "TP. Thủ Đức", ages: "2–15 tuổi", img: "1764943630631-b63aadf86e19", note: "Cơ sở mới tại khu đô thị Sala hiện đại." },
  { name: "Garden Hills", district: "Gò Vấp", ages: "2–18 tuổi", img: "1772551419793-75c00555bf7b", note: "Khuôn viên xanh, rộng rãi cho cộng đồng xuyên cấp." },
  { name: "Hoàng Văn Thụ", district: "Phú Nhuận", ages: "2–11 tuổi", img: "1781032161857-41214c66559f", note: "Khởi đầu êm đềm cho khối Mầm non và Tiểu học." },
];

const STORIES = [
  { name: "Minh Anh", grade: "Lớp 11 · Riverside", quote: "Em đã tìm thấy đam mê với robotics tại VAS.", img: "1673533582990-3542202b0a8f" },
  { name: "Đức Huy", grade: "Lớp 12 · Ba Tháng Hai", quote: "Thầy cô giúp em tin rằng mình có thể du học ngành y.", img: "1698072556956-1a5d2307a7a1" },
  { name: "Gia Bảo", grade: "Lớp 9 · Garden Hills", quote: "Trên sân bóng là nơi em học được cách dẫn dắt.", img: "1626788215369-3ba6c6ae88c0" },
];

const OUTCOMES = [
  { n: 200, suffix: "+", l: "điểm đến đại học trên toàn cầu" },
  { n: 15, suffix: " triệu USD", l: "học bổng cựu học sinh giành được" },
  { n: 95, suffix: "%", l: "học sinh vào đúng lộ trình mong muốn" },
];

const VOICES = [
  { stage: "Phụ huynh nổi tiếng", quote: "Điều chúng tôi trân trọng nhất ở VAS là sự tận tâm của giáo viên và cách trường giúp các con phát triển kỹ năng mềm một cách rất tự nhiên.", name: "Diễn viên Đinh Ngọc Diệp · phu nhân đạo diễn Victor Vũ" },
  { stage: "Tiểu học", quote: "Tôi từng lo con mình lạc lõng trong một ngôi trường lớn. Nhưng thầy cô hiểu con hơn cả tôi mong đợi — sáng nào con cũng háo hức đến trường.", name: "Chị Lan · phụ huynh cơ sở Sunrise" },
  { stage: "Trung học", quote: "Chương trình song ngữ giúp con gái tôi tự tin tiếng Anh mà không hề đánh mất tiếng Việt. Sự cân bằng đó chính là điều gia đình tôi tìm kiếm.", name: "Anh Tuấn · phụ huynh cơ sở Riverside" },
];

const STEPS = [
  ["01", "Chia sẻ về con của bạn", "Một cuộc trò chuyện ngắn về độ tuổi, sở thích và điểm xuất phát của con."],
  ["02", "Khám phá lộ trình phù hợp", "Chúng tôi giúp bạn hiểu rõ CAPI, CAP và CEP — và đâu là lựa chọn hợp với gia đình."],
  ["03", "Tham quan cơ sở", "Ghé thăm lớp học, gặp gỡ thầy cô và cảm nhận cộng đồng bằng chính trải nghiệm của bạn."],
  ["04", "Gặp gỡ đội ngũ tuyển sinh", "Giải đáp rõ ràng về đánh giá đầu vào, học phí và các mốc thời gian quan trọng."],
  ["05", "Bắt đầu hành trình VAS", "Chúng tôi mong được chào đón gia đình bạn."],
];

const NEWS = [
  { tag: "Sự kiện", date: "18/08/2026", title: "VAS chào đón gần 8.000 học sinh trở lại trường năm học 2026 – 2027", img: "1641683521844-700c456379bd" },
  { tag: "Ngoại khóa", date: "08/2026", title: "Khép lại chuỗi Trại hè Quốc tế 2026 tại Mỹ, Anh, Úc & New Zealand", img: "1587794032575-de0040fe9186" },
  { tag: "Chất lượng", date: "13/07/2026", title: "Khảo sát mức độ hài lòng của phụ huynh VAS 2026 vượt kỳ vọng", img: "1758270703127-9f6ae686ce7b" },
];

const EVENTS = [
  ["Ngày hội tuyển sinh", "Cơ sở Riverside", "24/08/2026"],
  ["Hội thảo trực tuyến", "Trực tuyến · Lộ trình CAPI", "31/08/2026"],
  ["Cà phê cùng phụ huynh", "Cơ sở Garden Hills", "07/09/2026"],
];

const FOOT = {
  "Chương trình": ["Mầm non", "Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Lộ trình Cambridge"],
  "Các cơ sở": ["Ba Tháng Hai", "Riverside", "Sunrise", "Sala", "Garden Hills", "Hoàng Văn Thụ"],
  "Về VAS": ["Câu chuyện VAS", "Đội ngũ giáo viên", "Thành tích", "Lộ trình vào đại học"],
  "Tuyển sinh": ["Quy trình tuyển sinh", "Học phí", "Đặt lịch tham quan", "Câu hỏi thường gặp", "Liên hệ"],
};

const PAGE = {
  "Về VAS": "ve-vas/",
  "Chương trình": "chuong-trinh/",
  "Các cơ sở": "co-so/",
  "Tuyển sinh": "tuyen-sinh/",
  "Tin tức": "tin-tuc/",
  "Vòng quanh VAS": "vong-quanh-vas/",
};

/* ================= helpers ================= */
const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ================= header ================= */
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const mega = document.getElementById("mega");
const mobileMenu = document.getElementById("mobileMenu");
let openKey = null;

const navKeys = Object.keys(MENU);
navKeys.forEach((k) => {
  const b = el(`<a class="nav-item" href="${PAGE[k]}">${esc(k)}</a>`);
  b.addEventListener("mouseenter", () => openMega(k));
  b.addEventListener("focus", () => openMega(k));
  nav.appendChild(b);
});

function renderMega(k) {
  const m = MENU[k];
  mega.innerHTML = `
    <div class="mega-inner">
      <div>
        <p class="mega-heading">${esc(m.heading)}</p>
        <p class="mega-note">${esc(m.note)}</p>
        <a href="#admissions" class="mega-cta">Đặt lịch tham quan cá nhân <span aria-hidden="true">→</span></a>
      </div>
      <ul class="mega-links">
        ${m.links.map((l) => `<li><a href="${PAGE[k]}">${esc(l)} <span aria-hidden="true">→</span></a></li>`).join("")}
      </ul>
    </div>`;
}
function openMega(k) {
  openKey = k;
  renderMega(k);
  mega.classList.add("open");
  [...nav.children].forEach((c) => c.classList.toggle("active", c.textContent === k));
  setSolid();
}
function closeMega() {
  openKey = null;
  mega.classList.remove("open");
  [...nav.children].forEach((c) => c.classList.remove("active"));
  setSolid();
}
header.addEventListener("mouseleave", closeMega);

function setSolid() {
  const solid = window.scrollY > 24 || openKey;
  header.classList.toggle("solid", !!solid);
}
window.addEventListener("scroll", setSolid, { passive: true });
setSolid();

/* mobile menu */
navKeys.forEach((k) => {
  const d = el(`
    <details>
      <summary>${esc(k)}</summary>
      <ul><li><a href="${PAGE[k]}" style="font-weight:600;color:var(--vas-red)">Xem trang ${esc(k)}</a></li>${MENU[k].links.map((l) => `<li><a href="${PAGE[k]}">${esc(l)}</a></li>`).join("")}</ul>
    </details>`);
  mobileMenu.appendChild(d);
});
mobileMenu.appendChild(el(`<a href="#admissions" class="btn btn-red">Đặt lịch tham quan</a>`));
const burger = document.getElementById("burger");
burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  header.classList.add("solid");
});
mobileMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) mobileMenu.classList.remove("open");
});

/* ================= render sections ================= */
// proof
document.getElementById("proofGrid").innerHTML = PROOF.map((p, i) => `
  <div class="proof-cell reveal" style="transition-delay:${i * 90}ms">
    <div class="proof-num" data-count="${p.n}" data-suffix="${esc(p.suffix)}">0</div>
    <div><p class="proof-label">${esc(p.label)}</p><p class="proof-note">${esc(p.note)}</p></div>
  </div>`).join("");

// differentiators
document.getElementById("diffGrid").innerHTML = DIFF.map((d, i) => `
  <article class="diff-card reveal" style="transition-delay:${i * 90}ms">
    <div class="diff-img"><img src="${img(d.img, 640, 800)}" alt="${esc(d.t)}" loading="lazy" /></div>
    <div class="diff-body">
      <h3>${esc(d.t)}</h3><p>${esc(d.d)}</p>
      <a href="#" class="diff-more">Tìm hiểu thêm <span aria-hidden="true">→</span></a>
    </div>
  </article>`).join("");

// stages
document.getElementById("stageGrid").innerHTML = STAGES.map((s, i) => `
  <div class="stage reveal" style="transition-delay:${i * 90}ms">
    <span class="tag"><i>0${i + 1}</i>${esc(s.age)}</span>
    <h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
  </div>`).join("");

// programme selector
const progTabs = document.getElementById("progTabs");
const progPanel = document.getElementById("progPanel");
function renderProg(idx) {
  const p = PROGRAMMES[idx];
  progTabs.querySelectorAll(".prog-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
  progPanel.classList.remove("animate-rise");
  void progPanel.offsetWidth;
  progPanel.classList.add("animate-rise");
  progPanel.innerHTML = `
    <div class="prog-badges">
      <span class="badge">${esc(p.code)}</span>
      <span class="badge soft">${esc(p.english)}</span>
    </div>
    <h3>${esc(p.name)}</h3>
    <p class="desc">${esc(p.d)}</p>
    <div class="prog-for"><p class="k">Phù hợp với</p><p class="v">${esc(p.for)}</p></div>
    <a href="#admissions" class="btn btn-red" style="margin-top:24px;padding:12px 24px;font-size:14px">Tìm lộ trình cho con <span aria-hidden="true">→</span></a>`;
}
PROGRAMMES.forEach((p, i) => {
  const b = el(`<button class="prog-tab"><span><span class="code">${esc(p.code)}</span><span class="tagname">${esc(p.tag)}</span></span><span class="arrow" aria-hidden="true">→</span></button>`);
  b.addEventListener("click", () => renderProg(i));
  progTabs.appendChild(b);
});
renderProg(0);

// people
document.getElementById("peopleGrid").innerHTML = PEOPLE.map((m, i) => `
  <article class="person reveal" style="transition-delay:${i * 100}ms">
    <div class="pic"><img src="${img(m.img, 720, 900)}" alt="Chân dung ${esc(m.name)}" loading="lazy" /></div>
    <div class="body">
      <p class="name">${esc(m.name)}</p>
      <p class="role">${esc(m.role)}</p>
      <p class="exp">${esc(m.exp)}</p>
      <p class="quote">“${esc(m.quote)}”</p>
    </div>
  </article>`).join("");

// timeline
document.getElementById("timeline").innerHTML = DAY.map(([time, label]) => `
  <li><span class="dot"><i></i></span><div class="row"><span class="time">${esc(time)}</span><span class="label">${esc(label)}</span></div></li>`).join("");

// campus
const campusFeature = document.getElementById("campusFeature");
const campusList = document.getElementById("campusList");
function renderCampus(idx) {
  const c = CAMPUSES[idx];
  campusList.querySelectorAll(".campus-item").forEach((t, i) => t.classList.toggle("active", i === idx));
  campusFeature.classList.remove("animate-rise");
  void campusFeature.offsetWidth;
  campusFeature.classList.add("animate-rise");
  campusFeature.innerHTML = `
    <div class="campus-photo">
      <img src="${img(c.img, 1100, 700)}" alt="Cơ sở VAS ${esc(c.name)}" />
      <div class="grad"></div>
      <div class="cap"><h3>${esc(c.name)}</h3><p>${esc(c.district)} · ${esc(c.ages)}</p></div>
    </div>
    <div class="campus-info">
      <p>${esc(c.note)}</p>
      <div class="actions">
        <a href="#admissions" class="btn btn-light">Đặt lịch tham quan</a>
        <a href="#" class="btn btn-outline-light" style="border-color:rgba(247,241,232,.4)">Xem cơ sở</a>
      </div>
    </div>`;
}
CAMPUSES.forEach((c, i) => {
  const b = el(`
    <li><button class="campus-item">
      <span class="idx">0${i + 1}</span>
      <span class="meta"><b>${esc(c.name)}</b><span>${esc(c.district)}</span></span>
      <span class="arrow" aria-hidden="true">→</span>
    </button></li>`);
  b.querySelector("button").addEventListener("click", () => renderCampus(i));
  campusList.appendChild(b);
});
renderCampus(0);

// stories
document.getElementById("storiesGrid").innerHTML = STORIES.map((s, i) => `
  <article class="story reveal" style="transition-delay:${i * 100}ms">
    <img src="${img(s.img, 720, 900)}" alt="${esc(s.name)}, ${esc(s.grade)}" loading="lazy" />
    <div class="grad"></div>
    <div class="cap"><p>“${esc(s.quote)}”</p><span>${esc(s.name)} · ${esc(s.grade)}</span></div>
  </article>`).join("");

// outcomes
document.getElementById("outcomesGrid").innerHTML = OUTCOMES.map((o, i) => `
  <div class="outcome reveal" style="transition-delay:${i * 90}ms">
    <div class="num" data-count="${o.n}" data-suffix="${esc(o.suffix)}">0</div>
    <p>${esc(o.l)}</p>
  </div>`).join("");

// voices
const voiceTabs = document.getElementById("voiceTabs");
const voiceQuote = document.getElementById("voiceQuote");
function renderVoice(idx) {
  const v = VOICES[idx];
  voiceTabs.querySelectorAll(".voice-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
  voiceQuote.classList.remove("animate-rise");
  void voiceQuote.offsetWidth;
  voiceQuote.classList.add("animate-rise");
  voiceQuote.innerHTML = `<p>“${esc(v.quote)}”</p><footer>${esc(v.name)}</footer>`;
}
VOICES.forEach((v, i) => {
  const b = el(`<button class="voice-tab">${esc(v.stage)}</button>`);
  b.addEventListener("click", () => renderVoice(i));
  voiceTabs.appendChild(b);
});
renderVoice(0);

// steps
document.getElementById("stepsGrid").innerHTML = STEPS.map(([n, t, d], i) => `
  <div class="step reveal" style="transition-delay:${i * 80}ms">
    <span class="n">${esc(n)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p>
  </div>`).join("");

// news
document.getElementById("articlesGrid").innerHTML = NEWS.map((a, i) => `
  <a href="#" class="article reveal" style="transition-delay:${i * 90}ms">
    <div class="thumb"><img src="${img(a.img, 600, 420)}" alt="${esc(a.title)}" loading="lazy" /></div>
    <p class="meta">${esc(a.tag)} <i></i> <em>${esc(a.date)}</em></p>
    <h3>${esc(a.title)}</h3>
  </a>`).join("");

// events
document.getElementById("eventsList").innerHTML = EVENTS.map(([title, place, date]) => {
  const [d, mth] = date.split("/");
  return `<li><a href="#" class="event">
    <span class="date"><b>${d}</b><span>Th${Number(mth)}</span></span>
    <span class="info"><b>${esc(title)}</b><span>${esc(place)}</span></span>
    <span class="arrow" aria-hidden="true">→</span>
  </a></li>`;
}).join("");

// footer
document.getElementById("footerCols").innerHTML = Object.entries(FOOT).map(([h, links]) => `
  <div><h4>${esc(h)}</h4><ul>${links.map((l) => `<li><a href="#">${esc(l)}</a></li>`).join("")}</ul></div>`).join("");

/* ================= reveal on scroll ================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

/* ================= count up ================= */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const target = +e.target.dataset.count;
    const suffix = e.target.dataset.suffix || "";
    if (reduce) { e.target.textContent = target.toLocaleString("en-US") + suffix; return; }
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      e.target.textContent = Math.round(eased * target).toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });
document.querySelectorAll("[data-count]").forEach((n) => countIO.observe(n));
