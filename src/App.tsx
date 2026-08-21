import { useState } from "react";
import Header from "./components/Header";
import { Reveal, Counter, img } from "./components/primitives";

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] ${
        light ? "text-gold-soft" : "text-vas-red"
      }`}
    >
      <span className="h-px w-6 bg-gold" />
      {children}
    </span>
  );
}

function Arrow() {
  return <span aria-hidden>→</span>;
}

/* ------------------------------------------------------------------ */
/* 01 — Hero                                                           */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-vas-red-deep">
      <img
        src={img("1728743264694-4ac39fa29385", 1900, 1300)}
        alt="Học sinh VAS cùng nhau học tập trong lớp"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-vas-red-deep/85 via-vas-red-deep/40 to-vas-red-deep/95" />
      <div className="grain absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-40 lg:px-10 lg:pb-24">
        <div className="max-w-4xl animate-rise">
          <Eyebrow light>Trường Quốc tế Việt Úc — VAS</Eyebrow>
          <h1 className="mt-6 font-display text-[clamp(2.9rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-paper">
            Nơi mỗi đứa trẻ khám phá
            <span className="italic text-gold-soft"> khả năng thật sự của mình.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-paper/85 lg:text-[19px]">
            Một nền giáo dục quốc tế được thiết kế để mỗi học sinh được học, trưởng thành và
            tỏa sáng — từ ngày đầu đến trường đến cánh cửa đại học của tương lai.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#admissions"
              className="rounded-full bg-paper px-7 py-3.5 text-[15px] font-semibold text-vas-red transition-transform hover:-translate-y-0.5"
            >
              Đặt lịch tham quan
            </a>
            <a
              href="#why"
              className="rounded-full border border-paper/50 px-7 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              Khám phá VAS
            </a>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] text-paper/60">
          <span className="h-px w-10 bg-paper/40" />
          Khám phá · Thấu hiểu · Tin tưởng · Ghé thăm
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Trust / Proof                                                  */
/* ------------------------------------------------------------------ */

const PROOF = [
  { n: 20, suffix: " năm", label: "dẫn đầu khối song ngữ", note: "Kể từ 2004, lớn lên cùng các gia đình Việt." },
  { n: 6, suffix: " cơ sở", label: "trên khắp TP.HCM", note: "Luôn có một cộng đồng VAS gần bạn." },
  { n: 8000, suffix: "+", label: "học sinh mỗi năm học", note: "Một trong những cộng đồng trường học lớn nhất." },
  { n: 16, suffix: " năm", label: "học xuyên cấp liền mạch", note: "Một lộ trình, từ Mầm non đến Lớp 12." },
];

function Trust() {
  return (
    <section className="border-b border-line bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Vì sao phụ huynh chọn VAS</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight text-ink">
              Những con số chỉ có ý nghĩa khi phía sau là một câu chuyện thật.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((p, i) => (
            <Reveal key={p.label} delay={i * 90} className="bg-paper">
              <div className="flex h-full flex-col justify-between gap-6 p-8">
                <div className="font-display text-[3.4rem] font-medium leading-none text-vas-red">
                  <Counter to={p.n} suffix={p.suffix} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{p.label}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{p.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-[14px] text-ink-soft">
            <span className="font-semibold text-ink">Hệ thống chuẩn Cambridge lớn nhất TP.HCM</span>
            <span className="h-4 w-px bg-line" />
            <span>Nhiều thủ khoa thế giới &amp; Việt Nam</span>
            <span className="h-4 w-px bg-line" />
            <span>Cựu học sinh tại 200+ đại học toàn cầu</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Why VAS (differentiators)                                      */
/* ------------------------------------------------------------------ */

const DIFF = [
  {
    t: "Chuẩn Cambridge",
    d: "Chương trình được công nhận toàn cầu, mở ra cánh cửa đến các đại học trên khắp thế giới.",
    img: "1758685734062-165cc0094e61",
  },
  {
    t: "Tiềm năng cá nhân",
    d: "Mỗi đứa trẻ học theo một cách riêng. Chúng tôi tạo không gian và sự hỗ trợ để con phát triển.",
    img: "1581726707445-75cbe4efc586",
  },
  {
    t: "Giáo dục song ngữ",
    d: "Thành thạo cả tiếng Anh và tiếng Việt — tầm nhìn toàn cầu, giữ vững gốc rễ quê hương.",
    img: "1561089489-f13d5e730d72",
  },
  {
    t: "Bản sắc Việt Nam",
    d: "Tự tin bước ra thế giới, với niềm tự hào sâu sắc về nơi mình sinh ra.",
    img: "1677128346173-f460d0e2560a",
  },
];

function WhyVas() {
  return (
    <section id="why" className="bg-paper-deep py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <h2 className="max-w-2xl font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] text-ink">
              Không chỉ là một ngôi trường.
              <span className="block italic text-vas-red">Một hành trình cho cả cuộc đời.</span>
            </h2>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-soft">
              VAS kết hợp tinh hoa của giáo dục quốc tế và trái tim của giáo dục Việt Nam — để con
              bạn trưởng thành thành một người trẻ bản lĩnh, ham học hỏi và vững vàng.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {DIFF.map((d, i) => (
            <Reveal key={d.t} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(138,20,20,0.35)]">
                <div className="aspect-[4/5] overflow-hidden bg-paper-deep">
                  <img
                    src={img(d.img, 640, 800)}
                    alt={d.t}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[1.35rem] text-ink">{d.t}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{d.d}</p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-vas-red opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Tìm hiểu thêm <Arrow />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Educational journey + programmes                               */
/* ------------------------------------------------------------------ */

const STAGES = [
  { age: "2–5 tuổi", t: "Mầm non", d: "Vui chơi, tò mò và niềm vui của những khám phá đầu đời." },
  { age: "6–10 tuổi", t: "Tiểu học", d: "Nền tảng vững chắc về ngôn ngữ, tư duy và nhân cách." },
  { age: "11–14 tuổi", t: "Trung học cơ sở", d: "Sự tò mò được rèn thành bản lĩnh học thuật thực thụ." },
  { age: "15–18 tuổi", t: "Trung học phổ thông", d: "Chứng chỉ Cambridge và con đường vào đại học." },
];

const PROGRAMMES = [
  {
    code: "CAPI",
    name: "Chương trình Cambridge Toàn phần",
    tag: "Quốc tế nhất",
    english: "Đến 70% bằng tiếng Anh",
    d: "Mức độ hội nhập quốc tế cao nhất tại VAS — lộ trình Cambridge dành cho các gia đình hướng đến những đại học hàng đầu ở nước ngoài, với tiếng Anh xuyên suốt mọi môn học.",
    for: "Học sinh hướng tới nền giáo dục toàn cầu, ưu tiên tiếng Anh.",
  },
  {
    code: "CAP",
    name: "Chương trình Song ngữ Cambridge",
    tag: "Lộ trình cân bằng",
    english: "~50% bằng tiếng Anh",
    d: "Lộ trình song ngữ cân bằng, kết hợp trọn vẹn chương trình quốc gia Việt Nam với các môn Cambridge — vừa vững gốc rễ, vừa vươn tầm quốc tế.",
    for: "Gia đình muốn con vừa giỏi tiếng Việt vừa hội nhập quốc tế.",
  },
  {
    code: "CEP",
    name: "Chương trình Tiếng Anh Cambridge",
    tag: "Nền tảng tiếng Anh",
    english: "Tiếng Anh tăng cường",
    d: "Chương trình quốc gia Việt Nam được làm giàu bằng chương trình Tiếng Anh Cambridge chuẩn mực — xây dựng khả năng giao tiếp tự tin ngay từ những ngày đầu.",
    for: "Học sinh từng bước tiến tới học tập quốc tế theo thời gian.",
  },
];

function Journey() {
  const [active, setActive] = useState(0);
  const p = PROGRAMMES[active];

  return (
    <section id="education" className="bg-vas-red-deep py-20 text-paper lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow light>Hành trình học tập</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]">
              Một lộ trình liền mạch,
              <span className="italic text-gold-soft"> trưởng thành cùng con bạn.</span>
            </h2>
          </div>
        </Reveal>

        {/* stage timeline */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-paper/15 bg-paper/10 md:grid-cols-4">
          {STAGES.map((s, i) => (
            <Reveal key={s.t} delay={i * 90} className="bg-vas-red-deep">
              <div className="flex h-full flex-col gap-3 p-7">
                <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-gold-soft">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-[11px]">
                    0{i + 1}
                  </span>
                  {s.age}
                </span>
                <h3 className="font-display text-[1.6rem] leading-tight">{s.t}</h3>
                <p className="text-[14px] leading-relaxed text-paper/70">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* programme selector */}
        <Reveal delay={100}>
          <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
            <div>
              <p className="text-[15px] text-paper/70">
                Ba lộ trình Cambridge. Chọn mức độ quốc tế phù hợp cho hành trình của con —
                chúng tôi sẽ đồng hành để bạn tìm ra lựa chọn đúng.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {PROGRAMMES.map((pr, i) => (
                  <button
                    key={pr.code}
                    onClick={() => setActive(i)}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                      active === i
                        ? "border-gold bg-paper text-vas-red"
                        : "border-paper/20 text-paper hover:border-paper/50"
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-[1.5rem] font-semibold">{pr.code}</span>
                      <span className="text-[13px] opacity-70">{pr.tag}</span>
                    </span>
                    <span aria-hidden className={active === i ? "text-vas-red" : "text-gold-soft"}>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div
              key={p.code}
              className="animate-rise rounded-3xl bg-paper p-8 text-ink lg:p-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-vas-red px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-paper">
                  {p.code}
                </span>
                <span className="rounded-full bg-paper-deep px-3 py-1 text-[12px] font-medium text-ink-soft">
                  {p.english}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.9rem] leading-tight text-vas-red">{p.name}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{p.d}</p>
              <div className="mt-6 rounded-2xl bg-paper-deep p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-vas-red">
                  Phù hợp với
                </p>
                <p className="mt-1.5 text-[15px] text-ink">{p.for}</p>
              </div>
              <a
                href="#finder"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-vas-red px-6 py-3 text-[14px] font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                Tìm lộ trình cho con <Arrow />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 — How students learn (editorial montage)                         */
/* ------------------------------------------------------------------ */

function Learn() {
  return (
    <section className="bg-paper py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Học sinh học như thế nào</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
              Việc học vượt xa
              <span className="italic text-vas-red"> khỏi bốn bức tường lớp học.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:grid-rows-2">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <figure className="group relative h-full min-h-[320px] overflow-hidden rounded-3xl bg-paper-deep">
              <img
                src={img("1758685734470-a75109299497", 1100, 1200)}
                alt="Học sinh và giáo viên cùng khám phá một thí nghiệm khoa học"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vas-red-deep/90 to-transparent p-8">
                <p className="font-display text-[1.7rem] text-paper">Tìm tòi thật, khám phá thật</p>
                <p className="mt-1 max-w-md text-[14px] text-paper/80">
                  Những giờ khoa học nơi học sinh tự đặt câu hỏi — và tự tìm ra câu trả lời.
                </p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-5">
            <figure className="group relative h-full min-h-[220px] overflow-hidden rounded-3xl bg-paper-deep">
              <img
                src={img("1761208662734-fb46f1398551", 900, 620)}
                alt="Giáo viên hướng dẫn học sinh tại bàn học"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-0 p-6">
                <p className="font-display text-[1.4rem] text-paper drop-shadow">Đồng hành, không áp đặt</p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={160} className="lg:col-span-5">
            <div className="flex h-full flex-col justify-center gap-4 rounded-3xl bg-vas-red p-8 text-paper">
              <p className="font-display text-[1.5rem] leading-snug">
                “Con tôi thực sự sẽ học như thế nào?”
              </p>
              <p className="text-[14.5px] leading-relaxed text-paper/80">
                Học qua dự án, phòng thí nghiệm, nghệ thuật, thể thao và phục vụ cộng đồng — mỗi
                ngày là sự cân bằng giữa tính học thuật và không gian để con được là chính mình.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                {["STEM", "Nghệ thuật", "Thể thao", "Công nghệ", "Hợp tác"].map((t) => (
                  <span key={t} className="rounded-full border border-paper/30 px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 — The People (teachers)                                          */
/* ------------------------------------------------------------------ */

const PEOPLE = [
  {
    name: "TS. Emma Whitfield",
    role: "Trưởng Chương trình Cambridge",
    exp: "18 năm · Cambridge, Anh Quốc",
    quote: "Nhiệm vụ của tôi là giúp mỗi học sinh tìm ra câu hỏi khiến em bừng sáng.",
    img: "1581065178047-8ee15951ede6",
  },
  {
    name: "Cô Nguyễn Thu Hà",
    role: "Trưởng khối Tiểu học · Riverside",
    exp: "14 năm · Mầm non & Tiểu học",
    quote: "Sự tự tin của con bắt đầu từ cảm giác được thấu hiểu và yêu thương.",
    img: "1573496527892-904f897eb744",
  },
  {
    name: "Thầy James Okoro",
    role: "Cố vấn Đại học & Hướng nghiệp",
    exp: "12 năm · Tuyển sinh toàn cầu",
    quote: "Chúng tôi vạch lối đến đúng ngôi trường — không chỉ một cái tên nổi tiếng.",
    img: "1590650213165-c1fef80648c4",
  },
];

function People() {
  return (
    <section className="bg-paper-deep py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Những con người</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
              Những người thầy đứng sau
              <span className="italic text-vas-red"> hành trình của con bạn.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PEOPLE.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <article className="group h-full overflow-hidden rounded-3xl bg-paper">
                <div className="aspect-[4/5] overflow-hidden bg-paper-deep">
                  <img
                    src={img(m.img, 720, 900)}
                    alt={`Chân dung ${m.name}`}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </div>
                <div className="p-7">
                  <p className="font-display text-[1.4rem] text-ink">{m.name}</p>
                  <p className="mt-1 text-[14px] font-medium text-vas-red">{m.role}</p>
                  <p className="text-[13px] text-ink-soft">{m.exp}</p>
                  <p className="mt-4 border-t border-line pt-4 font-display text-[1.05rem] italic leading-snug text-ink">
                    “{m.quote}”
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 — Life at VAS (a day)                                            */
/* ------------------------------------------------------------------ */

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

function LifeDay() {
  return (
    <section id="life" className="bg-paper py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Vòng quanh VAS</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
                Một ngày
                <span className="italic text-vas-red"> của con tại VAS.</span>
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">
                Từ lời chào đầu tiên đến cái vẫy tay tạm biệt, mỗi giờ trong ngày được thiết kế để
                cân bằng giữa thử thách, sự quan tâm và niềm vui được là một đứa trẻ.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 overflow-hidden rounded-3xl bg-paper-deep">
                <img
                  src={img("1502781252888-9143ba7f074e", 900, 640)}
                  alt="Học sinh cùng nhau vui cười ngoài trời"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <ol className="relative border-l border-line pl-8">
              {DAY.map(([time, label]) => (
                <li key={time} className="group relative pb-7 last:pb-0">
                  <span className="absolute -left-[37px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-vas-red bg-paper transition-colors group-hover:bg-vas-red">
                    <span className="h-1.5 w-1.5 rounded-full bg-vas-red transition-colors group-hover:bg-paper" />
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[1.3rem] font-medium text-vas-red">{time}</span>
                    <span className="text-[16px] text-ink">{label}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 — Campus discovery                                               */
/* ------------------------------------------------------------------ */

const CAMPUSES = [
  { name: "Ba Tháng Hai", district: "Quận 10", ages: "2–18 tuổi", img: "1786013522160-00ac876da3ab", note: "Cơ sở chính, trụ sở của hệ thống ngay trung tâm thành phố." },
  { name: "Riverside", district: "Quận 7", ages: "2–18 tuổi", img: "1781877641721-dc3d4974bf25", note: "Không gian ven sông yên bình với cơ sở vật chất quốc tế." },
  { name: "Sunrise", district: "Quận 7", ages: "2–18 tuổi", img: "1780247723262-bf9fab11592c", note: "Không gian hiện đại, tươi sáng tại khu Phú Mỹ Hưng." },
  { name: "Sala", district: "TP. Thủ Đức", ages: "2–15 tuổi", img: "1764943630631-b63aadf86e19", note: "Cơ sở mới tại khu đô thị Sala hiện đại." },
  { name: "Garden Hills", district: "Gò Vấp", ages: "2–18 tuổi", img: "1772551419793-75c00555bf7b", note: "Khuôn viên xanh, rộng rãi cho cộng đồng xuyên cấp." },
  { name: "Hoàng Văn Thụ", district: "Phú Nhuận", ages: "2–11 tuổi", img: "1781032161857-41214c66559f", note: "Khởi đầu êm đềm cho khối Mầm non và Tiểu học." },
];

function Campus() {
  const [active, setActive] = useState(0);
  const c = CAMPUSES[active];

  return (
    <section id="campuses" className="bg-vas-red-deep py-20 text-paper lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Eyebrow light>Các cơ sở</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03]">
                Không gian được tạo nên
                <span className="italic text-gold-soft"> cho những khả năng.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] text-paper/70">
              6 cơ sở trên khắp TP.HCM — mỗi nơi mang một cá tính riêng, cùng chung một chuẩn mực.
              Khám phá cơ sở gần gia đình bạn nhất.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div key={c.name} className="animate-rise overflow-hidden rounded-3xl bg-paper/10">
              <div className="relative aspect-[16/10] overflow-hidden bg-vas-red">
                <img
                  src={img(c.img, 1100, 700)}
                  alt={`Cơ sở VAS ${c.name}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vas-red-deep/80 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <p className="font-display text-[2.2rem] leading-none">{c.name}</p>
                  <p className="mt-2 text-[14px] text-paper/80">
                    {c.district} · {c.ages}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 p-7">
                <p className="max-w-md text-[15px] text-paper/80">{c.note}</p>
                <div className="flex gap-3">
                  <a href="#admissions" className="rounded-full bg-paper px-5 py-2.5 text-[14px] font-semibold text-vas-red">
                    Đặt lịch tham quan
                  </a>
                  <a href="#" className="rounded-full border border-paper/40 px-5 py-2.5 text-[14px] font-semibold text-paper">
                    Xem cơ sở
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <ul className="flex flex-col gap-2">
              {CAMPUSES.map((cam, i) => (
                <li key={cam.name}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                      active === i
                        ? "border-gold bg-paper/10"
                        : "border-transparent hover:bg-paper/5"
                    }`}
                  >
                    <span
                      className={`font-display text-[1.1rem] ${
                        active === i ? "text-gold-soft" : "text-paper/50"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[16px] font-medium">{cam.name}</span>
                      <span className="block text-[13px] text-paper/60">{cam.district}</span>
                    </span>
                    <span aria-hidden className={active === i ? "text-gold-soft" : "text-paper/40"}>
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 09 — Student stories                                                */
/* ------------------------------------------------------------------ */

const STORIES = [
  { name: "Minh Anh", grade: "Lớp 11 · Riverside", quote: "Em đã tìm thấy đam mê với robotics tại VAS.", img: "1673533582990-3542202b0a8f" },
  { name: "Đức Huy", grade: "Lớp 12 · Ba Tháng Hai", quote: "Thầy cô giúp em tin rằng mình có thể du học ngành y.", img: "1698072556956-1a5d2307a7a1" },
  { name: "Gia Bảo", grade: "Lớp 9 · Garden Hills", quote: "Trên sân bóng là nơi em học được cách dẫn dắt.", img: "1626788215369-3ba6c6ae88c0" },
];

function Stories() {
  return (
    <section id="stories" className="bg-paper py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Câu chuyện học sinh</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
                Gặp gỡ học sinh của chúng tôi.
              </h2>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-[14px] font-semibold text-vas-red">
              Đọc hành trình của các em <Arrow />
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <article className="group relative overflow-hidden rounded-3xl bg-paper-deep">
                <img
                  src={img(s.img, 720, 900)}
                  alt={`${s.name}, ${s.grade}`}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="font-display text-[1.5rem] leading-snug text-paper">“{s.quote}”</p>
                  <p className="mt-3 text-[13px] font-medium text-gold-soft">
                    {s.name} · {s.grade}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10 — Outcomes                                                       */
/* ------------------------------------------------------------------ */

function Outcomes() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper lg:py-32">
      <img
        src={img("1758270703648-1559ddc68a22", 1800, 900)}
        alt="Học sinh VAS trong ngày tốt nghiệp"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow light>Kết quả đầu ra</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.8rem)] leading-[1.02]">
              Giáo dục VAS sẽ đưa con bạn
              <span className="italic text-gold-soft"> đi đến đâu?</span>
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-paper/75">
              Từ VAS ra thế giới. Cựu học sinh của chúng tôi theo học tại các đại học hàng đầu ở Úc,
              Anh, Bắc Mỹ và châu Á — với bản lĩnh để tỏa sáng khi các em đặt chân đến.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-paper/15 bg-paper/10 sm:grid-cols-3">
          {[
            { n: 200, suffix: "+", l: "điểm đến đại học trên toàn cầu" },
            { n: 15, suffix: " triệu USD", l: "học bổng cựu học sinh giành được" },
            { n: 95, suffix: "%", l: "học sinh vào đúng lộ trình mong muốn" },
          ].map((o, i) => (
            <Reveal key={o.l} delay={i * 90} className="bg-transparent">
              <div className="p-8">
                <div className="font-display text-[3rem] font-medium leading-none text-gold-soft">
                  <Counter to={o.n} suffix={o.suffix} />
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-paper/75">{o.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11 — Parent voices                                                  */
/* ------------------------------------------------------------------ */

const VOICES = [
  {
    stage: "Phụ huynh nổi tiếng",
    quote: "Điều chúng tôi trân trọng nhất ở VAS là sự tận tâm của giáo viên và cách trường giúp các con phát triển kỹ năng mềm một cách rất tự nhiên.",
    name: "Diễn viên Đinh Ngọc Diệp · phu nhân đạo diễn Victor Vũ",
  },
  {
    stage: "Tiểu học",
    quote: "Tôi từng lo con mình lạc lõng trong một ngôi trường lớn. Nhưng thầy cô hiểu con hơn cả tôi mong đợi — sáng nào con cũng háo hức đến trường.",
    name: "Chị Lan · phụ huynh cơ sở Sunrise",
  },
  {
    stage: "Trung học",
    quote: "Chương trình song ngữ giúp con gái tôi tự tin tiếng Anh mà không hề đánh mất tiếng Việt. Sự cân bằng đó chính là điều gia đình tôi tìm kiếm.",
    name: "Anh Tuấn · phụ huynh cơ sở Riverside",
  },
];

function Voices() {
  const [i, setI] = useState(0);
  const v = VOICES[i];
  return (
    <section className="bg-paper-deep py-20 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
        <Reveal>
          <div className="text-center">
            <Eyebrow>Tiếng nói phụ huynh</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
              Lắng nghe các gia đình VAS.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {VOICES.map((vo, idx) => (
              <button
                key={vo.stage}
                onClick={() => setI(idx)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
                  i === idx ? "bg-vas-red text-paper" : "border border-line text-ink hover:border-vas-red"
                }`}
              >
                {vo.stage}
              </button>
            ))}
          </div>

          <blockquote key={v.stage} className="mx-auto mt-10 max-w-3xl animate-rise text-center">
            <p className="font-display text-[clamp(1.5rem,3vw,2.3rem)] italic leading-snug text-ink">
              “{v.quote}”
            </p>
            <footer className="mt-6 text-[14px] font-semibold text-vas-red">{v.name}</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 12 — Admissions flow                                                */
/* ------------------------------------------------------------------ */

const STEPS = [
  ["01", "Chia sẻ về con của bạn", "Một cuộc trò chuyện ngắn về độ tuổi, sở thích và điểm xuất phát của con."],
  ["02", "Khám phá lộ trình phù hợp", "Chúng tôi giúp bạn hiểu rõ CAPI, CAP và CEP — và đâu là lựa chọn hợp với gia đình."],
  ["03", "Tham quan cơ sở", "Ghé thăm lớp học, gặp gỡ thầy cô và cảm nhận cộng đồng bằng chính trải nghiệm của bạn."],
  ["04", "Gặp gỡ đội ngũ tuyển sinh", "Giải đáp rõ ràng về đánh giá đầu vào, học phí và các mốc thời gian quan trọng."],
  ["05", "Bắt đầu hành trình VAS", "Chúng tôi mong được chào đón gia đình bạn."],
];

function Admissions() {
  return (
    <section id="admissions" className="bg-vas-red py-20 text-paper lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow light>Tuyển sinh</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.8rem)] leading-[1.02]">
              Bước tiếp theo
              <span className="italic text-gold-soft"> bắt đầu từ đây.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-paper/80">
              Không áp lực, không rối rắm thủ tục — chỉ một lộ trình rõ ràng, ấm áp từ câu hỏi đầu
              tiên đến ngày đầu tiên đến trường.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-paper/20 p-6 transition-colors hover:bg-paper/5">
                <span className="font-display text-[2.4rem] font-medium leading-none text-gold-soft">{n}</span>
                <p className="mt-4 text-[16px] font-semibold">{t}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-paper/75">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap gap-4">
            <a href="#" className="rounded-full bg-paper px-7 py-3.5 text-[15px] font-semibold text-vas-red transition-transform hover:-translate-y-0.5">
              Đặt lịch tham quan cơ sở
            </a>
            <a href="tel:0911267755" className="rounded-full border border-paper/50 px-7 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-paper/10">
              Gọi tư vấn tuyển sinh
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 13 — News & events                                                  */
/* ------------------------------------------------------------------ */

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

function News() {
  return (
    <section className="bg-paper py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <Eyebrow>Tin tức & sự kiện</Eyebrow>
                  <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
                    Những điều đang diễn ra tại VAS.
                  </h2>
                </div>
                <a href="#" className="hidden shrink-0 text-[14px] font-semibold text-vas-red sm:inline-flex sm:items-center sm:gap-2">
                  Xem tất cả <Arrow />
                </a>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {NEWS.map((a, i) => (
                <Reveal key={a.title} delay={i * 90}>
                  <a href="#" className="group block">
                    <div className="overflow-hidden rounded-2xl bg-paper-deep">
                      <img
                        src={img(a.img, 600, 420)}
                        alt={a.title}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-vas-red">
                      {a.tag} <span className="h-1 w-1 rounded-full bg-line" /> <span className="text-ink-soft">{a.date}</span>
                    </p>
                    <p className="mt-2 font-display text-[1.2rem] leading-snug text-ink transition-colors group-hover:text-vas-red">
                      {a.title}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <div className="rounded-3xl bg-paper-deep p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[1.6rem] text-ink">Sự kiện sắp tới</h3>
                <a href="#" className="text-[13px] font-semibold text-vas-red">Tất cả sự kiện</a>
              </div>
              <ul className="mt-6 flex flex-col">
                {EVENTS.map(([title, place, date]) => (
                  <li key={title}>
                    <a href="#" className="group flex items-center gap-5 border-t border-line py-5">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-vas-red text-center leading-none text-paper">
                        <span className="font-display text-[1.3rem]">{date.split("/")[0]}</span>
                        <span className="mt-0.5 text-[10px] uppercase tracking-wide">Th{Number(date.split("/")[1])}</span>
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] font-semibold text-ink transition-colors group-hover:text-vas-red">{title}</span>
                        <span className="block text-[13px] text-ink-soft">{place}</span>
                      </span>
                      <span aria-hidden className="text-line transition-colors group-hover:text-vas-red">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const FOOT: Record<string, string[]> = {
  "Chương trình": ["Mầm non", "Tiểu học", "Trung học cơ sở", "Trung học phổ thông", "Lộ trình Cambridge"],
  "Các cơ sở": ["Ba Tháng Hai", "Riverside", "Sunrise", "Sala", "Garden Hills", "Hoàng Văn Thụ"],
  "Về VAS": ["Câu chuyện VAS", "Đội ngũ giáo viên", "Thành tích", "Lộ trình vào đại học"],
  "Tuyển sinh": ["Quy trình tuyển sinh", "Học phí", "Đặt lịch tham quan", "Câu hỏi thường gặp", "Liên hệ"],
};

function Footer() {
  return (
    <footer className="bg-vas-red-deep pt-20 text-paper">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-12 border-b border-paper/15 pb-16 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="inline-grid place-items-center rounded-xl bg-paper px-4 py-3">
              <img
                src="https://www.vas.edu.vn/asset/svg/logo-top.svg"
                alt="Trường Quốc tế Việt Úc (VAS)"
                className="h-9 w-auto"
              />
            </span>
            <p className="mt-5 max-w-sm font-display text-[1.6rem] leading-snug">
              Không chỉ là một ngôi trường. Là một hành trình cho cả cuộc đời của con.
            </p>
            <a href="#admissions" className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-[14px] font-semibold text-vas-red">
              Đặt lịch tham quan <Arrow />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(FOOT).map(([h, links]) => (
              <div key={h}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-gold-soft">{h}</p>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[14px] text-paper/75 transition-colors hover:text-paper">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 py-8 text-[13px] leading-relaxed text-paper/60 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-1">
            <p className="font-semibold text-paper/80">Công ty Cổ phần Giáo dục Quốc tế Việt Úc</p>
            <p>Trụ sở chính: 594 Ba Tháng Hai, Phường 14, Quận 10, TP.HCM</p>
            <p>Hotline: 0911 267 755 · admissions@vas.edu.vn</p>
          </div>
          <p>© 2026 Trường Quốc tế Việt Úc (VAS). Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky mobile CTA bar                                               */
/* ------------------------------------------------------------------ */

function StickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper/95 backdrop-blur-md sm:hidden">
      <a href="tel:0911267755" className="flex items-center justify-center gap-2 py-4 text-[14px] font-semibold text-vas-red">
        Gọi tư vấn
      </a>
      <a href="#admissions" className="flex items-center justify-center gap-2 bg-vas-red py-4 text-[14px] font-semibold text-paper">
        Đặt lịch tham quan
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <Trust />
        <WhyVas />
        <Journey />
        <Learn />
        <People />
        <LifeDay />
        <Campus />
        <Stories />
        <Outcomes />
        <Voices />
        <Admissions />
        <News />
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
}
