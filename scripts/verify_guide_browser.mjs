import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

// Run against a preview of the built site so Pagefind is available.
const origin = process.env.BETTERPASIG_PREVIEW_URL ?? "http://localhost:4321";
const output = process.env.BETTERPASIG_AUDIT_DIR;
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH });
const taskIds = [
  "pay-real-property-tax",
  "senior-citizen-id",
  "aics",
  "certified-copy-civil-document",
  "business-permit-renewal",
  "scholarship-new",
];
const pageFamilies = [
  "/",
  "/serbisyo/",
  "/serbisyo/business-permit-renewal/",
  "/tulong/",
  "/barangay/kapitolyo/",
  "/lugar/temporary-city-hall/",
  "/buhay/nag-aaral/",
  "/ngayong-linggo/",
  "/ngayong-linggo/arkibo/",
  "/emergency/",
  "/opisyal/",
  "/pondo/",
  "/tungkol/",
  "/larawan/",
];

function clockText(page) {
  return page.locator("[data-ph-clock]").innerText().then((text) => text.replace(/\s+/g, " "));
}

async function assertFits(page, label) {
  const overflow = await page.evaluate(() => {
    document.body.style.overflowX = "visible";
    const tooWide = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    document.body.style.removeProperty("overflow-x");
    return tooWide;
  });
  assert.equal(overflow, false, label);
}

async function assertLightMode(page) {
  const scheme = await page.locator("html").evaluate((root) => getComputedStyle(root).colorScheme);
  assert.deepEqual(scheme.split(/\s+/).sort(), ["light", "only"]);
  assert.equal(await page.locator("html[data-theme], .bp-theme").count(), 0);
}

async function assertHotlines(page) {
  assert.deepEqual(
    await page.locator(".bp-urgent a[href^='tel:']").evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ["tel:0286430000", "tel:911"],
  );
  const directory = page.locator(".bp-urgent__all");
  assert.ok((await directory.getAttribute("href")).endsWith("/emergency/#hotlines"));
}

