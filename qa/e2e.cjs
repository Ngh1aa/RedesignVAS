#!/usr/bin/env node
/*
  VAS — end-to-end test for the browser-only prototype.
  Covers every main flow, the demo reset and the failure simulation, then
  checks every page for console errors and href="#".

  Usage (repo root served on :8927):
    py -3 -m http.server 8927 --bind 127.0.0.1
    NODE_PATH=<playwright node_modules> node qa/e2e.cjs [--only name] [--headed]
*/
const { chromium } = require("playwright");
const assert = require("assert/strict");

const BASE = (process.env.VAS_BASE || "http://127.0.0.1:8927").replace(/\/$/, "");
const args = process.argv.slice(2);
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : "";
const HEADED = args.includes("--headed");
const T = 30000;

const MAIN_PAGES = ["", "ve-vas/", "chuong-trinh/", "co-so/", "co-so-riverside/", "tuyen-sinh/", "tin-tuc/", "vong-quanh-vas/", "find-my-path/", "hoc-bong/", "cuu-hoc-sinh/", "tu-van-huong-nghiep/", "ho-tro-hoc-sinh/", "tuyen-dung/", "lien-he/", "dat-lich-tham-quan/"];
const DOC_PAGES = ["design-system/", "component-states/", "user-flow/", "sitemap/", "prototype/"];
const IGNORE_CONSOLE = /Failed to load resource|net::ERR|Transition was aborted|UI Feedback Tool unavailable/;

const file = (name, type = "application/pdf") => ({ name, mimeType: type, buffer: Buffer.from("%PDF-1.4 prototype") });

let browser;
const consoleErrors = [];

async function newPage() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // External photos are irrelevant to the flows; skipping them keeps runs fast and deterministic.
  await context.route(/images\.unsplash\.com|digitaloceanspaces\.com|cdn2\.tuoitre|timtruongquocte|vas\.edu\.vn\/_next/, (route) => route.abort());
  const page = await context.newPage();
  page.on("pageerror", (error) => { if (!IGNORE_CONSOLE.test(error.message)) consoleErrors.push(`${page.url()} pageerror: ${error.message}`); });
  page.on("console", (msg) => { if (msg.type() === "error" && !IGNORE_CONSOLE.test(msg.text())) consoleErrors.push(`${page.url()} console: ${msg.text()}`); });
  page.on("dialog", (d) => d.dismiss());
  return page;
}
/* python -m http.server on Windows has a 5-connection accept backlog and occasionally
   refuses a sub-resource (net::ERR_CONNECTION_REFUSED). When that happens the page is
   reloaded; every such retry is counted and printed so it is never silent. */
let serverRetries = 0;
async function ready(page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await page.waitForFunction(() => window.VASProto && document.getElementById("vpToolbar") && document.readyState !== "loading", null, { timeout: attempt === 3 ? T : 15000 });
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      serverRetries += 1;
      await page.reload({ waitUntil: "domcontentloaded" });
    }
  }
}
async function open(page, path, waitUntil = "domcontentloaded") {
  for (let attempt = 0; ; attempt += 1) {
    try { await page.goto(`${BASE}/${path}`, { waitUntil }); return; }
    catch (error) {
      if (attempt >= 3 || !/ERR_CONNECTION_REFUSED|ERR_EMPTY_RESPONSE|chrome-error|interrupted by another navigation/.test(error.message)) throw error;
      serverRetries += 1;
      await page.waitForTimeout(500);
    }
  }
}
async function go(page, path) {
  await open(page, path);
  await ready(page);
}
async function reload(page) {
  await page.reload({ waitUntil: "domcontentloaded" });
  await ready(page);
}
const text = (page, sel) => page.locator(sel).first().innerText();
async function toastSays(page, re) {
  await page.waitForFunction((src) => new RegExp(src).test(document.getElementById("phase3Toast")?.textContent || ""), re.source, { timeout: T });
}
async function confirmDialog(page) {
  await page.waitForSelector("#vpDialog [data-vp-confirm]", { timeout: T });
  await page.click("#vpDialog [data-vp-confirm]");
  await page.waitForSelector("#vpDialog", { state: "hidden", timeout: T });
}

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

/* ------------------------------------------------------------------ */
test("pages: no console errors, no href=#, prototype toolbar", async () => {
  const page = await newPage();
  for (const path of [...MAIN_PAGES, ...DOC_PAGES]) {
    await open(page, path, "load");
    if (MAIN_PAGES.includes(path)) await ready(page);
    await page.waitForTimeout(700);
    const bad = await page.evaluate(() => [...document.querySelectorAll("a")].filter((a) => { const h = a.getAttribute("href"); return h === "#" || h === "" || /^javascript:/i.test(h || ""); }).map((a) => a.outerHTML.slice(0, 120)));
    assert.deepEqual(bad, [], `${path} has dead anchors: ${bad.join(" | ")}`);
    if (MAIN_PAGES.includes(path)) await page.waitForSelector("#vpToolbar [data-vp-reset]", { timeout: T });
  }
  await page.context().close();
});

