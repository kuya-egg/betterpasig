<p align="center"><img src="design/logo/mark-blue.svg" width="56" alt=""></p>

<h1 align="center">BetterPasig.org</h1>

<p align="center">Bawat serbisyo, benepisyo at opisyal ng Lungsod ng Pasig, malinaw at nasa isang lugar.<br>
Every service, benefit and official of Pasig City, clear and in one place.</p>

<p align="center"><img src="research/city-guide/home-desktop.jpg" width="820" alt="BetterPasig homepage"></p>

BetterPasig is a volunteer-run, non-partisan civic information site for Pasig City, part of the [BetterGov.ph](https://bettergov.ph) / [BetterLGU](https://lgu.bettergov.ph/) movement. Pasig already publishes more than most cities; BetterPasig organizes it so any Pasigueño can find a service, benefit, opportunity or official in under a minute, then sends them to the city's own channels to transact.

> Hindi ito opisyal na website ng Lungsod ng Pasig. For official transactions go to [pasigcity.gov.ph](https://pasigcity.gov.ph).

**Status:** prototype and data ready · Astro site scaffolded · public launch **December 15, 2026**.

## What's in this repo

| Folder | What it holds |
| --- | --- |
| [`docs/`](docs/) | [Roadmap and SMART goals](docs/roadmap.md), [backlog of things to build](docs/backlog.md), [design system](docs/design-system.md), [research notes](docs/research.md) |
| [`data/`](data/) | All site content as JSON: 173 services, hotlines, 30 barangays, officials directory, programs, facilities, transparency links. Every entry has sources. See [data/README.md](data/README.md) |
| [`design/`](design/) | Tokens (CSS + JSON), logo SVGs, Pasig map geometry, design canvases, screenshots |
| [`prototype/`](prototype/) | Working single-file pages: [homepage](prototype/index.html) and [officials directory](prototype/officials.html), plus their build scripts |
| [`video/`](video/) | Launch video (with Filipino voice-over and a silent cut) and the scripts that render it |
| [`scripts/`](scripts/) | Geometry, design-asset and data-check scripts |

## Quick start

The site is [Astro](https://astro.build) with [Bun](https://bun.sh) as the package manager and runner.

```bash
bun install
bun run dev       # http://localhost:4321
bun run build     # static site in dist/
bun run check     # type-check .astro and .ts files
```

Pages live in `src/pages/` (Filipino at `/`, English under `/en/`; interface text in `src/i18n.ts`), read content straight from `data/*.json` (via `src/lib/data.ts`) and render through `src/layouts/Site.astro` with the shared editorial styles in `src/styles/site.css`. Barangay content stays in Filipino on both routes.

### UI components

Shared buttons, badges, inputs, and cards live in `src/components/ui/` and come from the [shadcn/ui registry](https://ui.shadcn.com/docs/installation/astro). Use `bunx shadcn@4.23.0 add <component>` to add another. The registry styles use Tailwind utilities mapped to BetterPasig's color tokens in `src/styles/shadcn.css`.

Astro renders the pages and shared controls to HTML. The search field uses UI SDK for its clear and focus behavior. The installed SDK's React documentation is at `node_modules/@ui-sdk/react/docs/llms.txt`.

### Deploy (Cloudflare Pages)

Connect the repo in Cloudflare Pages with framework preset **Astro**, build command `bun run build`, output directory `dist`. Pages detects `bun.lock` and installs with Bun.

Set the environment variable **`BUN_VERSION=1.4.2`** in the Pages project (Settings → Variables and Secrets, for Production and Preview). The build image's default Bun is too old to read `bun.lock`, and Bun can't be pinned from a file. Node is pinned by `.node-version` (Astro needs 22.23.4+). Security and cache headers are in `public/_headers`. To deploy from a laptop instead: `bun run build && bunx wrangler pages deploy` (reads `wrangler.toml`).

Until launch, `/` is a "ginagawa pa" placeholder with an interactive barangay map and the emergency hotlines.

### Prototype

Open `prototype/index.html` or `prototype/officials.html` in a browser. No server, no install.

After editing anything in `data/`, rebuild the prototype pages:

```bash
python3 prototype/tools/build7.py data prototype/template.html prototype/index.html design/map/pasig-map.json design/map/marks.json
python3 prototype/tools/build_officials.py data prototype/officials.template.html prototype/officials.html design/map/marks.json
python3 scripts/count_verify.py data     # what is still "Sinusuri pa"
```

## Officials directory

[`prototype/officials.html`](prototype/officials.html) lists the city's elected officials (2025–2028), the City Council by district, 20 city offices with heads and phone numbers, and all 30 barangays with punong barangay, SK chair, kagawad and barangay hall numbers. It has search, a district filter and a clickable barangay map.

Data is current to **October 21, 2026**. The barangay officials elected in October 2023 are still in office: RA 12326 (Sept 24, 2026) cancelled the November 2026 barangay election and moved it to November 13, 2028. Barangay names and numbers come from directories, not an official city list, so all of them show **"Sinusuri pa"** until a steward confirms them by phone. That is the first job for barangay stewards (see [backlog](docs/backlog.md)).

## Stack

The public site uses **Astro**, JSON content, **Pagefind**, shadcn/ui, and **Cloudflare Pages**. Astro generates the sitemap during the build. Running cost is about the domain fee.

## How to help

1. **Fix a fact.** Edit the JSON, add the source URL, set `verify` correctly, open a pull request into `dev`.
2. **Be a barangay steward.** Call your barangay hall, confirm the numbers and officials, and update `data/officials-directory.json` with the date you checked.
3. **Build a page.** Pick an unchecked item in [docs/backlog.md](docs/backlog.md).

Rules: every fact needs a source; never guess (use `null`); Filipino first; no party colors, endorsements or political funding; collect no personal data.

## Branches

- `dev`: working branch; open pull requests here.
- `main`: what is live on betterpasig.org (from launch).

## Credits and licenses

- Barangay boundaries: PSA PSGC via [faeldon/philippines-json-maps](https://github.com/faeldon/philippines-json-maps) (MIT). The logo is our own drawing of that outline; we do not use the official city seal.
- Service data: Pasig City Citizen's Charters 2025 (`assets.pasigcity.gov.ph`).
- Typeface: [Newsreader](https://github.com/productiontype/Newsreader) and [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans) (SIL Open Font License), self-hosted. The logo lockup files use Geist (SIL Open Font License).
- Photographs: Wikimedia Commons, each credited with author and licence at `/larawan/` (`data/photos.json`).
- Launch video music and sound effects are synthesized in code; the voice is Microsoft Edge neural TTS (fil-PH-AngeloNeural).
