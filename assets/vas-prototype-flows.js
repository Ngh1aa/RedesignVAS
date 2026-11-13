/* =====================================================================
   VAS — PROTOTYPE FLOWS (vas-prototype-flows.js)
   Luồng theo trang: tuyển sinh, tham quan, tìm lộ trình, học bổng,
   tin tức, cơ sở, tuyển dụng, cựu học sinh, liên hệ.
   Phụ thuộc: vas-prototype-data.js, vas-prototype.js.
   ===================================================================== */
(function () {
  const P = window.VASProto;
  if (!P) return;
  const { SEED, store, esc, $, $$ } = P;

  const campusOptions = (placeholder = "Chọn cơ sở") => [["", placeholder], ...SEED.campuses.map((c) => [c.id, c.name])];
  const gradeOptions = (placeholder = "Chọn lớp") => [["", placeholder], ...SEED.grades.map((g) => [g.id, g.label])];
  const consentField = (name = "consent", text = "Tôi đồng ý để VAS sử dụng thông tin trên cho mục đích tư vấn và xét tuyển") => `<div class="vp-check" data-field="${name}"><label><input type="checkbox" name="${name}" /> <span>${esc(text)}, theo <a href="${P.BASE}lien-he/#chinh-sach-bao-mat">chính sách bảo mật</a>.</span></label><small class="vp-error" hidden></small></div>`;
  const scrollTo = (node) => node?.scrollIntoView({ behavior: "smooth", block: "start" });
  const fmpGradeToGrade = { "mam-non": "k3", 3: "g3", 7: "g7", 10: "g10" };
  const fmpGradeLabel = { "mam-non": "Mầm non", 3: "Lớp 1–5", 7: "Lớp 6–8", 10: "Lớp 9–12" };

  /* =================================================================
     TUYỂN SINH — hồ sơ dự tuyển, hồ sơ của tôi, ước tính học phí
     ================================================================= */
  P.flow("tuyen-sinh", () => {
    initTuition();
    initApplication();
  });

  function initTuition() {
    const root = document.getElementById("tuitionEstimator");
    if (!root) return;
    const result = document.getElementById("tcResult");
    const fields = { band: $("#tcBand"), programme: $("#tcProgramme"), campus: $("#tcCampus"), plan: $("#tcPlan"), sibling: $("#tcSibling") };
    const q = P.params();
    const saved = store.get("tuitionCalc");
    if (saved) Object.entries(fields).forEach(([key, node]) => { if (saved[key]) node.value = saved[key]; });
    if (saved?.extras) $$('input[name="extras"]', root).forEach((box) => { box.checked = saved.extras.includes(box.value); });
    const campusQ = q.get("campus"); if (P.campus(campusQ)) fields.campus.value = campusQ;
    const progQ = q.get("program"); if (P.programme(progQ)) fields.programme.value = progQ;
    const gradeQ = q.get("grade"); const bandFromGrade = { "mam-non": "mam-non", 3: "1-5", 7: "6-8", 10: "9-12", "1-5": "1-5", "6-8": "6-8", "9-12": "9-12" }[gradeQ];
    if (bandFromGrade) fields.band.value = bandFromGrade;

    const values = () => ({ band: fields.band.value, programme: fields.programme.value, campus: fields.campus.value, plan: fields.plan.value, sibling: fields.sibling.value, extras: $$('input[name="extras"]:checked', root).map((box) => box.value) });
    function render() {
      const v = values();
      store.set("tuitionCalc", v);
      const r = P.tuitionEstimate(v);
      const visit = document.getElementById("tcVisit");
      visit.href = `../dat-lich-tham-quan/?campus=${encodeURIComponent(v.campus)}`;
      if (!r.valid) {
        result.innerHTML = `<span>Học phí dự kiến năm học ${esc(SEED.tuition.schoolYear)}</span><strong>Tổ hợp này chưa khả dụng</strong><p data-tc-reason>${esc(r.reason)}</p>`;
        document.getElementById("tcApply").setAttribute("aria-disabled", "true");
        return;
      }
      document.getElementById("tcApply").removeAttribute("aria-disabled");
      result.innerHTML = `<span>Học phí dự kiến năm học ${esc(r.schoolYear)}</span><strong data-tc-total>${esc(P.money(r.total))} / năm</strong><dl class="tc-breakdown"><div><dt>Học phí ${esc(r.programme.code)} tại ${esc(r.campus.name)}</dt><dd>${esc(P.money(r.annual))}</dd></div>${r.discount ? `<div><dt>Ưu đãi anh chị em</dt><dd>− ${esc(P.money(r.discount))}</dd></div>` : ""}${r.extraItems.map((item) => `<div><dt>${esc(item.label)}</dt><dd>${esc(P.money(item.amount))}</dd></div>`).join("")}<div class="is-total"><dt>Mỗi kỳ thanh toán (${esc(r.plan.label)})</dt><dd data-tc-installment>${esc(P.money(r.perInstallment))}</dd></div></dl><p>${esc(r.plan.note)}. Phí ghi danh ${esc(P.money(r.applicationFee))} và phí giữ chỗ ${esc(P.money(r.reservationFee))} thanh toán một lần. Đây là ước tính tham khảo, chưa phải biểu phí chính thức.</p>`;
    }
    root.addEventListener("change", render);
    document.getElementById("tcApply").addEventListener("click", (event) => {
      const v = values();
      const r = P.tuitionEstimate(v);
      if (!r.valid) { event.preventDefault(); P.toast("Hãy chọn một tổ hợp khả dụng trước khi dùng cho hồ sơ."); return; }
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("vp:prefill-application", { detail: { band: v.band, programme: v.programme, campus: v.campus, source: "Ước tính học phí" } }));
    });
    render();
  }

  function initApplication() {
    const app = document.getElementById("applyApp");
    const list = document.getElementById("myApplications");
    if (!app || !list) return;
    const STEPS = ["Học sinh", "Phụ huynh", "Cơ sở & lộ trình", "Giấy tờ", "Xem lại"];
    const DOCS = [
      { id: "birth", label: "Giấy khai sinh", required: true },
      { id: "report", label: "Học bạ hoặc kết quả học tập gần nhất", required: "notPreschool" },
      { id: "photo", label: "Ảnh thẻ học sinh", required: false },
      { id: "other", label: "Giấy tờ khác (chứng chỉ, thư giới thiệu)", required: false },
    ];
    const blank = () => ({ ref: null, status: "draft", student: { fullName: "", dob: "", gender: "", currentSchool: "" }, grade: "", parent: { fullName: "", relation: "", phone: "", email: "" }, campus: "", programme: "", startTerm: "", docs: { birth: [], report: [], photo: [], other: [] }, note: "", source: "" });
    let work = store.wizard("apply") || { step: 0, data: blank(), banner: "" };
    let view = "form"; // form | done
    let lastResult = null;
    const save = () => store.wizard("apply", work);

    const level = () => P.grade(work.data.grade)?.level || "";
    const docRequired = (doc) => doc.required === true || (doc.required === "notPreschool" && level() && level() !== "mam-non");

    function progress() {
      return `<ol class="vp-steps" aria-label="Các bước hồ sơ">${STEPS.map((label, index) => `<li class="${index === work.step ? "is-current" : index < work.step ? "is-done" : ""}"${index === work.step ? ' aria-current="step"' : ""}><span>${String(index + 1).padStart(2, "0")}</span>${esc(label)}</li>`).join("")}</ol>`;
    }

    function stepBody() {
      const d = work.data;
      if (work.step === 0) return `<div class="vp-grid">${P.field({ name: "studentName", label: "Họ và tên học sinh", value: d.student.fullName, required: true, placeholder: "Nguyễn Minh An", attrs: 'autocomplete="off"' })}${P.field({ name: "dob", label: "Ngày sinh", type: "date", value: d.student.dob, required: true })}${P.field({ name: "gender", label: "Giới tính", value: d.student.gender, options: [["", "Không muốn nêu"], ["nam", "Nam"], ["nu", "Nữ"]] })}${P.field({ name: "grade", label: "Lớp dự tuyển", value: d.grade, required: true, options: gradeOptions() })}${P.field({ name: "currentSchool", label: "Trường đang học", value: d.student.currentSchool, placeholder: "Bỏ trống nếu chưa đi học", full: true })}</div>`;
      if (work.step === 1) return `<div class="vp-grid">${P.field({ name: "parentName", label: "Họ và tên phụ huynh", value: d.parent.fullName, required: true, placeholder: "Nguyễn Văn A" })}${P.field({ name: "relation", label: "Quan hệ với học sinh", value: d.parent.relation, required: true, options: [["", "Chọn quan hệ"], ["bo", "Bố"], ["me", "Mẹ"], ["giam-ho", "Người giám hộ"]] })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.parent.phone, required: true, placeholder: "09xx xxx xxx", attrs: 'inputmode="tel" autocomplete="tel"' })}${P.field({ name: "email", label: "Email", type: "email", value: d.parent.email, required: true, placeholder: "email@vidu.com", attrs: 'autocomplete="email"' })}</div>`;
      if (work.step === 2) {
        const lv = level();
        const campuses = SEED.campuses.map((c) => { const ok = !lv || c.levels.includes(lv); return `<label class="vp-option${ok ? "" : " is-disabled"}"><input type="radio" name="campus" value="${c.id}"${d.campus === c.id ? " checked" : ""}${ok ? "" : " disabled"} /><span><strong>${esc(c.name)}</strong><small>${esc(ok ? `${c.district}` : `Chưa có cấp học này`)}</small></span></label>`; }).join("");
        const progs = SEED.programmes.map((p) => { const ok = !lv || p.levels.includes(lv); return `<label class="vp-option${ok ? "" : " is-disabled"}"><input type="radio" name="programme" value="${p.id}"${d.programme === p.id ? " checked" : ""}${ok ? "" : " disabled"} /><span><strong>${esc(p.code)}</strong><small>${esc(ok ? p.name : "Chưa áp dụng cho Mầm non")}</small></span></label>`; }).join("");
        return `<fieldset class="vp-fieldset" data-field="campus"><legend>Cơ sở <span class="vp-req" aria-hidden="true">*</span></legend><div class="vp-options">${campuses}</div><small class="vp-error" hidden></small></fieldset><fieldset class="vp-fieldset" data-field="programme"><legend>Lộ trình <span class="vp-req" aria-hidden="true">*</span></legend><div class="vp-options is-3">${progs}</div><small class="vp-error" hidden></small></fieldset><div class="vp-grid">${P.field({ name: "startTerm", label: "Thời điểm nhập học", value: d.startTerm, required: true, options: [["", "Chọn thời điểm"], ["2027-01", "Học kỳ 2, tháng 01/2027"], ["2027-08", "Năm học 2027–2028, tháng 08/2027"], ["asap", "Sớm nhất khi có chỗ"]] })}</div>`;
      }
      if (work.step === 3) {
        return `<p class="vp-muted">Chọn tệp PDF, JPG, PNG hoặc DOC. Bản prototype chỉ ghi lại tên tệp; tệp không được tải lên.</p><div class="vp-docs">${DOCS.map((doc) => `<div class="vp-doc" data-field="doc-${doc.id}"><div><strong>${esc(doc.label)}${docRequired(doc) ? ' <span class="vp-req" aria-hidden="true">*</span>' : ' <span class="vp-optional">(không bắt buộc)</span>'}</strong><ul class="vp-files">${(d.docs[doc.id] || []).map((name, i) => `<li><span>${esc(name)}</span><button type="button" class="vp-link" data-remove-doc="${doc.id}" data-index="${i}" aria-label="Bỏ tệp ${esc(name)}">Bỏ</button></li>`).join("") || '<li class="vp-files-empty">Chưa chọn tệp</li>'}</ul><small class="vp-error" hidden></small></div><label class="btn btn-outline vp-file-btn">Chọn tệp<input type="file" name="doc-${doc.id}" data-doc="${doc.id}" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple /></label></div>`).join("")}</div>${P.field({ name: "note", label: "Ghi chú cho đội tuyển sinh", type: "textarea", value: d.note, rows: 3, placeholder: "Nhu cầu hỗ trợ học tập, sức khỏe, xe đưa rước…", full: true })}`;
      }
      const g = P.grade(d.grade); const c = P.campus(d.campus); const p = P.programme(d.programme);
      const est = P.tuitionEstimate({ band: g?.band, programme: d.programme, campus: d.campus });
      const term = { "2027-01": "Học kỳ 2, tháng 01/2027", "2027-08": "Năm học 2027–2028", asap: "Sớm nhất khi có chỗ" }[d.startTerm] || "";
      const rel = { bo: "Bố", me: "Mẹ", "giam-ho": "Người giám hộ" }[d.parent.relation] || "";
      const docCount = Object.values(d.docs).reduce((n, files) => n + files.length, 0);
      const row = (k, v) => `<div><dt>${esc(k)}</dt><dd>${esc(v || "Chưa có")}</dd></div>`;
      return `<div class="vp-review"><section><header><h4>Học sinh</h4><button type="button" class="vp-link" data-goto="0">Sửa</button></header><dl>${row("Họ tên", d.student.fullName)}${row("Ngày sinh", P.dateVi(d.student.dob))}${row("Lớp dự tuyển", g?.label)}${row("Trường đang học", d.student.currentSchool || "Chưa đi học")}</dl></section><section><header><h4>Phụ huynh</h4><button type="button" class="vp-link" data-goto="1">Sửa</button></header><dl>${row("Họ tên", `${d.parent.fullName}${rel ? ` (${rel})` : ""}`)}${row("Điện thoại", d.parent.phone)}${row("Email", d.parent.email)}</dl></section><section><header><h4>Cơ sở & lộ trình</h4><button type="button" class="vp-link" data-goto="2">Sửa</button></header><dl>${row("Cơ sở", c?.name)}${row("Lộ trình", p ? `${p.code}, ${p.name}` : "")}${row("Nhập học", term)}${row("Học phí ước tính", est.valid ? `${P.money(est.total)} / năm` : est.reason)}</dl></section><section><header><h4>Giấy tờ (${docCount} tệp)</h4><button type="button" class="vp-link" data-goto="3">Sửa</button></header><ul class="vp-files">${DOCS.map((doc) => (d.docs[doc.id] || []).map((name) => `<li><span>${esc(name)}</span><small>${esc(doc.label)}</small></li>`).join("")).join("") || '<li class="vp-files-empty">Chưa có tệp</li>'}</ul></section></div>${consentField("consent", "Tôi xác nhận thông tin trên là chính xác và đồng ý để VAS dùng thông tin này cho việc xét tuyển")}`;
    }

    function collect(form) {
      const d = work.data;
      const v = (name) => form.elements[name]?.value?.trim?.() ?? "";
      if (work.step === 0) { d.student.fullName = v("studentName"); d.student.dob = v("dob"); d.student.gender = v("gender"); d.student.currentSchool = v("currentSchool"); const prev = d.grade; d.grade = v("grade"); if (prev !== d.grade) { const lv = level(); if (d.campus && !P.campus(d.campus)?.levels.includes(lv)) d.campus = ""; if (d.programme && !P.programme(d.programme)?.levels.includes(lv)) d.programme = ""; } }
      if (work.step === 1) { d.parent.fullName = v("parentName"); d.parent.relation = v("relation"); d.parent.phone = v("phone").replace(/[\s.]/g, ""); d.parent.email = v("email"); }
      if (work.step === 2) { d.campus = form.elements.campus?.value || ""; d.programme = form.elements.programme?.value || ""; d.startTerm = v("startTerm"); }
      if (work.step === 3) { d.note = v("note"); }
      save();
    }

    function validate(form) {
      const R = P.rules;
      if (work.step === 0) return P.check(form, { studentName: R.required("họ tên học sinh"), dob: (value) => { if (!value) return "Vui lòng chọn ngày sinh."; const d = P.parseDate(value); const age = (Date.now() - d.getTime()) / 31557600000; return age < 2 || age > 19 ? "Ngày sinh cần phù hợp độ tuổi từ 2 đến 19." : ""; }, grade: R.choose("lớp dự tuyển") });
      if (work.step === 1) return P.check(form, { parentName: R.required("họ tên phụ huynh"), relation: R.choose("quan hệ với học sinh"), phone: R.phone(false), email: R.email(false) });
      if (work.step === 2) return P.check(form, { campus: (value) => (value ? "" : "Vui lòng chọn cơ sở."), programme: (value) => (value ? "" : "Vui lòng chọn lộ trình."), startTerm: R.choose("thời điểm nhập học") });
      if (work.step === 3) {
        let ok = true; let first = null;
        DOCS.forEach((doc) => {
          const wrap = form.querySelector(`[data-field="doc-${doc.id}"]`);
          const error = wrap.querySelector(".vp-error");
          const missing = docRequired(doc) && !(work.data.docs[doc.id] || []).length;
          error.hidden = !missing; error.textContent = missing ? `Vui lòng chọn tệp ${doc.label.toLowerCase()}.` : "";
          if (missing) { ok = false; first = first || wrap; }
        });
        if (first) { first.querySelector("input")?.focus({ preventScroll: true }); first.scrollIntoView({ block: "center", behavior: "smooth" }); }
        return ok;
      }
      return P.check(form, { consent: R.consent });
    }

    function render(focus = false) {
      if (view === "done") return renderDone();
      const editing = work.data.ref ? `<p class="vp-banner">Đang chỉnh sửa bản nháp <b>${esc(work.data.ref)}</b>. <button type="button" class="vp-link" data-new-app>Bắt đầu hồ sơ mới</button></p>` : "";
      const banner = work.banner ? `<p class="vp-banner is-info" data-prefill-banner>${esc(work.banner)}</p>` : "";
      const saved = store.get("savedPath");
      const pathOffer = !work.data.ref && !work.banner && saved ? `<div class="vp-banner is-info" data-path-offer><span>Bạn đã lưu kết quả Tìm lộ trình: <b>${esc(saved.programmeCode)}</b>, ${esc(saved.gradeLabel)}${saved.campusName ? `, ${esc(saved.campusName)}` : ""}.</span><button type="button" class="vp-link" data-use-path>Điền vào hồ sơ</button></div>` : "";
      app.innerHTML = `${progress()}<form class="vp-card vp-form" novalidate data-step="${work.step}"><header class="vp-form-head"><span class="vp-step-label">Bước ${work.step + 1} / ${STEPS.length}</span><h3 tabindex="-1">${esc(STEPS[work.step])}</h3></header>${editing}${banner}${pathOffer}<div data-vp-alert></div>${stepBody()}<div class="vp-form-nav">${work.step > 0 ? '<button type="button" class="btn btn-outline" data-back>Quay lại</button>' : "<span></span>"}<div class="vp-form-nav-end"><button type="button" class="btn btn-outline" data-save-draft>Lưu nháp</button>${work.step < STEPS.length - 1 ? '<button type="submit" class="btn btn-red" data-next>Tiếp tục</button>' : '<button type="submit" class="btn btn-red" data-submit>Nộp hồ sơ</button>'}</div></div></form>`;
      bind();
      if (focus) { $(".vp-form-head h3", app).focus({ preventScroll: true }); scrollTo(app); }
    }

    function bind() {
      const form = $("form", app);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        collect(form);
        if (!validate(form)) return;
        if (work.step < STEPS.length - 1) { work.step += 1; work.banner = ""; save(); render(true); return; }
        submit(form);
      });
      $("[data-back]", app)?.addEventListener("click", () => { collect(form); work.step -= 1; save(); render(true); });
      $("[data-save-draft]", app).addEventListener("click", (event) => saveDraft(form, event.currentTarget));
      $$("[data-goto]", app).forEach((button) => button.addEventListener("click", () => { work.step = Number(button.dataset.goto); save(); render(true); }));
      $("[data-new-app]", app)?.addEventListener("click", () => { work = { step: 0, data: blank(), banner: "" }; save(); P.setParam("ho-so", null); render(true); });
      $("[data-use-path]", app)?.addEventListener("click", () => applyPath(store.get("savedPath")));
      $$("input[type=file][data-doc]", app).forEach((input) => input.addEventListener("change", () => {
        collect(form);
        const { good, bad } = P.fileNames(input);
        const id = input.dataset.doc;
        work.data.docs[id] = [...new Set([...(work.data.docs[id] || []), ...good])];
        save();
        render();
        if (bad.length) { const wrap = app.querySelector(`[data-field="doc-${id}"] .vp-error`); wrap.hidden = false; wrap.textContent = `Không nhận tệp ${bad.join(", ")}. Chỉ chấp nhận PDF, JPG, PNG hoặc DOC.`; }
        else P.toast(`Đã thêm ${good.length} tệp.`);
      }));
      $$("[data-remove-doc]", app).forEach((button) => button.addEventListener("click", () => { collect(form); work.data.docs[button.dataset.removeDoc].splice(Number(button.dataset.index), 1); save(); render(); }));
    }

    function saveDraft(form, button) {
      collect(form);
      if (!work.data.student.fullName) { P.check(form, work.step === 0 ? { studentName: P.rules.required("họ tên học sinh trước khi lưu nháp") } : {}); if (work.step !== 0) P.toast("Hãy nhập họ tên học sinh ở bước 1 trước khi lưu nháp."); return; }
      const alert = $("[data-vp-alert]", app);
      alert.innerHTML = "";
      P.busy(button, true, "Đang lưu…");
      const record = { ...JSON.parse(JSON.stringify(work.data)), ref: work.data.ref || P.ref("HS"), status: "draft", step: work.step, updatedAt: new Date().toISOString() };
      P.request(() => store.upsert("applications", record)).then(() => {
        work.data.ref = record.ref; save();
        P.busy(button, false);
        P.toast(`Đã lưu nháp ${record.ref}. Bạn có thể tiếp tục bất cứ lúc nào.`);
        render(); renderList();
      }).catch((error) => {
        P.busy(button, false);
        alert.innerHTML = P.errorBox(error.message, "Lưu lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => saveDraft($("form", app), $("[data-save-draft]", app)));
      });
    }

    function submit(form) {
      const button = $("[data-submit]", form);
      const alert = $("[data-vp-alert]", app);
      alert.innerHTML = "";
      P.busy(button, true, "Đang nộp hồ sơ…");
      $$("button", form).forEach((b) => { if (b !== button) b.disabled = true; });
      const now = new Date().toISOString();
      const record = { ...JSON.parse(JSON.stringify(work.data)), ref: work.data.ref || P.ref("HS"), status: "submitted", submittedAt: now, updatedAt: now };
      P.request(() => store.upsert("applications", record), { delay: 900 }).then(() => {
        lastResult = record;
        work = { step: 0, data: blank(), banner: "" }; save();
        view = "done"; P.setParam("ho-so", null);
        render(); renderList();
        scrollTo(app);
      }).catch((error) => {
        P.busy(button, false);
        $$("button", form).forEach((b) => { b.disabled = false; });
        alert.innerHTML = P.errorBox(error.message, "Nộp lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => submit($("form", app)));
        alert.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }

    function renderDone() {
      const r = lastResult;
      const c = P.campus(r.campus);
      app.innerHTML = `<div class="vp-card vp-success" role="status" tabindex="-1"><span class="eyebrow">Đã nộp hồ sơ</span><h3>Cảm ơn gia đình ${esc(r.parent.fullName)}.</h3><p>Hồ sơ của <b>${esc(r.student.fullName)}</b> (${esc(P.grade(r.grade)?.label || "")}) tại cơ sở <b>${esc(c?.name || "")}</b> đã được ghi nhận.</p><p class="vp-ref">Mã hồ sơ <b data-app-ref>${esc(r.ref)}</b></p>${P.prototypeNote()}<ol class="vp-next"><li>Đội tuyển sinh gọi xác nhận trong 2 ngày làm việc.</li><li>Hẹn lịch đánh giá năng lực đầu vào.</li><li>Nhận kết quả và hướng dẫn nhập học.</li></ol><div class="vp-actions"><a class="btn btn-red" href="#ho-so-cua-toi">Xem hồ sơ của tôi</a><a class="btn btn-outline" href="../dat-lich-tham-quan/?campus=${encodeURIComponent(r.campus)}">Đặt lịch tham quan ${esc(c?.name || "")}</a><button type="button" class="btn btn-outline" data-another>Nộp hồ sơ khác</button></div></div>`;
      $("[data-another]", app).addEventListener("click", () => { view = "form"; render(true); });
      $(".vp-success", app).focus({ preventScroll: true });
    }

    function applyPath(saved) {
      if (!saved) return;
      const d = work.data;
      if (fmpGradeToGrade[saved.grade]) d.grade = fmpGradeToGrade[saved.grade];
      if (saved.program) d.programme = saved.program;
      if (saved.campus) d.campus = saved.campus;
      work.banner = `Đã điền sẵn lớp ${P.grade(d.grade)?.label || ""}, lộ trình ${saved.programmeCode}${saved.campusName ? ` và cơ sở ${saved.campusName}` : ""} từ kết quả Tìm lộ trình. Bạn vẫn có thể thay đổi.`;
      view = "form"; save(); render(true);
    }

    window.addEventListener("vp:prefill-application", (event) => {
      const { band: bandId, programme, campus, source } = event.detail;
      const d = work.data;
      const firstGrade = SEED.grades.find((g) => g.band === bandId);
      if (firstGrade && P.grade(d.grade)?.band !== bandId) d.grade = firstGrade.id;
      d.programme = programme; d.campus = campus;
      work.banner = `Đã điền sẵn lộ trình ${P.programme(programme)?.code} tại ${P.campus(campus)?.name} từ ${source}. Hãy kiểm tra lại lớp dự tuyển.`;
      view = "form"; save(); render(true);
    });

    /* -------- Hồ sơ của tôi -------- */
    function renderList() {
      const apps = store.get("applications") || [];
      const wanted = P.params().get("ho-so");
      const notFound = wanted && !apps.some((a) => a.ref === wanted) ? `<div class="vp-alert is-warning" role="alert" data-not-found><div><strong>Không tìm thấy hồ sơ ${esc(wanted)}</strong><p>Mã có thể sai hoặc hồ sơ đã bị xóa khi đặt lại dữ liệu demo.</p></div><button type="button" class="btn btn-outline" data-clear-ref>Xem tất cả hồ sơ</button></div>` : "";
      if (!apps.length) {
        list.innerHTML = notFound + P.emptyBlock("Chưa có hồ sơ nào", "Khi bạn lưu nháp hoặc nộp hồ sơ dự tuyển, hồ sơ sẽ xuất hiện ở đây.", '<a class="btn btn-red" href="#ung-tuyen">Bắt đầu hồ sơ</a>');
      } else {
        list.innerHTML = notFound + `<ul class="vp-records">${apps.map((a) => { const c = P.campus(a.campus); const p = P.programme(a.programme); return `<li class="vp-record" data-ref="${esc(a.ref)}"><div class="vp-record-main"><div class="vp-record-top">${P.statusChip(a.status)}<span class="vp-record-ref">${esc(a.ref)}</span></div><h3>${esc(a.student.fullName || "Chưa có tên học sinh")}</h3><p>${esc([P.grade(a.grade)?.label, p?.code, c?.name].filter(Boolean).join(", ") || "Chưa chọn lớp, lộ trình và cơ sở")}</p><small>${a.status === "draft" ? `Lưu lúc ${esc(P.stamp(a.updatedAt))}` : a.status === "withdrawn" ? `Rút lúc ${esc(P.stamp(a.withdrawnAt))}` : `Nộp lúc ${esc(P.stamp(a.submittedAt))}`}</small></div><div class="vp-record-actions"><button type="button" class="btn btn-outline" data-view="${esc(a.ref)}">Xem chi tiết</button>${a.status === "draft" ? `<button type="button" class="btn btn-red" data-edit="${esc(a.ref)}">Tiếp tục chỉnh sửa</button><button type="button" class="vp-link is-danger" data-delete="${esc(a.ref)}">Xóa nháp</button>` : ""}${a.status === "submitted" ? `<button type="button" class="vp-link is-danger" data-withdraw="${esc(a.ref)}">Rút hồ sơ</button>` : ""}</div></li>`; }).join("")}</ul>`;
      }
      $("[data-clear-ref]", list)?.addEventListener("click", () => { P.setParam("ho-so", null); renderList(); });
      $$("[data-view]", list).forEach((b) => b.addEventListener("click", () => openDetail(b.dataset.view)));
      $$("[data-edit]", list).forEach((b) => b.addEventListener("click", () => editDraft(b.dataset.edit)));
      $$("[data-withdraw]", list).forEach((b) => b.addEventListener("click", () => withdraw(b.dataset.withdraw)));
      $$("[data-delete]", list).forEach((b) => b.addEventListener("click", () => removeDraft(b.dataset.delete)));
    }

    function openDetail(ref) {
      const a = store.find("applications", ref);
      if (!a) { P.setParam("ho-so", ref); renderList(); return; }
      P.setParam("ho-so", ref);
      const c = P.campus(a.campus); const p = P.programme(a.programme);
      const files = Object.values(a.docs || {}).flat();
      const row = (k, v) => `<div><dt>${esc(k)}</dt><dd>${esc(v || "Chưa có")}</dd></div>`;
      P.openDialog({ title: a.student.fullName || "Hồ sơ dự tuyển", eyebrow: `Hồ sơ ${a.ref}`, body: `<div class="vp-detail-status">${P.statusChip(a.status)}</div><dl class="vp-dl">${row("Lớp dự tuyển", P.grade(a.grade)?.label)}${row("Ngày sinh", P.dateVi(a.student.dob))}${row("Cơ sở", c?.name)}${row("Lộ trình", p ? `${p.code}, ${p.name}` : "")}${row("Phụ huynh", a.parent.fullName)}${row("Liên hệ", [a.parent.phone, a.parent.email].filter(Boolean).join(", "))}${row("Giấy tờ", files.length ? files.join(", ") : "")}${row("Cập nhật", P.stamp(a.updatedAt))}</dl>${a.status === "withdrawn" ? `<p class="vp-muted">Lý do rút: ${esc(a.withdrawReason || "Không nêu")}</p>` : ""}`, onClose: () => P.setParam("ho-so", null) });
    }

    function editDraft(ref) {
      const a = store.find("applications", ref);
      if (!a) return;
      work = { step: Math.min(a.step || 0, STEPS.length - 1), data: { ...blank(), ...JSON.parse(JSON.stringify(a)) }, banner: "" };
      view = "form"; save(); render(true);
    }

    async function withdraw(ref) {
      const answer = await P.confirmDialog({ title: `Rút hồ sơ ${ref}?`, message: "Hồ sơ sẽ chuyển sang trạng thái Đã rút và không được xét tuyển. Bạn có thể nộp hồ sơ mới bất cứ lúc nào.", confirmLabel: "Rút hồ sơ", extra: `<div class="vp-grid">${P.field({ name: "reason", label: "Lý do (không bắt buộc)", options: [["", "Chọn lý do"], ["Đã chọn trường khác", "Đã chọn trường khác"], ["Thay đổi kế hoạch gia đình", "Thay đổi kế hoạch gia đình"], ["Muốn nộp lại hồ sơ khác", "Muốn nộp lại hồ sơ khác"]], full: true })}</div>` });
      if (!answer) return;
      const node = list.querySelector(`[data-ref="${CSS.escape(ref)}"] [data-withdraw]`);
      P.busy(node, true, "Đang rút…");
      P.request(() => store.update("applications", (items) => items.map((a) => (a.ref === ref ? { ...a, status: "withdrawn", withdrawnAt: new Date().toISOString(), withdrawReason: answer.reason || "" } : a)))).then(() => {
        P.toast(`Đã rút hồ sơ ${ref}.`); renderList();
      }).catch((error) => { P.busy(node, false); P.toast(`${error.message} Hồ sơ chưa bị rút, hãy thử lại.`); });
    }

    async function removeDraft(ref) {
      const ok = await P.confirmDialog({ title: `Xóa bản nháp ${ref}?`, message: "Bản nháp sẽ bị xóa khỏi tab này và không thể khôi phục.", confirmLabel: "Xóa nháp" });
      if (!ok) return;
      P.request(() => store.update("applications", (items) => items.filter((a) => a.ref !== ref))).then(() => {
        if (work.data.ref === ref) { work = { step: 0, data: blank(), banner: "" }; save(); render(); }
        P.toast(`Đã xóa bản nháp ${ref}.`); renderList();
      }).catch((error) => P.toast(`${error.message} Bản nháp vẫn còn.`));
    }

    // Prefill from Find My Path when arriving with ?from=path
    const q = P.params();
    if (q.get("from") === "path" && store.get("savedPath") && !work.data.ref) { applyPath(store.get("savedPath")); P.setParam("from", null); }
    else render();
    renderList();
    const wanted = q.get("ho-so");
    if (wanted && store.find("applications", wanted)) { openDetail(wanted); }
    else if (wanted) { setTimeout(() => scrollTo(list), 300); }
  }

  /* =================================================================
     ĐẶT LỊCH THAM QUAN — cơ sở, ngày, khung giờ, thông tin, xác nhận;
     Lịch của tôi: đổi lịch, hủy lịch
     ================================================================= */
  P.flow("dat-lich-tham-quan", () => {
    const app = document.getElementById("tourApp");
    const list = document.getElementById("myTours");
    if (!app || !list) return;
    const STEPS = ["Cơ sở", "Ngày & giờ", "Thông tin", "Xác nhận"];
    const blank = () => ({ campus: "", date: "", slot: "", name: "", phone: "", email: "", people: "2", interest: "", note: "" });
    let work = store.wizard("tour") || { step: 0, data: blank() };
    let view = "form";
    let lastTour = null;
    const save = () => store.wizard("tour", work);
    const q = P.params();
    if (P.campus(q.get("campus"))) {
      work = { step: 1, data: { ...work.data, campus: q.get("campus"), date: "", slot: "" } };
      const date = q.get("date"); const slot = q.get("slot");
      if (date && slot && P.tourDates(work.data.campus).includes(date) && P.slotState(work.data.campus, date, slot) === "open") { work.data.date = date; work.data.slot = slot; }
      save();
      P.setParam("campus", null); P.setParam("date", null); P.setParam("slot", null);
    }

    function summary() {
      const d = work.data;
      const set = (key, value) => { const node = document.querySelector(`[data-summary-${key}]`); if (node) node.textContent = value; };
      set("campus", P.campus(d.campus)?.name || "Chưa chọn");
      set("date", d.date ? P.dateLong(d.date) : "Chưa chọn");
      set("time", d.slot || "Chưa chọn");
      set("family", d.name ? `${d.name}, ${d.people} người` : "Chưa nhập");
    }

    function datePicker(campusId, selectedDate, selectedSlot, ignoreRef) {
      const dates = P.tourDates(campusId);
      const chips = dates.map((date) => { const full = P.dayIsFull(campusId, date, ignoreRef); const d = P.parseDate(date); return `<button type="button" class="vp-date${date === selectedDate ? " is-selected" : ""}" data-date="${date}"${full ? " disabled" : ""} aria-pressed="${date === selectedDate}"><small>${esc(["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()])}</small><strong>${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</strong><em>${full ? "Kín lịch" : "Còn chỗ"}</em></button>`; }).join("");
      const slots = selectedDate ? SEED.tours.slots.map((slot) => { const state = P.slotState(campusId, selectedDate, slot, ignoreRef); const label = state === "open" ? "Còn chỗ" : state === "mine" ? "Bạn đã đặt" : "Đã kín"; return `<button type="button" class="vp-slot is-${state}${slot === selectedSlot ? " is-selected" : ""}" data-slot="${slot}"${state !== "open" ? " disabled" : ""} aria-pressed="${slot === selectedSlot}"><strong>${slot}</strong><small>${label}</small></button>`; }).join("") : "";
      return `<fieldset class="vp-fieldset" data-field="date"><legend>Ngày tham quan</legend><div class="vp-dates">${chips}</div><small class="vp-error" hidden></small></fieldset><fieldset class="vp-fieldset" data-field="slot"><legend>Khung giờ</legend>${selectedDate ? `<div class="vp-slots">${slots}</div>` : '<p class="vp-muted">Chọn một ngày để xem khung giờ.</p>'}<small class="vp-error" hidden></small><p class="vp-muted">${esc(SEED.tours.capacityNote)}</p></fieldset>`;
    }

    function body() {
      const d = work.data;
      if (work.step === 0) return `<h3 tabindex="-1">Gia đình muốn ghé cơ sở nào?</h3><div class="campus-choice-grid" data-field="campus">${SEED.campuses.map((c) => `<button class="campus-choice${d.campus === c.id ? " active" : ""}" type="button" data-tour-campus="${c.id}" aria-pressed="${d.campus === c.id}"><strong>${esc(c.name)}</strong><span>${esc(c.district)}</span></button>`).join("")}<small class="vp-error" hidden></small></div>`;
      if (work.step === 1) return `<h3 tabindex="-1">Chọn ngày và khung giờ tại ${esc(P.campus(d.campus)?.name || "")}</h3>${datePicker(d.campus, d.date, d.slot)}`;
      if (work.step === 2) return `<h3 tabindex="-1">Thông tin gia đình</h3><div class="vp-grid">${P.field({ name: "name", label: "Họ tên phụ huynh", value: d.name, required: true, placeholder: "Nguyễn Văn A" })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.phone, required: true, placeholder: "09xx xxx xxx", attrs: 'inputmode="tel"' })}${P.field({ name: "email", label: "Email nhận xác nhận", type: "email", value: d.email, placeholder: "email@vidu.com" })}${P.field({ name: "people", label: "Số người tham dự", value: d.people, options: [["1", "1 người"], ["2", "2 người"], ["3", "3 người"], ["4", "4 người"], ["5", "5 người"]] })}${P.field({ name: "interest", label: "Cấp học quan tâm", value: d.interest, required: true, options: [["", "Chọn cấp học"], ...SEED.tuition.bands.map((b) => [b.id, b.label])] })}${P.field({ name: "note", label: "Điều gia đình muốn tìm hiểu", type: "textarea", value: d.note, rows: 3, placeholder: "Ví dụ: lớp 3, CAP, xe đưa rước", full: true })}</div>${consentField("consent", "Tôi đồng ý để VAS liên hệ xác nhận lịch tham quan")}`;
      const c = P.campus(d.campus);
      return `<h3 tabindex="-1">Kiểm tra và xác nhận</h3><dl class="vp-dl"><div><dt>Cơ sở</dt><dd>${esc(c?.name)}, ${esc(c?.address)}</dd></div><div><dt>Thời gian</dt><dd>${esc(P.dateLong(d.date))}, ${esc(d.slot)}</dd></div><div><dt>Phụ huynh</dt><dd>${esc(d.name)}, ${esc(d.phone)}${d.email ? `, ${esc(d.email)}` : ""}</dd></div><div><dt>Số người</dt><dd>${esc(d.people)}</dd></div><div><dt>Cấp học quan tâm</dt><dd>${esc(P.band(d.interest)?.label || "")}</dd></div>${d.note ? `<div><dt>Ghi chú</dt><dd>${esc(d.note)}</dd></div>` : ""}</dl>`;
    }

    function render(focus = false) {
      summary();
      if (view === "done") return renderDone();
      app.innerHTML = `<ol class="vp-steps is-compact" aria-label="Các bước đặt lịch">${STEPS.map((label, i) => `<li class="${i === work.step ? "is-current" : i < work.step ? "is-done" : ""}"${i === work.step ? ' aria-current="step"' : ""}><span>${String(i + 1).padStart(2, "0")}</span>${esc(label)}</li>`).join("")}</ol><form class="visit-body vp-form" novalidate data-step="${work.step}"><span class="xp-label">Bước ${work.step + 1} / ${STEPS.length}</span><div data-vp-alert></div>${body()}<div class="vp-form-nav">${work.step > 0 ? '<button type="button" class="btn btn-outline" data-back>Quay lại</button>' : "<span></span>"}<button type="submit" class="btn btn-red" ${work.step === STEPS.length - 1 ? "data-confirm-tour" : "data-next"}>${work.step === STEPS.length - 1 ? "Xác nhận đặt lịch" : "Tiếp tục"}</button></div></form>`;
      bind();
      if (focus) { $("h3", app)?.focus({ preventScroll: true }); app.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }

    function collect(form) {
      if (work.step !== 2) return;
      const v = (n) => form.elements[n]?.value?.trim() || "";
      Object.assign(work.data, { name: v("name"), phone: v("phone").replace(/[\s.]/g, ""), email: v("email"), people: v("people") || "2", interest: v("interest"), note: v("note") });
      save(); summary();
    }

    function showFieldError(form, name, message) {
      const wrap = form.querySelector(`[data-field="${name}"]`);
      const error = wrap?.querySelector(".vp-error");
      if (error) { error.textContent = message; error.hidden = false; }
      wrap?.scrollIntoView({ block: "center", behavior: "smooth" });
      wrap?.querySelector("button:not([disabled])")?.focus({ preventScroll: true });
    }

    function validate(form) {
      const d = work.data;
      if (work.step === 0) { if (!d.campus) { showFieldError(form, "campus", "Vui lòng chọn một cơ sở."); return false; } return true; }
      if (work.step === 1) {
        if (!d.date) { showFieldError(form, "date", "Vui lòng chọn ngày tham quan."); return false; }
        if (!d.slot) { showFieldError(form, "slot", "Vui lòng chọn khung giờ còn chỗ."); return false; }
        return true;
      }
      if (work.step === 2) { const R = P.rules; return P.check(form, { name: R.required("họ tên phụ huynh"), phone: R.phone(false), email: R.email(true), interest: R.choose("cấp học quan tâm"), consent: R.consent }); }
      return true;
    }

    function bind() {
      const form = $("form", app);
      $$("[data-tour-campus]", app).forEach((b) => b.addEventListener("click", () => { if (work.data.campus !== b.dataset.tourCampus) { work.data.date = ""; work.data.slot = ""; } work.data.campus = b.dataset.tourCampus; save(); render(); $(`[data-tour-campus="${b.dataset.tourCampus}"]`, app)?.focus(); }));
      $$("[data-date]", app).forEach((b) => b.addEventListener("click", () => { work.data.date = b.dataset.date; work.data.slot = ""; save(); render(); $(`[data-date="${b.dataset.date}"]`, app)?.focus(); }));
      $$("[data-slot]", app).forEach((b) => b.addEventListener("click", () => { work.data.slot = b.dataset.slot; save(); render(); $(`[data-slot="${b.dataset.slot}"]`, app)?.focus(); }));
      form.addEventListener("input", () => collect(form));
      $("[data-back]", app)?.addEventListener("click", () => { collect(form); work.step -= 1; save(); render(true); });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        collect(form);
        if (!validate(form)) return;
        if (work.step < STEPS.length - 1) { work.step += 1; save(); render(true); return; }
        confirmTour(form);
      });
    }

    function confirmTour(form) {
      const button = $("[data-confirm-tour]", form);
      const alert = $("[data-vp-alert]", form);
      alert.innerHTML = "";
      P.busy(button, true, "Đang giữ chỗ…");
      const d = work.data;
      P.request(() => {
        if (P.slotState(d.campus, d.date, d.slot) !== "open") { const error = new Error("Khung giờ này vừa kín. Hãy chọn một khung giờ khác; thông tin gia đình vẫn được giữ."); error.code = "slot-taken"; throw error; }
        const tour = { ref: P.ref("TQ"), status: "confirmed", ...JSON.parse(JSON.stringify(d)), createdAt: new Date().toISOString(), history: [] };
        store.upsert("tours", tour);
        return tour;
      }, { delay: 850 }).then((tour) => {
        lastTour = tour;
        work = { step: 0, data: blank() }; save();
        view = "done"; render(); renderList();
        app.scrollIntoView({ behavior: "smooth", block: "start" });
      }).catch((error) => {
        P.busy(button, false);
        alert.innerHTML = P.errorBox(error.message, error.code === "slot-taken" ? "Chọn khung giờ khác" : "Thử lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => { if (error.code === "slot-taken") { work.step = 1; work.data.slot = ""; save(); render(true); } else confirmTour($("form", app)); });
      });
    }

    function renderDone() {
      const t = lastTour; const c = P.campus(t.campus);
      app.innerHTML = `<div class="visit-body vp-success" role="status" tabindex="-1"><span class="xp-label">Đã đặt lịch</span><h3>Hẹn gặp gia đình tại ${esc(c.name)}.</h3><p>${esc(P.dateLong(t.date))}, lúc <b>${esc(t.slot)}</b>. Địa chỉ: ${esc(c.address)}. Điện thoại cơ sở: <a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a>.</p><p class="vp-ref">Mã lịch hẹn <b data-tour-ref>${esc(t.ref)}</b></p>${P.prototypeNote()}<div class="vp-actions"><a class="btn btn-red" href="#lich-cua-toi">Xem lịch của tôi</a><button type="button" class="btn btn-outline" data-again>Đặt thêm lịch</button><a class="btn btn-outline" href="../tuyen-sinh/#ung-tuyen">Nộp hồ sơ dự tuyển</a></div></div>`;
      $("[data-again]", app).addEventListener("click", () => { view = "form"; render(true); });
      $(".vp-success", app).focus({ preventScroll: true });
      ["campus", "date", "time", "family"].forEach((k) => { const node = document.querySelector(`[data-summary-${k}]`); if (node) node.textContent = k === "campus" ? c.name : k === "date" ? P.dateLong(t.date) : k === "time" ? t.slot : `${t.name}, ${t.people} người`; });
    }

    function renderList() {
      const tours = store.get("tours") || [];
      const wanted = P.params().get("lich");
      const notFound = wanted && !tours.some((t) => t.ref === wanted) ? `<div class="vp-alert is-warning" role="alert" data-not-found><div><strong>Không tìm thấy lịch hẹn ${esc(wanted)}</strong><p>Mã có thể sai hoặc lịch đã bị xóa khi đặt lại dữ liệu demo.</p></div><button type="button" class="btn btn-outline" data-clear-ref>Xem tất cả lịch</button></div>` : "";
      if (!tours.length) list.innerHTML = notFound + P.emptyBlock("Bạn chưa có lịch tham quan nào", "Lịch bạn đặt sẽ hiện ở đây để đổi giờ hoặc hủy khi cần.", '<a class="btn btn-red" href="#dat-lich">Đặt lịch ngay</a>');
      else list.innerHTML = notFound + `<ul class="vp-records">${tours.map((t) => { const c = P.campus(t.campus); return `<li class="vp-record${wanted === t.ref ? " is-highlight" : ""}" data-ref="${esc(t.ref)}"><div class="vp-record-main"><div class="vp-record-top">${P.statusChip(t.status)}<span class="vp-record-ref">${esc(t.ref)}</span></div><h3>${esc(c?.name || "")}, ${esc(t.slot)}</h3><p>${esc(P.dateLong(t.date))}, ${esc(t.people)} người</p>${t.history?.length ? `<small>Đã đổi lịch ${t.history.length} lần, lần gần nhất từ ${esc(P.dateVi(t.history[t.history.length - 1].date))} ${esc(t.history[t.history.length - 1].slot)}</small>` : ""}${t.status === "cancelled" ? `<small>Đã hủy${t.cancelReason ? `: ${esc(t.cancelReason)}` : ""}</small>` : ""}</div><div class="vp-record-actions">${t.status === "confirmed" ? `<button type="button" class="btn btn-outline" data-reschedule="${esc(t.ref)}">Đổi lịch</button><button type="button" class="vp-link is-danger" data-cancel="${esc(t.ref)}">Hủy lịch</button>` : `<a class="btn btn-outline" href="?campus=${esc(t.campus)}#dat-lich">Đặt lại lịch mới</a>`}</div></li>`; }).join("")}</ul>`;
      $("[data-clear-ref]", list)?.addEventListener("click", () => { P.setParam("lich", null); renderList(); });
      $$("[data-reschedule]", list).forEach((b) => b.addEventListener("click", () => reschedule(b.dataset.reschedule)));
      $$("[data-cancel]", list).forEach((b) => b.addEventListener("click", () => cancel(b.dataset.cancel)));
      $$("[href^='?campus=']", list).forEach((a) => a.addEventListener("click", (event) => { event.preventDefault(); work = { step: 1, data: { ...blank(), campus: a.getAttribute("href").match(/campus=([^#&]+)/)[1] } }; view = "form"; save(); render(true); }));
    }

    function reschedule(ref) {
      const tour = store.find("tours", ref);
      if (!tour) return;
      let pick = { date: tour.date, slot: "" };
      const { root, close } = P.openDialog({ title: `Đổi lịch ${ref}`, eyebrow: P.campus(tour.campus)?.name, body: '<div data-picker></div><div data-vp-alert></div><div class="vp-actions"><button type="button" class="btn btn-red" data-save-reschedule>Lưu lịch mới</button><button type="button" class="btn btn-outline" data-vp-close-inline>Giữ lịch cũ</button></div>' });
      const draw = () => {
        $("[data-picker]", root).innerHTML = `<p class="vp-muted">Lịch hiện tại: ${esc(P.dateLong(tour.date))}, ${esc(tour.slot)}.</p>${datePicker(tour.campus, pick.date, pick.slot, null)}`;
        $$("[data-date]", root).forEach((b) => b.addEventListener("click", () => { pick = { date: b.dataset.date, slot: "" }; draw(); $(`[data-date="${b.dataset.date}"]`, root)?.focus(); }));
        $$("[data-slot]", root).forEach((b) => b.addEventListener("click", () => { pick.slot = b.dataset.slot; draw(); $(`[data-slot="${b.dataset.slot}"]`, root)?.focus(); }));
      };
      draw();
      $("[data-vp-close-inline]", root).addEventListener("click", () => close());
      $("[data-save-reschedule]", root).addEventListener("click", (event) => {
        const alert = $("[data-vp-alert]", root);
        alert.innerHTML = "";
        if (!pick.date || !pick.slot) { alert.innerHTML = '<p class="vp-error" role="alert">Vui lòng chọn ngày và khung giờ mới.</p>'; return; }
        const button = event.currentTarget;
        P.busy(button, true, "Đang đổi lịch…");
        P.request(() => {
          if (P.slotState(tour.campus, pick.date, pick.slot, null) !== "open") throw new Error("Khung giờ này vừa kín, hãy chọn khung khác.");
          store.update("tours", (items) => items.map((t) => (t.ref === ref ? { ...t, date: pick.date, slot: pick.slot, history: [...(t.history || []), { date: t.date, slot: t.slot, at: new Date().toISOString() }] } : t)));
        }).then(() => { close(); P.toast(`Đã đổi lịch ${ref} sang ${P.dateVi(pick.date)} lúc ${pick.slot}.`); renderList(); })
          .catch((error) => { P.busy(button, false); alert.innerHTML = P.errorBox(error.message); $("[data-vp-retry]", alert).addEventListener("click", () => button.click()); });
      });
    }

    async function cancel(ref) {
      const answer = await P.confirmDialog({ title: `Hủy lịch ${ref}?`, message: "Khung giờ sẽ được nhường cho gia đình khác. Bạn có thể đặt lịch mới bất cứ lúc nào.", confirmLabel: "Hủy lịch", cancelLabel: "Giữ lịch", extra: `<div class="vp-grid">${P.field({ name: "reason", label: "Lý do (không bắt buộc)", options: [["", "Chọn lý do"], ["Bận việc đột xuất", "Bận việc đột xuất"], ["Muốn tham quan cơ sở khác", "Muốn tham quan cơ sở khác"], ["Đã tham quan trực tuyến", "Đã tham quan trực tuyến"]], full: true })}</div>` });
      if (!answer) return;
      const node = list.querySelector(`[data-cancel="${CSS.escape(ref)}"]`);
      P.busy(node, true, "Đang hủy…");
      P.request(() => store.update("tours", (items) => items.map((t) => (t.ref === ref ? { ...t, status: "cancelled", cancelReason: answer.reason || "", cancelledAt: new Date().toISOString() } : t))))
        .then(() => { P.toast(`Đã hủy lịch ${ref}.`); renderList(); })
        .catch((error) => { P.busy(node, false); P.toast(`${error.message} Lịch vẫn được giữ, hãy thử hủy lại.`); });
    }

    render();
    renderList();
    if (P.params().get("lich")) setTimeout(() => list.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  });

  /* =================================================================
     TÌM LỘ TRÌNH — lưu kết quả và mang sang hồ sơ dự tuyển
     ================================================================= */
  P.flow("find-my-path", () => {
    const layout = document.querySelector(".fit-layout");
    const content = document.getElementById("fitContent");
    if (!layout || !content) return;
    const DATA = window.VAS_DECISION_DATA;
    const currentResult = () => {
      const q = P.params();
      const grade = q.get("grade"); const direction = q.get("direction"); const program = q.get("program");
      if (!grade || !direction || !program) return null;
      const prog = P.programme(program); const camp = P.campus(q.get("campus"));
      return { grade, direction, program, campus: camp?.id || "", programmeCode: prog?.code || program.toUpperCase(), programmeName: prog?.name || "", gradeLabel: fmpGradeLabel[grade] || grade, campusName: camp?.name || "", savedAt: new Date().toISOString() };
    };
    const same = (a, b) => a && b && a.grade === b.grade && a.direction === b.direction && a.program === b.program && a.campus === b.campus;

    function banner() {
      let host = document.getElementById("fitSaved");
      const saved = store.get("savedPath");
      if (!saved) { host?.remove(); return; }
      if (!host) { host = document.createElement("div"); host.id = "fitSaved"; host.className = "vp-banner is-info fit-saved"; layout.querySelector(".section-head")?.appendChild(host); }
      host.innerHTML = `<span>Kết quả đã lưu: <b>${esc(saved.programmeCode)}</b>, ${esc(saved.gradeLabel)}${saved.campusName ? `, cơ sở ${esc(saved.campusName)}` : ""}.</span><span class="vp-banner-actions"><a class="vp-link" href="?grade=${encodeURIComponent(saved.grade)}&direction=${encodeURIComponent(saved.direction)}&program=${encodeURIComponent(saved.program)}${saved.campus ? `&campus=${encodeURIComponent(saved.campus)}` : ""}#find-path">Xem lại</a><a class="vp-link" href="../tuyen-sinh/?from=path#ung-tuyen">Dùng cho hồ sơ</a><button type="button" class="vp-link is-danger" data-vp-clear-path>Xóa</button></span>`;
      host.querySelector("[data-vp-clear-path]").addEventListener("click", () => { store.set("savedPath", null); banner(); syncButtons(); P.toast("Đã xóa kết quả đã lưu."); });
    }
    function syncButtons() {
      const button = document.querySelector("[data-vp-save-path]");
      if (!button || button.getAttribute("aria-busy")) return;
      const saved = same(store.get("savedPath"), currentResult());
      button.textContent = saved ? "Đã lưu kết quả" : "Lưu kết quả";
      button.classList.toggle("is-saved", saved);
    }
    function persist(button, then) {
      const result = currentResult();
      if (!result) return;
      P.busy(button, true, "Đang lưu…");
      P.request(() => store.set("savedPath", result), { delay: 500 }).then(() => {
        P.busy(button, false); banner(); syncButtons();
        P.toast("Đã lưu kết quả. Bạn có thể dùng kết quả này khi nộp hồ sơ dự tuyển.");
        then?.();
      }).catch((error) => { P.busy(button, false); syncButtons(); P.toast(`${error.message} Hãy bấm lưu lại.`); });
    }
    document.addEventListener("click", (event) => {
      const save = event.target.closest("[data-vp-save-path]");
      if (save) { event.preventDefault(); persist(save); return; }
      const use = event.target.closest("[data-vp-use-path]");
      if (use) {
        if (same(store.get("savedPath"), currentResult())) return;
        event.preventDefault();
        persist(use, () => { window.location.href = use.href; });
      }
    });
    new MutationObserver(syncButtons).observe(content, { childList: true });
    banner(); syncButtons();
    if (DATA && !DATA.tuition.records.length) {
      // Bảng phí của prototype nằm trong vas-prototype-data.js; trang này dẫn sang công cụ ước tính.
    }
  });

  /* =================================================================
     TIN TỨC — bộ lọc chủ đề, tìm kiếm, chi tiết bài viết
     ================================================================= */
  P.flow("tin-tuc", () => {
    const app = document.getElementById("newsApp");
    if (!app) return;
    const N = SEED.news;
    const PAGE = 6;
    const state = { cat: P.params().get("chu-de") || "all", q: P.params().get("q") || "", shown: PAGE };
    if (state.cat !== "all" && !N.categories.includes(state.cat)) state.cat = "all";
    let loaded = false;
    const articles = () => N.articles.slice().sort((a, b) => b.date.localeCompare(a.date));
    const norm = (text) => String(text).toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    const matches = (a) => (state.cat === "all" || a.cat === state.cat) && (!state.q || norm(`${a.title} ${a.excerpt} ${a.body.join(" ")}`).includes(norm(state.q)));
    const img = (a) => `<img src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy" />`;

    function load(then) {
      app.innerHTML = P.loadingBlock("Đang tải tin tức…");
      P.request(() => true, { delay: 450 }).then(() => { loaded = true; then(); }).catch((error) => {
        app.innerHTML = `<div class="vp-alert is-error" role="alert"><div><strong>Chưa tải được tin tức</strong><p>${esc(error.message.replace(" Dữ liệu bạn nhập vẫn được giữ nguyên.", ""))}</p></div><button type="button" class="btn btn-outline" data-vp-retry>Tải lại</button></div>`;
        $("[data-vp-retry]", app).addEventListener("click", () => load(then));
      });
    }

    function renderList(focusSearch = false) {
      const all = articles();
      const found = all.filter(matches);
      const counts = Object.fromEntries(N.categories.map((c) => [c, all.filter((a) => a.cat === c).length]));
      app.innerHTML = `<form class="vp-news-tools" role="search" data-news-search><label class="vp-search"><span class="sr-only">Tìm bài viết</span><input type="search" name="q" value="${esc(state.q)}" placeholder="Tìm theo từ khóa, ví dụ: Cambridge" autocomplete="off" /></label><button type="submit" class="btn btn-red">Tìm</button></form><div class="vp-chips" role="group" aria-label="Lọc theo chủ đề"><button type="button" class="vp-chip-btn${state.cat === "all" ? " is-active" : ""}" data-cat="all" aria-pressed="${state.cat === "all"}">Tất cả <b>${all.length}</b></button>${N.categories.map((c) => `<button type="button" class="vp-chip-btn${state.cat === c ? " is-active" : ""}" data-cat="${esc(c)}" aria-pressed="${state.cat === c}">${esc(c)} <b>${counts[c]}</b></button>`).join("")}</div><p class="vp-result-count" data-news-count>${found.length ? `${found.length} bài viết${state.q ? ` khớp “${esc(state.q)}”` : ""}` : "Không có bài viết phù hợp"}</p>${found.length ? `<div class="vp-news-grid">${found.slice(0, state.shown).map((a) => `<article class="vp-news-card"><a href="?bai=${esc(a.slug)}" data-article="${esc(a.slug)}"><div class="vp-news-thumb">${img(a)}</div><div class="vp-news-body"><p class="vp-meta"><b>${esc(a.cat)}</b><span>${esc(P.dateVi(a.date))}</span></p><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><span class="text-link">Đọc tiếp <span aria-hidden="true">→</span></span></div></a></article>`).join("")}</div>${found.length > state.shown ? `<button type="button" class="btn btn-outline vp-more" data-more>Xem thêm ${Math.min(PAGE, found.length - state.shown)} bài</button>` : ""}` : P.emptyBlock("Không tìm thấy bài viết", state.q ? `Không có bài nào khớp “${state.q}”${state.cat !== "all" ? ` trong chủ đề ${state.cat}` : ""}. Thử từ khóa khác hoặc bỏ bộ lọc.` : "Chủ đề này chưa có bài viết.", '<button type="button" class="btn btn-red" data-clear-filters>Xóa bộ lọc</button>')}`;
      $("[data-news-search]", app).addEventListener("submit", (event) => { event.preventDefault(); state.q = event.target.elements.q.value.trim(); state.shown = PAGE; P.setParam("q", state.q || null); renderList(true); });
      $("input[name=q]", app).addEventListener("search", (event) => { if (!event.target.value && state.q) { state.q = ""; P.setParam("q", null); renderList(true); } });
      $$("[data-cat]", app).forEach((b) => b.addEventListener("click", () => { state.cat = b.dataset.cat; state.shown = PAGE; P.setParam("chu-de", state.cat === "all" ? null : state.cat); renderList(); $(`[data-cat="${CSS.escape(state.cat)}"]`, app)?.focus(); }));
      $("[data-more]", app)?.addEventListener("click", () => { state.shown += PAGE; renderList(); });
      $("[data-clear-filters]", app)?.addEventListener("click", () => { state.cat = "all"; state.q = ""; P.setParam("q", null); P.setParam("chu-de", null); renderList(true); });
      $$("[data-article]", app).forEach((a) => a.addEventListener("click", (event) => { event.preventDefault(); openArticle(a.dataset.article, true); }));
      if (focusSearch) $("input[name=q]", app).focus();
    }

    function openArticle(slug, push) {
      if (push) P.setParam("bai", slug, true);
      app.innerHTML = P.loadingBlock("Đang mở bài viết…");
      document.getElementById("tin-moi-nhat").scrollIntoView({ behavior: "smooth", block: "start" });
      P.request(() => N.articles.find((a) => a.slug === slug) || null, { delay: 350 }).then((a) => {
        if (!a) {
          app.innerHTML = `<div class="vp-empty is-not-found" data-article-not-found><strong>Không tìm thấy bài viết</strong><p>Bài viết “${esc(slug)}” không tồn tại hoặc đã được gỡ. Hãy xem các tin mới nhất bên dưới.</p><button type="button" class="btn btn-red" data-back-list>Về danh sách tin tức</button></div>`;
          $("[data-back-list]", app).addEventListener("click", backToList);
          return;
        }
        const related = N.articles.filter((x) => x.cat === a.cat && x.slug !== a.slug).slice(0, 2);
        app.innerHTML = `<article class="vp-article" data-article-view="${esc(a.slug)}"><button type="button" class="vp-link vp-back" data-back-list>← Tất cả tin tức</button><p class="vp-meta"><b>${esc(a.cat)}</b><span>${esc(P.dateLong(a.date))}</span><span>${esc(a.author)}</span></p><h3 class="vp-article-title" tabindex="-1">${esc(a.title)}</h3><p class="vp-article-lead">${esc(a.excerpt)}</p><div class="vp-article-media">${img(a)}</div><div class="vp-article-body">${a.body.map((para) => `<p>${esc(para)}</p>`).join("")}</div><div class="vp-actions"><button type="button" class="btn btn-outline" data-copy-link>Sao chép liên kết</button><a class="btn btn-red" href="../tuyen-sinh/?intent=inquire#dang-ky">Nhận tư vấn</a></div>${related.length ? `<aside class="vp-related"><h4>Cùng chủ đề ${esc(a.cat)}</h4><ul>${related.map((r) => `<li><a href="?bai=${esc(r.slug)}" data-article="${esc(r.slug)}">${esc(r.title)}</a><small>${esc(P.dateVi(r.date))}</small></li>`).join("")}</ul></aside>` : ""}</article>`;
        $("[data-back-list]", app).addEventListener("click", backToList);
        $("[data-copy-link]", app).addEventListener("click", () => {
          const url = window.location.href;
          const done = () => P.toast("Đã sao chép liên kết bài viết.");
          if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, () => P.toast(url)); else P.toast(url);
        });
        $$("[data-article]", app).forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); openArticle(link.dataset.article, true); }));
        $(".vp-article-title", app).focus({ preventScroll: true });
        document.title = `${a.title} — Tin tức VAS`;
      }).catch((error) => {
        app.innerHTML = `<div class="vp-alert is-error" role="alert"><div><strong>Chưa mở được bài viết</strong><p>${esc(error.message.replace(" Dữ liệu bạn nhập vẫn được giữ nguyên.", ""))}</p></div><button type="button" class="btn btn-outline" data-vp-retry>Thử lại</button></div>`;
        $("[data-vp-retry]", app).addEventListener("click", () => openArticle(slug, false));
      });
    }
    const baseTitle = document.title;
    function backToList() { P.setParam("bai", null, true); document.title = baseTitle; renderList(); document.getElementById("tin-moi-nhat").scrollIntoView({ behavior: "smooth", block: "start" }); }
    window.addEventListener("popstate", () => { const slug = P.params().get("bai"); if (slug) openArticle(slug, false); else { document.title = baseTitle; renderList(); } });

    const slug = P.params().get("bai");
    if (slug) openArticle(slug, false); else load(() => renderList());
    if (!loaded && slug) loaded = true;
  });

  /* =================================================================
     CƠ SỞ — chi tiết từng cơ sở (dialog có đường dẫn ?chi-tiet=)
     ================================================================= */
  P.flow("co-so", () => {
    function open(id) {
      const c = P.campus(id);
      P.setParam("chi-tiet", id);
      if (!c) {
        P.openDialog({ title: "Không tìm thấy cơ sở", eyebrow: "Các cơ sở VAS", body: `<p class="vp-dialog-text" data-campus-not-found>Không có cơ sở nào với mã “${esc(id)}”. Hãy chọn một trong sáu cơ sở dưới đây.</p><ul class="vp-campus-links">${SEED.campuses.map((x) => `<li><button type="button" class="vp-link" data-vp-campus-detail="${x.id}">${esc(x.name)}, ${esc(x.district)}</button></li>`).join("")}</ul>`, onClose: () => P.setParam("chi-tiet", null) });
        return;
      }
      const levels = c.levels.map((l) => window.VAS_DECISION_DATA?.labels?.levels?.[l] || l).join(", ");
      const progs = c.programmes.map((p) => P.programme(p)?.code).join(", ");
      const fromBand = SEED.tuition.bands.find((b) => P.BAND_LEVELS[b.id].some((l) => c.levels.includes(l)));
      const est = P.tuitionEstimate({ band: fromBand.id, programme: "cep", campus: c.id, plan: "two" });
      const slots = P.nextOpenSlots(c.id, 3);
      const { root } = P.openDialog({
        title: c.name,
        eyebrow: `Cơ sở ${c.district}`,
        wide: true,
        body: `<div class="vp-campus-detail" data-campus-detail="${c.id}"><div><p class="vp-dialog-text">${esc(c.highlight)}</p><dl class="vp-dl"><div><dt>Địa chỉ</dt><dd>${esc(c.address)}</dd></div><div><dt>Điện thoại</dt><dd><a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a></dd></div><div><dt>Cấp học</dt><dd>${esc(levels)}</dd></div><div><dt>Lộ trình</dt><dd>${esc(progs)}</dd></div><div><dt>Học phí tham khảo</dt><dd>Từ ${esc(P.millions(est.annual))} / năm (${esc(fromBand.label)}, CEP)</dd></div></dl><h4>Tiện ích</h4><ul class="vp-tags">${c.facilities.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div><div class="vp-campus-side"><h4>Lịch tham quan còn trống</h4>${slots.length ? `<ul class="vp-slot-links">${slots.map((s) => `<li><a href="../dat-lich-tham-quan/?campus=${c.id}&date=${s.date}&slot=${encodeURIComponent(s.slot)}#dat-lich"><b>${esc(s.slot)}</b> ${esc(P.dateLong(s.date))}</a></li>`).join("")}</ul>` : '<p class="vp-muted">Hai tuần tới đã kín lịch. Hãy gọi cơ sở để được xếp lịch riêng.</p>'}<div class="vp-actions is-stack"><a class="btn btn-red" href="../dat-lich-tham-quan/?campus=${c.id}#dat-lich">Đặt lịch tham quan</a><a class="btn btn-outline" href="../tuyen-sinh/?campus=${c.id}#hoc-phi">Ước tính học phí</a><a class="btn btn-outline" href="../tuyen-sinh/#ung-tuyen">Nộp hồ sơ dự tuyển</a></div></div></div>`,
        onClose: () => P.setParam("chi-tiet", null),
      });
      return root;
    }
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-vp-campus-detail]");
      if (!trigger) return;
      event.preventDefault();
      open(trigger.dataset.vpCampusDetail);
    });
    const wanted = P.params().get("chi-tiet");
    if (wanted) open(wanted);
  });

  /* =================================================================
     HỌC BỔNG — kiểm tra điều kiện, nộp hồ sơ, rút hồ sơ
     ================================================================= */
  function scholarshipCheck({ grade, score, achievements = [], community = "none" }) {
    return SEED.scholarships.map((s) => {
      const reasons = [];
      const g = Number(grade); const sc = Number(score);
      if (!(g >= s.minGrade && g <= s.maxGrade)) reasons.push(`Dành cho học sinh lớp ${s.minGrade}–${s.maxGrade}.`);
      if (!(sc >= s.minScore)) reasons.push(`Cần điểm trung bình từ ${s.minScore.toLocaleString("vi-VN")} trở lên.`);
      if (s.needs === "achievement" && !achievements.length) reasons.push("Cần ít nhất một thành tích học thuật hoặc năng khiếu.");
      if (s.needs === "community" && community !== "led") reasons.push("Cần một dự án cộng đồng do học sinh khởi xướng hoặc dẫn dắt.");
      return { scholarship: s, eligible: !reasons.length, reasons };
    });
  }

  P.flow("hoc-bong", () => {
    const checker = document.getElementById("eligibilityApp");
    const appHost = document.getElementById("scholarshipApp");
    const list = document.getElementById("myScholarships");
    if (!checker || !appHost || !list) return;
    const gradeNumbers = [["", "Chọn lớp"], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), `Lớp ${i + 1}`])];
    let last = store.wizard("scholarshipCheck");

    function renderChecker() {
      const v = last?.input || {};
      checker.innerHTML = `<form class="vp-card vp-form" novalidate data-eligibility><div class="vp-grid">${P.field({ name: "grade", label: "Lớp hiện tại", value: v.grade || "", required: true, options: gradeNumbers })}${P.field({ name: "score", label: "Điểm trung bình năm gần nhất (thang 10)", type: "number", value: v.score ?? "", required: true, placeholder: "Ví dụ: 8,7", attrs: 'min="0" max="10" step="0.1" inputmode="decimal"' })}</div><fieldset class="vp-fieldset"><legend>Thành tích nổi bật</legend><div class="vp-checks">${[["city", "Giải học thuật cấp thành phố trở lên"], ["cambridge", "Chứng chỉ Cambridge loại xuất sắc"], ["talent", "Giải nghệ thuật hoặc thể thao"]].map(([id, label]) => `<label><input type="checkbox" name="achievements" value="${id}"${(v.achievements || []).includes(id) ? " checked" : ""} /> ${esc(label)}</label>`).join("")}</div></fieldset>${P.field({ name: "community", label: "Hoạt động cộng đồng", value: v.community || "none", options: [["none", "Chưa tham gia"], ["joined", "Có tham gia hoạt động cộng đồng"], ["led", "Khởi xướng hoặc dẫn dắt một dự án"]] })}<div class="vp-actions"><button type="submit" class="btn btn-red">Xem kết quả</button></div></form><div class="vp-card vp-eligibility" data-eligibility-result aria-live="polite">${last ? resultHtml(last.result) : P.emptyBlock("Chưa có kết quả", "Điền thông tin bên cạnh và bấm Xem kết quả để biết con có thể ứng tuyển học bổng nào.")}</div>`;
      const form = $("[data-eligibility]", checker);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const ok = P.check(form, { grade: P.rules.choose("lớp hiện tại"), score: (value) => { if (value === "") return "Vui lòng nhập điểm trung bình."; const n = Number(String(value).replace(",", ".")); return Number.isFinite(n) && n >= 0 && n <= 10 ? "" : "Điểm trung bình cần nằm trong khoảng 0 đến 10."; } });
        if (!ok) return;
        const input = { grade: form.elements.grade.value, score: Number(form.elements.score.value.replace(",", ".")), achievements: $$("input[name=achievements]:checked", form).map((x) => x.value), community: form.elements.community.value };
        last = { input, result: scholarshipCheck(input) };
        store.wizard("scholarshipCheck", last);
        $("[data-eligibility-result]", checker).innerHTML = resultHtml(last.result);
        bindResult();
        $("[data-eligibility-result]", checker).scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      bindResult();
    }
    function resultHtml(result) {
      const any = result.some((r) => r.eligible);
      return `<h3 tabindex="-1">${any ? "Con đủ điều kiện ứng tuyển" : "Chưa đủ điều kiện ở thời điểm này"}</h3><ul class="vp-elig-list">${result.map((r) => `<li class="${r.eligible ? "is-ok" : "is-no"}" data-elig="${r.scholarship.id}"><div><strong>${esc(r.scholarship.name)}</strong><span>${r.eligible ? `Đủ điều kiện. ${esc(r.scholarship.value)}.` : esc(r.reasons.join(" "))}</span></div>${r.eligible ? `<button type="button" class="btn btn-red" data-apply-scholarship="${r.scholarship.id}">Nộp hồ sơ</button>` : ""}</li>`).join("")}</ul>${any ? "" : '<p class="vp-muted">Gia đình vẫn có thể trao đổi với đội tuyển sinh về các chính sách hỗ trợ khác.</p>'}`;
    }
    function bindResult() {
      $$("[data-apply-scholarship]", checker).forEach((b) => b.addEventListener("click", () => {
        const draft = store.wizard("scholarshipForm") || {};
        Object.assign(draft, { scholarship: b.dataset.applyScholarship, grade: last.input.grade, score: String(last.input.score) });
        store.wizard("scholarshipForm", draft);
        renderForm(true);
      }));
    }

    function renderForm(focus) {
      const d = store.wizard("scholarshipForm") || {};
      appHost.innerHTML = `<form class="vp-card vp-form" novalidate data-scholarship-form><div data-vp-alert></div><div class="vp-grid">${P.field({ name: "scholarship", label: "Học bổng", value: d.scholarship || "", required: true, options: [["", "Chọn học bổng"], ...SEED.scholarships.map((s) => [s.id, s.name])] })}${P.field({ name: "studentName", label: "Họ tên học sinh", value: d.studentName || "", required: true })}${P.field({ name: "grade", label: "Lớp hiện tại", value: d.grade || "", required: true, options: gradeNumbers })}${P.field({ name: "campus", label: "Cơ sở đang học hoặc dự tuyển", value: d.campus || "", required: true, options: campusOptions() })}${P.field({ name: "score", label: "Điểm trung bình năm gần nhất", type: "number", value: d.score || "", required: true, attrs: 'min="0" max="10" step="0.1" inputmode="decimal"' })}${P.field({ name: "studentCode", label: "Mã học sinh VAS", value: d.studentCode || "", hint: "Bỏ trống nếu con chưa học tại VAS." })}${P.field({ name: "essay", label: "Thành tích và câu chuyện của con", type: "textarea", value: d.essay || "", required: true, rows: 5, full: true, hint: "Tối thiểu 80 ký tự: thành tích, hoạt động hoặc dự án cộng đồng nổi bật." })}<div class="vp-field is-full" data-field="evidence"><label for="hbEvidence">Minh chứng (giấy khen, chứng chỉ)</label><input id="hbEvidence" type="file" name="evidence" multiple accept=".pdf,.jpg,.jpeg,.png" /><ul class="vp-files">${(d.evidence || []).map((n) => `<li><span>${esc(n)}</span></li>`).join("") || '<li class="vp-files-empty">Chưa chọn tệp. Chỉ ghi lại tên tệp, không tải lên.</li>'}</ul><small class="vp-error" hidden></small></div>${P.field({ name: "parentName", label: "Họ tên phụ huynh", value: d.parentName || "", required: true })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.phone || "", required: true, attrs: 'inputmode="tel"' })}${P.field({ name: "email", label: "Email", type: "email", value: d.email || "", required: true })}</div>${consentField("consent", "Tôi xác nhận thông tin và minh chứng là trung thực")}<div class="vp-form-nav"><span></span><button type="submit" class="btn btn-red" data-submit-scholarship>Nộp hồ sơ học bổng</button></div></form>`;
      const form = $("form", appHost);
      const persist = () => { const x = store.wizard("scholarshipForm") || {}; ["scholarship", "studentName", "grade", "campus", "score", "studentCode", "essay", "parentName", "phone", "email"].forEach((k) => { x[k] = form.elements[k].value; }); store.wizard("scholarshipForm", x); };
      form.addEventListener("input", persist);
      form.addEventListener("change", persist);
      $("#hbEvidence", form).addEventListener("change", (event) => {
        persist();
        const { good, bad } = P.fileNames(event.target, /\.(pdf|jpe?g|png)$/i);
        const x = store.wizard("scholarshipForm") || {}; x.evidence = [...new Set([...(x.evidence || []), ...good])]; store.wizard("scholarshipForm", x);
        renderForm();
        if (bad.length) { const err = $("[data-field=evidence] .vp-error", appHost); err.hidden = false; err.textContent = `Không nhận tệp ${bad.join(", ")}. Chỉ chấp nhận PDF, JPG hoặc PNG.`; }
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault(); persist();
        const R = P.rules;
        const ok = P.check(form, {
          scholarship: R.choose("học bổng"), studentName: R.required("họ tên học sinh"), grade: R.choose("lớp hiện tại"), campus: R.choose("cơ sở"),
          score: (value) => { const n = Number(String(value).replace(",", ".")); if (value === "") return "Vui lòng nhập điểm trung bình."; if (!(n >= 0 && n <= 10)) return "Điểm trung bình cần từ 0 đến 10."; const s = SEED.scholarships.find((x) => x.id === form.elements.scholarship.value); return s && n < s.minScore ? `${s.short} yêu cầu điểm trung bình từ ${s.minScore.toLocaleString("vi-VN")}.` : ""; },
          essay: R.minLength(80, "Phần mô tả"), parentName: R.required("họ tên phụ huynh"), phone: R.phone(false), email: R.email(false), consent: R.consent,
        });
        if (!ok) return;
        const s = SEED.scholarships.find((x) => x.id === form.elements.scholarship.value);
        const g = Number(form.elements.grade.value);
        if (g < s.minGrade || g > s.maxGrade) { P.check(form, { grade: () => `${s.short} dành cho học sinh lớp ${s.minGrade}–${s.maxGrade}.` }); return; }
        const dup = (store.get("scholarshipApps") || []).find((a) => a.status === "submitted" && a.scholarship === s.id && a.studentName.toLowerCase() === form.elements.studentName.value.trim().toLowerCase());
        if (dup) { $("[data-vp-alert]", form).innerHTML = `<div class="vp-alert is-warning" role="alert"><div><strong>Đã có hồ sơ cho học sinh này</strong><p>Hồ sơ ${esc(dup.ref)} đang chờ xét duyệt. Hãy rút hồ sơ cũ nếu muốn nộp lại.</p></div></div>`; return; }
        submit(form);
      });
      if (focus) { form.scrollIntoView({ behavior: "smooth", block: "start" }); form.elements.studentName.focus({ preventScroll: true }); }
    }
    function submit(form) {
      const button = $("[data-submit-scholarship]", form);
      const alert = $("[data-vp-alert]", form);
      alert.innerHTML = "";
      P.busy(button, true, "Đang nộp…");
      const x = store.wizard("scholarshipForm");
      const record = { ref: P.ref("HB"), status: "submitted", ...x, studentName: x.studentName.trim(), submittedAt: new Date().toISOString() };
      P.request(() => store.upsert("scholarshipApps", record), { delay: 800 }).then(() => {
        store.wizard("scholarshipForm", null);
        const s = SEED.scholarships.find((y) => y.id === record.scholarship);
        appHost.innerHTML = `<div class="vp-card vp-success" role="status" tabindex="-1"><span class="eyebrow">Đã nộp hồ sơ học bổng</span><h3>${esc(s.name)}</h3><p>Hồ sơ của <b>${esc(record.studentName)}</b> đã được ghi nhận. Hội đồng học bổng xét duyệt sau hạn nộp ${esc(P.dateVi(s.deadline))}.</p><p class="vp-ref">Mã hồ sơ <b data-scholarship-ref>${esc(record.ref)}</b></p>${P.prototypeNote()}<div class="vp-actions"><a class="btn btn-red" href="#myScholarships">Xem hồ sơ của tôi</a><button type="button" class="btn btn-outline" data-another>Nộp hồ sơ khác</button></div></div>`;
        $("[data-another]", appHost).addEventListener("click", () => renderForm(true));
        $(".vp-success", appHost).focus({ preventScroll: true });
        renderList();
      }).catch((error) => {
        P.busy(button, false);
        alert.innerHTML = P.errorBox(error.message, "Nộp lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => submit(form));
      });
    }
    function renderList() {
      const apps = store.get("scholarshipApps") || [];
      if (!apps.length) { list.innerHTML = P.emptyBlock("Chưa có hồ sơ học bổng", "Hồ sơ bạn nộp sẽ hiện ở đây cùng trạng thái xét duyệt."); return; }
      list.innerHTML = `<ul class="vp-records">${apps.map((a) => { const s = SEED.scholarships.find((x) => x.id === a.scholarship); return `<li class="vp-record" data-ref="${esc(a.ref)}"><div class="vp-record-main"><div class="vp-record-top">${P.statusChip(a.status)}<span class="vp-record-ref">${esc(a.ref)}</span></div><h3>${esc(a.studentName)}</h3><p>${esc(s?.name || "")}, lớp ${esc(a.grade)}, ${esc(P.campus(a.campus)?.name || "")}</p><small>${a.status === "withdrawn" ? `Rút lúc ${esc(P.stamp(a.withdrawnAt))}` : `Nộp lúc ${esc(P.stamp(a.submittedAt))}`}</small></div><div class="vp-record-actions">${a.status === "submitted" ? `<button type="button" class="vp-link is-danger" data-withdraw-scholarship="${esc(a.ref)}">Rút hồ sơ</button>` : ""}</div></li>`; }).join("")}</ul>`;
      $$("[data-withdraw-scholarship]", list).forEach((b) => b.addEventListener("click", async () => {
        const ref = b.dataset.withdrawScholarship;
        const ok = await P.confirmDialog({ title: `Rút hồ sơ ${ref}?`, message: "Hồ sơ sẽ không được hội đồng xét duyệt. Bạn có thể nộp lại trước hạn.", confirmLabel: "Rút hồ sơ" });
        if (!ok) return;
        P.busy(b, true, "Đang rút…");
        P.request(() => store.update("scholarshipApps", (items) => items.map((a) => (a.ref === ref ? { ...a, status: "withdrawn", withdrawnAt: new Date().toISOString() } : a))))
          .then(() => { P.toast(`Đã rút hồ sơ ${ref}.`); renderList(); })
          .catch((error) => { P.busy(b, false); P.toast(`${error.message} Hồ sơ chưa bị rút.`); });
      }));
    }
    renderChecker();
    renderForm();
    renderList();
  });

  /* =================================================================
     TUYỂN DỤNG — danh sách, lọc, chi tiết, ứng tuyển, rút đơn
     ================================================================= */
  P.flow("tuyen-dung", () => {
    const app = document.getElementById("jobsApp");
    const list = document.getElementById("myJobApps");
    if (!app || !list) return;
    const state = { dept: "all", q: "" };
    const DEPTS = [["all", "Tất cả"], ["teaching", "Giảng dạy"], ["support", "Hỗ trợ"], ["office", "Văn phòng"]];
    const job = (id) => SEED.jobs.find((j) => j.id === id) || null;
    const activeApp = (id) => (store.get("jobApps") || []).find((a) => a.jobId === id && a.status === "submitted");
    const norm = (t) => String(t).toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

    function renderList() {
      const jobs = SEED.jobs.filter((j) => (state.dept === "all" || j.dept === state.dept) && (!state.q || norm(`${j.title} ${j.campus} ${j.summary}`).includes(norm(state.q))));
      app.innerHTML = `<div class="job-toolbar" role="group" aria-label="Lọc vị trí">${DEPTS.map(([id, label]) => `<button class="job-filter${state.dept === id ? " active" : ""}" type="button" data-dept="${id}" aria-pressed="${state.dept === id}">${esc(label)}</button>`).join("")}<form class="vp-inline-search" role="search" data-job-search><label><span class="sr-only">Tìm vị trí</span><input type="search" name="q" value="${esc(state.q)}" placeholder="Tìm theo vị trí hoặc cơ sở" /></label><button type="submit" class="btn btn-outline">Tìm</button></form></div><p class="vp-result-count" data-job-count>${jobs.length ? `${jobs.length} vị trí đang tuyển` : "Không có vị trí phù hợp"}</p>${jobs.length ? `<div class="job-list">${jobs.map((j) => `<article class="job-row" data-job-role="${j.dept}"><h3>${esc(j.title)}</h3><span>${esc(j.deptLabel)}</span><span>${esc(j.campus)}</span><a href="?vi-tri=${j.id}" data-job="${j.id}">${activeApp(j.id) ? "Đã ứng tuyển" : "Xem chi tiết →"}</a></article>`).join("")}</div>` : P.emptyBlock("Không tìm thấy vị trí", "Thử từ khóa khác hoặc chọn nhóm công việc khác.", '<button type="button" class="btn btn-red" data-clear-jobs>Xem tất cả vị trí</button>')}`;
      $$("[data-dept]", app).forEach((b) => b.addEventListener("click", () => { state.dept = b.dataset.dept; renderList(); $(`[data-dept="${state.dept}"]`, app).focus(); }));
      $("[data-job-search]", app).addEventListener("submit", (event) => { event.preventDefault(); state.q = event.target.elements.q.value.trim(); renderList(); $("input[name=q]", app).focus(); });
      $("[data-clear-jobs]", app)?.addEventListener("click", () => { state.dept = "all"; state.q = ""; renderList(); });
      $$("[data-job]", app).forEach((a) => a.addEventListener("click", (event) => { event.preventDefault(); openJob(a.dataset.job, true); }));
    }

    function openJob(id, push) {
      if (push) P.setParam("vi-tri", id, true);
      const j = job(id);
      document.getElementById("vi-tri").scrollIntoView({ behavior: "smooth", block: "start" });
      if (!j) {
        app.innerHTML = `<div class="vp-empty is-not-found" data-job-not-found><strong>Không tìm thấy vị trí</strong><p>Vị trí “${esc(id)}” không tồn tại hoặc đã đóng tuyển.</p><button type="button" class="btn btn-red" data-back-jobs>Xem các vị trí đang tuyển</button></div>`;
        $("[data-back-jobs]", app).addEventListener("click", backToList);
        return;
      }
      const applied = activeApp(j.id);
      const closed = j.deadline < P.isoDate(new Date());
      app.innerHTML = `<article class="vp-card vp-job" data-job-view="${j.id}"><button type="button" class="vp-link vp-back" data-back-jobs>← Tất cả vị trí</button><p class="vp-meta"><b>${esc(j.deptLabel)}</b><span>${esc(j.campus)}</span><span>${esc(j.type)}</span><span>Hạn nộp ${esc(P.dateVi(j.deadline))}</span></p><h3 class="vp-article-title" tabindex="-1">${esc(j.title)}</h3><p class="vp-article-lead">${esc(j.summary)}</p><div class="vp-two"><div><h4>Công việc chính</h4><ul class="vp-bullets">${j.duties.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h4>Yêu cầu</h4><ul class="vp-bullets">${j.requirements.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div><div data-apply-area></div></article>`;
      const area = $("[data-apply-area]", app);
      if (closed) area.innerHTML = '<div class="vp-alert is-warning"><div><strong>Vị trí đã hết hạn nhận hồ sơ</strong><p>Hãy xem các vị trí khác đang tuyển.</p></div></div>';
      else if (applied) area.innerHTML = `<div class="vp-alert is-info" data-already-applied><div><strong>Bạn đã ứng tuyển vị trí này</strong><p>Mã đơn ${esc(applied.ref)}, gửi lúc ${esc(P.stamp(applied.submittedAt))}.</p></div><a class="btn btn-outline" href="#don-cua-toi">Xem đơn của tôi</a></div>`;
      else renderApplyForm(area, j);
      $("[data-back-jobs]", app).addEventListener("click", backToList);
      $(".vp-article-title", app).focus({ preventScroll: true });
    }

    function renderApplyForm(area, j) {
      const d = store.wizard(`job-${j.id}`) || {};
      area.innerHTML = `<form class="vp-form vp-apply" novalidate data-job-apply><h4>Ứng tuyển vị trí này</h4><div data-vp-alert></div><div class="vp-grid">${P.field({ name: "fullName", label: "Họ và tên", value: d.fullName || "", required: true })}${P.field({ name: "email", label: "Email", type: "email", value: d.email || "", required: true })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.phone || "", required: true, attrs: 'inputmode="tel"' })}${P.field({ name: "experience", label: "Số năm kinh nghiệm", value: d.experience || "", required: true, options: [["", "Chọn"], ["0", "Chưa có kinh nghiệm"], ["1-2", "1–2 năm"], ["3-5", "3–5 năm"], ["5+", "Trên 5 năm"]] })}<div class="vp-field is-full" data-field="cv"><label for="cvFile">CV của bạn <span class="vp-req" aria-hidden="true">*</span></label><input id="cvFile" type="file" name="cv" accept=".pdf,.doc,.docx" /><small class="vp-hint" data-cv-name>${d.cv ? `Đã chọn: ${esc(d.cv)}` : "PDF hoặc DOC. Bản prototype chỉ ghi lại tên tệp."}</small><small class="vp-error" hidden></small></div>${P.field({ name: "cover", label: "Thư giới thiệu ngắn", type: "textarea", value: d.cover || "", rows: 4, full: true })}</div>${consentField("consent", "Tôi đồng ý để VAS lưu hồ sơ ứng tuyển")}<div class="vp-form-nav"><span></span><button type="submit" class="btn btn-red" data-submit-job>Gửi đơn ứng tuyển</button></div></form>`;
      const form = $("form", area);
      const key = `job-${j.id}`;
      const persist = () => { const x = store.wizard(key) || {}; ["fullName", "email", "phone", "experience", "cover"].forEach((k) => { x[k] = form.elements[k].value; }); store.wizard(key, x); };
      form.addEventListener("input", persist);
      $("#cvFile", form).addEventListener("change", (event) => {
        const { good, bad } = P.fileNames(event.target, /\.(pdf|docx?)$/i);
        const err = $("[data-field=cv] .vp-error", form);
        if (bad.length) { err.hidden = false; err.textContent = `Không nhận tệp ${bad[0]}. Hãy chọn PDF hoặc DOC.`; event.target.value = ""; return; }
        err.hidden = true;
        const x = store.wizard(key) || {}; x.cv = good[0] || ""; store.wizard(key, x);
        $("[data-cv-name]", form).textContent = x.cv ? `Đã chọn: ${x.cv}` : "";
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault(); persist();
        const R = P.rules;
        const ok = P.check(form, { fullName: R.required("họ và tên"), email: R.email(false), phone: R.phone(false), experience: R.choose("số năm kinh nghiệm"), cv: () => ((store.wizard(key) || {}).cv ? "" : "Vui lòng chọn tệp CV (PDF hoặc DOC)."), consent: R.consent });
        if (!ok) return;
        send(form, j);
      });
    }

    function send(form, j) {
      const button = $("[data-submit-job]", form);
      const alert = $("[data-vp-alert]", form);
      alert.innerHTML = "";
      P.busy(button, true, "Đang gửi đơn…");
      const x = store.wizard(`job-${j.id}`);
      const record = { ref: P.ref("UV"), status: "submitted", jobId: j.id, jobTitle: j.title, campus: j.campus, ...x, submittedAt: new Date().toISOString() };
      P.request(() => store.upsert("jobApps", record), { delay: 800 }).then(() => {
        store.wizard(`job-${j.id}`, null);
        const area = form.parentElement;
        area.innerHTML = `<div class="vp-success" role="status" tabindex="-1"><span class="eyebrow">Đã gửi đơn ứng tuyển</span><h3>Cảm ơn ${esc(record.fullName)}.</h3><p>Đơn cho vị trí <b>${esc(j.title)}</b> kèm CV <b>${esc(record.cv)}</b> đã được ghi nhận. Khối Nhân sự phản hồi trong 5 ngày làm việc.</p><p class="vp-ref">Mã đơn <b data-job-ref>${esc(record.ref)}</b></p>${P.prototypeNote()}<div class="vp-actions"><a class="btn btn-red" href="#don-cua-toi">Xem đơn của tôi</a><button type="button" class="btn btn-outline" data-back-jobs-2>Xem vị trí khác</button></div></div>`;
        $("[data-back-jobs-2]", area).addEventListener("click", backToList);
        $(".vp-success", area).focus({ preventScroll: true });
        renderMine();
      }).catch((error) => {
        P.busy(button, false);
        alert.innerHTML = P.errorBox(error.message, "Gửi lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => send(form, j));
      });
    }

    function backToList() { P.setParam("vi-tri", null, true); renderList(); document.getElementById("vi-tri").scrollIntoView({ behavior: "smooth", block: "start" }); }

    function renderMine() {
      const apps = store.get("jobApps") || [];
      if (!apps.length) { list.innerHTML = P.emptyBlock("Bạn chưa gửi đơn ứng tuyển nào", "Chọn một vị trí ở trên và gửi CV để bắt đầu.", '<a class="btn btn-red" href="#vi-tri">Xem vị trí đang tuyển</a>'); return; }
      list.innerHTML = `<ul class="vp-records">${apps.map((a) => `<li class="vp-record" data-ref="${esc(a.ref)}"><div class="vp-record-main"><div class="vp-record-top">${P.statusChip(a.status)}<span class="vp-record-ref">${esc(a.ref)}</span></div><h3>${esc(a.jobTitle)}</h3><p>${esc(a.campus)}, CV ${esc(a.cv)}</p><small>${a.status === "withdrawn" ? `Rút lúc ${esc(P.stamp(a.withdrawnAt))}` : `Gửi lúc ${esc(P.stamp(a.submittedAt))}`}</small></div><div class="vp-record-actions"><a class="btn btn-outline" href="?vi-tri=${esc(a.jobId)}" data-job-link="${esc(a.jobId)}">Xem vị trí</a>${a.status === "submitted" ? `<button type="button" class="vp-link is-danger" data-withdraw-job="${esc(a.ref)}">Rút đơn</button>` : ""}</div></li>`).join("")}</ul>`;
      $$("[data-job-link]", list).forEach((a) => a.addEventListener("click", (event) => { event.preventDefault(); openJob(a.dataset.jobLink, true); }));
      $$("[data-withdraw-job]", list).forEach((b) => b.addEventListener("click", async () => {
        const ref = b.dataset.withdrawJob;
        const ok = await P.confirmDialog({ title: `Rút đơn ${ref}?`, message: "Đơn sẽ không được Khối Nhân sự xem xét. Bạn có thể ứng tuyển lại khi vị trí còn mở.", confirmLabel: "Rút đơn" });
        if (!ok) return;
        P.busy(b, true, "Đang rút…");
        P.request(() => store.update("jobApps", (items) => items.map((a) => (a.ref === ref ? { ...a, status: "withdrawn", withdrawnAt: new Date().toISOString() } : a))))
          .then(() => { P.toast(`Đã rút đơn ${ref}.`); renderMine(); const open = P.params().get("vi-tri"); if (open) openJob(open, false); else renderList(); })
          .catch((error) => { P.busy(b, false); P.toast(`${error.message} Đơn chưa bị rút.`); });
      }));
    }

    window.addEventListener("popstate", () => { const id = P.params().get("vi-tri"); if (id) openJob(id, false); else renderList(); });
    const wanted = P.params().get("vi-tri");
    if (wanted) openJob(wanted, false); else renderList();
    renderMine();
  });

  /* =================================================================
     CỰU HỌC SINH — đăng ký, cập nhật, rời mạng lưới
     ================================================================= */
  P.flow("cuu-hoc-sinh", () => {
    const app = document.getElementById("alumniApp");
    if (!app) return;
    const years = [["", "Chọn năm"], ...Array.from({ length: 19 }, (_, i) => { const y = String(2026 - i); return [y, y]; })];
    const INTERESTS = [["mentoring", "Mentoring học sinh lớp 11–12"], ["events", "Họp mặt và sự kiện cựu học sinh"], ["story", "Chia sẻ câu chuyện trên kênh VAS"]];
    function renderProfile(flashMsg) {
      const a = store.get("alumni");
      if (!a) return renderForm();
      app.innerHTML = `<div class="vp-card vp-profile" data-alumni-profile tabindex="-1">${flashMsg ? `<div class="vp-success-inline" role="status"><strong>${esc(flashMsg)}</strong>${P.prototypeNote()}</div>` : ""}<div class="vp-record-top">${P.statusChip("received")}<span class="vp-record-ref">${esc(a.ref)}</span></div><h3>${esc(a.fullName)}</h3><p>Khóa ${esc(a.year)}, cơ sở ${esc(P.campus(a.campus)?.name || "")}</p><dl class="vp-dl"><div><dt>Hiện tại</dt><dd>${esc(a.role === "study" ? "Đang học" : "Đang làm việc")} tại ${esc(a.organisation)}, ${esc(a.country)}</dd></div><div><dt>Liên hệ</dt><dd>${esc([a.email, a.phone].filter(Boolean).join(", "))}</dd></div><div><dt>Quan tâm</dt><dd>${esc((a.interests || []).map((i) => INTERESTS.find((x) => x[0] === i)?.[1]).filter(Boolean).join("; ") || "Chưa chọn")}</dd></div><div><dt>Cập nhật</dt><dd>${esc(P.stamp(a.updatedAt))}</dd></div></dl><div class="vp-actions"><button type="button" class="btn btn-red" data-edit-alumni>Cập nhật thông tin</button><button type="button" class="vp-link is-danger" data-leave-alumni>Rời mạng lưới cựu học sinh</button></div></div>`;
      $("[data-edit-alumni]", app).addEventListener("click", () => renderForm(a));
      $("[data-leave-alumni]", app).addEventListener("click", async () => {
        const ok = await P.confirmDialog({ title: "Rời mạng lưới cựu học sinh?", message: "Thông tin của bạn sẽ bị xóa và bạn sẽ không nhận lời mời sự kiện nữa.", confirmLabel: "Xóa thông tin" });
        if (!ok) return;
        P.request(() => store.set("alumni", null)).then(() => { P.toast("Đã xóa thông tin cựu học sinh."); renderForm(); }).catch((error) => P.toast(`${error.message} Thông tin vẫn còn.`));
      });
      if (flashMsg) $("[data-alumni-profile]", app).focus({ preventScroll: true });
    }
    function renderForm(existing) {
      const d = existing || store.wizard("alumni") || {};
      app.innerHTML = `<form class="vp-card vp-form" novalidate data-alumni-form><div data-vp-alert></div>${existing ? `<p class="vp-banner">Đang cập nhật hồ sơ <b>${esc(existing.ref)}</b>. <button type="button" class="vp-link" data-cancel-edit>Hủy thay đổi</button></p>` : ""}<div class="vp-grid">${P.field({ name: "fullName", label: "Họ và tên", value: d.fullName || "", required: true })}${P.field({ name: "year", label: "Năm tốt nghiệp", value: d.year || "", required: true, options: years })}${P.field({ name: "campus", label: "Cơ sở đã học", value: d.campus || "", required: true, options: campusOptions() })}${P.field({ name: "email", label: "Email", type: "email", value: d.email || "", required: true })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.phone || "", attrs: 'inputmode="tel"' })}${P.field({ name: "role", label: "Hiện tại bạn", value: d.role || "", required: true, options: [["", "Chọn"], ["study", "Đang học"], ["work", "Đang làm việc"]] })}${P.field({ name: "organisation", label: "Trường hoặc nơi làm việc", value: d.organisation || "", required: true, placeholder: "Ví dụ: Đại học Melbourne" })}${P.field({ name: "country", label: "Quốc gia", value: d.country || "", required: true, options: [["", "Chọn quốc gia"], ...["Việt Nam", "Úc", "Hoa Kỳ", "Vương quốc Anh", "Canada", "Singapore", "Khác"].map((c) => [c, c])] })}</div><fieldset class="vp-fieldset"><legend>Bạn muốn tham gia</legend><div class="vp-checks">${INTERESTS.map(([id, label]) => `<label><input type="checkbox" name="interests" value="${id}"${(d.interests || []).includes(id) ? " checked" : ""} /> ${esc(label)}</label>`).join("")}</div></fieldset>${consentField("consent", "Tôi đồng ý để VAS lưu thông tin và liên hệ về hoạt động cựu học sinh")}<div class="vp-form-nav"><span></span><button type="submit" class="btn btn-red" data-submit-alumni>${existing ? "Lưu thay đổi" : "Đăng ký cựu học sinh"}</button></div></form>`;
      const form = $("form", app);
      if (!existing) form.addEventListener("input", () => { const x = {}; ["fullName", "year", "campus", "email", "phone", "role", "organisation", "country"].forEach((k) => { x[k] = form.elements[k].value; }); x.interests = $$("input[name=interests]:checked", form).map((i) => i.value); store.wizard("alumni", x); });
      $("[data-cancel-edit]", app)?.addEventListener("click", () => renderProfile());
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const R = P.rules;
        const ok = P.check(form, { fullName: R.required("họ và tên"), year: R.choose("năm tốt nghiệp"), campus: R.choose("cơ sở đã học"), email: R.email(false), phone: R.phone(true), role: R.choose("tình trạng hiện tại"), organisation: R.required("trường hoặc nơi làm việc"), country: R.choose("quốc gia"), consent: R.consent });
        if (!ok) return;
        const button = $("[data-submit-alumni]", form);
        const alert = $("[data-vp-alert]", form);
        const send = () => {
          alert.innerHTML = "";
          P.busy(button, true, "Đang lưu…");
          const record = { ref: existing?.ref || P.ref("CHS"), createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), interests: $$("input[name=interests]:checked", form).map((i) => i.value) };
          ["fullName", "year", "campus", "email", "phone", "role", "organisation", "country"].forEach((k) => { record[k] = form.elements[k].value.trim(); });
          P.request(() => store.set("alumni", record), { delay: 700 }).then(() => {
            store.wizard("alumni", null);
            renderProfile(existing ? "Đã cập nhật thông tin của bạn." : `Chào mừng bạn trở lại cộng đồng VAS. Mã cựu học sinh: ${record.ref}.`);
          }).catch((error) => { P.busy(button, false); alert.innerHTML = P.errorBox(error.message, "Lưu lại"); $("[data-vp-retry]", alert).addEventListener("click", send); });
        };
        send();
      });
    }
    renderProfile();
  });

  /* =================================================================
     LIÊN HỆ — form gửi tin nhắn
     ================================================================= */
  P.flow("lien-he", () => {
    const app = document.getElementById("contactApp");
    if (!app) return;
    const TOPICS = [["admissions", "Tư vấn tuyển sinh"], ["visit", "Tham quan cơ sở"], ["career", "Tuyển dụng"], ["general", "Câu hỏi khác"]];
    function renderForm(prefTopic) {
      const d = store.wizard("contact") || {};
      if (prefTopic) d.topic = prefTopic;
      app.innerHTML = `<form class="vp-card vp-form" novalidate data-contact-form><div data-vp-alert></div><div class="vp-grid">${P.field({ name: "topic", label: "Chủ đề", value: d.topic || "", required: true, options: [["", "Chọn chủ đề"], ...TOPICS] })}${P.field({ name: "campus", label: "Cơ sở liên quan", value: d.campus || "", options: campusOptions("Không cụ thể") })}${P.field({ name: "name", label: "Họ và tên", value: d.name || "", required: true })}${P.field({ name: "phone", label: "Số điện thoại", type: "tel", value: d.phone || "", attrs: 'inputmode="tel"', hint: "Nhập điện thoại hoặc email để VAS phản hồi." })}${P.field({ name: "email", label: "Email", type: "email", value: d.email || "" })}${P.field({ name: "message", label: "Nội dung", type: "textarea", value: d.message || "", required: true, rows: 5, full: true })}</div>${consentField("consent", "Tôi đồng ý để VAS liên hệ lại về nội dung trên")}<div class="vp-form-nav"><span></span><button type="submit" class="btn btn-red" data-submit-contact>Gửi tin nhắn</button></div></form>`;
      const form = $("form", app);
      form.addEventListener("input", () => { const x = {}; ["topic", "campus", "name", "phone", "email", "message"].forEach((k) => { x[k] = form.elements[k].value; }); store.wizard("contact", x); });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const R = P.rules;
        const ok = P.check(form, { topic: R.choose("chủ đề"), name: R.required("họ và tên"), phone: (v) => (!v && !form.elements.email.value.trim() ? "Vui lòng nhập số điện thoại hoặc email." : R.phone(true)(v)), email: R.email(true), message: R.minLength(10, "Nội dung"), consent: R.consent });
        if (!ok) return;
        send(form);
      });
    }
    function send(form) {
      const button = $("[data-submit-contact]", form);
      const alert = $("[data-vp-alert]", form);
      alert.innerHTML = "";
      P.busy(button, true, "Đang gửi…");
      const record = { ref: P.ref("LH"), status: "received", submittedAt: new Date().toISOString() };
      ["topic", "campus", "name", "phone", "email", "message"].forEach((k) => { record[k] = form.elements[k].value.trim(); });
      P.request(() => store.upsert("contacts", record), { delay: 700 }).then(() => {
        store.wizard("contact", null);
        const topic = TOPICS.find((t) => t[0] === record.topic)?.[1];
        app.innerHTML = `<div class="vp-card vp-success" role="status" tabindex="-1"><span class="eyebrow">Đã gửi tin nhắn</span><h3>Cảm ơn ${esc(record.name)}.</h3><p>Tin nhắn về <b>${esc(topic)}</b> đã được chuyển tới bộ phận phụ trách. Bạn sẽ nhận phản hồi qua ${esc(record.email || record.phone)}.</p><p class="vp-ref">Mã tin nhắn <b data-contact-ref>${esc(record.ref)}</b></p>${P.prototypeNote()}<div class="vp-actions"><button type="button" class="btn btn-red" data-new-message>Gửi tin nhắn khác</button><a class="btn btn-outline" href="../tuyen-sinh/#ung-tuyen">Nộp hồ sơ dự tuyển</a></div></div>`;
        $("[data-new-message]", app).addEventListener("click", () => renderForm());
        $(".vp-success", app).focus({ preventScroll: true });
      }).catch((error) => {
        P.busy(button, false);
        alert.innerHTML = P.errorBox(error.message, "Gửi lại");
        $("[data-vp-retry]", alert).addEventListener("click", () => send(form));
      });
    }
    // Đồng bộ với bộ chọn nhu cầu phía trên.
    $$("[data-contact-reason]").forEach((b) => b.addEventListener("click", () => { const select = app.querySelector("select[name=topic]"); if (select) { select.value = b.dataset.contactReason; select.dispatchEvent(new Event("input", { bubbles: true })); } }));
    renderForm();
  });

})();

window.VASProto && window.VASProto.boot();