test("admissions: multi-step application, draft, persistence, submit, view, withdraw, not-found", async () => {
  const page = await newPage();
  await go(page, "tuyen-sinh/#ung-tuyen");
  await page.waitForSelector("#myApplications .vp-empty");
  assert.match(await text(page, "#myApplications"), /Chưa có hồ sơ nào/);

  // step 1 validation
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp .vp-error:not([hidden])");
  assert.match(await text(page, "#applyApp [data-field=studentName] .vp-error"), /họ tên học sinh/);
  await page.fill("#applyApp [name=studentName]", "Nguyễn Minh An");
  await page.fill("#applyApp [name=dob]", "2018-05-10");
  await page.selectOption("#applyApp [name=grade]", "g3");
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp form[data-step='1']");
  // step 2
  await page.fill("#applyApp [name=parentName]", "Nguyễn Văn Bình");
  await page.selectOption("#applyApp [name=relation]", "bo");
  await page.fill("#applyApp [name=phone]", "12345");
  await page.fill("#applyApp [name=email]", "binh@vidu.com");
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp [data-field=phone] .vp-error:not([hidden])");
  await page.fill("#applyApp [name=phone]", "0912 345 678");
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp form[data-step='2']");
  // step 3: campus + programme
  await page.check("#applyApp input[name=campus][value=sala]");
  await page.check("#applyApp input[name=programme][value=cap]");
  await page.selectOption("#applyApp [name=startTerm]", "2027-08");
  // save draft
  await page.click("#applyApp [data-save-draft]");
  await toastSays(page, /Đã lưu nháp HS-/);
  await page.waitForSelector("#myApplications .vp-record .vp-chip.is-draft");
  // persistence across reload
  await reload(page);
  await page.waitForSelector("#applyApp form[data-step='2']");
  assert.equal(await page.isChecked("#applyApp input[name=campus][value=sala]"), true);
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp form[data-step='3']");
  // step 4: documents (file names only) incl. rejected type
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp [data-field=doc-birth] .vp-error:not([hidden])");
  await page.setInputFiles("#applyApp input[data-doc=birth]", [{ name: "virus.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") }]);
  await page.waitForSelector("#applyApp [data-field=doc-birth] .vp-error:not([hidden])");
  assert.match(await text(page, "#applyApp [data-field=doc-birth] .vp-error"), /virus\.exe/);
  await page.setInputFiles("#applyApp input[data-doc=birth]", [file("giay-khai-sinh.pdf")]);
  await page.waitForSelector("#applyApp [data-field=doc-birth] .vp-files li:has-text('giay-khai-sinh.pdf')");
  await page.setInputFiles("#applyApp input[data-doc=report]", [file("hoc-ba-lop-2.pdf"), file("anh-the.jpg", "image/jpeg")]);
  await page.waitForSelector("#applyApp [data-field=doc-report] .vp-files li:has-text('hoc-ba-lop-2.pdf')");
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp form[data-step='4']");
  // review shows data; consent required
  const review = await text(page, "#applyApp .vp-review");
  assert.match(review, /Nguyễn Minh An/); assert.match(review, /Sala/); assert.match(review, /giay-khai-sinh\.pdf/);
  await page.click("#applyApp [data-submit]");
  await page.waitForSelector("#applyApp [data-field=consent] .vp-error:not([hidden])");
  await page.check("#applyApp [name=consent]");
  await page.click("#applyApp [data-submit]");
  await page.waitForSelector("#applyApp [data-submit][aria-busy=true]");
  await page.waitForSelector("#applyApp [data-app-ref]", { timeout: T });
  const ref = (await text(page, "#applyApp [data-app-ref]")).trim();
  assert.match(ref, /^HS-\d{2}[A-Z0-9]{5}$/);
  assert.match(await text(page, "#applyApp .vp-success"), /prototype.*chưa có thông tin nào được gửi/i);
  await page.waitForSelector(`#myApplications [data-ref="${ref}"] .vp-chip.is-ok`);

  // view detail
  await page.click(`#myApplications [data-view="${ref}"]`);
  await page.waitForSelector("#vpDialog:not([hidden]) .vp-dl");
  assert.match(page.url(), new RegExp(`ho-so=${ref}`));
  await page.keyboard.press("Escape");
  await page.waitForSelector("#vpDialog", { state: "hidden" });

  // edit a draft: create a second draft, start new, then reopen it from the list
  await page.click("#applyApp [data-another]");
  await page.waitForSelector("#applyApp form[data-step='0']");
  await page.fill("#applyApp [name=studentName]", "Trần Bảo Ngọc");
  await page.click("#applyApp [data-save-draft]");
  await toastSays(page, /Đã lưu nháp/);
  await page.click("#applyApp [data-new-app]");
  await page.waitForFunction(() => document.querySelector("#applyApp [name=studentName]")?.value === "");
  await page.click("#myApplications [data-edit]");
  await page.waitForSelector("#applyApp .vp-banner:has-text('Đang chỉnh sửa bản nháp')");
  assert.equal(await page.inputValue("#applyApp [name=studentName]"), "Trần Bảo Ngọc");
  await page.fill("#applyApp [name=studentName]", "Trần Bảo Ngọc Anh");
  await page.click("#applyApp [data-save-draft]");
  await page.waitForSelector("#myApplications .vp-record h3:has-text('Trần Bảo Ngọc Anh')");

  // withdraw the submitted application
  await page.click(`#myApplications [data-withdraw="${ref}"]`);
  await page.selectOption("#vpDialog select[name=reason]", "Đã chọn trường khác");
  await confirmDialog(page);
  await page.waitForSelector(`#myApplications [data-ref="${ref}"] .vp-chip.is-muted`);
  assert.match(await text(page, `#myApplications [data-ref="${ref}"]`), /Đã rút/);

  // not-found deep link
  await go(page, "tuyen-sinh/?ho-so=HS-26ZZZZZ#ho-so-cua-toi");
  await page.waitForSelector("#myApplications [data-not-found]");
  await page.click("#myApplications [data-clear-ref]");
  await page.waitForSelector("#myApplications [data-not-found]", { state: "detached" });
  await page.context().close();
});

