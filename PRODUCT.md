# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Any Pasigueño, often a senior or someone on a budget phone and slow data, looking for a city office, fee, requirements, hotline, benefit or official. They arrive with one errand ("magbabayad ng amilyar", "anong number ng ambulansya") and want to leave knowing where to go. Secondary: barangay stewards, volunteers who confirm their own barangay's officials and numbers and record the date they checked.

## Product Purpose

BetterPasig puts every City of Pasig service, benefit, official and public figure in one clear, sourced, bilingual place. Success is a resident finding the office, fee and requirements in under 60 seconds (PRD-F3: 8 in 10 of 30 tested residents, 10 of them seniors) and knowing the next step. Payments, applications and complaints go to the city's own channels.

## Positioning

A guide and tracker, not a watchdog. Pasig's records are already open (local FOI ordinance, Ugnayan sa Pasig, livestreamed bidding) but scattered across charter PDFs and Facebook posts; BetterPasig organizes them, shows the source and checked date on every fact, and labels anything unconfirmed "Sinusuri pa". It is not the official website of Pasig City.

## Operating Context

Residents use it on phones, often outdoors or in line at an office, sometimes in an emergency. Content comes from `data/*.json` edited by pull request; Filipino is the default at `/`, English at `/en/`. Routes: home, `/serbisyo` (173 services), `/barangay/[id]` (30), `/lugar/[id]`, `/ngayong-linggo` (+ archive), `/opisyal`, `/emergency`, `/tulong`, `/pondo`, `/tungkol`.

## Capabilities and Constraints

- Astro static site on Cloudflare Pages; Pagefind search; no backend, no accounts, no tracking cookies.
- Every page under 300 KB on first load; no client JS unless the page needs it.
- Every fact keeps its source and checked date; `null` is hidden, never guessed; `verify: true` shows "Sinusuri pa".
- Not-official disclaimer on every page.

## Brand Commitments

- Name: BetterPasig, part of BetterGov.ph.
- Colors stay: Pasig Blue `#1A47A8` as the one accent (links, map, focus), ink and muted neutrals, red only for emergency, amber only for "Sinusuri pa" (`src/styles/site.css`). The public site uses a single light theme.
- The logo mark is the real outline of Pasig from PSA boundaries (`design/logo/`); never the official city seal.
- The 30-barangay map is a signature element.
- City motto "Umaagos ang Pag-asa" (Hope Flows), from `data/city.json`; the city is known for transparency.
- Voice: plain Filipino first, short sentences; say who to go to, how long, how much. Never praise or criticize an official.

## Evidence on Hand

Real sourced data in `data/` (services, hotlines, barangays, officials, programs, transparency figures, city facts, dated notices). No photographs, testimonials, partner logos or usage numbers exist; none may be invented.

## Product Principles

1. Source every claim, with the date it was checked.
2. Point to the city, never replace it.
3. Non-partisan always: officials listed equally.
4. Built for every age: Filipino first, large text, works on a budget phone.
5. Admit mistakes fast; corrections are public.

## Accessibility & Inclusion

WCAG 2.2 AA; 17px+ body; 48px tap targets; seniors are a named test group. Content must stay usable with JavaScript off and under reduced motion.
