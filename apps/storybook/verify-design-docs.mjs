import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import axe from "axe-core";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3100";
const screenshotDir = "/tmp/kimgseok-design-docs";
mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

async function assertA11y(target, label) {
  await target.addScriptTag({ content: axe.source });
  const result = await target.evaluate(async () => globalThis.axe.run());
  if (result.violations.length) {
    throw new Error(
      label + " axe violations: " +
      result.violations.map(({ id, nodes }) =>
        id + " " + nodes.map(({ target: nodeTarget }) => nodeTarget.join(" ")).join(" | ")
      ).join(", "),
    );
  }
}

await page.goto(baseUrl, { waitUntil: "networkidle" });
if (!(await page.getByRole("heading", { name: /필요한 UI를 찾고, 확인하고, 바로 적용하세요/ }).isVisible())) {
  throw new Error("Design Docs hero did not render.");
}
if ((await page.locator("body").innerText()).trim().length < 500) {
  throw new Error("Design Docs rendered insufficient content.");
}
await page.getByRole("button", { name: /기준 날짜/ }).click();
const dialog = page.getByRole("dialog", { name: "기준 날짜" });
await dialog.waitFor();
const focusedBefore = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(40);
const focusedAfter = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
if (!focusedBefore || !focusedAfter || focusedBefore === focusedAfter) {
  throw new Error("Calendar arrow navigation did not move focus.");
}
await page.keyboard.press("Escape");
await dialog.waitFor({ state: "hidden" });
await assertA11y(page, "home");
await page.screenshot({ path: screenshotDir + "/home-1280.png", fullPage: true });

await page.goto(baseUrl + "/components", { waitUntil: "networkidle" });
if ((await page.locator(".component-results > li").count()) !== 44) {
  throw new Error("Stable component catalog must render 44 entries by default.");
}
await page.keyboard.press("Control+K");
const search = page.getByLabel("컴포넌트 검색");
if (!(await search.evaluate((node) => node === document.activeElement))) {
  throw new Error("Control+K did not focus component search.");
}
await search.fill("토스트");
await page.waitForTimeout(180);
if ((await page.locator(".component-results > li").count()) !== 1 ||
    !(await page.locator(".component-results").getByRole("link", { name: /ToastViewport/ }).isVisible())) {
  throw new Error("Korean alias search did not isolate ToastViewport.");
}
await page.keyboard.press("Escape");
await page.waitForTimeout(30);
if ((await page.locator(".component-results > li").count()) !== 44) {
  throw new Error("Escape did not clear component search.");
}
await search.fill("Table");
await page.getByRole("button", { name: "Native", exact: true }).click();
if (!(await page.getByRole("heading", { name: "조건에 맞는 컴포넌트가 없어요." }).isVisible())) {
  throw new Error("Native filter did not exclude the Web-only Table.");
}
await page.getByRole("button", { name: "필터 초기화" }).click();
await search.fill("Button");
await Promise.all([
  page.waitForURL(/\/components\/button$/),
  search.press("Enter"),
]);
if (!(await page.getByText('import { NativeButton } from "@kimgseok/design-button/native";', { exact: true }).isVisible())) {
  throw new Error("Button detail does not expose the real Native export.");
}
const sourceHref = await page.getByRole("link", { name: /구현 소스 보기/ }).getAttribute("href");
if (!sourceHref?.includes("packages/design-systems/components/button/src/web-button.tsx")) {
  throw new Error("Button detail source link is missing.");
}
await assertA11y(page, "button detail");
await page.screenshot({ path: screenshotDir + "/button-1280.png", fullPage: true });

await page.goto(baseUrl + "/components", { waitUntil: "networkidle" });
await assertA11y(page, "components");
await page.screenshot({ path: screenshotDir + "/components-1280.png", fullPage: true });

const narrow = await browser.newPage({ viewport: { width: 320, height: 800 } });
narrow.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
narrow.on("pageerror", (error) => errors.push(error.message));
for (const [name, route] of [
  ["home", "/"],
  ["components", "/components"],
  ["button", "/components/button"],
]) {
  await narrow.goto(baseUrl + route, { waitUntil: "networkidle" });
  const overflow = await narrow.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (overflow) throw new Error(name + " overflows at 320px.");
  await assertA11y(narrow, name + " mobile");
  await narrow.screenshot({
    path: screenshotDir + "/" + name + "-320.png",
    fullPage: true,
  });
}

if (errors.length) throw new Error("Browser errors: " + errors.join(" | "));
await browser.close();
console.log(
  "Design Docs browser verification passed: search, filters, accurate exports, dialog keyboard/focus, 320px containment, axe, console.",
);
