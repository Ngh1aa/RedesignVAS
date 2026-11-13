#!/usr/bin/env node
/*
  VAS — interactive control inventory.
  Lists every visible interactive control on every page, activates each one and
  records whether something meaningful happened (navigation, DOM change,
  scroll, popup). Also reports console errors and href="#".

  Usage:
    NODE_PATH=<playwright node_modules> node qa/inventory.cjs [--base http://127.0.0.1:8927] [--json out.json] [--page tuyen-sinh/] [--mobile]
*/
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const BASE = opt("--base", "http://127.0.0.1:8927").replace(/\/$/, "");
const JSON_OUT = opt("--json", "");
const ONLY = opt("--page", "");
const WIDTHS = args.includes("--mobile") ? [1440, 390] : [1440];

const PAGES = [
  "", "ve-vas/", "chuong-trinh/", "co-so/", "co-so-riverside/", "tuyen-sinh/", "tin-tuc/", "vong-quanh-vas/",
  "find-my-path/", "hoc-bong/", "cuu-hoc-sinh/", "tu-van-huong-nghiep/", "ho-tro-hoc-sinh/", "tuyen-dung/",
  "lien-he/", "dat-lich-tham-quan/", "design-system/", "component-states/", "user-flow/", "sitemap/", "prototype/",
];

const IGNORED_CLASS_TOKENS = new Set(["in", "is-motion-visible", "solid", "vas-motion-item", "vas-motion-media", "is-hovered", "focus-visible"]);

async function installObserver(page) {
  await page.evaluate((ignored) => {
    const ignore = new Set(ignored);
    window.__invChanges = 0;
    if (window.__invObs) window.__invObs.disconnect();
    window.__invObs = new MutationObserver((records) => {
      for (const r of records) {
        if (r.target.closest && r.target.closest("[data-ui-feedback-root], ui-feedback-root")) continue;
        if (r.type === "attributes") {
          if (r.attributeName === "class") {
            const before = new Set((r.oldValue || "").split(/\s+/).filter(Boolean));
            const after = new Set((r.target.getAttribute("class") || "").split(/\s+/).filter(Boolean));
            const diff = [...before].filter((t) => !after.has(t)).concat([...after].filter((t) => !before.has(t)));
            if (diff.every((t) => ignore.has(t) || t.startsWith("vas-motion"))) continue;
          }
          if (r.attributeName === "style" && /--vas-motion/.test(r.target.getAttribute("style") || "")) continue;
        }
        window.__invChanges++;
      }
    });
    window.__invObs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true });
  }, [...IGNORED_CLASS_TOKENS]);
}

async function collect(page) {
  return page.evaluate(() => {
    const sel = "a[href], a:not([href])[onclick], button, summary, [role=button], [role=tab], [role=link], input:not([type=hidden]), select, textarea";
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !el.closest("[hidden]");
    };
    const out = [];
    document.querySelectorAll(sel).forEach((el, i) => {
      if (el.closest("[data-ui-feedback-root]")) return;
      el.setAttribute("data-inv", String(i));
      const tag = el.tagName.toLowerCase();
      const type = (el.getAttribute("type") || "").toLowerCase();
      out.push({
        id: String(i),
        tag,
        type,
        href: el.getAttribute("href"),
        text: (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.name || "").replace(/\s+/g, " ").trim().slice(0, 60),
        visible: visible(el),
        disabled: el.disabled === true || el.getAttribute("aria-disabled") === "true",
      });
    });
    return out;
  });
}

async function idsOf(context, url, cache) {
  const key = url.split("#")[0];
  if (cache.has(key)) return cache.get(key);
  const p = await context.newPage();
  let ids = null;
  try {
    let res = null;
    for (let attempt = 0; attempt < 5 && !res; attempt += 1) res = await p.goto(key, { waitUntil: "load", timeout: 20000 }).catch(() => null);
    if (res && res.status() < 400) {
      await p.waitForTimeout(900);
      ids = new Set(await p.evaluate(() => [...document.querySelectorAll("[id], a[name]")].map((n) => n.id || n.getAttribute("name"))));
    }
  } catch { ids = null; }
  await p.close();
  cache.set(key, ids);
  return ids;
}

// python -m http.server can refuse connections under load; retry the navigation instead of failing the run.
async function open(page, url) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try { await page.goto(url, { waitUntil: "load", timeout: 30000 }); break; }
    catch (error) { if (attempt === 4) throw error; await page.waitForTimeout(1000); }
  }
  await page.waitForTimeout(800);
}

async function clickAndObserve(page, ctrlId, pageUrl) {
  try { await installObserver(page); } catch { await page.waitForLoadState("domcontentloaded").catch(() => {}); await page.waitForTimeout(500); await installObserver(page).catch(() => {}); }
  const before = await page.evaluate(() => ({ url: location.href, y: scrollY }));
  let popup = null;
  const onPage = (p) => { popup = p; };
  page.context().on("page", onPage);
  let dialog = false;
  const onDialog = (d) => { dialog = true; d.dismiss().catch(() => {}); };
  page.on("dialog", onDialog);
  try {
    await page.locator(`[data-inv="${ctrlId}"]`).first().click({ timeout: 1500 });
  } catch (e) {
    page.off("dialog", onDialog);
    page.context().off("page", onPage);
    return { result: "unclickable", detail: e.message.split("\n")[0].slice(0, 80) };
  }
  await page.waitForTimeout(450);
  page.off("dialog", onDialog);
  page.context().off("page", onPage);
  if (popup) { await popup.close().catch(() => {}); return { result: "ok", detail: "opened popup" }; }
  if (dialog) return { result: "ok", detail: "dialog" };
  const after = await page.evaluate(() => ({ url: location.href, y: scrollY, changes: window.__invChanges || 0 })).catch(() => null);
  if (!after) return { result: "ok", detail: "navigated" };
  if (after.url.split("#")[0] !== before.url.split("#")[0]) return { result: "ok", detail: "navigated", reset: true };
  if (after.url !== before.url) return { result: "ok", detail: "hash " + after.url.split("#")[1], reset: Math.abs(after.y - before.y) > 0 };
  if (after.changes > 0) return { result: "ok", detail: `dom changes ${after.changes}` };
  if (Math.abs(after.y - before.y) > 40) return { result: "ok", detail: "scrolled" };
  return { result: "dead", detail: "no visible effect" };
}

