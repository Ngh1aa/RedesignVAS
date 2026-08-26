const imageUrl = (source, w, h) => source.startsWith("http") ? source : img(source, w, h);

const HUB_ITEMS = [
  ["tin-moi-nhat", "Tin tức mới nhất", "Những câu chuyện và dấu ấn mới nhất tại VAS."],
  ["su-kien", "Sự kiện sắp tới", "Lịch sự kiện, hoạt động và chương trình dành cho cộng đồng VAS."],
  ["cau-chuyen-hoc-sinh", "Câu chuyện học sinh", "Hành trình, thành tích và những điều học sinh VAS đang tạo nên."],
  ["hoat-dong-ngoai-khoa", "Hoạt động ngoại khóa", "Thể thao, nghệ thuật, trải nghiệm và những giờ học ngoài lớp."],
  ["thu-vien-anh", "Thư viện ảnh", "Những khoảnh khắc đáng nhớ của cộng đồng VAS."],
];

const LATEST = [
  {
    cat: "Cộng đồng", date: "20/08/2026", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/vas-chao-don-gan-8000-hoc-sinh-vao-ngay-tuu-truong-1",
    title: "VAS đã chuẩn bị gì cho đội ngũ giáo viên trước khi chào đón gần 8.000 học sinh trở lại trường?",
    ex: "VAS tổ chức chương trình tập huấn đầu năm học 2026–2027 tại 6 cơ sở, với hơn 1.000 giáo viên Cambridge và MOET, tập trung vào chuyên môn, chuyển đổi số, AI, safeguarding và môi trường học tập an toàn, hạnh phúc.",
  },
  {
    cat: "Phụ huynh", date: "18/08/2026", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/phu-huynh-ke-gi-ve-hanh-trinh-hoc-tap-cua-con-tai-vas.jpg",
    title: "Phụ huynh kể gì về hành trình học tập của con tại VAS?",
    ex: "Những chia sẻ thực tế từ phụ huynh về sự phát triển và trải nghiệm của con trong quá trình học tập tại VAS.",
  },
  {
    cat: "Sự kiện", date: "18/08/2026", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/vas-chao-don-gan-8000-hoc-sinh-vao-ngay-tuu-truong",
    title: "VAS chào đón gần 8.000 học sinh vào ngày tựu trường 2026–2027",
    ex: "Sáu cơ sở VAS đồng loạt chào đón học sinh trở lại trường vào ngày 17/08, chính thức bắt đầu năm học mới.",
  },
];

const STORIES = [
  ["Thành tích Cambridge", "Mỗi thành tích bắt đầu từ một hành trình.", "Học sinh VAS chinh phục các kỳ thi Cambridge bằng sự bền bỉ, tò mò và niềm tin vào khả năng của chính mình.", "https://www.vas.edu.vn/_next/image?url=https%3A%2F%2Fmgs-storage.sgp1.digitaloceanspaces.com%2Fvas%2Fmedia%2F4J4A2277%201.jpg&w=3840&q=75"],
  ["English Speaking Contest", "Gần 100 học sinh từ lớp 1 đến lớp 12 tham gia vòng chung kết hệ thống tại Riverside.", "Một sân khấu để học sinh nói lên suy nghĩ, lắng nghe nhau và tự tin sử dụng tiếng Anh trong những tình huống thật.", "https://cdn2.tuoitre.vn/thesaigontimes/uploads/2024/11/VAS_1.jpg"],
  ["Dự án học sinh", "Từ câu hỏi nhỏ đến giải pháp lớn.", "Robotics, nghệ thuật, Community Programme và những dự án liên môn giúp học sinh biến ý tưởng thành hành động.", "https://timtruongquocte.com/storage/app/resources/resize/1920_880_0_0_auto/truong-mam-non-quoc-te-viet-uc-vas_b481ba2cfd8a4e69f339a4b289580ece.webp"],
  ["Toán học Sài Gòn 2026", "VASers giành 9 giải thưởng tại cuộc thi Toán học Sài Gòn 2026.", "Các đội thi VAS ghi dấu ấn ở cả bảng Junior và Senior, thể hiện tư duy logic, khả năng tính toán và tinh thần phối hợp dưới áp lực.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG"],
  ["Cambridge Awards 2025", "Gần 600 học sinh VAS được vinh danh với IGCSE, AS & A Level.", "Lễ trao giải ghi nhận những nỗ lực bền bỉ và thành tích Cambridge nổi bật, trong đó có các danh hiệu Top in Vietnam.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg"],
];

const EVENTS = [
  ["24", "Th8", "Ngày hội tuyển sinh", "Cơ sở Riverside · 24/08/2026"],
  ["31", "Th8", "Hội thảo trực tuyến: Lộ trình CAPI", "Trực tuyến · 31/08/2026"],
  ["07", "Th9", "Cà phê cùng phụ huynh", "Cơ sở Garden Hills · 07/09/2026"],
];

