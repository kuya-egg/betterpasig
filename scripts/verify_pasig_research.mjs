import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

const root = resolve(process.argv[2] ?? 'research/pasig-2026-10-28');
const read = name => JSON.parse(readFileSync(join(root, name), 'utf8').replace(/^\uFEFF/, ''));
const manifest = read('source-manifest.json');
const report = read('retrieval-report.json');
const facts = read('verified-facts.json');
const sources = new Map(report.sources.map(s => [s.id, s]));
const fail = message => { throw new Error(message); };
if (sources.size !== report.sources.length || sources.size !== manifest.sources.length) fail('Source inventory mismatch');
const review = read('verification-review.json');
const reviewedImages = new Set(review.images.filter(i => i.visually_checked).map(i => i.file));
const reviewedArticles = new Set(review.articles.filter(i => i.document_checked).map(i => i.source_id));
let articles = 0;
for (const source of report.sources) {
  if (source.http_status !== 200 || source.error) fail(`${source.id}: retrieval failed`);
  const digest = createHash('sha256').update(readFileSync(join(root, source.html_file))).digest('hex');
  if (digest !== source.sha256) fail(`${source.id}: snapshot hash mismatch`);
  if (source.expected_published) {
    if (!source.publication_matches || source.observed_published !== source.expected_published) fail(`${source.id}: publication date mismatch`);
    if (source.observed_published < manifest.window_start || source.observed_published > manifest.window_end) fail(`${source.id}: outside window`);
    if (!existsSync(join(root, source.article_file))) fail(`${source.id}: missing article`);
    articles++;
  }
}
const placeIds = new Set(facts.places.map(p => p.id));
const barangayIds = new Set(JSON.parse(readFileSync('data/barangays.json', 'utf8')).barangays.map(b => b.id));
const serviceIds = new Set(JSON.parse(readFileSync('data/services.json', 'utf8')).services.map(s => s.id));
const ids = new Set();
function walk(value, path = '') {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) return value.forEach((item, i) => walk(item, `${path}[${i}]`));
  if (value.id && path !== '' && !path.startsWith('.excluded')) {
    if (ids.has(value.id)) fail(`Duplicate record id ${value.id}`);
    ids.add(value.id);
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === 'verify' && child !== true) fail(`${path}: must await independent maintainer review`);
    if (key === 'barangay_id' && child && !barangayIds.has(child)) fail(`${path}: unknown barangay`);
    if (['place_id', 'parent_id'].includes(key) && child && !placeIds.has(child)) fail(`${path}: unknown place`);
    if (key === 'place_ids' && child.some(id => !placeIds.has(id))) fail(`${path}: unknown place`);
    if (key === 'service_id' && child && !serviceIds.has(child)) fail(`${path}: unknown existing service`);
    if (key === 'evidence') {
      const refs = Array.isArray(child) ? child : Object.values(child).flat();
      for (const ref of refs) {
        const [id, kind, image] = ref.split(':');
        const source = sources.get(id);
        if (!source?.publication_matches) fail(`${path}: undated or unknown source ${ref}`);
        if (!reviewedArticles.has(id)) fail(`${path}: article was not document checked`);
        if (kind === 'image' && !existsSync(join(root, 'images', `${id}-${image}.jpeg`))) fail(`${path}: missing image ${ref}`);
        if (kind === 'image' && !reviewedImages.has(`images/${id}-${image}.jpeg`)) fail(`${path}: image was not visually checked`);
      }
      continue;
    }
    walk(child, `${path}.${key}`);
  }
}
walk(facts);
const coverage = read('coverage.json');
if (coverage.barangays.length !== barangayIds.size || new Set(coverage.barangays.map(b => b.barangay_id)).size !== barangayIds.size) fail('Incomplete or duplicate barangay coverage');
for (const row of coverage.barangays) {
  if (!barangayIds.has(row.barangay_id)) fail('Unknown coverage barangay');
  const expected = facts.places.filter(p => p.barangay_id === row.barangay_id).map(p => p.id).sort();
  if (JSON.stringify(expected) !== JSON.stringify([...row.place_ids].sort())) fail(`Incorrect coverage for ${row.barangay_id}`);
}
for (const image of read('image-retrieval-report.json')) {
  if (image.status !== 'downloaded') fail(`Image unavailable: ${image.url}`);
  const digest = createHash('sha256').update(readFileSync(join(root, image.file))).digest('hex');
  if (digest !== image.sha256) fail(`Image hash mismatch: ${image.file}`);
}
console.log(JSON.stringify({http_snapshots: sources.size, dated_articles_in_window: articles, places: facts.places.length, service_updates: facts.service_updates.length, opportunities: facts.opportunities.length, historical_updates: facts.historical_updates.length, result:'PASS', limitation:'Checks evidence integrity and references; does not establish field accuracy, independent review, live availability, or exhaustive latest coverage.'}, null, 2));
