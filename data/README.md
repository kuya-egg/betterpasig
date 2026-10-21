# BetterPasig data

All content on BetterPasig.org comes from the JSON files in `data/`. The site is static: no backend, no database. To change what the site shows, edit a JSON file and open a pull request.

Data retrieved: 2026-10-19.

## Files

| File | What it holds | Shows up on |
|---|---|---|
| `site.json` | Notice text, alerts, which hotlines and services to feature, City Hall location | Homepage |
| `hotlines.json` | Emergency and city phone numbers (`label_fil` / `label_en` are the short names shown on the site), plus `conflicts` still to resolve | Emergency strip, Hotlines page |
| `services.json` | 12 `categories`, 31 `offices`, 173 `services` from the Pasig Citizen's Charters | Services pages, search |
| `programs.json` | Benefits and programs (senior pension, solo parent, scholarships, etc.) | Programs / Tulong page |
| `barangays.json` | All 30 barangays with district, captain, contact | Barangay pages |
| `facilities.json` | Hospitals, evacuation centers, flood notes | Barangay pages, Emergency page |
| `officials.json` | Elected officials 2025–2028, some department heads | Government page |
| `officials-directory.json` | Full directory: city officials, council, department heads, and every barangay's officials and contact numbers | Officials directory page |
| `city.json` | City facts and City Hall contact | Homepage "Pasig at a glance" |
| `transparency.json` | Links to official disclosure portals and key figures | Public funds page |

## Rules for editing

1. **Every entry needs a source.** Put the URL in `sources` (or `source`). Prefer official city documents (`assets.pasigcity.gov.ph`), then national agencies, then reputable news.
2. **Use `verify`.** Set `"verify": true` when a value comes only from a secondary site, conflicts with another source, or might be outdated. The site shows these with a "being checked" label. Set it to `false` only after someone confirms it against an official source or by calling.
3. **Never guess.** If a fee, requirement or number is unknown, use `null`. The site hides empty fields.
4. **Keep IDs stable.** `id` values are used in URLs and in `site.json`. Rename the title, not the ID.
5. **Filipino first.** Fields ending in `_fil` are the default; `_en` is the English toggle.

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
