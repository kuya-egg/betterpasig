# BetterPasig redesign: build handoff (Nov 2026)

Mockups for a full-site redesign. Rebuild them in the real Astro site (`src/layouts/Kit.astro`, `public/kit/`, `src/styles/kit-site.css`). The `.dc.html` files are **design references, not production code**. Read them for layout, spacing, copy and interactions. Do not ship them or their runtime.

Live canvas (owner only): https://claude.ai/artifact/TN8LayD4yen89GtUaaq2Hh

## Before you start

- Follow `AGENTS.md` and `docs/design-system.md`. If this handoff and the design-system doc disagree, update `docs/design-system.md` as part of the change, in its own commit.
- Every fact still comes from `data/*.json` with a source. Copy in the mockups that looks like data (fees, phone numbers, officials, budgets, dates) is **sample text copied from the live site on 2026-11-18**. Render it from JSON. Do not hard-code it.
- `[Square brackets]` mean the value is unknown. Keep it `null` in JSON, and hide the field or show the "Sinusuri pa" badge as the page already does.
- Light mode only for this redesign (the live site is `color-scheme: light only`).

## Pages

| File | Route | Notes |
|---|---|---|
| `Main.dc.html` | `/` | Hero with 3D map, popular services, life situations, benefits band, topics index, places, hotlines |
| `Barangay.dc.html` | `/barangay/` (+ `/barangay/[id]/`) | Big 3D map with a 3D/flat toggle, district filter, detail panel, A–Z list |
| `Serbisyo.dc.html` | `/serbisyo/` | Topic sidebar plus a results list. A search box sits at the top |
| `ServiceDetail.dc.html` | `/serbisyo/[id]/` | Example: Senior Citizen ID. Fact tiles, requirements checklist, numbered steps, "Saan pupunta" aside |
| `Tulong.dc.html` | `/tulong/` (+ `/buhay/[id]/`) | Situation picker plus a step list, then a benefits accordion grouped by audience |
| `Pasyalan.dc.html` | `/pasyalan/` | Category filter, place cards, a sticky mini 3D map that highlights the place's barangay |
| `Hotlines.dc.html` | `/emergency/` | Red hero with the two primary numbers, grouped `tel:`/`sms:` cards |
| `IbaPa.dc.html` | `/ngayong-linggo/`, `/opisyal/`, `/pondo/`, `/tungkol/` | Shown as tabs in the mockup. Build as **four separate pages** sharing the same header style |

The header (red emergency strip plus a white nav) and the footer (navy) are identical on every page. Build each once as a component.

## Tokens

These match the live kit's `:root`. Keep the names the kit already uses.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F8FAFC` | Page background |
| `--bg` | `#FFFFFF` | Cards, header, white sections |
| `--surface` | `#EEF2F6` | Secondary fact tiles, segmented-control track |
| `--ink` | `#172741` | Text, footer background |
| `--muted` | `#515D6B` | Secondary text (passes 4.5:1 on paper and white) |
| `--blue` | `#1A47A8` | Links, primary buttons, selected states, benefits band |
| `--pale` | `#E8EFFA` | Icon circles, map panel, hover rows |
| `--hover` | `#CCD9F7` | Light blue accents on blue backgrounds |
| `--mark-bg` | `#DCE5F8` | Map district 1 fill, avatar circles |
| `--line` | `#CCD6E3` | 1px borders and dividers |
| `--line-strong` | `#8A9BB4` | Search input borders |
| `--red` | `#981D28` | Emergency strip, hotline buttons |
| `--amber` | `#744500` on `#FBF0DC` | "Sinusuri pa" badge |
| map district 2 | `#A9BFEF` | Map district 2 fill |
| map side | `#6E86BC` | 3D extrusion color |

**Type**
- Display: Newsreader 500, already the kit's `--font-display`. Italic `<em>` in blue for the one highlighted word in each H1.
- Text: Manrope, already self-hosted.
- Sizes:
  - H1: `clamp(52px, 6vw, 88px)`, line-height 1.04, letter-spacing −0.02em. The home H1 goes to 96px.
  - H2: `clamp(36px, 4vw, 56px)`.
  - Body: 18px, line-height 1.65. Never go below 14px. Labels are 14px uppercase with 0.12em tracking.

**Shape and motion**
- Shape: cards have a 16px radius and a 1px `--line` border, with no shadow. Big panels (map, benefits band) are 28–32px. Buttons and chips are pills.
- Motion: ease `cubic-bezier(.22,.8,.24,1)`.
  - Card hover: lift 3px, border turns `--blue`, and the arrow slides 5px.
  - Respect `prefers-reduced-motion`, which the kit already does globally.

**Layout**
- Max width is 1280px with 40px side padding.
- Sections are 112px apart on home and 56–96px apart on inner pages.

## The 3D map (the signature piece)

It uses the **same PSGC paths as the current site** (`design/map/pasig-map.json`, viewBox `100 0 360 560`). The effect is CSS only, with no WebGL.

1. **Extrusion.** Put the 30 paths in one `<g class="ext">` and give it 10 chained `drop-shadow(0 1px 0 #6E86BC)` filters. Each filter shadows the previous result, so together they form a solid 10px side wall.
2. **Tilt.** Wrap the SVG in `.tilt { transform: perspective(1600px) rotateX(48deg) rotateZ(-12deg); transform-origin: 50% 55%; transition: transform .9s }`. Flat mode is `transform: none`, so the toggle animates between the two.
3. **Selection.** The selected path gets `fill: var(--blue); transform: translateY(-10px)`. Hover gets `fill: #7F9DE3; translateY(-5px)`. Because the extrusion filter sits on the parent group, a lifted barangay keeps its side wall.
4. **Fills.**
   - District 1: `--mark-bg`.
   - District 2: `#A9BFEF`.
   - Filtered out: `--surface`.
   - On Pasyalan, the darker fill means "has a place".
5. **Accessibility.**
   - Each path sits inside an `<a href="/barangay/[id]/" aria-label="Name">`, so the map works with Tab and Enter.
   - Show a focus stroke in `--ink`.
   - The A–Z list is always on the page as the text alternative. The detail panel is `aria-live="polite"`.
6. Size the hero map at about 420px wide and the map page at about 470px. On phones, render the map flat (no tilt) at full width.

**Islands:** this is the only component that needs client JS. It keeps the selected id, the filter and the 3D/flat mode. Everything else on every page is static HTML, except a few small interactive pieces that also need islands:
- the requirements checklist on the service page (local state, never saved)
- the benefits accordion (use `<details>`/`<summary>`)
- the place filter and the Tulong situation picker. For these two, prefer links to real filtered URLs over JS where you can.

## Check these before shipping

- **District split:** the mockup uses 22 barangays in District 1 and 8 in District 2 (Dela Paz, Manggahan, Maybunga, Pinagbuhatan, Rosario, San Miguel, Santa Lucia, Santolan). This came from memory. Confirm it against a source and store it in `data/` with a citation.
- **Placeholders:** barangay captain, hall address and phone; several offices and benefit amounts; the barangays for Parke ng Pag-asa and East Bank Linear Park.
- **Photos:** the mockups show labelled placeholders. Use the Wikimedia images the site already has.
- **Language toggle:** the nav shows an "English" link. Wire it to the `/en/` mirror.
- **Accessibility:** run axe or Pa11y after the build. All text pairs in the token table were chosen to pass AA.
