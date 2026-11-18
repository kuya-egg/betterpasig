# Scripts

| Script | What it does |
| --- | --- |
| `geo/outline.py` | Unions the 30 PSA barangay polygons (`design/map/pasig-brgy.json`) into the Pasig outline and smooths it |
| `geo/marks.py` | Projects the outline into the 48-unit logo box and writes `design/map/marks.json` (`smooth`, `detail`, `pieces`) |
| `design_assets.py` | Writes `design/tokens/tokens.{json,css}` and the logo SVGs in `design/logo/` from `marks.json` |
| `web_icons.mjs` | Renders `public/favicon.ico`, `favicon.svg`, the PNG app icons and the `og.png` share image from `marks.json` (`bun scripts/web_icons.mjs`) |
| `count_verify.py` | Lists every value still marked `verify: true` in `data/` |
| `count_verify.mjs` | Counts the same review flags using Bun when Python is unavailable |
| `scrape_pasig_sources.ps1` | Retrieves public official source pages and preserves previous retrieval history |
| `verify_pasig_research.mjs` | Checks saved source dates, hashes, image evidence and research references |
| `verify_recent_contracts.mjs` | Validates the recent data contracts and rejects deliberately invalid mutations |
| `verify_freshness.mjs` | Checks Manila calendar boundaries, source age, event dates and exact cutoffs |
| `verify_pasig_browser.mjs` | Checks the built site using Windows Edge, including routes, search and expiry |

Run Python with `pip install shapely` for the geometry scripts.

```bash
python3 scripts/design_assets.py . design/map/marks.json
python3 scripts/count_verify.py data
```

For the sourced Pasig data slice, run:

```powershell
bun scripts/verify_pasig_research.mjs
bun scripts/verify_recent_contracts.mjs
bun scripts/verify_freshness.mjs
bun run check
bun run build
bun scripts/verify_pasig_browser.mjs
bun scripts/count_verify.mjs data
```

The browser check uses `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` and writes its report and screenshots under `research/implementation-audit/`. See [the data guide](../data/README.md) for source retrieval, field evidence and review rules, and [the research index](../research/README.md) for archived implementation records.
