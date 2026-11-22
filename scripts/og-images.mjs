// Writes dist/og/<page>.png from each built page's og:title. Run after astro build, before pagefind.
// Satori reads woff, not woff2: Manrope comes from @fontsource/manrope, not the variable package.
// The mark is drawn on afterwards. Satori's inline SVG becomes a nested image, and sharp hangs on that.
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { ogImagePath, ogTitleSuffix } from "../src/lib/og-image.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const width = 1200;
const height = 630;
const padX = 72;
const padTop = 52;
const markW = 56;
const markH = 77;
const textWidth = width - padX * 2 - 8;
const ink = "#172741";
const muted = "#515D6B";
const paper = "#F8FAFC";
const blue = "#1A47A8";

const require = createRequire(import.meta.resolve("satori"));
const opentype = require("@shuding/opentype.js");
const newsreader = readFileSync(join(root, "node_modules/@fontsource/newsreader/files/newsreader-latin-500-normal.woff"));
const manrope = (weight) => readFileSync(join(root, `node_modules/@fontsource/manrope/files/manrope-latin-${weight}-normal.woff`));
const face = opentype.parse(newsreader.buffer.slice(newsreader.byteOffset, newsreader.byteOffset + newsreader.byteLength));
const fonts = [
  { name: "Newsreader", data: newsreader, weight: 500, style: "normal" },
  { name: "Manrope", data: manrope(500), weight: 500, style: "normal" },
  { name: "Manrope", data: manrope(600), weight: 600, style: "normal" },
];

const mark = await sharp(readFileSync(join(root, "design/logo/mark-blue.svg")), { density: 300 })
  .resize(markW, markH)
  .png()
  .toBuffer();
const { default: satori } = await import("satori");

function decode(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function lineWidth(text, size) {
  const count = [...text].length;
  return face.getAdvanceWidth(text, size) + Math.max(0, count - 1) * -0.02 * size;
}

function wrap(text, size) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (!line || lineWidth(next, size) <= textWidth) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fit(text) {
  for (let size = 84; size >= 20; size -= 2) {
    const lines = wrap(text, size);
    if (lines.length <= 3 && lines.every((line) => lineWidth(line, size) <= textWidth)) return { size, lines };
  }
  throw new Error(`title does not fit in 3 lines: ${text}`);
}

function card(lines, size) {
  return {
    type: "div",
    props: {
      style: {
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        background: paper,
        fontFamily: "Newsreader",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "20px", padding: `${padTop}px ${padX}px 0` },
            children: [
              { type: "div", props: { style: { width: `${markW}px`, height: `${markH}px`, display: "flex" } } },
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "Manrope",
                    fontSize: 40,
                    fontWeight: 600,
                    color: ink,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  },
                  children: "BetterPasig",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              padding: `12px ${padX}px 0`,
            },
            children: lines.map((line) => ({
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontFamily: "Newsreader",
                  fontWeight: 500,
                  fontSize: size,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: ink,
                  whiteSpace: "nowrap",
                },
                children: line,
              },
            })),
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              padding: `0 ${padX}px 32px`,
              fontFamily: "Manrope",
              fontWeight: 500,
              fontSize: 24,
              color: muted,
            },
            children: "betterpasig.org",
          },
        },
        { type: "div", props: { style: { display: "flex", height: "12px", width: `${width}px`, background: blue } } },
      ],
    },
  };
}

const rendered = new Map();

function pngFor(title) {
  let pending = rendered.get(title);
  if (!pending) {
    pending = (async () => {
      const { size, lines } = fit(title);
      const svg = await satori(card(lines, size), { width, height, fonts });
      return sharp(Buffer.from(svg))
        .composite([{ input: mark, left: padX, top: padTop }])
        .png({ compressionLevel: 9, palette: true, effort: 5, quality: 90, colors: 16, dither: 0 })
        .toBuffer();
    })();
    rendered.set(title, pending);
  }
  return pending;
}

function pages(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) pages(path, found);
    else if (entry.name === "index.html") found.push(path);
  }
  return found;
}

function meta(html, file) {
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1];
  const tag = html.match(/<meta\b[^>]*\bproperty="og:title"[^>]*>/i)?.[0];
  const content = tag?.match(/\bcontent="([^"]*)"/)?.[1];
  if (!lang || content == null) throw new Error(`${file}: missing html lang or og:title`);
  const title = decode(content);
  const pageTitle = title.endsWith(ogTitleSuffix) ? title.slice(0, -ogTitleSuffix.length) : title;
  if (!pageTitle) throw new Error(`${file}: empty og:title`);
  return { lang, pageTitle };
}

const started = performance.now();
const jobs = pages(dist)
  .map((file) => relative(dist, file).split("\\").join("/"))
  .filter((rel) => !rel.split("/").includes("404"))
  .map((rel) => {
    const html = readFileSync(join(dist, rel), "utf8");
    const { pageTitle } = meta(html, rel);
    const dir = rel.replace(/\/index\.html$/, "").replace(/^index\.html$/, "");
    const pathname = dir ? `/${dir}/` : "/";
    const image = ogImagePath(pathname);
    if (image === "/og.png") return null;
    return { pageTitle, out: join(dist, image.slice(1)) };
  })
  .filter(Boolean);

const limit = Math.max(1, Math.min(8, availableParallelism()));
let cursor = 0;
let minBytes = Infinity;
let maxBytes = 0;

async function worker() {
  for (;;) {
    const index = cursor++;
    if (index >= jobs.length) return;
    const job = jobs[index];
    const png = await pngFor(job.pageTitle);
    mkdirSync(dirname(job.out), { recursive: true });
    writeFileSync(job.out, png);
    if (png.length < minBytes) minBytes = png.length;
    if (png.length > maxBytes) maxBytes = png.length;
  }
}

await Promise.all(Array.from({ length: Math.min(limit, jobs.length) }, () => worker()));

const seconds = ((performance.now() - started) / 1000).toFixed(1);
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
console.log(
  `${jobs.length} og images in ${seconds}s (${rendered.size} rendered, ${kb(minBytes)}–${kb(maxBytes)}, ${limit} workers)`,
);
