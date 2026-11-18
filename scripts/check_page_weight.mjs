// Fails when any built page needs more than 300 KB on first load (roadmap guardrail).
// Counts gzip size of the HTML and its local CSS and JS (with JS imports), plus the woff2 fonts the CSS references.
// Run after `bun run build`: bun scripts/check_page_weight.mjs [dist]
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const dist = resolve(process.argv[2] ?? "dist");
const budget = 300 * 1024;
const sizes = new Map();

function transferSize(file) {
  if (!sizes.has(file)) {
    const body = readFileSync(file);
    sizes.set(file, file.endsWith(".woff2") ? body.length : gzipSync(body, { level: 9 }).length);
  }
  return sizes.get(file);
}

function local(url, from) {
  if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith("data:")) return null;
  const path = url.split(/[?#]/)[0];
  return path.startsWith("/") ? join(dist, path) : resolve(dirname(from), path);
}

function assets(html, file) {
  const found = new Set();
  const add = (url, from) => {
    const path = local(url, from);
    if (!path || found.has(path)) return;
    found.add(path);
    const text = readFileSync(path, "utf8");
    if (path.endsWith(".css")) {
      for (const [, font] of text.matchAll(/url\(([^)]+\.woff2)\)/g)) add(font, path);
    } else if (path.endsWith(".js")) {
      for (const [, dep] of text.matchAll(/(?:import|from)\s*["']([^"']+\.js)["']/g)) add(dep, path);
    }
  };
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    if (/rel="?(?:stylesheet|modulepreload)/.test(tag)) add(tag.match(/href="?([^"\s>]+)/)[1], file);
  }
  for (const [, src] of html.matchAll(/<script\b[^>]*\bsrc="?([^"\s>]+)/g)) add(src, file);
  for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="?([^"\s>]+)/g)) add(src, file);
  return found;
}

function* pages(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const results = [...pages(dist)].map((file) => {
  const html = readFileSync(file, "utf8");
  const bytes = [...assets(html, file)].reduce((sum, path) => sum + transferSize(path), transferSize(file));
  return { page: `/${relative(dist, file)}`, bytes };
});
results.sort((a, b) => b.bytes - a.bytes);

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
for (const { page, bytes } of results.slice(0, 5)) console.log(`${kb(bytes).padStart(9)}  ${page}`);
const over = results.filter((row) => row.bytes > budget);
if (over.length) {
  console.error(`\n${over.length} page(s) over the ${kb(budget)} first-load budget:`);
  for (const { page, bytes } of over) console.error(`  ${kb(bytes)}  ${page}`);
  process.exit(1);
}
console.log(`\nAll ${results.length} pages are under ${kb(budget)} on first load.`);
