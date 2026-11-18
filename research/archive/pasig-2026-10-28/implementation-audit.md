# Implementation audit — 2026-10-29

Archived implementation record. The original audit describes the state before commits; the remaining factual-review and release gates remain documented below.

Scope: `implementation-plan.md`, its 12 work-order rows and 20 acceptance scenarios. Branch: `feat/pasig-sourced-places`. Changes are local and uncommitted. Existing concurrent UI and dependency edits are retained.

## Result

The application code and local automated checks pass. The full plan is **not ready to merge or publish**: an independent maintainer has not reviewed the facts, and the required private FMD guide is unavailable. No review, generated-document workflow, PR, merge, or deployment is claimed complete.

## Corrections made during this audit

- Replaced the shallow source checks with typed record/schedule/contact schemas and field-evidence validation. Invalid dates, future publications, unsupported coordinates, inconsistent claim values, missing citations, unknown source locators, duplicate IDs and broken relationships fail validation.
- Created the planned `data/sources.json` registry with publication/retrieval dates, nullable independent-review timestamps, review status, method, saved evidence paths and reviewed locators. Kept compatibility display fields alongside structured facts.
- Added place kinds/parents, update kinds/summaries, opportunity kinds and eligibility translations, and explicit service-to-update IDs. Removed the unsupported legacy RPT fee value; the sourced 2027 offer remains separate.
- Centralized browser date handling: expired feed membership is removed; archive records are present in static output and revealed when eligible; event status changes at Manila midnight; source warnings and map counts update on load, midnight and tab visibility.
- Made search evaluate dates when a query runs and send expired results to the localized archive.
- Corrected the Revolving Tower `/barangay/null/` link and a broken 404 language link.
- Kept BPLD and RPT schedules separate on the same building page; retained market hours separately. Phone extensions are displayed separately from the trunk telephone link.
- Replaced the CaSpay registration action with the official announcement and organizer-confirmation wording. No live form availability or capacity is claimed.
- Added a Bun review-flag counter for this Windows environment. Added source-retrieval history and last-successful timestamps to the scraper; its PowerShell syntax passes. Its new failure/history branch has not been exercised against a failing live source.

## Work-order accounting

| Plan row | Status | Evidence or remaining requirement |
|---|---|---|
| 1. Source evidence | Documentary checking and integrity checks complete; independent review pending | 13 saved pages; 11 dated articles; attachment hashes and references checked by `verify_pasig_research.mjs` |
| 2. FMD change documents | Blocked | `D:/PROJECTS/FMD/AGENTS.md` absent; authorized private guide unavailable. Root `AGENTS.md` forbids editing generated `docs/` without it. |
| 3. Source registry | Implemented | `data/sources.json`, 11 sources; metadata and locator validation |
| 4. Places | Implemented | 12 records; null unknowns, parents, kinds and field evidence; six barangays represented in the research edition |
| 5. Notices/opportunities/history | Implemented | Four updates, one opportunity, three historical records; separate kinds and statuses |
| 6. Legacy service correction | Implemented | RPT fee null; no December 31 promotion; three service records reference the new records |
| 7. Contracts/references | Implemented and tested | `verify_recent_contracts.mjs`: valid data, 14 rejected mutations, four semantic assertions |
| 8. Calendar/expiry | Implemented and tested | `verify_freshness.mjs`: 19 assertions; Edge clock tests across Manila midnight |
| 9. Source notes and languages | Implemented; bounded visual check complete | Both languages exercised; documentary review distinguished from independent review and phone verification |
| 10. Routes | Implemented and tested | 12 place pages and 30 barangay pages per language, plus four weekly/archive routes; 439 total pages |
| 11. Integration | Implemented and tested | Home/map/search/service/weekly/archive integration; alert expiry uses Manila dates; current and archived browser states checked |
| 12. Contributor instructions | Data instructions complete; generated docs blocked | `data/README.md`; FMD documentation reconciliation still required |

## Acceptance-case accounting

