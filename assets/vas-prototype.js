/* =====================================================================
   VAS — PROTOTYPE CORE (vas-prototype.js)
   Kho dữ liệu sessionStorage, yêu cầu giả lập (có thể mô phỏng lỗi),
   thành phần dùng chung (dialog, toast, field, lỗi có thể thử lại) và
   thanh công cụ prototype ở chân trang. Các luồng theo trang nằm trong
   vas-prototype-flows.js.
   ===================================================================== */
(function () {
  const SEED = window.VAS_SEED;
  if (!SEED) { console.warn("VAS prototype: thiếu vas-prototype-data.js"); return; }

  const KEY = "vas-prototype-v1";
  const FAIL_KEY = "vas-prototype-fail-next";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const listeners = new Set();
  let memory = null; // dùng khi sessionStorage bị chặn

  /* ---------------- store ---------------- */
  function fresh() { return { version: SEED.version, ...clone(SEED.records) }; }
  function read() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.version === SEED.version) return { ...fresh(), ...data };
      }
    } catch (error) { /* hỏng dữ liệu: khởi tạo lại */ }
    if (memory) return memory;
    const data = fresh();
    write(data);
    return data;
  }
  function write(data) {
    memory = data;
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (error) { /* chế độ riêng tư */ }
  }
  const store = {
    all: read,
    get: (key) => read()[key],
    set(key, value) { const data = read(); data[key] = value; write(data); listeners.forEach((fn) => fn(key)); return value; },
    update(key, fn) { const data = read(); data[key] = fn(data[key]); write(data); listeners.forEach((cb) => cb(key)); return data[key]; },
    upsert(key, item, idKey = "ref") {
      return store.update(key, (list) => {
        const next = Array.isArray(list) ? list.slice() : [];
        const index = next.findIndex((entry) => entry[idKey] === item[idKey]);
        if (index >= 0) next[index] = item; else next.unshift(item);
        return next;
      });
    },
    find: (key, ref, idKey = "ref") => (read()[key] || []).find((entry) => entry[idKey] === ref) || null,
    wizard(name, value) {
      const data = read();
      data.wizards = data.wizards || {};
      if (value === undefined) return data.wizards[name] || null;
      if (value === null) delete data.wizards[name]; else data.wizards[name] = value;
      write(data);
      return value;
    },
    reset() {
      memory = null;
      try { sessionStorage.removeItem(KEY); sessionStorage.removeItem(FAIL_KEY); } catch (error) { /* bỏ qua */ }
      write(fresh());
      listeners.forEach((fn) => fn("*"));
    },
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };

  /* ---------------- simulated network ---------------- */
  const failNext = {
    get() { try { return sessionStorage.getItem(FAIL_KEY) === "1"; } catch (error) { return false; } },
    set(on) { try { if (on) sessionStorage.setItem(FAIL_KEY, "1"); else sessionStorage.removeItem(FAIL_KEY); } catch (error) { /* bỏ qua */ } syncFailToggles(); },
  };
  function request(work, { delay = 700 } = {}) {
    // Cờ lỗi được đọc ngay khi yêu cầu bắt đầu, nên yêu cầu đang chạy dở không "ăn" mất cờ vừa bật.
    const shouldFail = failNext.get();
    if (shouldFail) failNext.set(false);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Không kết nối được tới máy chủ tuyển sinh. Dữ liệu bạn nhập vẫn được giữ nguyên."));
          return;
        }
        try { resolve(work ? work() : null); } catch (error) { reject(error); }
      }, delay);
    });
  }

  function ref(prefix) {
    const year = String(new Date().getFullYear()).slice(-2);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
    return `${prefix}-${year}${code}`;
  }

  /* ---------------- formatting ---------------- */
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value) => `${Math.round(value).toLocaleString("vi-VN")} ₫`;
  const millions = (value) => `${(Math.round(value / 100000) / 10).toLocaleString("vi-VN")} triệu ₫`;
  const WEEKDAYS = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const parseDate = (iso) => { const [y, m, d] = String(iso).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dateVi = (iso) => { if (!iso) return ""; const d = parseDate(iso); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`; };
  const dateLong = (iso) => { if (!iso) return ""; const d = parseDate(iso); return `${WEEKDAYS[d.getDay()]}, ${dateVi(iso)}`; };
  const stamp = (isoTime) => { if (!isoTime) return ""; const d = new Date(isoTime); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ngày ${dateVi(isoDate(d))}`; };

  /* ---------------- lookup helpers ---------------- */
  const campus = (id) => SEED.campuses.find((item) => item.id === id) || null;
  const programme = (id) => SEED.programmes.find((item) => item.id === id) || null;
  const grade = (id) => SEED.grades.find((item) => item.id === id) || null;
  const band = (id) => SEED.tuition.bands.find((item) => item.id === id) || null;
  const BAND_LEVELS = { "mam-non": ["mam-non"], "1-5": ["tieu-hoc"], "6-8": ["thcs"], "9-12": ["thcs", "thpt"] };

  /* ---------------- tuition ---------------- */
  function tuitionEstimate({ band: bandId, programme: programmeId, campus: campusId, plan = "two", sibling = "none", extras = [] }) {
    const T = SEED.tuition;
    const b = band(bandId); const p = programme(programmeId); const c = campus(campusId);
    const planInfo = T.plans.find((item) => item.id === plan) || T.plans[1];
    if (!b || !p || !c) return { valid: false, reason: "Chọn đủ cấp lớp, lộ trình và cơ sở để xem ước tính." };
    const levels = BAND_LEVELS[b.id];
    if (!levels.some((level) => p.levels.includes(level))) return { valid: false, reason: `${p.code} chưa áp dụng cho ${b.label}. Hãy chọn CEP hoặc CAP.` };
    if (!levels.some((level) => c.levels.includes(level))) return { valid: false, reason: `Cơ sở ${c.name} chưa có ${b.label}. Hãy chọn Sala, Riverside, Garden Hills hoặc Sunrise.` };
    const base = b.base * (T.programmeFactor[p.id] || 1) + (T.campusOffset[c.id] || 0);
    const annual = base * planInfo.factor;
    const discount = annual * (T.siblingDiscount[sibling] || 0);
    const extraItems = T.extras.filter((item) => extras.includes(item.id));
    const extraTotal = extraItems.reduce((sum, item) => sum + item.amount, 0);
    const total = annual - discount + extraTotal;
    return { valid: true, band: b, programme: p, campus: c, plan: planInfo, base, annual, discount, extraItems, extraTotal, total, perInstallment: total / planInfo.installments, applicationFee: T.applicationFee, reservationFee: T.reservationFee, schoolYear: T.schoolYear };
  }

  /* ---------------- tour availability ---------------- */
  function tourDates(campusId, from = new Date()) {
    const c = campus(campusId);
    if (!c) return [];
    const out = [];
    const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
    let guard = 0;
    while (out.length < 10 && guard < SEED.tours.daysAhead + 14) {
      if (c.tourDays.includes(cursor.getDay())) out.push(isoDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
      guard += 1;
    }
    return out;
  }
  function slotState(campusId, dateIso, slot, ignoreRef) {
    const dates = tourDates(campusId);
    const index = dates.indexOf(dateIso);
    if (index === SEED.tours.fullyBookedOffset) return "taken";
    const weekday = parseDate(dateIso).getDay();
    if (SEED.tours.takenPattern.some((rule) => rule.campus === campusId && rule.weekday === weekday && rule.slot === slot)) return "taken";
    const mine = (store.get("tours") || []).find((tour) => tour.status === "confirmed" && tour.ref !== ignoreRef && tour.campus === campusId && tour.date === dateIso && tour.slot === slot);
    if (mine) return "mine";
    return "open";
  }
  function dayIsFull(campusId, dateIso, ignoreRef) {
    return SEED.tours.slots.every((slot) => slotState(campusId, dateIso, slot, ignoreRef) !== "open");
  }
  function nextOpenSlots(campusId, count = 3) {
    const out = [];
    for (const date of tourDates(campusId)) {
      for (const slot of SEED.tours.slots) {
        if (slotState(campusId, date, slot) === "open") out.push({ date, slot });
        if (out.length >= count) return out;
      }
    }
    return out;
  }

  /* ---------------- UI: toast & dialog ---------------- */
  function toast(message) {
    let host = document.getElementById("phase3Toast");
    if (!host) {
      host = document.createElement("div");
      host.id = "phase3Toast";
      host.className = "phase3-toast";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    host.textContent = message;
    host.classList.add("is-visible");
    clearTimeout(host._timer);
    host._timer = setTimeout(() => host.classList.remove("is-visible"), 3200);
  }

  let dialogHost = null;
  let dialogClose = null;
  function openDialog({ title, eyebrow = "", body = "", labelledBy = "vpDialogTitle", wide = false, onClose } = {}) {
    if (dialogClose) dialogClose(true);
    if (!dialogHost) {
      dialogHost = document.createElement("div");
      dialogHost.id = "vpDialog";
      dialogHost.className = "phase3-dialog vp-dialog";
      dialogHost.hidden = true;
      document.body.appendChild(dialogHost);
    }
    const lastFocus = document.activeElement;
    dialogHost.innerHTML = `<div class="phase3-dialog-backdrop" data-vp-close></div><section class="phase3-dialog-panel vp-dialog-panel${wide ? " is-wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="${labelledBy}"><header><div>${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}<h2 id="${labelledBy}">${esc(title)}</h2></div><button type="button" data-vp-close aria-label="Đóng">×</button></header><div class="vp-dialog-body">${body}</div></section>`;
    dialogHost.hidden = false;
    document.documentElement.classList.add("phase3-dialog-open");
    const onKey = (event) => { if (event.key === "Escape") close(); };
    function close(silent) {
      if (dialogHost.hidden) return;
      dialogHost.hidden = true;
      dialogHost.innerHTML = "";
      document.documentElement.classList.remove("phase3-dialog-open");
      document.removeEventListener("keydown", onKey);
      dialogClose = null;
      if (!silent) { lastFocus?.focus?.(); onClose?.(); }
    }
    $$("[data-vp-close]", dialogHost).forEach((node) => node.addEventListener("click", () => close()));
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => ($(".vp-dialog-body [autofocus]", dialogHost) || $("[data-vp-close]:not(.phase3-dialog-backdrop)", dialogHost))?.focus());
    dialogClose = close;
    return { root: $(".vp-dialog-body", dialogHost), close };
  }

  function confirmDialog({ title, message, confirmLabel = "Xác nhận", cancelLabel = "Giữ nguyên", danger = false, extra = "" }) {
    return new Promise((resolve) => {
      let answered = false;
      const { root, close } = openDialog({
        title,
        eyebrow: "Xác nhận",
        body: `<p class="vp-dialog-text">${esc(message)}</p>${extra}<div class="vp-actions"><button type="button" class="btn ${danger ? "btn-red" : "btn-red"}" data-vp-confirm>${esc(confirmLabel)}</button><button type="button" class="btn btn-outline" data-vp-cancel>${esc(cancelLabel)}</button></div>`,
        onClose: () => { if (!answered) resolve(null); },
      });
      $("[data-vp-confirm]", root).addEventListener("click", () => {
        answered = true;
        const values = Object.fromEntries($$("select, input, textarea", root).map((field) => [field.name, field.value]));
        close(true);
        resolve(values);
      });
      $("[data-vp-cancel]", root).addEventListener("click", () => { answered = true; close(); resolve(null); });
    });
  }

  /* ---------------- UI: fields & validation ---------------- */
  let fieldSeq = 0;
  function field({ name, label, type = "text", value = "", required = false, options = null, hint = "", placeholder = "", attrs = "", full = false, rows = 4 }) {
    fieldSeq += 1;
    const id = `vp-${name}-${fieldSeq}`;
    const req = required ? " required" : "";
    const describedBy = `${id}-error${hint ? ` ${id}-hint` : ""}`;
    let control;
    if (options) {
      control = `<select id="${id}" name="${esc(name)}"${req} aria-describedby="${describedBy}" ${attrs}>${options.map(([v, l, disabled]) => `<option value="${esc(v)}"${String(v) === String(value) ? " selected" : ""}${disabled ? " disabled" : ""}>${esc(l)}</option>`).join("")}</select>`;
    } else if (type === "textarea") {
      control = `<textarea id="${id}" name="${esc(name)}" rows="${rows}"${req} placeholder="${esc(placeholder)}" aria-describedby="${describedBy}" ${attrs}>${esc(value)}</textarea>`;
    } else {
      control = `<input id="${id}" name="${esc(name)}" type="${type}" value="${esc(value)}"${req} placeholder="${esc(placeholder)}" aria-describedby="${describedBy}" ${attrs} />`;
    }
    return `<div class="vp-field${full ? " is-full" : ""}" data-field="${esc(name)}"><label for="${id}">${esc(label)}${required ? ' <span class="vp-req" aria-hidden="true">*</span>' : ""}</label>${control}${hint ? `<small class="vp-hint" id="${id}-hint">${esc(hint)}</small>` : ""}<small class="vp-error" id="${id}-error" hidden></small></div>`;
  }
  function check(form, rules) {
    let first = null;
    $$(".vp-error", form).forEach((node) => { node.hidden = true; node.textContent = ""; });
    $$("[aria-invalid]", form).forEach((node) => node.removeAttribute("aria-invalid"));
    Object.entries(rules).forEach(([name, rule]) => {
      const control = form.elements[name];
      const node = control instanceof RadioNodeList ? control[0] : control;
      const value = control instanceof RadioNodeList ? control.value : control?.type === "checkbox" ? control.checked : control?.value?.trim?.() ?? "";
      const message = rule(value, form);
      if (!message) return;
      const wrap = node?.closest?.(".vp-field, .vp-check, fieldset") || form.querySelector(`[data-field="${name}"]`);
      const error = wrap?.querySelector(".vp-error");
      if (error) { error.textContent = message; error.hidden = false; }
      if (node) node.setAttribute("aria-invalid", "true");
      if (!first) first = node || wrap;
    });
    if (first) { first.focus?.({ preventScroll: true }); first.scrollIntoView?.({ block: "center", behavior: "smooth" }); }
    return !first;
  }
  const rules = {
    required: (label) => (value) => (value ? "" : `Vui lòng nhập ${label}.`),
    choose: (label) => (value) => (value ? "" : `Vui lòng chọn ${label}.`),
    phone: (optional) => (value) => { const v = String(value || "").replace(/[\s.]/g, ""); if (!v) return optional ? "" : "Vui lòng nhập số điện thoại."; return /^0\d{9,10}$/.test(v) ? "" : "Số điện thoại cần 10–11 chữ số và bắt đầu bằng 0."; },
    email: (optional) => (value) => { if (!value) return optional ? "" : "Vui lòng nhập email."; return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : "Email chưa đúng định dạng, ví dụ ten@vidu.com."; },
    consent: (value) => (value ? "" : "Vui lòng xác nhận đồng ý để tiếp tục."),
    minLength: (n, label) => (value) => (String(value || "").length >= n ? "" : `${label} cần ít nhất ${n} ký tự.`),
  };
  const FILE_OK = /\.(pdf|jpe?g|png|docx?)$/i;
  function fileNames(input, allowed = FILE_OK) {
    const files = [...(input?.files || [])];
    const good = files.filter((file) => allowed.test(file.name)).map((file) => file.name);
    const bad = files.filter((file) => !allowed.test(file.name)).map((file) => file.name);
    return { good, bad };
  }

  function busy(button, on, label = "Đang gửi…") {
    if (!button) return;
    if (on) {
      button.dataset.vpLabel = button.innerHTML;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.innerHTML = `<span class="vp-spinner" aria-hidden="true"></span> ${esc(label)}`;
    } else {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (button.dataset.vpLabel) button.innerHTML = button.dataset.vpLabel;
    }
  }
  function errorBox(message, retryLabel = "Thử lại") {
    return `<div class="vp-alert is-error" role="alert"><div><strong>Chưa gửi được</strong><p>${esc(message)}</p></div><button type="button" class="btn btn-outline" data-vp-retry>${esc(retryLabel)}</button></div>`;
  }
  const PROTOTYPE_NOTE = "Đây là bản prototype: chưa có thông tin nào được gửi tới VAS. Dữ liệu chỉ lưu tạm trong tab trình duyệt này và sẽ mất khi đóng tab hoặc đặt lại dữ liệu demo.";
  const prototypeNote = () => `<p class="vp-proto-note">${esc(PROTOTYPE_NOTE)}</p>`;
  const loadingBlock = (label = "Đang tải…") => `<div class="vp-loading" role="status"><span class="vp-spinner" aria-hidden="true"></span><span>${esc(label)}</span></div>`;
  const emptyBlock = (title, text, action = "") => `<div class="vp-empty"><strong>${esc(title)}</strong><p>${esc(text)}</p>${action}</div>`;

  function statusChip(status) {
    const map = { draft: ["Bản nháp", "is-draft"], submitted: ["Đã nộp", "is-ok"], confirmed: ["Đã xác nhận", "is-ok"], withdrawn: ["Đã rút", "is-muted"], cancelled: ["Đã hủy", "is-muted"], received: ["Đã nhận", "is-ok"] };
    const [label, cls] = map[status] || [status, ""];
    return `<span class="vp-chip ${cls}">${esc(label)}</span>`;
  }

  /* ---------------- URL helpers ---------------- */
  const params = () => new URLSearchParams(window.location.search);
  function setParam(key, value, push = false) {
    const url = new URL(window.location.href);
    if (value === null || value === undefined || value === "") url.searchParams.delete(key); else url.searchParams.set(key, value);
    history[push ? "pushState" : "replaceState"]({}, "", url);
  }
  const BASE = window.SITE_BASE || (document.body.dataset.depth ? "../".repeat(Number(document.body.dataset.depth)) : "");

  /* ---------------- footer prototype toolbar ---------------- */
  function syncFailToggles() { $$("[data-vp-fail]").forEach((input) => { input.checked = failNext.get(); }); }
  function counts() {
    const data = store.all();
    return {
      apps: (data.applications || []).filter((item) => item.status !== "withdrawn").length,
      tours: (data.tours || []).filter((item) => item.status === "confirmed").length,
    };
  }
  function renderToolbar() {
    if (document.body.dataset.noPrototypeBar !== undefined) return;
    let bar = document.getElementById("vpToolbar");
    const footer = document.querySelector(".footer");
    if (!bar) {
      bar = document.createElement("section");
      bar.id = "vpToolbar";
      bar.className = "vp-toolbar";
      bar.setAttribute("aria-labelledby", "vpToolbarTitle");
      if (footer) footer.insertAdjacentElement("afterbegin", bar); else document.body.appendChild(bar);
    }
    const c = counts();
    bar.innerHTML = `<div class="wrap vp-toolbar-inner"><div class="vp-toolbar-copy"><strong id="vpToolbarTitle">Bản prototype chạy trên trình duyệt</strong><p>Hồ sơ, lịch hẹn và đơn bạn tạo chỉ lưu trong tab này. Không có thông tin nào được gửi tới VAS.</p></div><div class="vp-toolbar-actions"><a href="${BASE}tuyen-sinh/#ho-so-cua-toi">Hồ sơ của tôi <b data-vp-count="apps">${c.apps}</b></a><a href="${BASE}dat-lich-tham-quan/#lich-cua-toi">Lịch của tôi <b data-vp-count="tours">${c.tours}</b></a><label class="vp-switch"><input type="checkbox" data-vp-fail /> <span>Mô phỏng lỗi ở lần gửi tiếp theo</span></label><button type="button" class="vp-reset" data-vp-reset>Đặt lại dữ liệu demo</button></div></div>`;
    syncFailToggles();
    $("[data-vp-fail]", bar).addEventListener("change", (event) => {
      failNext.set(event.target.checked);
      toast(event.target.checked ? "Lần gửi tiếp theo sẽ báo lỗi để bạn thử luồng khôi phục." : "Đã tắt mô phỏng lỗi.");
    });
    $("[data-vp-reset]", bar).addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Đặt lại dữ liệu demo?", message: "Mọi hồ sơ, lịch tham quan, đơn ứng tuyển và kết quả đã lưu trong tab này sẽ bị xóa và quay về dữ liệu ban đầu.", confirmLabel: "Đặt lại dữ liệu", danger: true });
      if (!ok) return;
      store.reset();
      try { sessionStorage.setItem("vas-prototype-flash", "Đã đặt lại dữ liệu demo."); } catch (error) { /* bỏ qua */ }
      // Bỏ tham số truy vấn (mã hồ sơ, bài viết…) rồi tải lại để mọi luồng vẽ lại từ dữ liệu gốc.
      const url = new URL(window.location.href);
      url.search = "";
      history.replaceState(null, "", url.toString());
      window.location.reload();
    });
  }
  store.on(() => {
    const c = counts();
    $$("[data-vp-count='apps']").forEach((node) => { node.textContent = c.apps; });
    $$("[data-vp-count='tours']").forEach((node) => { node.textContent = c.tours; });
  });

  function flash() {
    try {
      const message = sessionStorage.getItem("vas-prototype-flash");
      if (message) { sessionStorage.removeItem("vas-prototype-flash"); setTimeout(() => toast(message), 300); }
    } catch (error) { /* bỏ qua */ }
  }

  /* ---------------- flows registry ---------------- */
  const flows = [];
  function flow(test, init) { flows.push([test, init]); }
  const route = () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    return /\.html?$/.test(last) ? (parts[parts.length - 2] || "") : last;
  };

  window.VASProto = {
    SEED, store, request, failNext, ref, esc, $, $$, money, millions, dateVi, dateLong, stamp, isoDate, parseDate,
    campus, programme, grade, band, BAND_LEVELS, tuitionEstimate, tourDates, slotState, dayIsFull, nextOpenSlots,
    toast, openDialog, confirmDialog, field, check, rules, fileNames, FILE_OK, busy, errorBox, prototypeNote, PROTOTYPE_NOTE,
    loadingBlock, emptyBlock, statusChip, params, setParam, BASE, flow, route,
  };

  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    renderToolbar();
    flash();
    const current = route();
    flows.forEach(([test, init]) => {
      if (test === current || (Array.isArray(test) && test.includes(current))) {
        try { init(window.VASProto); } catch (error) { console.error("VAS prototype flow failed", error); }
      }
    });
  }
  /* vas-prototype-flows.js đăng ký các luồng rồi gọi VASProto.boot() ở cuối file. */
  window.VASProto.boot = () => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
    else boot();
  };
})();
