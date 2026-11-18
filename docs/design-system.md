# BetterPasig design system

Information first. Calm, modern, readable by a lola on a budget phone and a student on a laptop. It should not look like a government portal, and it should not look like an AI template.

Source of truth for values: [`design/tokens/tokens.json`](../design/tokens/tokens.json) and [`design/tokens/tokens.css`](../design/tokens/tokens.css). Working reference: [`prototype/index.html`](../prototype/index.html).

## 2026 redesign (Kit layout)

Every page renders through `src/layouts/Kit.astro`; `Base.astro`, Tailwind and Geist on the web were removed in November 2026. Colors do not change: `src/styles/kit-site.css` maps the table below onto the kit's tokens, light and dark. Reference pages (services, barangays, directories) use `section section--flow` so they grow with their content.

- **Kit**: plain CSS and ES modules in `public/kit/` (design-taste-frontend): `system.css/js` (sections, buttons, nav, action bar), `layout/` (split hero, float card), `motion/` (hero entrance, hover), `moments/` (photo chapters, word highlight) and `ui/` (the checklist fragment). Copy kit files in; do not edit them. Site-specific styles go in `kit-site.css` or the component's `<style>`.
- **Type**: Manrope (variable, self-hosted from `@fontsource-variable/manrope`, no Google Fonts).
- **Page attributes**: `data-type="service" data-radius="soft" data-buttons="tonal"`. One primary button (verb + object, "Hanapin ang serbisyo") and one secondary.
- **Sections**: each is one or two screens tall (`--h`); on phones (`--hm`) a section may grow to its content. Light sections alternate with `ground-surface`.
- **Home page order**: split hero (search, Manggahan Floodway photo, emergency float card) → life doors (`data/life-events.json`) → most used services with a requirements checklist → barangay map → places to visit (photo chapters, `data/pasyalan.json`) → new in Pasig with a numbered locator map → where the facts come from (word highlight) → emergency numbers → closing call and footer.
- **Photographs**: Wikimedia Commons only, registered in `data/photos.json`, served by `astro:assets` as AVIF/WebP. The footer has one credits line linking `/larawan/`; no captions on images.
- **Motion**: hero entrance once, the two scroll moments, hover and press states, and cross-document view transitions (`src/styles/shared.css`). All off under `prefers-reduced-motion`. No scroll reveals.

## Principles

1. **Information before decoration.** Emergency numbers, search and the most-used services are visible without scrolling.
2. **One accent.** Pasig Blue is the only brand color. Red means emergency, amber means "Sinusuri pa". Nothing else gets color.
3. **No gradients, no glow, no icon-in-a-square.** Structure comes from type, spacing and 1px hairlines.
4. **Tables and lists over cards.** People compare fees and times; rows make that easy.
5. **Motion explains, never decorates.** Short (140–240ms), one easing curve, and off under `prefers-reduced-motion`.
6. **Every fact shows its source and checked date.**

## Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#FFFFFF` | `#0F1216` | Page |
| `--ink` | `#16181D` | `#ECEEF2` | Text, primary buttons, table rules |
| `--muted` | `#586070` | `#A2A9B6` | Secondary text (passes AA on bg) |
| `--line` | `#E2E5EB` | `#272C35` | Hairlines |
| `--subtle` | `#F4F6F9` | `#161A20` | Quiet fills (search hints, chips) |
| `--blue` | `#1A47A8` | `#86A6F4` | Pasig Blue: links, logo, map, focus ring |
| `--pale` | `#E6ECF8` | `#1E2633` | Map base fill, selected rows |
| `--hover` | `#C7D5F4` | `#2C3A55` | Map hover |
| `--mark-bg` | `#DCE5F8` | `#24314C` | Search highlight |
| `--red` / `--red-bg` | `#B42318` / `#FEF3F2` | `#F97066` / `#2B1513` | Emergency only |
| `--amber` | `#8A5A00` | `#E3B35C` | "Sinusuri pa" (unverified) labels only |

## Type

Manrope (variable, self-hosted), fallback system-ui. Base 17px for older readers. The table below is the original Geist scale, kept for the logo and print files; on the site the kit's type scale applies (`--t-label`, `--t-small`, `--t-body`, `--t-card`, display sizes from `public/kit/system.css`).

| Role | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Display (hero h1) | 52px (34px mobile) | 700 | -0.04em |
| Section h2 | 30px | 700 | -0.03em |
| h3 / row title | 19px | 600 | -0.01em |
| Body | 17px / 1.55 | 400 | 0 |
| Small | 15px | 400–500 | 0 |
| Caption, table head | 14px | 500 | 0 |
| Micro (tags, verify) | 13px | 600 | 0 |

Use `font-variant-numeric: tabular-nums` (`.num`) for fees, phone numbers and times.

## Layout

- Max width 1200px, 16px side gutter (respects safe-area insets).
- 8px spacing grid.
- Radii: 4px (tags, focus), 6px (chips), 8px (inputs), 10px (search), 12px (floating menus).
- Shadows only on floating layers (search results, tooltip, toast).

## Components

- **Header**: lockup + nav + language. Sticky; gains a hairline shadow after scrolling.
- **Emergency strip**: red label, Pasig Hotline (02) 8643-0000 big, other numbers inline, copy buttons. Always first.
- **Search**: 2px ink border, black button "Hanapin". Results dropdown with highlight, count and arrow-key navigation. "Popular" quick buttons below.
- **Barangay map**: 30 real PSA boundaries. Pale fill, blue on hover/select, white 1.5px borders. Selecting fills the info panel (hall, phones, officials) and remembers the choice.
- **Featured table**: service, office, fee, time. Whole row clickable. Stacks to two lines on mobile.
- **Category list**: heading with count; links in ink with a drawn underline on hover (no underline wall).
- **Officials list**: name, role, contact. Same treatment for everyone (non-partisan rule).
- **Verify label**: amber 13px text "Sinusuri pa" next to any value with `verify: true`.
- **Source line**: muted 14px "Pinagmulan: … · Sinuri: Okt 2026".
- **Toast**: bottom center, ink background, 2s.

## Logo

The mark is the real outline of Pasig, unioned from the 30 PSA barangay polygons and smoothed. Files in [`design/logo/`](../design/logo/).

- `mark-blue.svg` on light, `mark-white.svg` on blue or dark, `mark-ink.svg` for one-color print.
- `lockup-horizontal.svg`: mark + "BetterPasig" in Geist 700.
- `app-icon.svg` / `favicon.svg`: white mark on a Pasig Blue rounded square.
- Clear space: the width of the mark's narrowest neck on all sides. Minimum size 16px tall.
- Never use the official city seal, never add a gradient, never rotate or outline the mark.

## Motion

- Ease `cubic-bezier(.2,.7,.2,1)`; fast 140ms (hover, press), mid 240ms (menus, reveal).
- Loader: the 30 barangays fill south to north (about 1.4s), once per session. Skipped under reduced motion.
- Micro-interactions: link underline draws left to right; copy button morphs to a check; table row nudges 2px on hover; map barangay lifts to `--hover`.
- No parallax, no scroll-jacking, no auto-playing carousels.

## Voice

Plain Filipino first, English second. Short sentences. Say who to go to, how long, how much. Never praise or criticize an official.

## Canvases and mockups

- `design/canvases/identity/`: final direction (homepage, logo concepts, loader states, mobile). Open the `.dc.html` files in the Claude design canvas, or read them as HTML.
- `design/canvases/homepage-explorations/`: earlier rounds v1–v5 and theme studies, kept for history.
- `design/screenshots/`: renders of the v7 prototype and video keyframes.
