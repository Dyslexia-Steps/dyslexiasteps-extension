// Rating link: hidden before 5 usage days, shown after, gone once dismissed.
export default async ({ ctx, sw, shot }) => {
  const id = await sw.evaluate(() => chrome.runtime.id);
  const open = async () => { const p = await ctx.newPage(); await p.goto(`chrome-extension://${id}/popup.html`); await p.waitForTimeout(700); return p; };
  let p = await open();
  console.log("fresh: rate hidden =", await p.locator("#rating").isHidden(), "days =", JSON.stringify(await sw.evaluate(() => chrome.storage.local.get("usageDays"))));
  await p.close();
  await sw.evaluate(() => chrome.storage.local.set({ usageDays: ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05"] }));
  p = await open();
  console.log("5 days: rate visible =", await p.locator("#rating").isVisible(), "text =", await p.locator("#rateLink").textContent(), "href =", await p.locator("#rateLink").getAttribute("href"));
  await p.screenshot({ path: "/tmp/ext-test/rating-popup.png", fullPage: true });
  await p.locator("#rateDismiss").click();
  await p.waitForTimeout(200);
  console.log("after dismiss: hidden =", await p.locator("#rating").isHidden(), "rateDone =", JSON.stringify(await sw.evaluate(() => chrome.storage.local.get("rateDone"))));
  await p.close();
  p = await open();
  console.log("reopen: hidden =", await p.locator("#rating").isHidden());
};
