/* Trang Các cơ sở — Campus Finder */
const imageUrl = (source, w, h) => source.startsWith("http") ? source : img(source, w, h);

const CAMPUSES = [
  {
    id: "sala",
    number: "01",
    name: "Sala",
    shortName: "SALA",
    district: "Thủ Đức",
    districtKey: "thu-duc",
    address: "1 Bùi Thiện Ngộ, KĐT Sala, TP. Thủ Đức",
    ages: "Mầm non — THPT",
    levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xanh", "xuyen-cap", "the-thao"],
    label: "Mega Campus · Thủ Đức",
    tagline: "Một không gian lớn để con lớn lên.",
    description: "Không gian rộng mở cho một hành trình xuyên cấp. Sala có hơn 7.000 m² đất dành cho cây xanh, hoạt động và trải nghiệm của học sinh.",
    highlights: ["Mầm non → THPT", "Khuôn viên xanh", "Hoạt động ngoài trời", "Cambridge", "Phòng chức năng", "Hồ bơi / thể thao"],
    comparison: "Mega Campus, không gian xanh",
    phone: "028 3622 0833",
    rating: "4,4",
    img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/DSC06094.jpg",
    lifeImg: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1562774053-701939374585?w=900&h=650&fit=crop&auto=format&q=80"
  },
  {
    id: "riverside",
    number: "02",
    name: "Riverside",
    shortName: "RIVERSIDE",
    district: "Quận 7",
    districtKey: "quan-7",
    address: "99 Nguyễn Thị Thập, Quận 7",
    ages: "Mầm non — THPT",
    levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xanh", "xuyen-cap", "the-thao", "nghe-thuat"],
    label: "Mega Campus · Quận 7",
    tagline: "Không gian để học. Khoảng xanh để lớn.",
    description: "Một campus lớn, một hành trình liền mạch. Riverside nổi bật với không gian hiện đại, nhiều mảng xanh cùng các khu vực khoa học, ICT, nghệ thuật và thể thao.",
    highlights: ["Mầm non → THPT", "Khuôn viên lớn", "Mảng xanh", "Phòng thí nghiệm", "ICT / nghệ thuật", "Thể thao"],
    comparison: "Campus lớn, nhiều mảng xanh",
    phone: "028 3622 0898",
    rating: "4,4",
    img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/giju3EonpIqxIQZ9elHcTqHYODyGVoxRhTJfA52A.jpeg",
    lifeImg: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=650&fit=crop&auto=format&q=80"
  },
  {
    id: "garden-hills",
    number: "03",
    name: "Garden Hills",
    shortName: "GARDEN HILLS",
    district: "Gò Vấp",
    districtKey: "go-vap",
    address: "168 Phan Văn Trị, Gò Vấp",
    ages: "Mầm non — THPT",
    levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xanh", "xuyen-cap", "the-thao", "nghe-thuat"],
    label: "Gò Vấp",
    tagline: "Không gian xanh. Tư duy rộng mở.",
    description: "Giữa lòng thành phố, gần thiên nhiên. Garden Hills được thiết kế theo xu hướng kiến trúc xanh với nhiều không gian mở, hồ bơi và sân bóng.",
    highlights: ["Mầm non → THPT", "Kiến trúc xanh", "Không gian mở", "Công nghệ lớp học", "Hồ bơi", "STEM / nghệ thuật"],
    comparison: "Kiến trúc xanh, không gian mở",
    phone: "028 3588 3088",
    rating: "4,4",
    img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/3pzEV3VqNl8Eefi0SwcqqtGXC27WCNElPoTqpFXc.jpeg",
    lifeImg: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=650&fit=crop&auto=format&q=80"
  },
  {
    id: "sunrise",
    number: "04",
    name: "Sunrise",
    shortName: "SUNRISE",
    district: "Quận 7",
    districtKey: "quan-7",
    address: "Số 1, Đường số 20, Khu đô thị Him Lam, Quận 7",
    ages: "Mầm non — THPT",
    levels: ["mam-non", "tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xuyen-cap", "the-thao", "nghe-thuat"],
    label: "Him Lam · Quận 7",
    tagline: "Một khởi đầu tốt cho hành trình dài.",
    description: "Khởi đầu nhẹ nhàng, phát triển vững vàng. Vị trí trong khu đô thị Him Lam giúp Sunrise trở thành lựa chọn thuận tiện cho gia đình Nam Sài Gòn.",
    highlights: ["Mầm non → THPT", "Khu đô thị Him Lam", "Không gian đa chức năng", "Cambridge", "Ngoại khóa", "Thể thao & nghệ thuật"],
    comparison: "Khu đô thị Him Lam, thuận tiện",
    phone: "028 3622 6611",
    rating: "4,5",
    img: "https://www.vas.edu.vn/_next/image?url=https%3A%2F%2Fmgs-storage.sgp1.digitaloceanspaces.com%2Fvas%2Fmedia%2Fcoso-sunrise-2710.jpg&w=3840&q=75",
    lifeImg: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=650&fit=crop&auto=format&q=80"
  },
  {
    id: "hoang-van-thu",
    number: "05",
    name: "Hoàng Văn Thụ",
    shortName: "HOÀNG VĂN THỤ",
    district: "Phú Nhuận",
    districtKey: "phu-nhuan",
    address: "202 Hoàng Văn Thụ, Phú Nhuận",
    ages: "Tiểu học — THPT",
    levels: ["tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xuyen-cap", "nghe-thuat"],
    label: "Phú Nhuận",
    tagline: "Gần hơn để đồng hành lâu hơn.",
    description: "Trung tâm thành phố, gần hơn với gia đình. Cơ sở phù hợp với phụ huynh Phú Nhuận và các khu vực lân cận, có dịch vụ xe đưa đón.",
    highlights: ["Vị trí trung tâm", "Tiện lợi đưa đón", "Tiểu học → THPT", "Cambridge", "Học thuật", "Ngoại khóa"],
    comparison: "Vị trí trung tâm, thuận tiện",
    phone: "028 3999 0112",
    rating: "4,0",
    img: "https://www.vas.edu.vn/_next/image?url=https%3A%2F%2Fmgs-storage.sgp1.digitaloceanspaces.com%2Fvas%2Fmedia%2FDSCF5583.jpg&w=3840&q=75",
    lifeImg: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=900&h=650&fit=crop&auto=format&q=80"
  },
  {
    id: "ba-thang-hai",
    number: "06",
    name: "Ba Tháng Hai",
    shortName: "BA THÁNG HAI",
    district: "Quận 10",
    districtKey: "quan-10",
    address: "594 Ba Tháng Hai, Quận 10",
    ages: "Tiểu học — THPT",
    levels: ["tieu-hoc", "thcs", "thpt"],
    priorities: ["gan-nha", "xuyen-cap", "the-thao"],
    label: "Quận 10",
    tagline: "Vững nền tảng. Mở tương lai.",
    description: "Nền tảng vững vàng giữa lòng thành phố. Ba Tháng Hai là một trong những cơ sở lâu đời của hệ thống, đào tạo các cấp học phổ thông và có dịch vụ xe đưa đón.",
    highlights: ["Tiểu học → THPT", "Vị trí trung tâm", "Cơ sở lâu đời", "Cambridge", "Học thuật", "Xe đưa đón"],
    comparison: "Quận 10, vị trí trung tâm",
    phone: "028 3864 1770",
    rating: "4,0",
    img: "https://mgs-storage.sgp1.digitaloceanspaces.com/vas/media/tkpCBTcMmoj2bGdaIQ486f1suUMI31f4O79QPklE.jpeg",
    lifeImg: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1100&h=750&fit=crop&auto=format&q=80",
    spaceImg: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=900&h=650&fit=crop&auto=format&q=80"
  }
];

