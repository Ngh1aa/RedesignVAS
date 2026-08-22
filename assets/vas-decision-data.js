(function () {
  const programmes = [
    {
      id: "cep",
      code: "CEP",
      name: "Cambridge English Programme",
      short: "Tiếng Anh Cambridge tăng cường",
      summary: "Giữ nền tảng chương trình Việt Nam và mở rộng năng lực tiếng Anh quốc tế.",
      fit: "Gia đình muốn giữ chương trình Việt Nam đầy đủ và tăng cường môi trường tiếng Anh.",
      levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    },
    {
      id: "cap",
      code: "CAP",
      name: "Cambridge Academic Programme",
      short: "Cambridge học thuật song song",
      summary: "Kết hợp nền tảng Việt Nam với tư duy và các môn học thuật Cambridge.",
      fit: "Gia đình muốn con phát triển song song nền tảng Việt Nam và năng lực học tập quốc tế.",
      levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    },
    {
      id: "capi",
      code: "CAPI",
      name: "Cambridge Academic Programme International",
      short: "Cambridge chuyên sâu quốc tế",
      summary: "Tập trung mạnh vào chương trình Cambridge và các môn học bằng tiếng Anh.",
      fit: "Gia đình định hướng đại học quốc tế mạnh và muốn theo chuỗi Cambridge từ sớm.",
      levels: ["tieu-hoc", "thcs", "thpt"],
    },
  ];

  const campuses = [
    { id: "sala", name: "Sala", district: "Thủ Đức", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "1 Bùi Thiện Ngộ, KĐT Sala, TP. Thủ Đức" },
    { id: "riverside", name: "Riverside", district: "Quận 7", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "99 Nguyễn Thị Thập, Quận 7" },
    { id: "garden-hills", name: "Garden Hills", district: "Gò Vấp", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "168 Phan Văn Trị, Gò Vấp" },
    { id: "sunrise", name: "Sunrise", district: "Quận 7", levels: ["mam-non", "tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "Số 1, Đường số 20, Khu đô thị Him Lam, Quận 7" },
    { id: "hoang-van-thu", name: "Hoàng Văn Thụ", district: "Phú Nhuận", levels: ["tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "202 Hoàng Văn Thụ, Phú Nhuận" },
    { id: "ba-thang-hai", name: "Ba Tháng Hai", district: "Quận 10", levels: ["tieu-hoc", "thcs", "thpt"], programmes: ["cep", "cap", "capi"], address: "594 Ba Tháng Hai, Quận 10" },
  ];

  // Values are intentionally null until the approved VAS fee table is connected.
  const tuition = { schoolYear: "2026–2027", currency: "VND", records: [] };
  const labels = {
    levels: { "mam-non": "Mầm non", "tieu-hoc": "Lớp 1–5", thcs: "Lớp 6–8", thpt: "Lớp 9–12" },
    paymentPlans: { one: "1 lần / năm", two: "2 lần / năm", four: "4 lần / năm" },
  };

  const programmeById = (id) => programmes.find((item) => item.id === id);
  const campusById = (id) => campuses.find((item) => item.id === id);
  const matchingCampuses = (level, programme) => campuses.filter((campus) => campus.levels.includes(level) && campus.programmes.includes(programme));
  const gradeToLevel = (grade) => grade === "mam-non" ? "mam-non" : grade === "1-5" ? "tieu-hoc" : grade === "6-8" ? "thcs" : "thpt";

  window.VAS_DECISION_DATA = { programmes, campuses, tuition, labels, programmeById, campusById, matchingCampuses, gradeToLevel };
})();
