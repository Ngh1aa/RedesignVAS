/* Trang Chương trình */
const STAGES = [
  { ic: "01", age: "2–5 tuổi", t: "Mầm non", d: "Khởi đầu bằng sự tò mò và nền tảng song ngữ.", detail: "Học qua vui chơi, tương tác và trải nghiệm; làm quen với ICT và chuẩn bị nền tảng chuyển tiếp lên Cambridge." },
  { ic: "02", age: "Lớp 1–5", t: "Tiểu học", d: "Xây nền tảng học thuật và tư duy toàn cầu.", detail: "Lựa chọn CAPI, CAP hoặc CEP; học sinh CAPI có thể dự thi Cambridge International Primary Checkpoint cuối Lớp 5." },
  { ic: "03", age: "Lớp 6–8", t: "Trung học cơ sở", d: "Mở rộng năng lực, khám phá hướng đi.", detail: "Tiếp tục hoặc chuyển đổi giữa CAPI, CAP và CEP; CAPI tập trung vào Toán, Tiếng Anh, Khoa học, ICT và Global Perspectives." },
  { ic: "04", age: "Lớp 9–12", t: "Trung học phổ thông", d: "Chuẩn bị cho đại học và tương lai toàn cầu.", detail: "Lộ trình CAPI đi từ IGCSE đến AS Level và A Level; các bằng cấp Cambridge được công nhận quốc tế." },
];

const PROGRAMMES = [
  { code: "CAPI", name: "Cambridge toàn phần", tag: "Chuyên sâu từ Tiểu học đến A Level", english: "Checkpoint → IGCSE → AS/A Level", d: "Lộ trình Cambridge chuyên sâu từ Tiểu học đến A Level.", for: "Học sinh ưu tiên môi trường quốc tế và mục tiêu đại học toàn cầu.", detail: "Cambridge Academic Programme International — học phần lớn các môn bằng tiếng Anh, xuyên suốt từ Tiểu học đến Trung học phổ thông." },
  { code: "CAP", name: "Song ngữ Cambridge", tag: "Cân bằng Việt Nam và quốc tế", english: "Cambridge + Chương trình Quốc gia", d: "Cambridge kết hợp Chương trình Giáo dục Quốc gia.", for: "Học sinh muốn phát triển song song nền tảng Việt Nam và năng lực học thuật quốc tế.", detail: "Cambridge Academic Programme — học sinh có thể đạt Primary Checkpoint, Secondary Checkpoint và IGCSE theo từng cấp học." },
  { code: "CEP", name: "Tiếng Anh Cambridge", tag: "Tiếng Anh học thuật", english: "Cambridge English Programme", d: "Phát triển tiếng Anh học thuật trong môi trường quốc tế.", for: "Học sinh muốn xây nền tiếng Anh vững chắc bên cạnh chương trình quốc gia.", detail: "Cambridge English Programme — kết hợp chương trình giáo dục quốc gia với tiếng Anh Cambridge và các kỳ thi tương ứng theo cấp học." },
];

const CERTS = [
  { ic: "◆", t: "Cambridge Primary & Lower Secondary", d: "Đánh giá chuẩn quốc tế theo dõi sự tiến bộ qua từng cấp học." },
  { ic: "✦", t: "Cambridge IGCSE", d: "Chứng chỉ trung học được công nhận rộng rãi trên toàn cầu." },
  { ic: "❖", t: "Cambridge A Level & IELTS", d: "Chìa khóa vào các đại học hàng đầu ở Úc, Anh, Bắc Mỹ và châu Á." },
];

document.getElementById("stageGrid").innerHTML = STAGES.map((s) => `
  <article class="feature">
    <span class="ic">${s.ic}</span>
    <p style="font-size:12px;text-transform:uppercase;letter-spacing:.15em;color:var(--vas-red);font-weight:600">${esc(s.age)}</p>
    <h3 style="margin-top:6px">${esc(s.t)}</h3><p>${esc(s.d)}</p><p class="stage-detail">${esc(s.detail)}</p>
  </article>`).join("");

const progTabs = document.getElementById("progTabs");
const progPanel = document.getElementById("progPanel");
function renderProg(idx) {
  const p = PROGRAMMES[idx];
  progTabs.querySelectorAll(".prog-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
  progPanel.classList.remove("animate-rise"); void progPanel.offsetWidth; progPanel.classList.add("animate-rise");
  progPanel.innerHTML = `
    <div class="prog-badges">
      <span class="badge">${esc(p.code)}</span>
      <span class="badge soft">${esc(p.english)}</span>
    </div>
    <h3>${esc(p.name)}</h3>
    <p class="desc">${esc(p.d)}</p>
    <div class="prog-for"><p class="k">Phù hợp với</p><p class="v">${esc(p.for)}</p><p class="prog-detail">${esc(p.detail)}</p></div>
    <a href="../tuyen-sinh/#dang-ky" class="btn btn-red" style="margin-top:24px;padding:12px 24px;font-size:14px">Tìm lộ trình cho con <span aria-hidden="true">→</span></a>`;
}
PROGRAMMES.forEach((p, i) => {
  const b = el(`<button class="prog-tab pill-tab" style="justify-content:space-between;display:flex;align-items:center;text-align:left"><span><span class="code">${esc(p.code)}</span> <span class="tagname">${esc(p.tag)}</span></span><span class="arrow" aria-hidden="true">→</span></button>`);
  b.addEventListener("click", () => renderProg(i));
  progTabs.appendChild(b);
});
renderProg(0);

document.getElementById("certGrid").innerHTML = CERTS.map((c) => `
  <article class="feature"><span class="ic">${c.ic}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></article>`).join("");
