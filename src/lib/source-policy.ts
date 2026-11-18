// HARD RULE (docs/state.md D7): every fact cites an official source or a major news outlet. Never Wikipedia, a
// directory, an aggregator or a blog. The build fails when a source URL in data/*.json is not on this list, so an
// unreviewed host can never reach the site. To add a host, add it here in a reviewed pull request.

/** Major news outlets (owner's list, 2026-11-18). */
const NEWS: Record<string, true> = {
  "inquirer.net": true,
  "philstar.com": true,
  "gmanetwork.com": true,
  "rappler.com": true,
  "mb.com.ph": true,
  "abs-cbn.com": true,
  "manilatimes.net": true,
  "tribune.net.ph": true,
  "malaya.com.ph": true,
  "bworldonline.com": true,
  "businessmirror.com.ph": true,
  "verafiles.org": true,
  "dzrh.com.ph": true,
};

/**
 * Official channels that are not on a .gov.ph host: an office's own account or system, or an institution's own site
 * for its own facts. A social account must be the office's own (checked in review, not here).
 */
const OFFICIAL: Record<string, true> = {
  "x.com": true,
  "facebook.com": true,
  "e-bfp.com": true,
  "themedicalcity.com": true,
  "plpasig.edu.ph": true,
};

/** Never a source, whatever the page says. Named so the error says why. */
const BANNED = /(^|\.)(wikipedia\.org|phshirt\.com|barangaydirectory\.com|pasigcityguide\.com|clinicfinderph\.com|healthspace\.ph|yellow-pages\.ph|contactnumbersph\.com|moneymax\.ph|peoplaid\.com|novagov\.ph|spot\.ph|topgear\.com\.ph|chanrobles\.com|batasnatin\.com|thepost\.net\.ph|philstarlife\.com)$/;

const registrable = (host: string, list: Record<string, true>) =>
  Object.keys(list).some((domain) => host === domain || host.endsWith(`.${domain}`));

export function isTrustedSource(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return false;
  }
  if (BANNED.test(host)) return false;
  return /\.gov(\.ph)?$/.test(host) || registrable(host, NEWS) || registrable(host, OFFICIAL);
}

// Keys that hold a citation; everything under them is checked (sources.json's `sources[].url` included). Action
// links such as online.url, registration_url or a map link are not citations.
const CITATION_KEY = /^(sources?|source_url|[a-z_]+_sources?)$/;

/** Throws on the first source URL in `data` that is not trusted, naming the file and the path to it. */
export function assertTrustedSources(file: string, data: unknown): void {
  const bad: string[] = [];
  const walk = (node: unknown, path: string, citation: boolean) => {
    if (typeof node === "string") {
      if (citation && /^https?:\/\//.test(node) && !isTrustedSource(node)) bad.push(`${path}: ${node}`);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`, citation));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) walk(value, `${path}.${key}`, citation || CITATION_KEY.test(key));
    }
  };
  walk(data, file, false);
  if (bad.length) {
    throw new Error(`data/${file}.json cites ${bad.length} untrusted source(s) (docs/state.md D7):\n  ${bad.slice(0, 10).join("\n  ")}`);
  }
}
