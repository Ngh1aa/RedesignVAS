/* Trang Vòng quanh VAS */
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

const LIFE = [
  { ic: "✦", t: "Thể thao", d: "Bóng đá, bơi lội, bóng rổ và nhiều bộ môn giúp rèn thể chất và tinh thần đồng đội." },
  { ic: "❖", t: "Nghệ thuật", d: "Âm nhạc, hội họa, sân khấu — nơi mỗi học sinh tìm thấy tiếng nói sáng tạo của mình." },
  { ic: "◆", t: "Câu lạc bộ", d: "Robotics, tranh biện, khoa học, truyền thông… hàng chục CLB cho mọi đam mê." },
];

const GALLERY = ["1580582932707-520aed937b7b", "1518135714426-c18f5ffb6f4d", "1509062522246-3755977927d7", "1541178735493-479c1a27ed24", "1523240795612-9a054b0db644", "1427504494785-3a9ca7044f45"];

document.getElementById("dayList").innerHTML = DAY.map(([time, label]) => `
  <li><span class="dot"><i></i></span><span class="yr">${esc(time)}</span><h4 style="margin-top:2px;font-weight:500">${esc(label)}</h4></li>`).join("");

document.getElementById("lifeGrid").innerHTML = LIFE.map((l) => `
  <article class="feature"><span class="ic">${l.ic}</span><h3>${esc(l.t)}</h3><p>${esc(l.d)}</p></article>`).join("");

document.getElementById("gallery").innerHTML = GALLERY.map((id, i) => `
  <figure class="g-item${i === 0 ? " g-lg" : ""}"><img src="${img(id, 700, 700)}" alt="Không gian học tập tại VAS" loading="lazy" /></figure>`).join("");
