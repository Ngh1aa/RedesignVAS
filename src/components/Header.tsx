import { useEffect, useState } from "react";

const MENU: Record<string, { heading: string; note: string; links: string[] }> = {
  "Về VAS": {
    heading: "20 năm dẫn đầu khối song ngữ",
    note: "Bằng chứng, không phải lời nói.",
    links: [
      "Câu chuyện VAS",
      "Ban lãnh đạo",
      "Đội ngũ giáo viên",
      "Thành tích học sinh",
      "Lộ trình vào đại học",
      "Giá trị cốt lõi",
    ],
  },
  "Chương trình": {
    heading: "Hành trình xuyên cấp 16 năm",
    note: "Một lộ trình liền mạch, từ Mầm non đến Lớp 12.",
    links: [
      "Mầm non",
      "Tiểu học",
      "Trung học cơ sở",
      "Trung học phổ thông",
      "Cambridge toàn phần (CAPI)",
      "Song ngữ Cambridge (CAP)",
      "Tiếng Anh Cambridge (CEP)",
    ],
  },
  "Các cơ sở": {
    heading: "6 cơ sở trên khắp TP.HCM",
    note: "Tìm cơ sở phù hợp với gia đình bạn.",
    links: [
      "Tất cả cơ sở",
      "Ba Tháng Hai",
      "Riverside",
      "Sunrise",
      "Sala",
      "Garden Hills",
      "Hoàng Văn Thụ",
    ],
  },
  "Tuyển sinh": {
    heading: "Bước tiếp theo bắt đầu từ đây",
    note: "Rõ ràng, ấm áp và không áp lực.",
    links: [
      "Quy trình tuyển sinh",
      "Học phí",
      "Điều kiện nhập học",
      "Câu hỏi thường gặp",
      "Đặt lịch tham quan",
    ],
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

const NAV = Object.keys(MENU);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      onMouseLeave={() => setOpen(null)}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-paper/95 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3" aria-label="Trường Quốc tế Việt Úc (VAS) — Trang chủ">
          <span
            className={`grid place-items-center rounded-xl transition-colors ${
              solid ? "bg-transparent p-2" : "bg-paper px-3.5 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            }`}
          >
            <img
              src="https://www.vas.edu.vn/asset/svg/logo-top.svg"
              alt="Trường Quốc tế Việt Úc (VAS)"
              className="h-[30px] w-auto"
            />
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <button
              key={item}
              onMouseEnter={() => setOpen(item)}
              onFocus={() => setOpen(item)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                open === item
                  ? "text-vas-red"
                  : solid
                    ? "text-ink hover:text-vas-red"
                    : "text-paper/90 hover:text-paper"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Tìm kiếm"
            className={`hidden h-10 w-10 place-items-center rounded-full border transition-colors sm:grid ${
              solid
                ? "border-line text-ink hover:border-vas-red hover:text-vas-red"
                : "border-paper/40 text-paper hover:border-paper"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <a
            href="#admissions"
            className="hidden rounded-full bg-vas-red px-5 py-2.5 text-[14px] font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:bg-vas-red-deep sm:inline-block"
          >
            Đặt lịch tham quan
          </a>
          <button
            aria-label="Menu"
            onClick={() => setMobile((v) => !v)}
            className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${
              solid ? "text-ink" : "text-paper"
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobile ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {open && (
        <div className="hidden animate-rise border-t border-line bg-paper lg:block">
          <div className="mx-auto grid max-w-[1440px] grid-cols-[1.1fr_1.4fr] gap-12 px-10 py-10">
            <div className="max-w-sm">
              <p className="font-display text-[26px] leading-tight text-vas-red">
                {MENU[open].heading}
              </p>
              <p className="mt-3 text-[15px] text-ink-soft">{MENU[open].note}</p>
              <a
                href="#admissions"
                className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-vas-red"
              >
                Đặt lịch tham quan cá nhân
                <span aria-hidden>→</span>
              </a>
            </div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 self-center">
              {MENU[open].links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="group flex items-center justify-between border-b border-line py-3 text-[15px] text-ink transition-colors hover:text-vas-red"
                  >
                    {l}
                    <span className="text-line transition-colors group-hover:text-gold" aria-hidden>
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-paper px-5 pb-8 pt-2 lg:hidden">
          {NAV.map((item) => (
            <details key={item} className="border-b border-line py-1">
              <summary className="cursor-pointer list-none py-3 text-[16px] font-medium text-ink">
                {item}
              </summary>
              <ul className="pb-2">
                {MENU[item].links.map((l) => (
                  <li key={l}>
                    <a href="#" className="block py-2 pl-3 text-[15px] text-ink-soft">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <a
            href="#admissions"
            className="mt-5 block rounded-full bg-vas-red px-5 py-3.5 text-center text-[15px] font-semibold text-paper"
          >
            Đặt lịch tham quan
          </a>
        </div>
      )}
    </header>
  );
}