(async () => {
  const browser = await chromium.launch();
  const pages = ONLY ? [ONLY] : PAGES;
  const report = [];
  let totals = { controls: 0, tested: 0, ok: 0, dead: 0, hrefHash: 0, consoleErrors: 0, brokenLinks: 0, fields: 0, hidden: 0 };
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route(/images\.unsplash|digitaloceanspaces|fonts\.g/, (r) => r.abort());
    const idCache = new Map();
    for (const path of pages) {
      const url = `${BASE}/${path}`;
      const page = await context.newPage();
      const errors = [];
      // Cross-document view transitions abort when automation navigates mid-transition; that is harness noise.
      page.on("pageerror", (e) => { if (!/Transition was aborted/.test(e.message)) errors.push("pageerror: " + e.message); });
      page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) errors.push(m.text()); });
      await open(page, url);
      const controls = await collect(page);
      const rows = [];
      for (const c of controls) {
        const row = { ...c };
        if (!c.visible) { row.result = "hidden"; rows.push(row); continue; }
        if (c.disabled) { row.result = "disabled"; rows.push(row); continue; } // intentional disabled state (e.g. component-states specimens)
        if (["input", "select", "textarea"].includes(c.tag) && !["submit", "button", "reset", "checkbox", "radio"].includes(c.type)) { row.result = "field"; rows.push(row); continue; }
        const href = c.href;
        if (c.tag === "a" && href !== null) {
          if (href === "#" || href === "" || /^javascript:/i.test(href)) {
            row.hrefHash = true;
          } else if (/^(tel:|mailto:)/i.test(href)) { row.result = "ok"; row.detail = href.split(":")[0]; rows.push(row); continue; }
          else if (/^https?:/i.test(href) && !href.startsWith(BASE)) { row.result = "ok"; row.detail = "external"; rows.push(row); continue; }
          else {
            const abs = new URL(href, page.url()).href;
            const [doc, hash] = abs.split("#");
            const samePage = doc === page.url().split("#")[0];
            if (!samePage || !hash) {
              const ids = await idsOf(context, doc, idCache);
              if (!ids) { row.result = "broken"; row.detail = "404 " + doc.replace(BASE, ""); rows.push(row); continue; }
              if (hash && !ids.has(decodeURIComponent(hash))) { row.result = "broken"; row.detail = "missing #" + hash; rows.push(row); continue; }
              if (!samePage) { row.result = "ok"; row.detail = "link"; rows.push(row); continue; }
              if (!hash) { row.result = "ok"; row.detail = "self link (reload)"; rows.push(row); continue; }
            }
          }
        }
        // Buttons, summaries, tabs, same-page anchors, href="#": click.
        let r = await clickAndObserve(page, c.id, url);
        if (r.result !== "ok") {
          // Retry from a fresh page so earlier clicks cannot mask the result.
          await open(page, url); await collect(page);
          r = await clickAndObserve(page, c.id, url);
        }
        Object.assign(row, r);
        if (r.reset || r.detail === "navigated") { await open(page, url); await collect(page); }
        else { await page.keyboard.press("Escape").catch(() => {}); }
        rows.push(row);
      }
      await page.close();
      const sum = (k) => rows.filter((r) => r.result === k).length;
      const entry = { width, path: "/" + path, errors: [...new Set(errors)], controls: rows.length, ok: sum("ok"), dead: sum("dead") + sum("unclickable"), broken: sum("broken"), fields: sum("field"), hidden: sum("hidden"), hrefHash: rows.filter((r) => r.hrefHash).length, rows };
      report.push(entry);
      totals.controls += entry.controls; totals.ok += entry.ok; totals.dead += entry.dead; totals.brokenLinks += entry.broken;
      totals.fields += entry.fields; totals.hidden += entry.hidden; totals.hrefHash += entry.hrefHash; totals.consoleErrors += entry.errors.length;
      console.log(`[${width}] ${entry.path.padEnd(24)} controls=${entry.controls} ok=${entry.ok} dead=${entry.dead} broken=${entry.broken} fields=${entry.fields} hidden=${entry.hidden} href#=${entry.hrefHash} errors=${entry.errors.length}`);
      rows.filter((r) => ["dead", "unclickable", "broken"].includes(r.result) || r.hrefHash).forEach((r) => console.log(`    - ${r.result.toUpperCase()} <${r.tag}${r.href !== null ? ` href="${r.href}"` : ""}> "${r.text}" ${r.detail || ""}`));
      entry.errors.forEach((e) => console.log(`    ! ${e.slice(0, 200)}`));
    }
    await context.close();
  }
  totals.tested = totals.controls - totals.fields - totals.hidden;
  console.log("\nTOTAL", JSON.stringify(totals));
  if (JSON_OUT) require("fs").writeFileSync(JSON_OUT, JSON.stringify({ totals, report }, null, 2));
  await browser.close();
  process.exit(totals.dead + totals.brokenLinks + totals.hrefHash + totals.consoleErrors > 0 ? 1 : 0);
})();
