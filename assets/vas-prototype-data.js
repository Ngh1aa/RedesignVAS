/* =====================================================================
   VAS — PROTOTYPE SEED DATA (vas-prototype-data.js)
   Nguồn dữ liệu duy nhất cho các luồng chạy trên trình duyệt (không có
   máy chủ). vas-prototype.js đọc file này để khởi tạo sessionStorage;
   "Đặt lại dữ liệu demo" luôn quay về đúng nội dung dưới đây.
   Học phí, lịch trống, tin bài và vị trí tuyển dụng là số liệu mô phỏng
   cho prototype, không phải biểu phí hay thông báo chính thức của VAS.
   ===================================================================== */
(function () {
  const campuses = [
    { id: "sala", name: "Sala", district: "Thủ Đức", districtKey: "thu-duc", address: "1 Bùi Thiện Ngộ, KĐT Sala, TP. Thủ Đức", phone: "028 3622 0833", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Mega Campus với hơn 7.000 m² cây xanh, hồ bơi và khu thể thao.", facilities: ["Hồ bơi", "Sân bóng", "Phòng thí nghiệm", "Thư viện", "Phòng nghệ thuật"], tourDays: [1, 2, 3, 4, 5, 6] },
    { id: "riverside", name: "Riverside", district: "Quận 7", districtKey: "quan-7", address: "99 Nguyễn Thị Thập, Quận 7", phone: "028 3622 0898", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Campus lớn, nhiều mảng xanh với khu khoa học, ICT, nghệ thuật và thể thao.", facilities: ["Phòng thí nghiệm", "ICT", "Nhà thi đấu", "Sân khấu", "Thư viện"], tourDays: [1, 2, 3, 4, 5, 6] },
    { id: "garden-hills", name: "Garden Hills", district: "Gò Vấp", districtKey: "go-vap", address: "168 Phan Văn Trị, Gò Vấp", phone: "028 3588 3088", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Kiến trúc xanh, nhiều không gian mở, hồ bơi và sân bóng.", facilities: ["Hồ bơi", "Sân bóng", "STEM lab", "Phòng âm nhạc"], tourDays: [1, 2, 3, 4, 5] },
    { id: "sunrise", name: "Sunrise", district: "Quận 7", districtKey: "quan-7", address: "Số 1, Đường số 20, KĐT Him Lam, Quận 7", phone: "028 3622 6611", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Cộng đồng gắn kết trong khu đô thị Him Lam, thuận tiện cho gia đình Quận 7.", facilities: ["Thư viện", "Sân thể thao", "Phòng mỹ thuật"], tourDays: [1, 2, 3, 4, 5] },
    { id: "hoang-van-thu", name: "Hoàng Văn Thụ", district: "Phú Nhuận", districtKey: "phu-nhuan", address: "202 Hoàng Văn Thụ, Phú Nhuận", phone: "028 3999 0112", levels: ["tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Cơ sở trung tâm, thuận tiện cho gia đình Phú Nhuận và Tân Bình.", facilities: ["Thư viện", "Phòng ICT", "Sân đa năng"], tourDays: [1, 3, 5] },
    { id: "ba-thang-hai", name: "Ba Tháng Hai", district: "Quận 10", districtKey: "quan-10", address: "594 Ba Tháng Hai, Phường 14, Quận 10", phone: "028 3864 1770", levels: ["tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], highlight: "Trụ sở chính và cơ sở đầu tiên của VAS, nhịp học tập trung giữa trung tâm thành phố.", facilities: ["Thư viện", "Phòng thí nghiệm", "Sân đa năng"], tourDays: [2, 4, 6] },
  ];

  const programmes = [
    { id: "cep", code: "CEP", name: "Tiếng Anh Cambridge tăng cường", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"] },
    { id: "cap", code: "CAP", name: "Song ngữ Cambridge học thuật", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"] },
    { id: "capi", code: "CAPI", name: "Cambridge tích hợp quốc tế", levels: ["tieu-hoc", "thcs", "thpt"] },
  ];

  /* Lớp cụ thể dùng trong hồ sơ dự tuyển, gom về 4 nhóm biểu phí. */
  const grades = [
    { id: "k1", label: "Mầm non K1 (3 tuổi)", band: "mam-non", level: "mam-non" },
    { id: "k2", label: "Mầm non K2 (4 tuổi)", band: "mam-non", level: "mam-non" },
    { id: "k3", label: "Mầm non K3 (5 tuổi)", band: "mam-non", level: "mam-non" },
    ...[1, 2, 3, 4, 5].map((n) => ({ id: `g${n}`, label: `Lớp ${n}`, band: "1-5", level: "tieu-hoc" })),
    ...[6, 7, 8].map((n) => ({ id: `g${n}`, label: `Lớp ${n}`, band: "6-8", level: "thcs" })),
    { id: "g9", label: "Lớp 9", band: "9-12", level: "thcs" },
    ...[10, 11, 12].map((n) => ({ id: `g${n}`, label: `Lớp ${n}`, band: "9-12", level: "thpt" })),
  ];

  const tuition = {
    schoolYear: "2026–2027",
    bands: [
      { id: "mam-non", label: "Mầm non", base: 180000000 },
      { id: "1-5", label: "Lớp 1–5", base: 220000000 },
      { id: "6-8", label: "Lớp 6–8", base: 260000000 },
      { id: "9-12", label: "Lớp 9–12", base: 300000000 },
    ],
    programmeFactor: { cep: 1, cap: 1.16, capi: 1.35 },
    campusOffset: { sala: 20000000, riverside: 15000000, "garden-hills": 8000000, sunrise: 10000000, "hoang-van-thu": 0, "ba-thang-hai": 5000000 },
    plans: [
      { id: "one", label: "1 lần / năm", installments: 1, factor: 0.97, note: "Giảm 3% khi thanh toán một lần" },
      { id: "two", label: "2 lần / năm", installments: 2, factor: 1, note: "Chia theo học kỳ" },
      { id: "four", label: "4 lần / năm", installments: 4, factor: 1.03, note: "Phụ thu 3% khi chia theo quý" },
    ],
    applicationFee: 2000000,
    reservationFee: 10000000,
    siblingDiscount: { none: 0, one: 0.05, two: 0.1 },
    extras: [
      { id: "meal", label: "Bữa ăn bán trú", amount: 18000000 },
      { id: "bus", label: "Xe đưa rước (tuyến trung bình)", amount: 22000000 },
    ],
  };

  /* Lịch tham quan: 4 khung giờ mỗi ngày. Một số khung được đánh dấu đã kín
     theo công thức cố định để mọi lần mở trang đều giống nhau. */
  const tours = {
    slots: ["08:30", "10:00", "14:00", "15:30"],
    daysAhead: 14,
    capacityNote: "Mỗi khung giờ đón tối đa 4 gia đình.",
    takenPattern: [
      { campus: "sala", weekday: 2, slot: "08:30" },
      { campus: "sala", weekday: 4, slot: "10:00" },
      { campus: "riverside", weekday: 1, slot: "10:00" },
      { campus: "riverside", weekday: 3, slot: "14:00" },
      { campus: "riverside", weekday: 5, slot: "08:30" },
      { campus: "garden-hills", weekday: 2, slot: "15:30" },
      { campus: "sunrise", weekday: 1, slot: "08:30" },
      { campus: "hoang-van-thu", weekday: 3, slot: "10:00" },
      { campus: "ba-thang-hai", weekday: 4, slot: "14:00" },
    ],
    fullyBookedOffset: 3,
  };

  const news = {
    categories: ["Học thuật", "Sự kiện", "Cộng đồng", "Phụ huynh", "Thể thao"],
    articles: [
      { slug: "tap-huan-giao-vien-2026", cat: "Cộng đồng", date: "2026-08-20", author: "Ban Truyền thông VAS", title: "VAS chuẩn bị gì cho đội ngũ giáo viên trước ngày đón gần 8.000 học sinh?", excerpt: "Chương trình tập huấn đầu năm học 2026–2027 tại 6 cơ sở tập trung vào chuyên môn, chuyển đổi số, AI và môi trường học tập an toàn.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/vas-chao-don-gan-8000-hoc-sinh-vao-ngay-tuu-truong-1", body: ["Trước ngày tựu trường, hơn 1.000 giáo viên Cambridge và MOET của VAS tham gia chuỗi tập huấn kéo dài hai tuần tại cả 6 cơ sở.", "Nội dung tập trung vào phương pháp giảng dạy lấy học sinh làm trung tâm, ứng dụng AI có trách nhiệm trong lớp học và quy trình safeguarding.", "Ban Giám hiệu các cơ sở cũng rà soát lại kế hoạch đón học sinh mới, đặc biệt với các em lần đầu đến trường ở bậc Mầm non và Lớp 1."] },
      { slug: "phu-huynh-ke-ve-hanh-trinh", cat: "Phụ huynh", date: "2026-08-18", author: "Ban Truyền thông VAS", title: "Phụ huynh kể gì về hành trình học tập của con tại VAS?", excerpt: "Những chia sẻ thực tế từ phụ huynh về sự phát triển và trải nghiệm của con trong quá trình học tập tại VAS.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/phu-huynh-ke-gi-ve-hanh-trinh-hoc-tap-cua-con-tai-vas.jpg", body: ["Chúng tôi trò chuyện với năm gia đình có con theo học từ Mầm non đến THPT tại VAS.", "Điểm chung trong các câu chuyện là sự tự tin khi giao tiếp tiếng Anh và thói quen tự đặt câu hỏi của các con.", "Nhiều phụ huynh cũng nhắc đến vai trò của giáo viên chủ nhiệm trong việc kết nối gia đình và nhà trường."] },
      { slug: "tuu-truong-2026", cat: "Sự kiện", date: "2026-08-18", author: "Ban Truyền thông VAS", title: "VAS chào đón gần 8.000 học sinh vào ngày tựu trường 2026–2027", excerpt: "Sáu cơ sở VAS đồng loạt chào đón học sinh trở lại trường vào ngày 17/08, chính thức bắt đầu năm học mới.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/vas-chao-don-gan-8000-hoc-sinh-vao-ngay-tuu-truong", body: ["Sáng 17/08, không khí năm học mới lan tỏa khắp sáu cơ sở VAS.", "Học sinh Mầm non được làm quen lớp học cùng phụ huynh trong buổi sáng đầu tiên, trong khi học sinh THPT tham gia hoạt động định hướng năm học.", "Năm học 2026–2027 đánh dấu năm thứ 22 VAS đồng hành cùng các gia đình Việt."] },
      { slug: "toan-hoc-sai-gon-2026", cat: "Học thuật", date: "2026-07-26", author: "Tổ Toán VAS", title: "VASers giành 9 giải thưởng tại cuộc thi Toán học Sài Gòn 2026", excerpt: "Các đội thi VAS ghi dấu ấn ở cả bảng Junior và Senior, thể hiện tư duy logic và tinh thần phối hợp.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/hoc%20sinh.JPG", body: ["Bốn đội thi của VAS tham dự cuộc thi Toán học Sài Gòn 2026 và mang về 9 giải thưởng.", "Ở bảng Senior, đội VAS Riverside giành giải Nhất phần thi giải toán đồng đội.", "Các thầy cô cho biết bí quyết nằm ở những buổi luyện đề nhỏ, đều đặn mỗi tuần."] },
      { slug: "cambridge-awards-2025", cat: "Học thuật", date: "2026-06-12", author: "Phòng Học thuật VAS", title: "Gần 600 học sinh VAS được vinh danh tại Cambridge Awards 2025", excerpt: "Lễ trao giải ghi nhận thành tích IGCSE, AS & A Level nổi bật, trong đó có các danh hiệu Top in Vietnam.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/cam%20award%20%285%29.jpg", body: ["Lễ vinh danh Cambridge Awards 2025 diễn ra tại cơ sở Riverside với sự tham dự của học sinh, phụ huynh và thầy cô.", "Nhiều học sinh đạt danh hiệu Top in Vietnam và Top in the World ở các môn Toán, Vật lý và Tiếng Anh.", "Thành tích phản ánh quá trình học tập bền bỉ từ các cấp học dưới."] },
      { slug: "vas-olympics-2026", cat: "Thể thao", date: "2026-05-30", author: "Tổ Thể chất VAS", title: "VAS Olympics 2026: hơn 2.000 học sinh và phụ huynh cùng tranh tài", excerpt: "Gần 900 huy chương được trao ở 6 bộ môn trong ngày hội thể thao lớn nhất năm.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/2Rss8Y19k1HSYe2nN478uJTay6qCwc4CtWxjyNbz.jpeg", body: ["VAS Olympics 2026 quy tụ học sinh từ cả sáu cơ sở thi đấu bơi lội, điền kinh, bóng đá, bóng rổ, cầu lông và cờ vua.", "Năm nay, nội dung tiếp sức gia đình thu hút hơn 300 phụ huynh tham gia.", "Ban tổ chức cảm ơn đội ngũ tình nguyện viên là học sinh THPT."] },
      { slug: "english-speaking-contest", cat: "Sự kiện", date: "2026-04-21", author: "Tổ Tiếng Anh VAS", title: "Chung kết English Speaking Contest tại Riverside", excerpt: "Gần 100 học sinh từ lớp 1 đến lớp 12 bước vào vòng chung kết hệ thống.", img: "https://cdn2.tuoitre.vn/thesaigontimes/uploads/2024/11/VAS_1.jpg", body: ["Vòng chung kết English Speaking Contest diễn ra trong hai ngày tại hội trường Riverside.", "Các thí sinh trình bày bài nói về chủ đề 'Ngôi trường của tương lai'.", "Ban giám khảo đánh giá cao sự tự tin và khả năng phản biện của học sinh."] },
      { slug: "robotics-2026", cat: "Học thuật", date: "2026-03-15", author: "CLB Robotics VAS", title: "Chung kết VAS Robotics 2025–2026: từ ý tưởng đến giải pháp", excerpt: "Các đội thi mang đến những robot giải quyết bài toán thật trong trường học và cộng đồng.", img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/chung-ket-cuoc-thi-vas-robotics-2025-2026-anh-11", body: ["24 đội thi bước vào vòng chung kết VAS Robotics với chủ đề 'Trường học xanh'.", "Đội vô địch thiết kế robot phân loại rác tự động cho căn tin.", "Cuộc thi là một phần của chương trình STEM xuyên suốt các cấp học."] },
    ],
  };

  const scholarships = [
    { id: "xuat-sac", name: "Học bổng Xuất Sắc VAS", short: "Xuất Sắc VAS", minGrade: 1, maxGrade: 11, minScore: 8.5, needs: "achievement", value: "Tối đa 50% học phí năm học", deadline: "2027-03-31", summary: "Dành cho học sinh có thành tích học tập nổi trội và thành tích ở sân chơi học thuật hoặc năng khiếu." },
    { id: "kien-tao", name: "Học bổng VASer Kiến Tạo Thay Đổi", short: "Kiến Tạo Thay Đổi", minGrade: 6, maxGrade: 11, minScore: 7.0, needs: "community", value: "Tối đa 30% học phí năm học", deadline: "2027-03-31", summary: "Ghi nhận học sinh có dự án hoặc hoạt động tạo thay đổi tích cực cho cộng đồng." },
  ];

  const jobs = [
    { id: "gv-tieu-hoc", title: "Giáo viên Tiểu học (Cambridge)", dept: "teaching", deptLabel: "Giảng dạy", campus: "Riverside", type: "Toàn thời gian", posted: "2026-10-28", deadline: "2026-12-15", summary: "Giảng dạy Toán, Khoa học và Tiếng Anh theo chương trình Cambridge Primary cho học sinh Lớp 1–5.", duties: ["Lập kế hoạch bài dạy theo khung Cambridge Primary", "Theo dõi tiến bộ và trao đổi định kỳ với phụ huynh", "Phối hợp với giáo viên Việt Nam trong lớp song ngữ"], requirements: ["Bằng Cử nhân Sư phạm hoặc tương đương", "Tối thiểu 2 năm kinh nghiệm giảng dạy", "IELTS 7.0 hoặc tương đương"] },
    { id: "gv-toan-thcs", title: "Giáo viên Toán Trung học", dept: "teaching", deptLabel: "Giảng dạy", campus: "Sala", type: "Toàn thời gian", posted: "2026-10-20", deadline: "2026-12-10", summary: "Giảng dạy Toán Cambridge Lower Secondary và IGCSE cho học sinh Lớp 6–10.", duties: ["Giảng dạy và ra đề đánh giá theo chuẩn Cambridge", "Bồi dưỡng đội tuyển Toán", "Tham gia sinh hoạt chuyên môn liên cơ sở"], requirements: ["Bằng Cử nhân Toán hoặc Sư phạm Toán", "Kinh nghiệm IGCSE là lợi thế", "Giao tiếp tiếng Anh tốt"] },
    { id: "gv-mam-non", title: "Giáo viên Mầm non song ngữ", dept: "teaching", deptLabel: "Giảng dạy", campus: "Garden Hills", type: "Toàn thời gian", posted: "2026-11-02", deadline: "2026-12-20", summary: "Đồng hành cùng trẻ 3–5 tuổi trong môi trường song ngữ, học qua chơi.", duties: ["Tổ chức hoạt động học qua chơi", "Chăm sóc và quan sát sự phát triển của trẻ", "Ghi nhận nhật ký lớp học cho phụ huynh"], requirements: ["Bằng Cao đẳng/Đại học Sư phạm Mầm non", "Yêu trẻ, kiên nhẫn", "Tiếng Anh giao tiếp"] },
    { id: "giam-sat-ho-boi", title: "Nhân viên Giám sát hồ bơi", dept: "support", deptLabel: "Hỗ trợ", campus: "Sala", type: "Bán thời gian", posted: "2026-10-15", deadline: "2026-11-30", summary: "Đảm bảo an toàn cho học sinh trong các giờ học bơi và hoạt động dưới nước.", duties: ["Giám sát an toàn hồ bơi theo ca", "Kiểm tra thiết bị cứu hộ hằng ngày", "Phối hợp với giáo viên thể chất"], requirements: ["Chứng chỉ cứu hộ còn hiệu lực", "Sức khỏe tốt", "Ưu tiên có kinh nghiệm trường học"] },
    { id: "y-te-hoc-duong", title: "Nhân viên Y tế học đường", dept: "support", deptLabel: "Hỗ trợ", campus: "Ba Tháng Hai", type: "Toàn thời gian", posted: "2026-10-25", deadline: "2026-12-05", summary: "Theo dõi sức khỏe, sơ cứu và tư vấn chăm sóc sức khỏe cho học sinh.", duties: ["Sơ cứu và xử lý tình huống y tế ban đầu", "Quản lý hồ sơ sức khỏe học sinh", "Tổ chức truyền thông sức khỏe"], requirements: ["Bằng Điều dưỡng hoặc Y sĩ", "Chứng chỉ hành nghề", "Tối thiểu 1 năm kinh nghiệm"] },
    { id: "tts-tuyen-sinh", title: "Thực tập sinh Tư vấn tuyển sinh", dept: "office", deptLabel: "Văn phòng", campus: "Riverside", type: "Thực tập", posted: "2026-11-05", deadline: "2026-12-31", summary: "Hỗ trợ đội tuyển sinh đón tiếp gia đình, chuẩn bị hồ sơ và sự kiện ngày hội tuyển sinh.", duties: ["Đón tiếp và hướng dẫn gia đình tham quan", "Cập nhật hồ sơ dự tuyển", "Hỗ trợ tổ chức ngày hội tuyển sinh"], requirements: ["Sinh viên năm 3–4", "Giao tiếp tốt", "Sử dụng thành thạo tin học văn phòng"] },
    { id: "chuyen-vien-truyen-thong", title: "Chuyên viên Truyền thông nội dung", dept: "office", deptLabel: "Văn phòng", campus: "Ba Tháng Hai", type: "Toàn thời gian", posted: "2026-10-10", deadline: "2026-11-25", summary: "Phát triển nội dung câu chuyện học sinh, sự kiện và tuyển sinh trên các kênh của VAS.", duties: ["Viết và biên tập bài viết, kịch bản video", "Lên lịch nội dung đa kênh", "Phối hợp với các cơ sở để thu thập câu chuyện"], requirements: ["Tối thiểu 2 năm kinh nghiệm nội dung", "Viết tiếng Việt chuẩn mực", "Tiếng Anh đọc hiểu tốt"] },
  ];

  /* Dữ liệu người dùng ban đầu của một phiên. Để trống để mọi luồng bắt đầu
     từ trạng thái rỗng thật. */
  const records = {
    applications: [],
    tours: [],
    scholarshipApps: [],
    jobApps: [],
    alumni: null,
    contacts: [],
    inquiries: [],
    savedPath: null,
    tuitionCalc: null,
    wizards: {},
  };

  window.VAS_SEED = Object.freeze({ version: 1, campuses, programmes, grades, tuition, tours, news, scholarships, jobs, records });
})();
