// Renders the favicon.ico, PNG app icons and the social share image into public/ from design/map/marks.json.
// Run: bun scripts/web_icons.mjs   (set CHROMIUM_PATH if Chromium is not at /opt/pw-browsers/chromium)
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "public");
const BLUE = "#1A47A8";
const INK = "#16181D";
const MUTED = "#586070";

const mark = JSON.parse(readFileSync(join(ROOT, "design/map/marks.json"), "utf8")).smooth;
const font = (w) =>
  readFileSync(join(ROOT, `node_modules/@fontsource/geist/files/geist-latin-${w}-normal.woff2`)).toString("base64");

// Square icon: white mark on Pasig Blue. `scale` keeps the mark inside the maskable safe zone when smaller.
const icon = ({ radius = 0, scale = 0.78 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">` +
  `<rect width="48" height="48" rx="${radius}" fill="${BLUE}"/>` +
  `<g transform="translate(24 24) scale(${scale}) translate(-24 -24)"><path d="${mark}" fill="#FFFFFF"/></g></svg>`;

const og = `
<style>
  @font-face { font-family: Geist; font-weight: 400; src: url(data:font/woff2;base64,${font(400)}) format("woff2"); }
  @font-face { font-family: Geist; font-weight: 700; src: url(data:font/woff2;base64,${font(700)}) format("woff2"); }
  body { margin: 0; width: 1200px; height: 630px; background: #fff; font-family: Geist, sans-serif; color: ${INK};
         display: flex; align-items: center; gap: 64px; padding: 0 96px; box-sizing: border-box; border-bottom: 12px solid ${BLUE}; }
  svg { width: 230px; flex: none; }
  h1 { margin: 0; font-size: 84px; font-weight: 700; letter-spacing: -0.04em; }
  p { margin: 18px 0 0; font-size: 34px; line-height: 1.3; color: ${MUTED}; max-width: 18em; }
</style>
<svg viewBox="8 2 32 44"><path d="${mark}" fill="${BLUE}"/></svg>
<div><h1>BetterPasig</h1><p>Bawat serbisyo, benepisyo at opisyal ng Lungsod ng Pasig, malinaw at nasa isang lugar.</p></div>`;

const executablePath =
  process.env.CHROMIUM_PATH ??
  (existsSync("/opt/pw-browsers/chromium")
    ? join("/opt/pw-browsers", readdirSync("/opt/pw-browsers").find((d) => /^chromium-\d+$/.test(d)), "chrome-linux/chrome")
    : undefined);
const browser = await chromium.launch({ executablePath });

async function png(html, w, h = w) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<body style="margin:0">${html}</body>`);
  const buf = await page.screenshot({ omitBackground: true });
  await page.close();
  return buf;
}

// ICO container holding PNG images (supported by every current browser and Windows Vista+).
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const rounded = icon({ radius: 11 });
const icoSizes = [16, 32, 48];
const icoImages = [];
for (const size of icoSizes) icoImages.push({ size, data: await png(rounded, size) });
writeFileSync(join(OUT, "favicon.ico"), ico(icoImages));

writeFileSync(join(OUT, "favicon.svg"), rounded.replace(' width="100%" height="100%"', "") + "\n");
writeFileSync(join(OUT, "apple-touch-icon.png"), await png(icon(), 180)); // iOS rounds the corners itself
writeFileSync(join(OUT, "icon-192.png"), await png(rounded, 192));
writeFileSync(join(OUT, "icon-512.png"), await png(rounded, 512));
writeFileSync(join(OUT, "icon-maskable-512.png"), await png(icon({ scale: 0.6 }), 512));
writeFileSync(join(OUT, "og.png"), await png(og, 1200, 630));

await browser.close();
console.log("Wrote favicon.ico, favicon.svg, apple-touch-icon.png, icon-*.png and og.png to public/");
