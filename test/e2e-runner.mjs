import { chromium } from "playwright";
import { cpSync, readFileSync, writeFileSync, rmSync } from "node:fs";
const [src, url, outPrefix] = process.argv.slice(2);
const ext = "/tmp/ext-test/build-" + outPrefix;
rmSync(ext, { recursive: true, force: true });
cpSync(src, ext, { recursive: true });
const m = JSON.parse(readFileSync(ext + "/manifest.json", "utf8"));
m.host_permissions = ["<all_urls>"]; // test-only
writeFileSync(ext + "/manifest.json", JSON.stringify(m));
const ctx = await chromium.launchPersistentContext("/tmp/ext-test/profile-" + Date.now(), {
  channel: "chromium", headless: true, viewport: { width: 1280, height: 800 },
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
});
let [sw] = ctx.serviceWorkers();
if (!sw) sw = await ctx.waitForEvent("serviceworker");
const errors = [];
const page = await ctx.newPage();
page.on("pageerror", e => errors.push("pageerror " + e.message));
page.on("console", m => m.type() === "error" && errors.push("console " + m.text()));
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const tabId = await sw.evaluate(async (u) => (await chrome.tabs.query({})).find(t => t.url?.startsWith(u.slice(0, 20)))?.id, url);
await sw.evaluate(async (id) => chrome.scripting.executeScript({ target: { tabId: id }, files: ["content.js"] }), tabId);
await page.waitForTimeout(500);
const script = (await import(process.argv[5])).default;
await script({ ctx, sw, page, tabId, shot: async (n) => page.screenshot({ path: `/tmp/ext-test/${outPrefix}-${n}.png` }) });
console.log("errors:", errors.filter(e => !/Failed to load resource|Content Security|net::/.test(e)).slice(0, 10));
await ctx.close();