const FILTERS = { level: "all", district: "all", priority: "all" };
const byId = (id) => CAMPUSES.find((campus) => campus.id === id) || CAMPUSES[0];
const safe = (value) => esc(String(value));

function matches(campus) {
  const levelMatch = FILTERS.level === "all" || campus.levels.includes(FILTERS.level);
  const districtMatch = FILTERS.district === "all" || campus.districtKey === FILTERS.district;
  const priorityMatch = FILTERS.priority === "all" || campus.priorities.includes(FILTERS.priority);
  return levelMatch && districtMatch && priorityMatch;
}

function cardTemplate(campus) {
  return `
    <article class="campus-editorial-card" data-campus-card="${safe(campus.id)}">
      <div class="campus-card-media">
        <img src="${imageUrl(campus.img, 1200, 800)}" alt="Khuôn viên cơ sở VAS ${safe(campus.name)}" loading="lazy" />
        <span class="campus-card-index">${safe(campus.number)} / 06</span>
        <span class="campus-card-level">${safe(campus.ages)}</span>
      </div>
      <div class="campus-card-body">
        <div class="campus-card-kicker"><span>${safe(campus.shortName)}</span><span>${safe(campus.label)}</span></div>
        <h3>${safe(campus.name)}</h3>
        <p class="campus-tagline">“${safe(campus.tagline)}”</p>
        <p>${safe(campus.description)}</p>
        <div class="tag-list">${campus.highlights.slice(0, 4).map((item) => `<span>${safe(item)}</span>`).join("")}</div>
        <div class="campus-card-actions"><button class="text-link" type="button" data-focus-campus="${safe(campus.id)}">Xem trên bản đồ →</button><a class="text-link" href="../tuyen-sinh/#dang-ky">Đăng ký tư vấn →</a></div>
      </div>
      <div class="campus-card-gallery" aria-hidden="true"><img src="${imageUrl(campus.lifeImg, 520, 360)}" alt="" loading="lazy" /><img src="${imageUrl(campus.spaceImg, 520, 360)}" alt="" loading="lazy" /></div>
    </article>`;
}

