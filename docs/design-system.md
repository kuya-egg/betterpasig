# BetterPasig design system

Information first. Calm, modern, readable by a lola on a budget phone and a student on a laptop. It should not look like a government portal, and it should not look like an AI template.

Source of truth for values: `src/styles/site.css` (tokens and shared classes). The November 2026 handoff in [`design/canvases/redesign-2026-11/`](../design/canvases/redesign-2026-11/README.md) is the design reference; where this file and the code disagree, the code wins and this file is updated in the same pull request.

## November 2026 redesign (Site layout)

Every page renders through `src/layouts/Site.astro` with `src/styles/site.css` (which imports `shared.css` and the shadcn layer). The site is light only (`color-scheme: only light`). Shared pieces:

- `src/components/site/SiteHeader.astro`: the red emergency strip with the Manila clock, then a sticky white nav (Serbisyo, Tulong, Barangay, Pasyalan, Iba pa), a search shortcut and the language switch.
- `src/components/site/SiteFooter.astro`: navy footer, "Para sa bawat Pasigueño", the same on every page.
- `src/components/site/PageHead.astro`: breadcrumb, uppercase kicker, the H1 (one highlighted word in an `<em>`) and a lead.
- `src/components/map/Map3D.astro`: the 3D barangay map, the signature piece (see below).

## Principles

1. **Information before decoration.** Emergency numbers, search and the most-used services are visible without scrolling.
2. **One accent.** Pasig Blue is the only brand color, with its navy ramp. Red means emergency, amber means "Sinusuri pa". Nothing else gets color.
3. **No gradients, no glow.** Structure comes from type, spacing and 1px hairlines. Icons sit in a pale round well, never a colored square.
4. **Rows to compare, cards to choose.** Fees, times and officials go in ruled rows; doors to a topic or a place are cards.
5. **Motion explains, never decorates.** One easing curve, no looping animation, off under `prefers-reduced-motion`.
6. **Every fact shows its source and checked date.**

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F8FAFC` | Page background |
| `--bg` | `#FFFFFF` | Cards, header, white sections |
| `--surface` | `#EEF2F6` | Quiet panels, filtered-out map shapes |
| `--ink` | `#172741` | Text, footer background |
| `--muted` | `#515D6B` | Secondary text (AA on paper and white) |
| `--blue` | `#1A47A8` | Pasig Blue: links, buttons, the selected barangay, focus ring |
| `--pale` | `#E8EFFA` | Map panels, the benefits band, selected nav, icon wells |
| `--hover` | `#CCD9F7` | Hover fills |
| `--mark-bg` | `#DCE5F8` | Map District 1, search highlight |
| `--line` / `--line-strong` | `#CCD6E3` / `#8A9BB4` | Hairlines, card borders |
| `--red` | `#981D28` | Emergency only (the strip, the hotlines hero) |
| `--amber` on `#FBF0DC` | `#744500` | "Sinusuri pa" badge only |
| Map | `#A9BFEF` District 2, `#6E86BC` side wall, `#7F9DE3` hover | The 3D map |

## Type

Newsreader 500 (roman and italic) for display, Manrope for text, both self-hosted. Weights 400, 500 and 600 only. Nothing under 14px.

| Role | Token | Size | Notes |
| --- | --- | --- | --- |
| Home H1 | `--t-h1-home` | 56–96px | Newsreader 500, line-height 1.04, −0.02em |
| H1 | `--t-h1` | 52–88px | One word in `<em>`: italic, Pasig Blue |
| H2 | `--t-h2` | 36–56px | Newsreader 500 |
| H3 | `--t-h3` | 24–28px | Newsreader 500 |
| Lead | `--t-lead` | 21px | Muted, line-height 1.55 |
| Card title | `--t-card` | 20px | Manrope 600 |
| Body | `--t-body` | 18px / 1.65 | Manrope 400 |
| Meta, buttons | `--t-meta` | 16px | Manrope 500–600 |
| Small, kicker | `--t-small`, `--t-label` | 14px | Kicker: 600, uppercase, 0.12em, blue (`.kicker`) |

Use `.num` (`tabular-nums`) for fees, phone numbers and times. No trailing period on headings, labels, buttons or kickers. No middle-dot separators: use a gap, a line break or a hairline.

## Layout