| Case | Result and evidence |
|---|---|
| 1–3. Inclusive window, Manila midnight, retrieval does not refresh publication | PASS — deterministic calendar assertions |
| 4. Missing publication evidence | PASS — required source publication date/schema; absent dates cannot be fresh |
| 5. Navigation/Other News dates | Documentary inspection — isolated article snapshots; expected article dates match. Not a new adversarial HTML parser test. |
| 6. Exact online cutoff | PASS — before/at cutoff assertions; rendered notice has no Q4 online action |
| 7. Conditional November 3 | PASS — condition retained, never promoted to confirmed. Follow-up search found no qualifying newer confirmation. |
| 8. Exclusive RPT deadline and separate bulk date | PASS — December 28 and December 10 values asserted; wording remains “before”; exact timestamp null |
| 9–10. Separate schedules | PASS — explicit BPLD child desks and RPT rows; market hours remain on the market record |
| 11. Null fee versus zero | PASS — legacy RPT fee null; generic veterinary fee null; event fee zero, rendered as free for that event |
| 12. CaSpay conditions, unknown capacity and date-only expiry | PASS — structured conditions retained; both languages checked in Edge across October 30/31 midnight |
| 13. Historical parking/blood notices | PASS — historical types and dated copy; neither is asserted to describe current status or prove an event occurred |
| 14. People versus applications | PASS — 1,067 jobseekers and 1,753 applications remain separate in outcome copy |
| 15. Invalid provenance/references/coordinates | PASS — rejected mutation tests and build-time validation |
| 16. Phone scope | PASS — assistance contact remains outside emergency data; no call-verified flags set; extension separated |
| 17. Review statuses | PASS — all new records retain `verify: true`; independent-review timestamps null |
| 18. Narrow correction provenance | Implemented — each fact and source retains its own evidence/effective/review fields. A failed scraper attempt retains the last successful timestamp; live failure exercise remains unperformed. |
| 19. Search destinations and safe text | PASS — keyboard search in both languages, expired search archive destinations, browser has no runtime errors; rendering uses textContent/highlight text nodes |
| 20. Load/boundary/visibility/no-JS | PASS for automated load and midnight tests; handlers share the same refresh function for visibility. No-JS page shows dated official-source action without a live-registration claim. |

## Actual checks

- `bun run check`: zero errors, warnings or hints.
- `bun run build`: 439 static pages.
- `bun scripts/verify_recent_contracts.mjs`: PASS.
- `bun scripts/verify_freshness.mjs`: PASS, 19 assertions.
- `bun scripts/verify_pasig_research.mjs`: PASS, 13 snapshots / 11 dated articles.
- `bun scripts/verify_pasig_browser.mjs`: PASS. Checks all 439 pages for one h1 and visible disclaimer, 35,665 internal links, localized keyboard search, mobile/desktop horizontal overflow, event midnight expiry, stale feeds, archive visibility and no-JS wording. Results and four screenshots: `research/implementation-audit/`.
- Local gzip first-load measurement in Edge: approximately 129 KB, under the 300 KB goal. This measures the local test server, not a deployed Cloudflare response.
- `bun scripts/count_verify.mjs data`: 539 review flags across the whole dataset. This is a count, not proof of factual review.
- `python scripts/count_verify.py data`: cannot run; Python is not installed and Windows exposes the Store alias. The Bun equivalent runs successfully.
- `git diff --check`: no whitespace errors. Existing Windows line-ending warnings remain.

Browser checks are bounded implementation checks, not a full WCAG certification or the repository's 30-resident usability study.

## Remaining gates — exact, not complete

1. **Independent factual review:** another maintainer must compare promoted fields with the saved articles/images before merge. No phone call, site visit, form submission or authenticated payment was performed.
2. **FMD documents:** obtain the authorized private v3.0.1 guide, perform its proposal/spec/tasks/reconciliation workflow and materialize only through its scripts. No generated `docs/` was hand-edited.
3. **Publication-time refresh:** re-fetch affected official sources in a preserved evidence edition and check for superseding notices before publication. Current research is the October 28 edition; S11, published September 29, is correctly stale on October 29. This is not exhaustive citywide/latest-feed coverage.
4. **Release operations:** independent review, PR to `dev`, merge, deployment and rollback rehearsal are not performed in this local task. The 30-resident usability study remains a release requirement.

Holiday follow-up: the city announcement still states November 3 conditionally. The national 2026 holiday announcement found in the follow-up was published in 2025, outside the requested 30-day research window, so it was not promoted into the recent product slice. References: https://pco.gov.ph/news_releases/pbbm-issues-proclamation-declaring-regular-holidays-special-non-working-days-for-2026/ and https://pasigcity.gov.ph/news-and-releases/4th-quarter-assessment-and-payment-of-business-taxes-and-fees-september-27-2026-941 . The latter is also outside the edition window; it does not supersede the October 4 source.