test("admissions: failure simulation shows recoverable error, retry succeeds", async () => {
  const page = await newPage();
  await go(page, "tuyen-sinh/#ung-tuyen");
  await page.fill("#applyApp [name=studentName]", "Lê Gia Huy");
  await page.check("#vpToolbar [data-vp-fail]");
  await toastSays(page, /báo lỗi/);
  await page.click("#applyApp [data-save-draft]");
  await page.waitForSelector("#applyApp .vp-alert.is-error [data-vp-retry]");
  assert.equal(await page.inputValue("#applyApp [name=studentName]"), "Lê Gia Huy");
  assert.equal(await page.isChecked("#vpToolbar [data-vp-fail]"), false);
  await page.click("#applyApp [data-vp-retry]");
  await toastSays(page, /Đã lưu nháp/);
  await page.waitForSelector("#myApplications .vp-chip.is-draft");
  await page.context().close();
});

test("admissions: tuition estimate calculator and prefill into application", async () => {
  const page = await newPage();
  await go(page, "tuyen-sinh/#hoc-phi");
  await page.selectOption("#tcBand", "mam-non");
  await page.selectOption("#tcProgramme", "capi");
  await page.waitForSelector("#tcResult [data-tc-reason]");
  assert.match(await text(page, "#tcResult"), /chưa khả dụng/);
  await page.selectOption("#tcBand", "1-5");
  await page.selectOption("#tcProgramme", "cap");
  await page.selectOption("#tcCampus", "sala");
  await page.selectOption("#tcPlan", "one");
  await page.selectOption("#tcSibling", "one");
  await page.check("#tuitionEstimator input[value=meal]");
  await page.waitForSelector("#tcResult [data-tc-total]");
  // (220,000,000 × 1.16 + 20,000,000) × 0.97 = 266,944,000; −5% = 253,596,800; + 18,000,000 meal = 271,596,800
  assert.match(await text(page, "#tcResult [data-tc-total]"), /271\.596\.800/);
  await reload(page);
  await page.waitForSelector("#tcResult [data-tc-total]");
  assert.equal(await page.inputValue("#tcSibling"), "one");
  await page.click("#tcApply");
  await page.waitForSelector("#applyApp [data-prefill-banner]");
  assert.equal(await page.inputValue("#applyApp [name=grade]"), "g1");
  await page.context().close();
});