const ACTIVITIES = [
  ["VAS Olympics", "Hơn 2.000 học sinh và phụ huynh tham gia, gần 900 huy chương được trao ở 6 bộ môn.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/2Rss8Y19k1HSYe2nN478uJTay6qCwc4CtWxjyNbz.jpeg"],
  ["VAS Robotics", "Không gian để học sinh thử nghiệm, hợp tác và giải quyết vấn đề bằng tư duy sáng tạo.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/chung-ket-cuoc-thi-vas-robotics-2025-2026-anh-11"],
  ["VAS Summer Fair 2026", "Trại hè kết thúc bằng một ngày hội trải nghiệm, biểu diễn và triển lãm dành cho học sinh và gia đình tại Sala.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/trai-he-song-ngu-vas-2026-hinh-6.jpg"],
];

const ARCHIVE = [
  ["Đời sống VAS", "Khoảnh khắc thường ngày tại trường.", "https://www.vas.edu.vn/_next/image?url=https%3A%2F%2Fmgs-storage.sgp1.digitaloceanspaces.com%2Fvas%2Fmedia%2F3fc139c1-e71a-4077-94b7-0ea09ed2cfd4.jpeg&w=1200&q=75"],
  ["Học tập", "Lớp học, dự án và hoạt động học thuật.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/trai-he-song-ngu-vas-2026-hinh-1.jpg"],
  ["Sự kiện", "Lễ khai giảng, hội thao và các cuộc thi.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/trai-he-song-ngu-vas-2026-hinh-2.jpg"],
  ["Ngoại khóa", "Thể thao, nghệ thuật, dã ngoại và trải nghiệm.", "https://www.vas.edu.vn/_next/image?url=https%3A%2F%2Fmgs-storage.sgp1.digitaloceanspaces.com%2Fvas%2Fmedia%2Feca%201.jpg&w=2048&q=75"],
  ["Cộng đồng", "Kết nối phụ huynh, học sinh và giáo viên.", "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/kxAsMml1ucokFucmA2fOocm0BLhTrdCQIwcofmz5.jpeg"],
];

document.getElementById("newsHub").innerHTML = HUB_ITEMS.map(([id, title, desc], index) => `
  <a class="hub-link" href="#${esc(id)}"><span class="hub-index">0${index + 1}</span><span class="hub-text"><strong>${esc(title)}</strong><small>${esc(desc)}</small></span><span class="hub-arrow" aria-hidden="true">→</span></a>`).join("");

document.getElementById("latestNews").innerHTML = LATEST.map((a, index) => `
  <article class="latest-card ${index === 0 ? "latest-card-feature" : ""}">
    <div class="latest-thumb"><img src="${imageUrl(a.img, 1000, 700)}" alt="${esc(a.title)}" loading="lazy" /></div>
    <div class="latest-body"><p class="meta"><b>${esc(a.cat)}</b><i></i><em>${esc(a.date)}</em></p><h3>${esc(a.title)}</h3><p>${esc(a.ex)}</p><a class="text-link" href="#tin-moi-nhat">Đọc tiếp <span aria-hidden="true">→</span></a></div>
  </article>`).join("");

document.getElementById("storyFeature").innerHTML = `
  <img src="${imageUrl(STORIES[0][3], 1100, 800)}" alt="${esc(STORIES[0][1])}" loading="lazy" />
  <div class="story-feature-copy"><span class="eyebrow">${esc(STORIES[0][0])}</span><h3>${esc(STORIES[0][1])}</h3><p>${esc(STORIES[0][2])}</p></div>`;

document.getElementById("storyList").innerHTML = STORIES.slice(1).map(([tag, title, desc, image]) => `
  <article class="story-item"><img src="${imageUrl(image, 800, 600)}" alt="${esc(title)}" loading="lazy" /><div><span class="eyebrow">${esc(tag)}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></div></article>`).join("");

document.getElementById("eventsList").innerHTML = EVENTS.map(([d, m, t, p]) => `
  <li><a href="#su-kien" class="event"><span class="date"><b>${esc(d)}</b><span>${esc(m)}</span></span><span class="info"><b>${esc(t)}</b><span>${esc(p)}</span></span><span class="arrow" aria-hidden="true">→</span></a></li>`).join("");

document.getElementById("activityGrid").innerHTML = ACTIVITIES.map(([title, desc, image]) => `
  <article class="activity-card"><img src="${imageUrl(image, 900, 650)}" alt="${esc(title)}" loading="lazy" /><div><h3>${esc(title)}</h3><p>${esc(desc)}</p></div></article>`).join("");

document.getElementById("archiveGrid").innerHTML = ARCHIVE.map(([title, desc, image], index) => `
  <a class="archive-card archive-${index + 1}" href="#thu-vien-anh"><img src="${imageUrl(image, 1000, 850)}" alt="${esc(title)}" loading="lazy" /><span><strong>${esc(title)}</strong><small>${esc(desc)}</small></span></a>`).join("");