- Max width 1280px (`.wrap`), side padding `clamp(20px, 4vw, 40px)`.
- 4px spacing grid: `--s-1` to `--s-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 112px.
- Sections 112px apart on home (`.section--home`), 56–96px on inner pages (`.section`).
- Radii: 8px small, 12px inputs and nav links, 16px cards, 28px big panels (`--r-panel`). Buttons and chips are pills; nothing else is.
- Shadows only on floating layers (the map's selection card, menus, search results).

## Components

- **Emergency strip**: Pasig DRRMO and 911 as tel: links, "Lahat ng hotline", the Manila clock. Always first.
- **Nav**: links are 12px-radius blocks; the current section is blue on pale.
- **Buttons**: `.pill--primary` (blue), `.pill--secondary` (white, line border). One primary per view, verb + object.
- **Chips**: `.chip`, 44px tall; selected = blue fill with `aria-current` or `aria-pressed="true"`.
- **Linked card** (`.cd`): white, 1px line, 16px radius. Hover changes the border to blue and the background to `#F5F8FE`; the `.ar` arrow slides 4px. Cards never lift.
- **Linked row** (`.row`): ruled list item; hover is pale.
- **3D barangay map** (`Map3D.astro`): the 30 PSA PSGC shapes from `design/map/pasig-map.json`, extruded with ten chained 1px drop-shadows and tilted with `perspective(1600px) rotateX(48deg) rotateZ(-12deg)`. District 1 `--mark-bg`, District 2 `#A9BFEF`; hover lifts 5px, the selected barangay lifts 10px in Pasig blue. Every shape is a link to its barangay page, so it works with the keyboard and without script; the A–Z list on the page is the text alternative. Flat and full width on phones. Sizes: about 420px (home), 470px (`/barangay/`), 260px (side maps).
- **Officials**: name, role, contact. Same treatment for everyone (non-partisan rule).
- **Verify badge**: "Sinusuri pa", amber on `#FBF0DC`, 14px, next to any value with `verify: true`.
- **Source line**: muted 14px source link and checked date.
- **Footer**: navy, white text, the same on every page.

## Photographs

Wikimedia Commons only, registered in `data/photos.json`, served by `astro:assets` as AVIF/WebP. No captions on images; the footer links the credits page `/larawan/`.

## Logo

The mark is the real outline of Pasig, unioned from the 30 PSA barangay polygons and smoothed. Files in [`design/logo/`](../design/logo/).

- `mark-blue.svg` on light, `mark-white.svg` on blue or dark, `mark-ink.svg` for one-color print.
- `lockup-horizontal.svg`: mark + "BetterPasig" in Geist 700.
- `app-icon.svg` / `favicon.svg`: white mark on a Pasig Blue rounded square.
- Clear space: the width of the mark's narrowest neck on all sides. Minimum size 16px tall.
- Never use the official city seal, never add a gradient, never rotate or outline the mark.

## Motion

- Ease `cubic-bezier(.22,.8,.24,1)` (`--ease`); fast 150ms (hover, press), mid 240ms (cards, menus). The 3D/flat map switch takes 0.9s.
- Micro-interactions: a card's border turns blue and its arrow slides 4px; a map barangay lifts 5px on hover and 10px when selected; the copy button morphs to a check.
- No looping animation, no scroll reveals, no parallax, no scroll-jacking, no auto-playing carousels. Everything is off under `prefers-reduced-motion`.

## Voice

Plain English and Filipino, English the default. The interface is also in Cebuano, Ilokano, Hiligaynon, Waray, Bikol, and Kapampangan; those pages reuse Filipino content. Short sentences. Say who to go to, how long, how much. Never praise or criticize an official.

## Canvases and mockups

- `design/canvases/redesign-2026-11/`: the November 2026 handoff (`Main`, `Barangay`, `Serbisyo`, `ServiceDetail`, `Tulong`, `Pasyalan`, `Hotlines`, `IbaPa`) and its README. The live site follows it, with the polish pass recorded above (weights to 600, a 4px grid, no middle dots, a pale benefits band).
- `design/canvases/identity/`: the earlier direction (homepage, logo concepts, loader states, mobile). Open the `.dc.html` files in the Claude design canvas, or read them as HTML.
- `design/canvases/homepage-explorations/`: earlier rounds v1–v5 and theme studies, kept for history.
- `design/screenshots/`: renders of the v7 prototype and video keyframes.