function renderCards() {
  const grid = document.getElementById("campusGrid");
  const filtered = CAMPUSES.filter(matches);
  if (!filtered.length) {
    grid.innerHTML = `<div class="finder-empty"><span class="eyebrow">Chưa có kết quả</span><h3>Hãy thử mở rộng lựa chọn.</h3><p>Không có cơ sở nào khớp cả ba điều kiện hiện tại. Bạn có thể đặt lại bộ lọc hoặc bắt đầu với một tiêu chí duy nhất.</p><button class="btn btn-dark" type="button" id="emptyReset">Đặt lại bộ lọc</button></div>`;
  } else {
    grid.innerHTML = filtered.map(cardTemplate).join("");
  }
  const count = document.getElementById("finderCount");
  count.textContent = filtered.length ? `${filtered.length} cơ sở phù hợp với bạn` : "Không có cơ sở phù hợp";
  count.setAttribute("aria-live", "polite");
  document.querySelectorAll("[data-focus-campus]").forEach((button) => button.addEventListener("click", () => focusCampus(button.dataset.focusCampus)));
  const emptyReset = document.getElementById("emptyReset");
  if (emptyReset) emptyReset.addEventListener("click", resetFinder);
}

function updateChoices() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = FILTERS[button.dataset.filter] === button.dataset.value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function resetFinder() {
  FILTERS.level = "all";
  FILTERS.district = "all";
  FILTERS.priority = "all";
  updateChoices();
  renderCards();
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    FILTERS[button.dataset.filter] = button.dataset.value;
    updateChoices();
    renderCards();
  });
});
document.getElementById("resetFinder").addEventListener("click", resetFinder);

function mapCardTemplate(campus) {
  return `<span class="eyebrow">Cơ sở ${safe(campus.number)} · ${safe(campus.district)}</span><h3>${safe(campus.name)}</h3><p class="map-card-tagline">${safe(campus.tagline)}</p><p>${safe(campus.address)}.</p><div class="map-card-meta"><span>${safe(campus.ages)}</span><span>${safe(campus.phone)}</span></div><div class="row"><button type="button" class="btn btn-dark" data-focus-detail="${safe(campus.id)}">Xem cơ sở →</button><a class="btn btn-outline-dark" href="../tuyen-sinh/#dang-ky">Đăng ký tư vấn</a></div>`;
}

function setActiveMarker(id) {
  document.querySelectorAll("[data-campus]").forEach((marker) => marker.classList.toggle("is-active", marker.dataset.campus === id));
}

function renderMap(id = "sala") {
  const campus = byId(id);
  document.getElementById("mapCard").innerHTML = mapCardTemplate(campus);
  setActiveMarker(campus.id);
  document.querySelectorAll("[data-focus-detail]").forEach((button) => button.addEventListener("click", () => {
    document.querySelector(`[data-campus-card="${campus.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
}

function focusCampus(id) {
  renderMap(id);
  document.getElementById("ban-do").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-campus]").forEach((marker) => marker.addEventListener("click", () => renderMap(marker.dataset.campus)));

const comparisonBody = document.getElementById("comparisonBody");
comparisonBody.innerHTML = CAMPUSES.map((campus) => `<tr><th scope="row"><span class="table-number">${safe(campus.number)}</span>${safe(campus.name)}</th><td>${safe(campus.district)}</td><td>${safe(campus.ages)}</td><td>${safe(campus.comparison)}</td></tr>`).join("");

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-focus-campus]");
  if (link) focusCampus(link.dataset.focusCampus);
});

updateChoices();
renderCards();
renderMap();