test("admissions: inquiry form confirmation says prototype and stores the lead", async () => {
  const page = await newPage();
  await go(page, "tuyen-sinh/?intent=inquire#dang-ky");
  await page.fill("#enquiryForm [name=name]", "Phạm Thu Hà");
  await page.fill("#enquiryForm [name=phone]", "0987654321");
  await page.selectOption("#enquiryForm [name=intentReason]", "fee");
  await page.check("#enquiryForm [name=consent]");
  await page.click("#enquiryForm button[type=submit]");
  await page.waitForSelector("#formMsg:not([hidden]) [data-ref]", { timeout: T });
  assert.match(await text(page, "#formMsg"), /prototype/);
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem("vas-prototype-v1")).inquiries.length);
  assert.equal(stored, 1);
  await page.click("#leadAgain");
  await page.waitForSelector("#enquiryForm [name=name]:visible");
  await page.context().close();
});

test("tour booking: campus, date, taken slots, details, confirm, reschedule, cancel", async () => {
  const page = await newPage();
  await go(page, "dat-lich-tham-quan/");
  await page.waitForSelector("#myTours .vp-empty");
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp [data-field=campus] .vp-error:not([hidden])");
  await page.click("#tourApp [data-tour-campus=riverside]");
  await page.waitForSelector("#tourApp [data-tour-campus=riverside][aria-pressed=true]");
  assert.equal((await text(page, "[data-summary-campus]")).trim(), "Riverside");
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp .vp-date");
  // a fully booked day is disabled
  assert.ok(await page.locator("#tourApp .vp-date[disabled]").count() >= 1, "expected a fully booked day");
  // find a day that has at least one taken slot and one open slot
  const dates = await page.$$eval("#tourApp .vp-date:not([disabled])", (n) => n.map((b) => b.dataset.date));
  let chosen = null;
  for (const date of dates) {
    await page.click(`#tourApp [data-date="${date}"]`);
    await page.waitForSelector(`#tourApp [data-date="${date}"][aria-pressed=true]`);
    const taken = await page.locator("#tourApp .vp-slot.is-taken").count();
    if (taken > 0) { chosen = date; break; }
  }
  assert.ok(chosen, "expected a day with a taken slot");
  assert.equal(await page.locator("#tourApp .vp-slot.is-taken").first().isDisabled(), true);
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp [data-field=slot] .vp-error:not([hidden])");
  const open = await page.locator("#tourApp .vp-slot.is-open").first().getAttribute("data-slot");
  await page.click(`#tourApp [data-slot="${open}"]`);
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp form[data-step='2']");
  await page.fill("#tourApp [name=name]", "Võ Thanh Tâm");
  await page.fill("#tourApp [name=phone]", "0903123456");
  await page.selectOption("#tourApp [name=interest]", "6-8");
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp [data-field=consent] .vp-error:not([hidden])");
  await page.check("#tourApp [name=consent]");
  await page.click("#tourApp [data-next]");
  await page.waitForSelector("#tourApp [data-confirm-tour]");
  assert.match(await text(page, "#tourApp .vp-dl"), new RegExp(open));
  await page.click("#tourApp [data-confirm-tour]");
  await page.waitForSelector("#tourApp [data-tour-ref]", { timeout: T });
  const ref = (await text(page, "#tourApp [data-tour-ref]")).trim();
  assert.match(ref, /^TQ-/);
  assert.match(await text(page, "#tourApp .vp-success"), /prototype/);
  await page.waitForSelector(`#myTours [data-ref="${ref}"] .vp-chip.is-ok`);
  // reload persists
  await reload(page);
  await page.waitForSelector(`#myTours [data-ref="${ref}"]`);
  // reschedule
  await page.click(`#myTours [data-reschedule="${ref}"]`);
  await page.waitForSelector("#vpDialog:not([hidden]) .vp-date");
  await page.click("#vpDialog [data-save-reschedule]");
  await page.waitForSelector("#vpDialog .vp-error[role=alert]");
  const newDate = await page.locator("#vpDialog .vp-date:not([disabled])").nth(1).getAttribute("data-date");
  await page.click(`#vpDialog [data-date="${newDate}"]`);
  await page.waitForSelector(`#vpDialog [data-date="${newDate}"][aria-pressed=true]`);
  const newSlot = await page.locator("#vpDialog .vp-slot.is-open").first().getAttribute("data-slot");
  await page.click(`#vpDialog [data-slot="${newSlot}"]`);
  await page.click("#vpDialog [data-save-reschedule]");
  await page.waitForSelector("#vpDialog", { state: "hidden", timeout: T });
  await page.waitForSelector(`#myTours [data-ref="${ref}"] small:has-text('Đã đổi lịch 1 lần')`);
  assert.match(await text(page, `#myTours [data-ref="${ref}"] h3`), new RegExp(newSlot));
  // cancel
  await page.click(`#myTours [data-cancel="${ref}"]`);
  await confirmDialog(page);
  await page.waitForSelector(`#myTours [data-ref="${ref}"] .vp-chip.is-muted`);
  // not-found
  await go(page, "dat-lich-tham-quan/?lich=TQ-26NOPE1#lich-cua-toi");
  await page.waitForSelector("#myTours [data-not-found]");
  await page.context().close();
});

