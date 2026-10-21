# Prototype (v7)

`index.html` is a single self-contained page that shows the final homepage direction with real data: loader, sticky header, emergency strip with copy buttons, search with highlight and keyboard navigation, the interactive 30-barangay map, featured services table, categories, programs, officials and public funds.

`officials.html` is the officials directory: city officials, the City Council, department heads, and every barangay's officials and contact numbers, with a filter and "Sinusuri pa" labels on anything unconfirmed.

Open either file in a browser; no server needed. These are references for the Astro build, not production code.

## Rebuild after editing data

```bash
python3 prototype/tools/build7.py data prototype/template.html prototype/index.html design/map/pasig-map.json design/map/marks.json
python3 prototype/tools/build_officials.py data prototype/officials.template.html prototype/officials.html design/map/marks.json
```

`tools/shot.py` takes desktop and mobile screenshots with Playwright.
