/* Vòng quanh VAS — một ngày, nhiều cách để lớn lên */
const HUB = [
  ["doi-song-hoc-duong", "Đời sống học đường", "Những trải nghiệm tạo nên một ngày học tập trọn vẹn."],
  ["the-thao", "Thể thao", "Năng lượng, tinh thần đồng đội và niềm vui vận động."],
  ["nghe-thuat", "Nghệ thuật", "Nơi học sinh khám phá và thể hiện tài năng."],
  ["cau-lac-bo", "Câu lạc bộ", "Theo đuổi sở thích, phát triển năng khiếu."],
  ["cong-dong", "Cộng đồng", "Học cách sẻ chia và tạo nên những thay đổi tích cực."],
  ["cham-soc-hoc-sinh", "Chăm sóc học sinh", "An toàn, sức khỏe và sự phát triển toàn diện."],
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
const SPORT = {
  title: "VAS Olympics 2026",
  body: "Một ngày hội để học sinh và phụ huynh cùng vận động, cổ vũ và kết nối qua thể thao.",
  stats: [["2.000+", "học sinh & phụ huynh"], ["6", "bộ môn"], ["900", "huy chương gần nhất"]],
  sports: "Bóng đá · Bóng rổ · Cờ vua · Điền kinh · Bơi lội · Nhảy",
  image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1100&h=800&fit=crop&auto=format&q=80",
};
const ARTS = [
  ["Music", "Âm nhạc và những sân khấu để học sinh cất tiếng."],
  ["Visual Arts", "Hội họa, thiết kế và những cách nhìn mới."],
  ["Dance", "Chuyển động, nhịp điệu và sự tự tin."],
  ["Drama", "Kể chuyện, nhập vai và lắng nghe nhau."],
  ["Film", "Ghi lại góc nhìn của học sinh về thế giới."],
  ["Talent Shows", "VAS Painting Contest và VAS's Got Talent."],
];
const CLUBS = [
  ["Thể thao", "Bóng đá · Bóng rổ · Cầu lông · Bơi"],
  ["Sáng tạo", "Nghệ thuật · Thủ công · Âm nhạc · Phim ảnh"],
  ["Tư duy", "Cờ vua · Khoa học · Các trò chơi trí tuệ"],
];
const PROJECTS = [
  ["GẤP Project", "Tái sinh đồng phục cũ và biến vật liệu quen thuộc thành điều có ích."],
  ["TAKE ME HOME", "Lan tỏa nhận thức về an toàn trên môi trường mạng."],
  ["GIẤC MƠ LẬP TRÌNH", "Cung cấp công cụ học Python miễn phí cho cộng đồng."],
  ["ZERO WASTE", "Hướng đến xây dựng thư viện sách cho trẻ em vùng cao."],
];
const CARE = ["Theo dõi sức khỏe", "Chăm sóc dinh dưỡng", "Y tế học đường", "An toàn & vệ sinh", "Hỗ trợ tâm lý", "Kết nối phụ huynh – nhà trường", "Định hướng tương lai"];

const $ = (id) => document.getElementById(id);
const safe = (value) => typeof esc === "function" ? esc(value) : String(value).replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

$("aroundHub").innerHTML = HUB.map(([id, title, desc], index) => `
  <a class="around-hub-item" href="#${safe(id)}">
    <span class="hub-no">0${index + 1}</span><span class="hub-copy"><strong>${safe(title)}</strong><small>${safe(desc)}</small></span><span class="hub-arrow" aria-hidden="true">→</span>
  </a>`).join("");

$("dayList").innerHTML = DAY.map(([time, label]) => `
  <li><span class="dot"><i></i></span><span class="yr">${safe(time)}</span><h4>${safe(label)}</h4></li>`).join("");

$("sportStory").innerHTML = `<div class="sport-card"><div class="sport-card-copy"><span class="sport-label">CASE STUDY · 2026</span><h3>${safe(SPORT.title)}</h3><p>${safe(SPORT.body)}</p><div class="sport-stats">${SPORT.stats.map(([value, label]) => `<div><strong>${safe(value)}</strong><span>${safe(label)}</span></div>`).join("")}</div><p class="sport-list">${safe(SPORT.sports)}</p></div><img src="${SPORT.image}" alt="Học sinh và phụ huynh tham gia hoạt động thể thao tại VAS" loading="lazy" /></div>`;

$("artsGrid").innerHTML = ARTS.map(([title, desc]) => `<article class="tag-card"><span class="tag-index">${safe(title)}</span><p>${safe(desc)}</p></article>`).join("");
$("clubsGrid").innerHTML = CLUBS.map(([title, desc]) => `<article class="club-card"><span class="club-mark">✦</span><h3>${safe(title)}</h3><p>${safe(desc)}</p></article>`).join("");
$("communityProjects").innerHTML = `<p class="community-tagline">Từ lớp học đến cộng đồng.</p>${PROJECTS.map(([title, desc]) => `<article class="project-row"><strong>${safe(title)}</strong><span>${safe(desc)}</span><i aria-hidden="true">↗</i></article>`).join("")}`;
$("careChips").innerHTML = CARE.map((item) => `<span>${safe(item)}</span>`).join("");
