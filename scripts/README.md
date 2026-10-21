# Scripts

| Script | What it does |
| --- | --- |
| `geo/outline.py` | Unions the 30 PSA barangay polygons (`design/map/pasig-brgy.json`) into the Pasig outline and smooths it |
| `geo/marks.py` | Projects the outline into the 48-unit logo box and writes `design/map/marks.json` (`smooth`, `detail`, `pieces`) |
| `design_assets.py` | Writes `design/tokens/tokens.{json,css}` and the logo SVGs in `design/logo/` from `marks.json` |
| `count_verify.py` | Lists every value still marked `verify: true` in `data/` |

Run Python with `pip install shapely` for the geometry scripts.

```bash
python3 scripts/design_assets.py . design/map/marks.json
python3 scripts/count_verify.py data
```