try {
  const layout = await browser.newPage({ viewport: { width: 320, height: 844 } });
  // Existing visitors may have a dark theme preference stored by previous releases.
  await layout.addInitScript(() => localStorage.setItem("bp-theme", "dark"));
  const runtimeErrors = [];
  layout.on("pageerror", (error) => runtimeErrors.push(error.message));

  for (const locale of ["", "/en"]) {
    for (const colorScheme of ["light", "dark"]) {
      await layout.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      for (const width of [320, 390, 768, 1024, 1440]) {
        await layout.setViewportSize({ width, height: 900 });
        const routes = width === 320 || width === 1440 ? pageFamilies : pageFamilies.slice(0, 5);
        for (const route of routes) {
          const path = locale + route;
          const response = await layout.goto(origin + path, { waitUntil: "domcontentloaded" });
          assert.ok(response.ok(), path);
          await assertFits(layout, `${colorScheme} at ${width}px: ${path}`);
          await assertHotlines(layout);
          await assertLightMode(layout);
        }
      }
    }

    await layout.setViewportSize({ width: 390, height: 844 });
    await layout.emulateMedia({ colorScheme: "light" });
    await layout.goto(origin + locale + "/");
    assert.deepEqual(
      await layout.locator(".bp-quick li a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
      taskIds.map((id) => `${locale}/serbisyo/${id}/`),
    );
    assert.equal(await layout.locator(".bp-map__directory a").count(), 30);
    assert.equal(await layout.locator("#mapa").getAttribute("lang"), "fil");
    assert.equal(await layout.locator("#mapa-h").innerText(), "Ang 30 barangay ng Pasig");
    const hasEnglish = locale === "/en";
    await layout.getByRole("navigation", { name: hasEnglish ? "Main menu" : "Pangunahing menu" })
      .getByRole("link", { name: hasEnglish ? "Explore Pasig" : "Pasyalan" }).click();
    assert.ok(layout.url().endsWith("#pasyalan"));
    const park = layout.locator("#pasyalan-maybunga-rainforest-park").locator("..");
    assert.match(await park.innerText(), hasEnglish ? /7:00 AM/ : /7:00 n\.u\./);

    const details = layout.locator(".bp-header__more");
    const summary = details.locator("summary");
    await summary.focus();
    await summary.press("Enter");
    assert.equal(await details.evaluate((element) => element.open), true);
    await summary.press("Escape");
    assert.equal(await details.evaluate((element) => element.open), false);

    await layout.goto(origin + locale + "/barangay/maybunga/");
    assert.equal(await layout.locator("main").getAttribute("lang"), "fil");
    assert.match(await layout.locator("main").innerText(), /Punong barangay/);
    assert.doesNotMatch(await layout.locator("main").innerText(), /Directory source|Published numbers/);
    await layout.goto(origin + locale + "/opisyal/#opisyal-barangay");
    assert.equal(await layout.locator("#opisyal-barangay").getAttribute("lang"), "fil");

    await layout.goto(origin + locale + "/serbisyo/scholarship-new/");
    assert.match(await layout.locator(".section-head p").innerText(), hasEnglish ? /Pasig residents/ : /taga-Pasig/);
    assert.ok(await layout.locator("#service-requirements").isVisible());
    await layout.goto(origin + locale + "/serbisyo/business-permit-renewal/");
    assert.match(await layout.locator(".bp-svc__instructions").innerText(), hasEnglish ? /Proof of gross sales/ : /Patunay ng gross sales/);
    await layout.goto(origin + locale + "/serbisyo/aics/");
    assert.match(await layout.locator(".section-head p").innerText(), hasEnglish ? /residents in crisis/ : /taga-Pasig.*krisis/);

    const searchPage = await browser.newPage();
    await searchPage.goto(origin + locale + "/serbisyo/");
    const search = searchPage.getByRole("combobox");
    await search.fill("Maybunga Rainforest Park");
    const first = searchPage.getByRole("option").first();
    await first.waitFor();
    assert.equal(await first.getAttribute("href"), `${locale}/#pasyalan-maybunga-rainforest-park`);
    await search.press("ArrowDown");
    assert.equal(await search.getAttribute("aria-activedescendant"), await first.getAttribute("id"));
    await search.press("Escape");
    assert.equal(await search.getAttribute("aria-expanded"), "false");
    await search.press("ArrowDown");
    await first.waitFor();
    await search.press("ArrowDown");
    await search.press("Enter");
    await searchPage.waitForURL(`**${locale}/#pasyalan-maybunga-rainforest-park`);
    await searchPage.close();
  }
  assert.deepEqual(runtimeErrors, []);

  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touch.goto(origin + "/");
  await touch.locator(".bp-quick a[href$='/aics/']").tap();
  await touch.waitForURL("**/serbisyo/aics/");
  await touch.close();

  const noScript = await browser.newPage({ javaScriptEnabled: false, colorScheme: "dark", viewport: { width: 390, height: 844 } });
  await noScript.goto(origin + "/en/");
  await assertHotlines(noScript);
  await assertLightMode(noScript);
  assert.equal(await noScript.locator("[data-ph-clock]").isVisible(), false);
  assert.match(await noScript.locator(".bp-urgent__clock").innerText(), /Philippine time/);
  assert.equal(await noScript.locator(".bp-map__directory a").count(), 30);
  await noScript.locator(".bp-header__more summary").click();
  assert.equal(await noScript.locator(".bp-header__more").evaluate((element) => element.open), true);
  await noScript.locator(".bp-quick__all").click();
  assert.ok(await noScript.locator("#service-categories a").first().isVisible());
  await noScript.close();

  const searchStates = await browser.newPage();
  await searchStates.goto(origin + "/serbisyo/");
  const input = searchStates.getByRole("combobox");
  await input.fill("zzqqxnoresult");
  const status = searchStates.locator(".bp-search__status");
  await searchStates.waitForFunction(() => document.querySelector(".bp-search__status").textContent.includes("Walang resulta"));
  assert.ok((await status.innerText()).includes("Walang resulta"));
  await searchStates.route("**/pagefind/pagefind.js", (route) => route.abort());
  await searchStates.reload();
  await input.fill("amilyar");
  assert.match(await status.innerText(), /Naghahanap/);
  await searchStates.waitForFunction(() => document.querySelector(".bp-search__status").textContent.includes("Hindi mabuksan"));
  assert.equal(await searchStates.locator(".bp-search__browse").getAttribute("href"), "#service-categories");
  await searchStates.close();

  const clock = await browser.newPage({ timezoneId: "America/Los_Angeles" });
  await clock.clock.install({ time: new Date("2026-11-18T11:59:50+08:00") });
  await clock.clock.pauseAt(new Date("2026-11-18T11:59:59+08:00"));
  await clock.goto(origin + "/en/");
  await clock.locator("[data-ph-clock]").waitFor();
  assert.equal(await clockText(clock), "11:59 AM");
  await clock.clock.runFor(1_100);
  assert.equal(await clockText(clock), "12:00 PM");
  await clock.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await clock.clock.setSystemTime(new Date("2026-11-19T00:00:00+08:00"));
  await clock.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert.equal(await clockText(clock), "12:00 AM");
  await clock.close();

  await layout.setViewportSize({ width: 1440, height: 900 });
  await layout.goto(origin);
  await layout.evaluate(() => { document.documentElement.style.zoom = "2"; });
  await assertFits(layout, "200% CSS zoom");
  await layout.evaluate(() => { document.documentElement.style.zoom = ""; });

  if (output) {
    await mkdir(output, { recursive: true });
    for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
      await layout.setViewportSize({ width, height });
      await layout.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
      await layout.goto(origin, { waitUntil: "networkidle" });
      await layout.screenshot({ path: join(output, `home-${name}.jpg`), quality: 84 });
      if (name === "mobile") {
        const park = layout.locator("#pasyalan-maybunga-rainforest-park").locator("../..");
        await park.scrollIntoViewIfNeeded();
        await park.locator("img").evaluate((image) => image.decode());
        await park.screenshot({ path: join(output, "explore-mobile.jpg"), quality: 84 });
      }
      await layout.goto(origin + (name === "desktop" ? "/en/serbisyo/business-permit-renewal/" : "/serbisyo/aics/"), { waitUntil: "networkidle" });
      await layout.screenshot({ path: join(output, `service-${name}.jpg`), quality: 84 });
    }
  }
  console.log("Guide browser checks passed: 14 page families, both languages and device color preferences, direct links, search states, hotline destinations, Manila clock, touch, zoom, and no JavaScript.");
} finally {
  await browser.close();
}
