/* Trang Tin tức */
const imageUrl = (source, w, h) => source.startsWith("http") ? source : img(source, w, h);

const FEATURED = {
  tag: "Sự kiện", date: "18/08/2026", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/vas-chao-don-gan-8000-hoc-sinh-vao-ngay-tuu-truong",
  title: "VAS chào đón gần 8.000 học sinh trở lại trường năm học 2026 – 2027",
  excerpt: "Sáng 18/08, không khí tựu trường rộn ràng trên khắp 6 cơ sở khi gần 8.000 học sinh VAS bước vào năm học mới — đánh dấu một cột mốc mới của cộng đồng trường học lớn nhất khối song ngữ tại TP.HCM.",
};

const NEWS = [
  { cat: "Ngoại khóa", tag: "Ngoại khóa", date: "08/2026", img: "1587794032575-de0040fe9186", title: "Khép lại chuỗi Trại hè Quốc tế 2026 tại Mỹ, Anh, Úc & New Zealand", ex: "Hàng trăm học sinh VAS trở về với hành trang là những trải nghiệm văn hóa và kỹ năng sống quý giá." },
  { cat: "Chất lượng", tag: "Chất lượng", date: "13/07/2026", img: "1758270703127-9f6ae686ce7b", title: "Khảo sát mức độ hài lòng của phụ huynh VAS 2026 vượt kỳ vọng", ex: "Kết quả khảo sát ghi nhận sự tin tưởng ngày càng cao của các gia đình với chất lượng giảng dạy và chăm sóc." },
  { cat: "Học thuật", tag: "Học thuật", date: "06/2026", img: "1523050854058-8df90110c9f1", title: "Học sinh VAS giành nhiều thành tích tại các kỳ thi Cambridge quốc tế", ex: "Nhiều em đạt điểm xuất sắc, khẳng định chất lượng đào tạo chuẩn Cambridge của nhà trường." },
  { cat: "Ngoại khóa", tag: "Ngoại khóa", date: "05/2026", img: "1526676037777-05a232554f77", title: "Ngày hội thể thao liên cơ sở lan tỏa tinh thần đồng đội", ex: "Học sinh sáu cơ sở tranh tài trong không khí sôi nổi, gắn kết cộng đồng VAS." },
  { cat: "Học thuật", tag: "Học thuật", date: "04/2026", img: "1509062522246-3755977927d7", title: "Triển lãm dự án STEM: khi học sinh trở thành nhà sáng chế", ex: "Những sản phẩm sáng tạo cho thấy tư duy phản biện và khả năng giải quyết vấn đề của học sinh." },
  { cat: "Cộng đồng", tag: "Cộng đồng", date: "03/2026", img: "1488521787991-ed7bbaae773c", title: "Dự án phục vụ cộng đồng gắn kết học sinh với xã hội", ex: "Học sinh VAS lan tỏa giá trị sẻ chia qua các hoạt động thiện nguyện ý nghĩa." },
];

const EVENTS = [
  ["24", "Th8", "Ngày hội tuyển sinh", "Cơ sở Riverside · 24/08/2026"],
  ["31", "Th8", "Hội thảo trực tuyến: Lộ trình CAPI", "Trực tuyến · 31/08/2026"],
  ["07", "Th9", "Cà phê cùng phụ huynh", "Cơ sở Garden Hills · 07/09/2026"],
];

const CATS = ["Tất cả", "Học thuật", "Ngoại khóa", "Chất lượng", "Cộng đồng"];

document.getElementById("featured").innerHTML = `
  <div class="fa-img"><img src="${imageUrl(FEATURED.img, 1000, 700)}" alt="${esc(FEATURED.title)}" /></div>
  <div class="fa-body">
    <p class="meta" style="display:flex;align-items:center;gap:8px;font-size:12px;text-transform:uppercase;letter-spacing:.15em;color:var(--vas-red)"><b>${esc(FEATURED.tag)}</b> · <em style="font-style:normal;color:var(--ink-soft)">${esc(FEATURED.date)}</em></p>
    <h2>${esc(FEATURED.title)}</h2>
    <p>${esc(FEATURED.excerpt)}</p>
    <a href="#" class="btn btn-red" style="margin-top:24px;padding:12px 24px;font-size:14px">Đọc tiếp <span aria-hidden="true">→</span></a>
  </div>`;

const grid = document.getElementById("articleGrid");
function renderNews(cat) {
  const list = cat === "Tất cả" ? NEWS : NEWS.filter((n) => n.cat === cat);
  grid.innerHTML = list.map((a) => `
    <a href="#" class="article-card">
      <div class="thumb"><img src="${img(a.img, 600, 450)}" alt="${esc(a.title)}" loading="lazy" /></div>
      <p class="meta">${esc(a.tag)} <i></i> <em>${esc(a.date)}</em></p>
      <h3>${esc(a.title)}</h3><p>${esc(a.ex)}</p>
    </a>`).join("");
}
const catTabs = document.getElementById("catTabs");
CATS.forEach((c, i) => {
  const b = el(`<button class="pill-tab ${i === 0 ? "active" : ""}">${esc(c)}</button>`);
  b.addEventListener("click", () => {
    catTabs.querySelectorAll(".pill-tab").forEach((t) => t.classList.remove("active"));
    b.classList.add("active");
    renderNews(c);
  });
  catTabs.appendChild(b);
});
renderNews("Tất cả");

document.getElementById("eventsList").innerHTML = EVENTS.map(([d, m, t, p]) => `
  <li><a href="#" class="event">
    <span class="date"><b>${d}</b><span>${m}</span></span>
    <span class="info"><b>${esc(t)}</b><span>${esc(p)}</span></span>
    <span class="arrow" aria-hidden="true">→</span>
  </a></li>`).join("");
