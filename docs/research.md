# Research notes

A summary of the research behind BetterPasig (October 2026). Detailed, sourced facts live in `data/*.json`; this file records the reasoning.

## The movement

- **BetterGov.ph** is a volunteer civic-tech movement that rebuilds hard-to-use government information into clear, fast, open-source sites.
- **BetterLGU** ([lgu.bettergov.ph](https://lgu.bettergov.ph/)) is its directory of city and municipal sites, named `better<city>.org` (for example [betterlaspinas.org](https://betterlaspinas.org/)). The directory already lists a Pasig project in progress (maintainer @ericvelasco-dev), so we reach out before launch to avoid two competing sites.
- Common pattern across Better sites: emergency hotlines at the top, services directory, officials, barangay list, transparency links, a clear "not an official government website" disclaimer, and open-source code on GitHub.

## What makes Pasig different

Pasig is already transparent: a local FOI ordinance (Ordinance No. 37, s. 2018), the Ugnayan sa Pasig transparency office, livestreamed procurement, and Citizen's Charters for 31 offices published at `assets.pasigcity.gov.ph`. So BetterPasig is a **guide and tracker**, not a watchdog. Its job is to make open-but-scattered records easy to find and follow.

## What residents need first (MVP)

1. Emergency numbers, verified and dated.
2. Every city service: office, fee, processing time, requirements, steps, with a source (173 from the charters).
3. My barangay: hall, contacts, officials.
4. Who runs the city: officials and how to reach their offices.
5. Benefits and opportunities: senior pension (indigent seniors 65+ with no other pension), solo parent, scholarships, AICS, job fairs.
6. Following the city: bids log and the New City Hall project.

Deferred to 2027 because they need slow, careful extraction: budget explorer, COA audit summaries, ordinance search, flood maps.

## Design research

- Benchmarks people liked: calm product sites (Apple, Stripe) and good government services (GOV.UK, Singapore's LifeSG) for clarity, not for looks.
- What reads as "AI-generated" and is banned here: gradient heroes, icon-in-a-rounded-square card grids, pill badges everywhere, many accent colors, vague marketing copy.
- What works for all ages: 17px+ body, high contrast, tables for comparing, one clear search, large tap targets, Filipino first.
- Identity: the real outline of Pasig (from PSA boundaries) as the logo, and the 30-barangay map as the signature element. One accent, Pasig Blue `#1A47A8`.

## Tech choice

**Astro** over Nuxt/Next: the site is content, not an app. Astro ships zero JS by default, has typed content collections for the JSON data, and adds interactivity only where needed (search, map). Add Tailwind (or plain CSS with our tokens), **Pagefind** for static search, and **Cloudflare Pages** for free hosting with preview deploys. Yearly cost is about the domain fee.

**Search uses Pagefind** (decided 2026-11-18 for issue #6), replacing the hand-built inline JSON index. `bun run build` runs `astro build && pagefind --site dist`; Pagefind indexes only `<main>` of detail pages (`data-pagefind-body` in `src/layouts/Site.astro`), one index per `<html lang>`, and loads in the browser only when the search box is first used. Regional pages are indexed under their own language code; the indexed text is Filipino. Freshness stays in our code: `src/pages/notice-dates.json.ts` supplies dates so an expired notice is sent to the archive, and `src/lib/search-synonyms.ts` holds the everyday-Filipino synonym pairs (Pagefind has no synonym feature).

## Data sources

- Pasig Citizen's Charters 2025 (`assets.pasigcity.gov.ph`) for services.
- PSA PSGC barangay boundaries via [faeldon/philippines-json-maps](https://github.com/faeldon/philippines-json-maps) (MIT) for the map and logo.
- COMELEC results and national news (Philstar, Inquirer, Rappler, Manila Bulletin, PNA) for officials.
- `pasigcity.gov.ph` blocks automated readers, so volunteers check its pages by hand and we request data through eFOI.
