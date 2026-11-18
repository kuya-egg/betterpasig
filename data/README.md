# BetterPasig data

All content on BetterPasig.org comes from the JSON files in `data/`. The site is static: no backend, no database. To change what the site shows, edit a JSON file and open a pull request.

Core directory data retrieved: 2026-10-19. Recent official notice edition: 2026-10-28.

The recent edition uses `sources.json` for publisher, publication/retrieval timestamps, review status and saved evidence paths. `places.json`, `service-updates.json` (`updates`) and `opportunities.json` preserve display fields alongside `facts`: each fact has a typed JSON value, field ID, source/locator/method evidence and nullable effective dates. Build-time validation rejects uncited or inconsistent fields, invalid dates/hours, duplicate IDs and broken relationships. `recent_update_ids` links the three affected legacy services. The legacy RPT fee is null pending review; the dated 2027 offer appears separately.

Run `bun scripts/verify_recent_contracts.mjs`, `bun scripts/verify_freshness.mjs`, `bun run check`, `bun run build`, then `bun scripts/verify_pasig_browser.mjs`. The browser check uses the installed Windows Edge executable and saves results/screenshots under `research/implementation-audit/`. `bun scripts/count_verify.mjs data` is the Bun equivalent of the Python review-flag counter; neither counter establishes factual accuracy.

## Files

| File | What it holds | Shows up on |
|---|---|---|
| `site.json` | Notice text, alerts, which hotlines and services to feature, City Hall location | Homepage |
| `hotlines.json` | Emergency and city phone numbers (`label_fil` / `label_en` are the short names shown on the site), plus `conflicts` still to resolve (`text_fil` / `text_en`) | Emergency strip, `/emergency` |
| `services.json` | 12 `categories`, 31 `offices`, 173 `services` from the Pasig Citizen's Charters | Services pages, search |
| `programs.json` | Benefits and programs (senior pension, solo parent, scholarships, etc.): `for_*`, `benefit_*`, `how_*`, `note_*` | `/tulong`, homepage benefits |
| `barangays.json` | All 30 barangays with district, captain, contact | Barangay pages |
| `facilities.json` | Hospitals, evacuation centers, flood notes (`text_*`), list caveat (`notes_*`) | Barangay pages, `/emergency` |
| `officials.json` | Elected officials 2025–2028, some department heads | `/opisyal`, homepage officials |
| `officials-directory.json` | Full directory: terms (`term_*`, `term_note_*`), ex-officio, department heads, and every barangay's officials and contact numbers | `/opisyal` |
| `city.json` | City facts (`value_*`, `note_*`) and City Hall contact | `/tungkol` "Pasig at a glance" |
| `transparency.json` | Links to official disclosure portals (`description_*`) and key figures (`label_*`, `value_*`, `note_*`) | `/pondo`, homepage funds |

## Rules for editing

1. **Every entry needs a source.** Put the URL in `sources` (or `source`). Prefer official city documents (`assets.pasigcity.gov.ph`), then national agencies, then reputable news.
2. **Use `verify`.** Set `"verify": true` when a value comes only from a secondary site, conflicts with another source, or might be outdated. The site shows these with a "being checked" label. Set it to `false` only after someone confirms it against an official source or by calling.
3. **Never guess.** If a fee, requirement or number is unknown, use `null`. The site hides empty fields.
4. **Keep IDs stable.** `id` values are used in URLs and in `site.json`. Rename the title, not the ID.
5. **Filipino first.** Fields ending in `_fil` are the default; `_en` is the English toggle. Prose and values that people read get both (`*_fil` and `*_en`); keep every number, peso amount, date, name and phone number identical between the two. A name, URL or plain number stays a single field.

## Services schema

```json
{
  "id": "pay-real-property-tax",
  "category": "property-tax",
  "title_fil": "Magbayad ng amilyar (real property tax)",
  "title_en": "Pay real property tax",
  "summary_fil": "...",
  "office": "cto",
  "audience": ["residents", "businesses"],
  "online": { "available": true, "url": "https://payments.pasigcity.gov.ph" },
  "requirements": ["..."],
  "fee": "...",
  "processing_time": "...",
  "steps": ["..."],
  "sources": ["https://assets.pasigcity.gov.ph/..."],
  "verify": false
}
```

## Adding an alert

Add an object to `alerts` in `site.json`, following `alert_example`. Always include `source` and `expires`; expired alerts are hidden automatically.

## Known gaps (help wanted)

- Fire (BFP Pasig) landline not confirmed; only a mobile number found.
- Police number 8477-7953 comes from secondary sites.
- Pasig City General Hospital ER line not identified.
- No barangay hall addresses yet; barangay captains and numbers are from directories and need checking.
- Health Department services lack requirements (its charter is 539 pages).
- 2025–2026 city budget totals not sourced.
- Land area conflict: 48.46 km² vs 31.46 km².
- pasigcity.gov.ph pages could not be read automatically; a volunteer should check its Services and Emergency Contacts pages by hand.

## Recent official Pasig notices and places

The October 2026 edition is a separate, dated research slice in `sources.json`, `places.json`, `service-updates.json`, and `opportunities.json`. Each fact retains an `evidence` reference such as `S03:image:1`; resolve `S03` through `sources.json`. The registry records the article publication date and retrieval/check timestamp separately. `verify: true` means a second maintainer review or a phone check is still pending. Do not change it to false based on successful downloading or an HTTP 200 response.

The slice covers September 29 through October 28, 2026. A source is in the current 30-calendar-day section only when its publication date is within the inclusive rolling window for Asia/Manila. Retrieval dates do not refresh publication dates. Unknown addresses, hours, coordinates, venue details, and live availability stay `null`; service-specific schedules must not be applied to a whole building. Past events remain historical and must not carry an active registration prompt.

The snapshots and downloaded attachments in `research/pasig-2026-10-28/` are review evidence, not website assets. Re-run the reviewed scraper from the repository root with:

```powershell
& ([scriptblock]::Create((Get-Content -LiteralPath 'scripts/scrape_pasig_sources.ps1' -Raw -Encoding UTF8)))
```

That command refreshes the saved edition. For a later research cycle, copy the manifest and evidence into a new dated folder before retrieval so old evidence remains reproducible. Run `bun scripts/verify_pasig_research.mjs` after a scrape. It checks hashes, dates and references; it does not replace field-by-field review against the source or an independent maintainer review.

When correcting a published detail, keep the old evidence edition, update only the affected field and its evidence reference, set `verify: true`, and ask another maintainer to review the correction before merge. Never use resident-submitted information as public evidence.
