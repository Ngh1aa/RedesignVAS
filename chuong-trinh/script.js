/* Trang Chương trình */
const STAGES = [
  { ic: "01", age: "2–5 tuổi", t: "Mầm non", d: "Vui chơi, tò mò và niềm vui của những khám phá đầu đời." },
  { ic: "02", age: "6–10 tuổi", t: "Tiểu học", d: "Nền tảng vững chắc về ngôn ngữ, tư duy và nhân cách." },
  { ic: "03", age: "11–14 tuổi", t: "Trung học cơ sở", d: "Sự tò mò được rèn thành bản lĩnh học thuật thực thụ." },
  { ic: "04", age: "15–18 tuổi", t: "Trung học phổ thông", d: "Chứng chỉ Cambridge và con đường vào đại học." },
];

const PROGRAMMES = [
  { code: "CAPI", name: "Chương trình Cambridge Toàn phần", tag: "Quốc tế nhất", english: "Đến 70% bằng tiếng Anh", d: "Mức độ hội nhập quốc tế cao nhất tại VAS — lộ trình Cambridge dành cho các gia đình hướng đến những đại học hàng đầu ở nước ngoài, với tiếng Anh xuyên suốt mọi môn học.", for: "Học sinh hướng tới nền giáo dục toàn cầu, ưu tiên tiếng Anh." },
  { code: "CAP", name: "Chương trình Song ngữ Cambridge", tag: "Lộ trình cân bằng", english: "~50% bằng tiếng Anh", d: "Lộ trình song ngữ cân bằng, kết hợp trọn vẹn chương trình quốc gia Việt Nam với các môn Cambridge — vừa vững gốc rễ, vừa vươn tầm quốc tế.", for: "Gia đình muốn con vừa giỏi tiếng Việt vừa hội nhập quốc tế." },
  { code: "CEP", name: "Chương trình Tiếng Anh Cambridge", tag: "Nền tảng tiếng Anh", english: "Tiếng Anh tăng cường", d: "Chương trình quốc gia Việt Nam được làm giàu bằng chương trình Tiếng Anh Cambridge chuẩn mực — xây dựng khả năng giao tiếp tự tin ngay từ những ngày đầu.", for: "Học sinh từng bước tiến tới học tập quốc tế theo thời gian." },
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
    <h3 style="margin-top:6px">${esc(s.t)}</h3><p>${esc(s.d)}</p>
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
    <div class="prog-for"><p class="k">Phù hợp với</p><p class="v">${esc(p.for)}</p></div>
    <a href="../tuyen-sinh/" class="btn btn-red" style="margin-top:24px;padding:12px 24px;font-size:14px">Tìm lộ trình cho con <span aria-hidden="true">→</span></a>`;
}
PROGRAMMES.forEach((p, i) => {
  const b = el(`<button class="prog-tab pill-tab" style="justify-content:space-between;display:flex;align-items:center;text-align:left"><span><span class="code">${esc(p.code)}</span> <span class="tagname">${esc(p.tag)}</span></span><span class="arrow" aria-hidden="true">→</span></button>`);
  b.addEventListener("click", () => renderProg(i));
  progTabs.appendChild(b);
});
renderProg(0);

document.getElementById("certGrid").innerHTML = CERTS.map((c) => `
  <article class="feature"><span class="ic">${c.ic}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></article>`).join("");
