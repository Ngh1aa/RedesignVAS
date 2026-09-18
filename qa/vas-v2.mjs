import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.VAS_BASE_URL || "http://127.0.0.1:4173";
await fs.mkdir("qa/evidence", { recursive: true });

const browser = await chromium.launch({ headless: true });
const blockers = [];
const notes = [];

async function open(path, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(900);
  return page;
}

async function noOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (metrics.scrollWidth > metrics.clientWidth + 2) {
    blockers.push(`${label}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  }
}

async function axe(page, label) {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(v => ["serious","critical"].includes(v.impact));
  if (serious.length) {
    blockers.push(`${label}: axe blockers — ${serious.map(v => v.id).join(", ")}`);
  }
}

const desktop = { width: 1440, height: 1000 };
const mobile = { width: 390, height: 844 };

// Home: the new decision architecture must be visible and link to real routes.
{
  const page = await open("/", desktop);
  const heading = page.locator("#bat-dau #decisionPathTitle");
  if (!(await heading.isVisible())) blockers.push("Home: parent decision path is not visible");
  const labels = await page.locator("#bat-dau .decision-path-label").allTextContents();
  for (const expected of ["Chương trình","Cơ sở","Trải nghiệm campus","Bước tiếp theo"]) {
    if (!labels.some(label => label.includes(expected))) blockers.push(`Home: missing decision step ${expected}`);
  }
  await noOverflow(page, "Home desktop");
  await axe(page, "Home desktop");
  await page.screenshot({ path: "qa/evidence/home-decision-desktop.png", fullPage: true });
  await page.close();
}

// Mobile: cards must recompose rather than overflow.
{
  const page = await open("/", mobile);
  await noOverflow(page, "Home mobile");
  if (!(await page.locator("#bat-dau").isVisible())) blockers.push("Home mobile: decision path missing");
  await page.screenshot({ path: "qa/evidence/home-decision-mobile.png", fullPage: true });
  await page.close();
}

// Campus finder should carry chosen programme/level into the dedicated visit route.
{
  const page = await open("/co-so/?program=cap&level=tieu-hoc", desktop);
  const visitHref = await page.locator(".campus-editorial-card .campus-card-actions a").filter({ hasText: "Tham quan" }).first().getAttribute("href");
  if (!visitHref?.includes("../dat-lich-tham-quan/")) blockers.push("Campus finder: visit CTA does not use dedicated planner");
  if (!visitHref?.includes("program=cap")) blockers.push("Campus finder: programme context not carried");
  if (!visitHref?.includes("level=tieu-hoc")) blockers.push("Campus finder: level context not carried");
  await noOverflow(page, "Campus finder desktop");
  await page.screenshot({ path: "qa/evidence/campus-finder-context.png", fullPage: true });
  await page.close();
}

// Visit planner must hydrate the selected decision context truthfully.
{
  const page = await open("/dat-lich-tham-quan/?campus=riverside&program=cap&level=tieu-hoc", desktop);
  const campus = (await page.locator("[data-summary-campus]").textContent())?.trim();
  const program = (await page.locator("[data-summary-program]").textContent())?.trim();
  const level = (await page.locator("[data-summary-level]").textContent())?.trim();
  if (campus !== "Riverside") blockers.push(`Visit planner: expected Riverside, got ${campus}`);
  if (program !== "CAP") blockers.push(`Visit planner: expected CAP, got ${program}`);
  if (level !== "Tiểu học") blockers.push(`Visit planner: expected Tiểu học, got ${level}`);
  if (!(await page.locator("[data-visit-context]").isVisible())) blockers.push("Visit planner: carried-context banner is hidden");
  const body = await page.locator("body").innerText();
  if (body.includes("conversion screen dạng scheduler")) blockers.push("Visit planner: internal implementation language leaked into UI");
  await noOverflow(page, "Visit planner desktop");
  await axe(page, "Visit planner desktop");
  await page.screenshot({ path: "qa/evidence/visit-context-desktop.png", fullPage: true });
  await page.close();
}

// Campus detail must read as a parent-facing product surface.
{
  const page = await open("/co-so-riverside/", mobile);
  const body = await page.locator("body").innerText();
  if (body.includes("Trang detail tập trung")) blockers.push("Riverside: internal design-documentation copy leaked into UI");
  const visitHref = await page.locator('a[href*="dat-lich-tham-quan"]').first().getAttribute("href");
  if (!visitHref?.includes("campus=riverside")) blockers.push("Riverside: visit CTA loses campus context");
  await noOverflow(page, "Riverside mobile");
  await page.screenshot({ path: "qa/evidence/riverside-mobile.png", fullPage: true });
  await page.close();
}

await browser.close();

const summary = {
  status: blockers.length ? "FAIL" : "PASS",
  blockers,
  notes,
  checkedAt: new Date().toISOString(),
};
await fs.writeFile("qa/evidence/summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (blockers.length) process.exit(1);
