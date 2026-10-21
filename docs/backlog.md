# Backlog: mga gagawin

Everything we need to build, in launch order. Each item maps to a goal in [roadmap.md](roadmap.md) (G1–G7). Tick items off in pull requests. Size: S = under a day, M = 1–3 days, L = a week.

## Phase 0 · Setup (by Nov 1, 2026)

- [ ] Contact the BetterLGU Pasig maintainer (@ericvelasco-dev) and agree on one project · S · G7
- [ ] Scaffold Astro + Tailwind, wire `design/tokens/tokens.css`, Geist via `@fontsource` · S
- [ ] Content collections reading `data/*.json` with Zod schemas (fail the build on missing `sources`) · M · G1
- [ ] Cloudflare Pages deploy from `main`, preview deploys from `dev` and PRs · S
- [ ] Cloudflare Web Analytics (cookieless) · S · G6
- [ ] Phone-verify every hotline in `data/hotlines.json`; set `verify: false` and `checked` date · M · G2
- [ ] Request a meeting with Ugnayan sa Pasig and the PIO · S
- [ ] CONTRIBUTING.md, non-partisan pledge, corrections log page · S · G7

## Phase 1 · Build (Nov 2 – Nov 29)

Homepage
- [ ] Port `prototype/index.html` into Astro components: Header, EmergencyStrip, Search, BarangayMap, Notes, FeaturedTable, Categories, Programs, Officials, Funds, Footer · L
- [ ] Loader (fills the 30 barangays once per session, skipped on reduced motion) · S
- [ ] Copy-to-clipboard for hotlines with toast · S

Services (G1)
- [ ] `/serbisyo/[slug]` page per service: office, fee, processing time, requirements, steps, where, source + checked date · L
- [ ] `/serbisyo` index grouped by the 12 categories · M
- [ ] Finish the last fields for all 173 services; zero `null` fees without a note · L

Barangays (G2)
- [ ] `/barangay/[slug]` for all 30: hall address, phones, punong barangay, SK chair, health center, map outline · M
- [ ] Barangay picker remembers choice (localStorage, per viewer only) · S

Officials directory
- [ ] `/opisyal` page from `data/officials-directory.json` (city officials, council, department heads, 30 barangays) · M
- [ ] Equal listing rule: same card size and order rule (alphabetical by barangay / district order) for everyone · S

Search
- [ ] Pagefind index across services, barangays, officials, programs · M
- [ ] Filipino synonym list (amilyar = real property tax, sedula = community tax certificate, etc.) · M
- [ ] Log empty searches (terms only) via a tiny Cloudflare Worker counter, no IP storage · S · G6

Opportunities (G4)
- [ ] `data/opportunities.json` schema: title, kind, who qualifies, deadline, where, source · S
- [ ] `/ngayong-linggo` weekly list page + archive · M

Tracking (G5)
- [ ] `data/bids.json`: project, ABC, winner, contract amount, savings, livestream link · M
- [ ] `/bids` log page with filters · M
- [ ] `/bagong-city-hall` page, updated monthly · S

Quality
- [ ] Every page under 300 KB first load (CI budget check) · S
- [ ] Accessibility pass: contrast, focus, 48px targets, screen reader labels · M · G3
- [ ] English toggle (`_en` fields) · M
- [ ] OG images per page (logo + title, no gradients) · S

## Phase 2 · Launch (Dec 1 – Dec 31)

- [ ] Soft launch Dec 1 to volunteers · S
- [ ] First weekly list Dec 1 · S · G4
- [ ] Resident tests: 30 people, 10 seniors, Dec 1–12; target 80% under 60s · L · G3
- [ ] Fix top issues from testing · M
- [ ] Public launch Dec 15 with `video/betterpasig-launch-voice.mp4` · S
- [ ] Recruit 15 barangay stewards · ongoing · G7

## Later (2027)

- [ ] Budget explorer (annual budget + SAAOB) · L
- [ ] COA audit summaries in plain Filipino · L
- [ ] Ordinance search with one-line summaries · L
- [ ] Flood readiness: evacuation centers, flood map, river levels · L
- [ ] Open data downloads (CSV/JSON of everything) · S
- [ ] Neutral May 2028 election guide (what positions do, how to vote, precinct finder links) · M
- [ ] Steward handbook and handover plan · M

## Data debt (open `verify: true` items)

Run `python3 scripts/count_verify.py data` to list everything still marked "Sinusuri pa".
