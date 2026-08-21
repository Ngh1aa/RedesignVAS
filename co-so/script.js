/* Trang Các cơ sở */
const CAMPUSES = [
  { name: "Ba Tháng Hai", district: "Quận 10", ages: "2–18 tuổi", img: "1786013522160-00ac876da3ab", note: "Cơ sở chính, trụ sở của hệ thống ngay trung tâm thành phố." },
  { name: "Riverside", district: "Quận 7", ages: "2–18 tuổi", img: "1781877641721-dc3d4974bf25", note: "Không gian ven sông yên bình với cơ sở vật chất quốc tế." },
  { name: "Sunrise", district: "Quận 7", ages: "2–18 tuổi", img: "1780247723262-bf9fab11592c", note: "Không gian hiện đại, tươi sáng tại khu Phú Mỹ Hưng." },
  { name: "Sala", district: "TP. Thủ Đức", ages: "2–15 tuổi", img: "1764943630631-b63aadf86e19", note: "Cơ sở mới tại khu đô thị Sala hiện đại." },
  { name: "Garden Hills", district: "Gò Vấp", ages: "2–18 tuổi", img: "1772551419793-75c00555bf7b", note: "Khuôn viên xanh, rộng rãi cho cộng đồng xuyên cấp." },
  { name: "Hoàng Văn Thụ", district: "Phú Nhuận", ages: "2–11 tuổi", img: "1781032161857-41214c66559f", note: "Khởi đầu êm đềm cho khối Mầm non và Tiểu học." },
];

const FACILITIES = [
  { ic: "◆", t: "Chuẩn Cambridge", d: "Cùng một chương trình và tiêu chuẩn giảng dạy trên mọi cơ sở." },
  { ic: "✦", t: "Phòng lab & thư viện", d: "Không gian học tập, thí nghiệm và đọc sách hiện đại." },
  { ic: "❖", t: "Thể thao & nghệ thuật", d: "Sân bãi, phòng nhạc, mỹ thuật cho phát triển toàn diện." },
  { ic: "✧", t: "Chăm sóc học sinh", d: "Đội ngũ y tế, tư vấn tâm lý và an ninh tận tâm." },
];

document.getElementById("campusGrid").innerHTML = CAMPUSES.map((c, i) => `
  <article class="campus-card">
    <div class="photo">
      <img src="${img(c.img, 800, 550)}" alt="Cơ sở VAS ${esc(c.name)}" loading="lazy" />
      <span class="badge">Cơ sở 0${i + 1}</span>
    </div>
    <div class="body">
      <h3>${esc(c.name)}</h3>
      <p class="dist">${esc(c.district)} · ${esc(c.ages)}</p>
      <p>${esc(c.note)}</p>
      <div class="row"><span>${esc(c.ages)}</span><a href="../tuyen-sinh/">Đặt lịch tham quan →</a></div>
    </div>
  </article>`).join("");

document.getElementById("facilityGrid").innerHTML = FACILITIES.map((f) => `
  <article class="feature"><span class="ic">${f.ic}</span><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></article>`).join("");