test("tour booking: deep link from campus detail preselects slot", async () => {
  const page = await newPage();
  await go(page, "co-so/?chi-tiet=sala");
  await page.waitForSelector("#vpDialog [data-campus-detail=sala] .vp-slot-links a");
  const href = await page.locator("#vpDialog .vp-slot-links a").first().getAttribute("href");
  await page.click("#vpDialog .vp-slot-links a >> nth=0");
  await page.waitForURL(/dat-lich-tham-quan/);
  await ready(page);
  await page.waitForSelector("#tourApp .vp-slot.is-selected");
  const slot = decodeURIComponent(href.match(/slot=([^&#]+)/)[1]);
  assert.equal(await page.locator("#tourApp .vp-slot.is-selected").getAttribute("data-slot"), slot);
  assert.equal((await text(page, "[data-summary-campus]")).trim(), "Sala");
  await page.context().close();
});

test("find-my-path: quiz result can be saved and carried into admissions", async () => {
  const page = await newPage();
  await go(page, "find-my-path/");
  await page.click(".fit-option[data-value='3']");
  await page.click(".fit-option[data-value='balanced']");
  await page.waitForSelector("[data-vp-save-path]");
  await page.click("[data-vp-save-path]");
  await page.waitForSelector("[data-vp-save-path].is-saved");
  await page.waitForSelector("#fitSaved");
  assert.match(await text(page, "#fitSaved"), /CAP/);
  await reload(page);
  await page.waitForSelector("#fitSaved");
  await page.click("[data-vp-use-path]");
  await page.waitForURL(/tuyen-sinh/);
  await ready(page);
  await page.waitForSelector("#applyApp [data-prefill-banner]");
  assert.equal(await page.inputValue("#applyApp [name=grade]"), "g3");
  await page.selectOption("#applyApp [name=grade]", "g3");
  await page.fill("#applyApp [name=studentName]", "Đỗ Nhật Minh");
  await page.fill("#applyApp [name=dob]", "2018-02-02");
  await page.click("#applyApp [data-next]");
  await page.fill("#applyApp [name=parentName]", "Đỗ Văn Nam");
  await page.selectOption("#applyApp [name=relation]", "bo");
  await page.fill("#applyApp [name=phone]", "0911222333");
  await page.fill("#applyApp [name=email]", "nam@vidu.com");
  await page.click("#applyApp [data-next]");
  await page.waitForSelector("#applyApp form[data-step='2']");
  assert.equal(await page.isChecked("#applyApp input[name=programme][value=cap]"), true);
  // clearing the saved result
  await go(page, "find-my-path/");
  await page.click("#fitSaved [data-vp-clear-path]");
  await page.waitForSelector("#fitSaved", { state: "detached" });
  await page.context().close();
});

test("scholarships: eligibility checker and application with withdraw", async () => {
  const page = await newPage();
  await go(page, "hoc-bong/#kiem-tra");
  await page.waitForSelector("#eligibilityApp .vp-empty");
  await page.click("#eligibilityApp [data-eligibility] button[type=submit]");
  await page.waitForSelector("#eligibilityApp [data-field=grade] .vp-error:not([hidden])");
  await page.selectOption("#eligibilityApp [name=grade]", "4");
  await page.fill("#eligibilityApp [name=score]", "8");
  await page.click("#eligibilityApp [data-eligibility] button[type=submit]");
  await page.waitForSelector("#eligibilityApp [data-elig=xuat-sac].is-no");
  assert.match(await text(page, "#eligibilityApp [data-elig=kien-tao]"), /lớp 6–11/);
  await page.selectOption("#eligibilityApp [name=grade]", "7");
  await page.fill("#eligibilityApp [name=score]", "9.1");
  await page.check("#eligibilityApp input[value=city]");
  await page.selectOption("#eligibilityApp [name=community]", "led");
  await page.click("#eligibilityApp [data-eligibility] button[type=submit]");
  await page.waitForSelector("#eligibilityApp [data-elig=xuat-sac].is-ok");
  await page.waitForSelector("#eligibilityApp [data-elig=kien-tao].is-ok");
  await page.click("#eligibilityApp [data-apply-scholarship=xuat-sac]");
  await page.waitForFunction(() => document.querySelector("#scholarshipApp [name=scholarship]")?.value === "xuat-sac");
  assert.equal(await page.inputValue("#scholarshipApp [name=grade]"), "7");
  await page.fill("#scholarshipApp [name=studentName]", "Hoàng Khánh Linh");
  await page.selectOption("#scholarshipApp [name=campus]", "riverside");
  await page.fill("#scholarshipApp [name=essay]", "Quá ngắn");
  await page.fill("#scholarshipApp [name=parentName]", "Hoàng Văn Phúc");
  await page.fill("#scholarshipApp [name=phone]", "0909888777");
  await page.fill("#scholarshipApp [name=email]", "phuc@vidu.com");
  await page.check("#scholarshipApp [name=consent]");
  await page.click("#scholarshipApp [data-submit-scholarship]");
  await page.waitForSelector("#scholarshipApp [data-field=essay] .vp-error:not([hidden])");
  await page.fill("#scholarshipApp [name=essay]", "Linh đạt giải Nhì Toán cấp thành phố, là trưởng nhóm dự án trồng cây xanh ở trường và dạy kèm miễn phí cho các bạn lớp 5.");
  await page.setInputFiles("#scholarshipApp input[name=evidence]", [file("giay-khen-toan.pdf")]);
  await page.waitForSelector("#scholarshipApp .vp-files li:has-text('giay-khen-toan.pdf')");
  await page.check("#scholarshipApp [name=consent]");
  await page.click("#scholarshipApp [data-submit-scholarship]");
  await page.waitForSelector("#scholarshipApp [data-scholarship-ref]", { timeout: T });
  const ref = (await text(page, "#scholarshipApp [data-scholarship-ref]")).trim();
  assert.match(await text(page, "#scholarshipApp .vp-success"), /prototype/);
  await page.waitForSelector(`#myScholarships [data-ref="${ref}"]`);
  await page.click(`#myScholarships [data-withdraw-scholarship="${ref}"]`);
  await confirmDialog(page);
  await page.waitForSelector(`#myScholarships [data-ref="${ref}"] .vp-chip.is-muted`);
  await page.context().close();
});

test("news: category filter, search, empty state, article detail, not-found", async () => {
  const page = await newPage();
  await go(page, "tin-tuc/#tin-moi-nhat");
  await page.waitForSelector("#newsApp .vp-news-card");
  assert.equal(await page.locator("#newsApp .vp-news-card").count(), 6);
  await page.click("#newsApp [data-more]");
  await page.waitForFunction(() => document.querySelectorAll("#newsApp .vp-news-card").length === 8);
  await page.click("#newsApp [data-cat='Học thuật']");
  await page.waitForSelector("#newsApp [data-cat='Học thuật'][aria-pressed=true]");
  assert.equal(await page.locator("#newsApp .vp-news-card").count(), 3);
  await page.fill("#newsApp input[name=q]", "robot");
  await page.press("#newsApp input[name=q]", "Enter");
  await page.waitForFunction(() => document.querySelectorAll("#newsApp .vp-news-card").length === 1);
  await page.fill("#newsApp input[name=q]", "khong co tu nay");
  await page.press("#newsApp input[name=q]", "Enter");
  await page.waitForSelector("#newsApp .vp-empty [data-clear-filters]");
  await page.click("#newsApp [data-clear-filters]");
  await page.waitForFunction(() => document.querySelectorAll("#newsApp .vp-news-card").length === 6);
  await page.click("#newsApp .vp-news-card a >> nth=0");
  await page.waitForSelector("#newsApp [data-article-view]");
  assert.match(page.url(), /bai=/);
  await page.click("#newsApp [data-back-list]");
  await page.waitForSelector("#newsApp .vp-news-card");
  await go(page, "tin-tuc/?bai=bai-khong-ton-tai");
  await page.waitForSelector("#newsApp [data-article-not-found]");
  // failed load is recoverable
  await go(page, "tin-tuc/");
  await page.check("#vpToolbar [data-vp-fail]");
  await reload(page);
  await page.waitForSelector("#newsApp .vp-alert.is-error [data-vp-retry]");
  await page.click("#newsApp [data-vp-retry]");
  await page.waitForSelector("#newsApp .vp-news-card");
  await page.context().close();
});

test("campuses: filters with empty state, campus detail, not-found", async () => {
  const page = await newPage();
  await go(page, "co-so/");
  await page.click("[data-filter=level][data-value=mam-non]");
  await page.click("[data-filter=district][data-value=phu-nhuan]");
  await page.waitForSelector("#campusGrid .finder-empty");
  await page.click("#emptyReset");
  await page.waitForSelector("#campusGrid [data-campus-card]");
  await page.click("[data-filter=district][data-value=go-vap]");
  await page.waitForFunction(() => document.querySelectorAll("#campusGrid [data-campus-card]").length === 1);
  await page.click("#campusGrid [data-vp-campus-detail]");
  await page.waitForSelector("#vpDialog [data-campus-detail=garden-hills]");
  assert.match(page.url(), /chi-tiet=garden-hills/);
  await page.keyboard.press("Escape");
  await page.waitForSelector("#vpDialog", { state: "hidden" });
  assert.doesNotMatch(page.url(), /chi-tiet/);
  await go(page, "co-so/?chi-tiet=khong-co");
  await page.waitForSelector("#vpDialog [data-campus-not-found]");
  await page.click("#vpDialog [data-vp-campus-detail=riverside]");
  await page.waitForSelector("#vpDialog [data-campus-detail=riverside]");
  await page.context().close();
});

test("careers: list, filter, search, detail, apply with CV name, withdraw, not-found", async () => {
  const page = await newPage();
  await go(page, "tuyen-dung/#vi-tri");
  await page.waitForSelector("#jobsApp .job-row");
  assert.equal(await page.locator("#jobsApp .job-row").count(), 7);
  await page.click("#jobsApp [data-dept=support]");
  await page.waitForFunction(() => document.querySelectorAll("#jobsApp .job-row").length === 2);
  await page.click("#jobsApp [data-dept=all]");
  await page.fill("#jobsApp input[name=q]", "IGCSE");
  await page.press("#jobsApp input[name=q]", "Enter");
  await page.waitForFunction(() => document.querySelectorAll("#jobsApp .job-row").length === 1);
  await page.click("#jobsApp [data-job]");
  await page.waitForSelector("#jobsApp [data-job-view=gv-toan-thcs]");
  await page.click("#jobsApp [data-submit-job]");
  await page.waitForSelector("#jobsApp [data-field=fullName] .vp-error:not([hidden])");
  await page.fill("#jobsApp [name=fullName]", "Lý Quốc Bảo");
  await page.fill("#jobsApp [name=email]", "bao@vidu.com");
  await page.fill("#jobsApp [name=phone]", "0938111222");
  await page.selectOption("#jobsApp [name=experience]", "3-5");
  await page.setInputFiles("#cvFile", [{ name: "cv.txt", mimeType: "text/plain", buffer: Buffer.from("x") }]);
  await page.waitForSelector("#jobsApp [data-field=cv] .vp-error:not([hidden])");
  await page.setInputFiles("#cvFile", [file("CV-Ly-Quoc-Bao.pdf")]);
  await page.waitForSelector("#jobsApp [data-cv-name]:has-text('CV-Ly-Quoc-Bao.pdf')");
  await page.check("#jobsApp [name=consent]");
  await page.click("#jobsApp [data-submit-job]");
  await page.waitForSelector("#jobsApp [data-job-ref]", { timeout: T });
  const ref = (await text(page, "#jobsApp [data-job-ref]")).trim();
  assert.match(await text(page, "#jobsApp .vp-success"), /CV-Ly-Quoc-Bao\.pdf/);
  await page.waitForSelector(`#myJobApps [data-ref="${ref}"]`);
  // already-applied state on the job page
  await reload(page);
  await page.waitForSelector("#jobsApp [data-already-applied]");
  await page.click(`#myJobApps [data-withdraw-job="${ref}"]`);
  await confirmDialog(page);
  await page.waitForSelector(`#myJobApps [data-ref="${ref}"] .vp-chip.is-muted`);
  await page.waitForSelector("#jobsApp [data-job-apply]");
  await go(page, "tuyen-dung/?vi-tri=khong-co#vi-tri");
  await page.waitForSelector("#jobsApp [data-job-not-found]");
  await page.click("#jobsApp [data-back-jobs]");
  await page.waitForSelector("#jobsApp .job-row");
  await page.context().close();
});

test("alumni: register, update, persist", async () => {
  const page = await newPage();
  await go(page, "cuu-hoc-sinh/#ket-noi");
  await page.click("#alumniApp [data-submit-alumni]");
  await page.waitForSelector("#alumniApp [data-field=fullName] .vp-error:not([hidden])");
  await page.fill("#alumniApp [name=fullName]", "Mai Xuân Khôi");
  await page.selectOption("#alumniApp [name=year]", "2019");
  await page.selectOption("#alumniApp [name=campus]", "ba-thang-hai");
  await page.fill("#alumniApp [name=email]", "khoi@vidu.com");
  await page.selectOption("#alumniApp [name=role]", "study");
  await page.fill("#alumniApp [name=organisation]", "Georgia Institute of Technology");
  await page.selectOption("#alumniApp [name=country]", "Hoa Kỳ");
  await page.check("#alumniApp input[value=mentoring]");
  await page.check("#alumniApp [name=consent]");
  await page.click("#alumniApp [data-submit-alumni]");
  await page.waitForSelector("#alumniApp [data-alumni-profile]", { timeout: T });
  assert.match(await text(page, "#alumniApp"), /CHS-/);
  assert.match(await text(page, "#alumniApp"), /prototype/);
  await page.click("#alumniApp [data-edit-alumni]");
  await page.waitForSelector("#alumniApp [data-alumni-form]");
  await page.selectOption("#alumniApp [name=role]", "work");
  await page.fill("#alumniApp [name=organisation]", "Google");
  await page.check("#alumniApp [name=consent]");
  await page.click("#alumniApp [data-submit-alumni]");
  await page.waitForSelector("#alumniApp [data-alumni-profile]:has-text('Google')", { timeout: T });
  await reload(page);
  await page.waitForSelector("#alumniApp [data-alumni-profile]:has-text('Đang làm việc tại Google')");
  await page.context().close();
});

test("contact: router sets topic, validation, confirmation", async () => {
  const page = await newPage();
  await go(page, "lien-he/#gui-tin-nhan");
  await page.click("#contactApp [data-submit-contact]");
  await page.waitForSelector("#contactApp [data-field=topic] .vp-error:not([hidden])");
  await page.click("[data-contact-reason=visit]");
  await page.waitForFunction(() => document.querySelector("#contactApp [name=topic]").value === "visit");
  await page.fill("#contactApp [name=name]", "Trương Mỹ Linh");
  await page.fill("#contactApp [name=message]", "Gia đình muốn hỏi về xe đưa rước tuyến Quận 2.");
  await page.click("#contactApp [data-submit-contact]");
  await page.waitForSelector("#contactApp [data-field=phone] .vp-error:not([hidden])");
  await page.fill("#contactApp [name=email]", "linh@vidu.com");
  await page.check("#contactApp [name=consent]");
  await page.click("#contactApp [data-submit-contact]");
  await page.waitForSelector("#contactApp [data-contact-ref]", { timeout: T });
  assert.match(await text(page, "#contactApp .vp-success"), /prototype/);
  await page.click("#contactApp [data-new-message]");
  await page.waitForSelector("#contactApp [data-contact-form]");
  await page.context().close();
});

test("reset: demo data returns to the seed", async () => {
  const page = await newPage();
  await go(page, "lien-he/");
  await page.evaluate(() => { const d = JSON.parse(sessionStorage.getItem("vas-prototype-v1")); d.tours.push({ ref: "TQ-26RESET", status: "confirmed", campus: "sala", date: "2030-01-01", slot: "08:30", people: "2", history: [] }); d.savedPath = { grade: "3" }; sessionStorage.setItem("vas-prototype-v1", JSON.stringify(d)); });
  await go(page, "dat-lich-tham-quan/#lich-cua-toi");
  await page.waitForSelector('#myTours [data-ref="TQ-26RESET"]');
  assert.equal((await text(page, "#vpToolbar [data-vp-count=tours]")).trim(), "1");
  await page.click("#vpToolbar [data-vp-reset]");
  await page.waitForSelector("#vpDialog [data-vp-confirm]");
  await Promise.all([page.waitForNavigation({ waitUntil: "domcontentloaded" }), page.click("#vpDialog [data-vp-confirm]")]);
  await ready(page);
  await page.waitForSelector("#myTours .vp-empty");
  await toastSays(page, /Đã đặt lại dữ liệu demo/);
  const data = await page.evaluate(() => JSON.parse(sessionStorage.getItem("vas-prototype-v1")));
  assert.equal(data.tours.length, 0);
  assert.equal(data.savedPath, null);
  assert.equal((await text(page, "#vpToolbar [data-vp-count=tours]")).trim(), "0");
  await page.context().close();
});

/* ------------------------------------------------------------------ */
(async () => {
  browser = await chromium.launch({ headless: !HEADED });
  let passed = 0; const failed = [];
  const started = Date.now();
  for (const t of tests) {
    if (ONLY && !t.name.includes(ONLY)) continue;
    const t0 = Date.now();
    try { await t.fn(); passed += 1; console.log(`  ✓ ${t.name} (${Date.now() - t0} ms)`); }
    catch (error) { failed.push(t.name); console.log(`  ✗ ${t.name}\n      ${String(error.message).split("\n").slice(0, 4).join("\n      ")}`); }
  }
  if (consoleErrors.length) { failed.push("console errors"); console.log("\nConsole errors:"); [...new Set(consoleErrors)].forEach((e) => console.log("  - " + e.slice(0, 240))); }
  console.log(`\n${passed} passed, ${failed.length} failed, ${((Date.now() - started) / 1000).toFixed(1)} s`);
  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();
