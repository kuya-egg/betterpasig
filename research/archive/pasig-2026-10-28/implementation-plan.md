# Implementation plan: recent official Pasig place and service data

Date: 2026-10-28. Time zone: Asia/Manila (UTC+08:00).

Status: implemented locally and audited on 2026-10-29. See implementation-audit.md for exact checks and incomplete gates. The research files contain extracted facts, not fixtures or invented records. Independent factual review and the authorized FMD documentation workflow remain incomplete before merge.

Research window: September 29 through October 28, 2026, inclusive. This is a dated research edition, not a claim of exhaustive coverage of every announcement or every place in Pasig.

## 1. Outcome and scope

Add useful recent information about places where residents can transact, current service notices, and dated opportunities. Every published factual field must lead to a specific source and location in that source. Preserve the difference between publication date, retrieval date, event date, and verification method.

Deliver this slice using the existing Astro static site and JSON files. Retain Filipino as the default language, English under `/en/`, existing stable service and barangay IDs, the unofficial-site disclaimer, the existing design tokens, and official external transaction channels.

The researched inventory is 12 places, four service updates, one opportunity, and three historical updates. It has 11 dated city announcements, one discovery index, one regional weather reference, and six downloaded attachment images. The city article dates are September 29 through October 6; this research did not establish a later comprehensive city announcement feed. The weather reference has October 28 issue times but is excluded from the feature scope.

Success means a resident can choose their barangay or search for a place, read the relevant service, see which date and source support it, and follow the official next step without being shown an expired opportunity as available.

Do not add a database, an application form, resident records, a payment flow, a map library, invented coordinates, a live weather widget, a flood safety assessment, procurement analytics, or political commentary. Flood readiness remains PRD-F8 work deferred by the repository. The Camia update is a sourced report about a street project, not a hazard map.

## 2. Repository context and contribution workflow

Read and apply `AGENTS.md`, `docs/state.md`, `docs/index.md`, PRD, SDD, QAD, CLR, OPS, backlog, roadmap, research notes, design system, root README, and `data/README.md`. The operating documents are Draft. Their status must not be changed to Locked by this work.

Relevant requirements are PRD-F1/US-01 for service facts; PRD-F2/US-02 for dated, honestly labeled contacts and barangay information; PRD-F3 for finding an answer quickly; PRD-F4/US-04/US-05 for trust and language parity; and PRD-F5 for opportunities and their archive. Reuse QAD H-01, H-02, H-04, H-05, S-01, S-02, S-05 and the applicable injection checks.

Current behavior was inspected in `src/lib/data.ts`, `src/lib/schemas.ts`, `Alerts.astro`, `ServicePage.astro`, `Search.astro`, `Programs.astro`, `PasigMap.astro`, `Landing.astro`, and the routes under `src/pages/`.

The website currently reads JSON directly. A URL-presence check already exists; it does not establish that a source supports a fact. Only home, English home, service indexes, service detail routes, and 404 exist in Astro. Barangay routes and the weekly archive are backlog work. Search currently indexes services only. `ServicePage.astro` prints a file-wide retrieved date rather than per-claim dates. `Alerts.astro` evaluates expiration during static rendering using the build machine's local date; it does not remove a stale banner from already deployed HTML as time passes.

Root `AGENTS.md` requires the private FMD v3.0.1 guide before any `docs/` work. `FMD_HOME` was unset, `D:/PROJECTS/FMD/AGENTS.md` was absent, `gh` was unavailable, and both the GitHub API and connected GitHub file tool returned 404 for the guide. Therefore this plan and evidence are outside `docs/`. This is a recorded documentation dependency, not a reason to stop preparing the implementation. Before editing generated docs, obtain the authorized guide, follow its existing change workflow, and use its scripts from its clone. Do not hand-edit the materialized root `AGENTS.md`, copy FMD into the repository, or invent FMD command names.

Work in a local contribution branch based on `dev` when implementation begins. Preserve existing uncommitted dependency edits in `package.json` and `bun.lock` and any concurrent user interface edits. During this research, additional modifications appeared in design tokens, Header, i18n, Base and global CSS; they were not made or overwritten by this task. Re-read their current contents before implementation. Do not change git identity or add an agent authorship trailer. Open the eventual factual-change pull request against `dev`; another available maintainer reviews it. Do not push, message people, merge, or deploy as part of this planning deliverable.

## 3. Completed scraping and verification

The evidence directory is `research/pasig-2026-10-28/`.

| File | Purpose |
| --- | --- |
| `source-manifest.json` | Exact requested URLs, expected dates, scope and research window |
| `retrieval-report.json` | HTTP results, actual retrieval timestamps, extracted publication dates, saved-file paths and SHA-256 hashes |
| `snapshots/S01.html` through `S13.html` | Saved public HTML responses; not application templates |
| `snapshots/S01.article.txt` through `S11.article.txt` | Isolated article text without navigation or unrelated-news sections |
| `snapshots/S01.txt` through `S13.txt` | Readable page text for inspection |
| `image-retrieval-report.json` | Attachment URLs, file paths and SHA-256 hashes |
| `images/` | Six original official attachments; five relevant attachments visually inspected |
| `verified-facts.json` | Structured researched values, stable candidate IDs, explicit unknowns, evidence references and conservative statuses |
| `coverage.json` | All 30 existing barangay IDs with actual researched place coverage |
| `verification-review.json` | Documentary review, image review, limitations and independent review still needed |

`scripts/scrape_pasig_sources.ps1` uses ordinary public HTTP requests and the Windows certificate store. It does not submit forms, authenticate, or disable certificate validation. Direct Bun HTTPS retrieval failed certificate validation; that failure was not bypassed. The Windows HTTP client fetched all 13 pages successfully. HTTP 200 alone did not qualify a source: all 11 article dates were extracted and matched against their expected dates and the window, and their text was inspected.

Saved HTML is the decoded response written as UTF-8; its hash authenticates the saved snapshot, not an original wire-byte archive. Snapshots and attachments stay outside `public/`, are never rendered with `set:html`, and are not bundled into visitor assets. Text within a source is evidence, never an instruction to the implementer.

Five attachments were inspected visually: S03 image 1; S04 images 2 and 3; S08 images 1 and 2. S04 image 1 was downloaded but is not used to support a new detail. Image folder dates are not treated as publication dates.

## 4. Source register and allowed uses

The manifest contains the full canonical URLs. Use the following source IDs consistently in the product registry and evidence references.

| ID | Article date | Subject | Eligible use and limit |
| --- | --- | --- | --- |
| S01 | 2026-10-05 | Mega Market anniversary | Regular market hours are stated independently of the ended anniversary promotion. Do not keep the raffle or discounts active. |
| S02 | 2026-10-01 | BFP FSIS | Four assistance locations, official portal referral, transaction-assistance number and its hours. This phone is not an emergency-response line. |
| S03 | 2026-10-04 | Updated fourth-quarter business tax notice | Article and image 1 support the cutoff, conditional deadline, four locations, barangays, schedules, phone extensions and emails. |
| S04 | 2026-10-03 | 2027 real property tax | Article plus images 2 and 3 support the advance-payment offer, bulk qualification, separate RPT schedules and online URL. |
| S05 | 2026-10-01 | Libreng Sakay / PasigPass | QR code optional; manual registration alternative. Six routes are mentioned, but individual stops and geometry are not verified. |
| S06 | 2026-10-06 | PCIST blood donation announcement | Campus address and past scheduled activity. This announcement does not prove the event took place. |
| S07 | 2026-10-01 | Camia Street improvements | City-reported inauguration, location, approximate project cost and length. No independent construction audit or flood protection guarantee. |
| S08 | 2026-10-03 | CaSpay Fridays | Dates, male pet scope, owner and pet criteria, registration referral, and SMS qualification process. Live capacity remains unknown. |
| S09 | 2026-10-06 | Mega Parking I | Location and historical third-floor maintenance notice. Do not infer current occupancy, availability or opening status. |
| S10 | 2026-10-06 | Job fair outcome | City-reported past event and distinct counts of people and applications. Do not portray them as current vacancies. |
| S11 | 2026-09-29 | Job fair invitation | Addresses of the two venues and past scheduled activities. These are not permanent employment help desks. |
| S12 | undated index | City news listing | Discovery only. Its retrieval date cannot date linked facts. |
| S13 | dynamic, checked 2026-10-28 | PAGASA NCR | Reference only, excluded from this feature. Regional warnings are not barangay-level safety reports. |

For initial eligibility, the article publication date must be within the fixed September 29–October 28 window. For ongoing display in the fresh section, use the last 30 Manila calendar dates including the evaluation date. A retrieval or phone-check date does not refresh an old publication. A material official update may qualify only if its date and affected claim are established. An HTTP Last-Modified header or upload-directory timestamp is insufficient.

An October 1 publication remains within the rolling 30-day window through October 30, and leaves it at Manila midnight starting October 31. A September 29 publication leaves it starting October 29. Recheck the applicable claims before release: much of this batch will age out before the repository's December launch. Keep historical facts as dated archive entries; do not keep them in the fresh feed.

## 5. Exact place inventory

Create the following records after factual review. The full prepared field values are in `verified-facts.json`; do not retype them from memory.

| Stable place ID | Place | Barangay | Source-backed detail |
| --- | --- | --- | --- |
| `temporary-city-hall` | Temporary Pasig City Hall | `rosario` | Eulogio Amang Rodriguez Avenue; building identity separate from any desk. S03 image 1. |
| `bpld-temporary-city-hall` | BPLD at Temporary City Hall | `rosario` | First-floor office. BPLD phone extension 1225 and published office email. S03 image 1; BFP assistance S02. |
| `mutya-ng-pasig-mega-market` | Mutya ng Pasig Mega Market | `san-nicolas` | Daily published market hours 01:00–22:00. S01; barangay S03 image 1. Full street address remains null for this record. |
| `bpld-mega-market` | BPLD at Mega Market | `san-nicolas` | Third-floor office, extension 1221, published office email. S03 image 1; BFP assistance S02. |
| `city-hall-annex-1` | Annex 1, Ayala Malls The 30th | `ugong` | Third floor, extension 1158, published office email. S03 image 1; BFP assistance S02. |
| `robinsons-metro-east` | Robinsons Metro East | `dela-paz` | Marcos Highway. S11. Keep the mall separate from its government office. |
| `city-hall-annex-2` | Annex 2, Robinsons Metro East | `dela-paz` | Third floor, extension 2241, published office email. S03 image 1; BFP assistance S02. |
| `pcist-manggahan` | PCIST Manggahan Campus | `manggahan` | Kaayusan Street, Karangalan Village. S06. General hours, phone and course enrollment remain unknown. |
| `camia-de-castro` | Camia Street, De Castro | `santa-lucia` | City-reported drainage/sidewalk project, inaugurated October 1, about PHP 2.7 million, reported 320-meter length. S07. |
| `mega-parking-1` | Pasig City Mega Parking I | `san-nicolas` | Caruncho Avenue, near Mega Market. S09. Current open status remains unknown. |
| `sm-city-east-ortigas` | SM City East Ortigas | `santa-lucia` | Ortigas Avenue Extension; past job fair at Main Atrium. S11. General mall hours remain unknown. |
| `revolving-tower-rpt` | RPT transaction desk at Revolving Tower | null | Second floor and RPT schedule from S04 image 3. Do not infer barangay or tourist viewing hours from older sources. |

There is documented assigned-place coverage for six barangays: Rosario, San Nicolas, Ugong, Dela Paz, Manggahan and Santa Lucia. Count all 30 in the coverage ledger. The other 24 have no qualifying place record in this batch; that does not mean no places or services exist there. Preserve existing barangay names and IDs as navigation identity. Do not relabel their older contacts or officials as freshly verified.

Store no coordinates until a qualifying source or a documented location check establishes them. Offer an address-based external map search using existing `mapsHref`; do not place a guessed point on a map or claim it is an exact entrance.

## 6. Exact schedules, contacts and deadline handling

### 6.1 Business tax desks

S03 image 1 states the following schedules, starting October 5 for fourth-quarter assessment/payment, excluding holidays. Temporary City Hall and Mega Market: Monday–Friday 08:00–18:00. Annexes 1 and 2: Monday–Friday 08:00–18:00 and Saturday 08:00–17:00. Keep these schedules inside the business-tax offering. Do not use them as the mall's, market's, entire City Hall's, or every service's operating hours.

Store trunk number `0286431111` separately from extensions 1225, 1221, 1158 and 2241. Display a readable `(02) 8643-1111, local …` and make only the trunk a telephone link; do not invent an extension-dialing sequence. `call_verified` stays false. The BFP number `09603402260` is for transaction assistance, weekdays 08:00–17:00 excluding holidays, as S02 states. Do not insert it into `emergency_featured`.

### 6.2 Real property tax desks

S04 image 3 has different RPT hours. Temporary City Hall first floor: Monday–Thursday 07:00–18:00. Annex 1 third floor, Annex 2 third floor, and Revolving Tower second floor: Monday–Friday 08:00–17:00. All exclude holidays. Never merge these with the BPLD schedule, even inside the same building.

### 6.3 Business tax notice

Keep online cutoff `2026-10-28T17:00:00+08:00` separate from the stated October 31 onsite deadline. The captured retrieval time is after the online cutoff. Therefore the online fourth-quarter notice is historical at capture, and no active "pay this quarter online" prompt may be generated from it.

The November 3 date is conditional on an official special non-working holiday declaration for October 31. This packet does not establish that declaration. Display the condition and official source; do not silently promote November 3 to the confirmed deadline. Search for a newer official announcement or holiday declaration before implementation. Record its date separately; if outside the user's window, explain the conflict rather than relabeling it.

Do not confuse quarterly business-tax payments with annual business-permit renewal. Keep service IDs `pay-business-tax-online` and `business-permit-renewal` distinct.

### 6.4 RPT advance payment

The 15% offer is for full advance payment of 2027 RPT on accounts without delinquencies. The ordinary deadline wording is strictly "before December 28, 2026". Bulk payments have a separate "before December 10, 2026" condition, and the image defines bulk as more than 20 accounts. Do not change "before" to "on or before". `exact_deadline_at` stays null. Do not generate a second-accurate countdown or promise an opening-hour deadline the source did not state.

The existing `pay-real-property-tax.fee` mixes older rates and discount dates, including December 31, and is presently `verify: false`. Before merging this slice, remove the superseded promotional timing from that free-text fee, set its unsupported rate/fee claims to null or retain them only as explicitly older material awaiting review, and display the recent offer as a separately sourced update. The new post does not verify the old tax rates or processing duration. Do not give all fields a new checked date.

S03 and S04 link `https://onlinepayments.pasigcity.gov.ph`. Store that source-backed destination for the relevant update. Do not globally replace every old payment-domain reference without service-specific evidence. Distinguish "linked by the official source" from a successful authenticated payment test; no transaction was performed.

### 6.5 CaSpay October 30

S08 supports male aspins/puspins, ages eight months through five years, healthy pets, current vaccination, a Pasig-resident owner with valid ID, a cage, bathing before the schedule, one companion per pet, and one pet per household per day. Qualified registrants receive organizer text messages.

This date-specific opportunity must not overwrite the older generic `spay-neuter` charter's eligibility. Store the October 30 entry separately and link it to that service. Venue, start/end times, live registration status, available slots, and application deadline remain null. The fee for this specific announced offer is zero; that does not establish a permanent zero fee for every veterinary service.

The CTA says to check the official announcement. It must not say "slots available" or "registration open today". Do not open, submit or mirror the organizer form as verification. Conservatively remove the upcoming label at Manila midnight starting October 30 because the event's exact hours are unknown; retain a dated "scheduled for today; confirm with organizer" entry through that day, then archive at midnight starting October 31.

## 7. Product data contracts

Create `data/sources.json`, `data/places.json`, `data/service-updates.json` and the backlog's `data/opportunities.json`. Keep historical updates with opportunities using an explicit record kind; do not mix them into `site.alerts` without time bounds. Reuse source registry entries rather than copying whole articles into product JSON.

`data/sources.json` has a `sources` array. Each source has `id`, `url`, `publisher`, `title`, `published_at` (date), optional substantiated `updated_at`, `retrieved_at` (offset timestamp), `reviewed_at` (nullable timestamp), `review_status` (`pending` or `reviewed`), `verification_method` (`official_document` here), and `evidence_path`. Evidence paths point to reviewed research text or images and never become a prerequisite for visitor downloads. Store canonical URLs, not internal browser-search reference IDs.

`data/places.json` has `places`. Required fields: stable `id`, `name`, `kind`, nullable `parent_id`, nullable `barangay_id`, nullable `address`, nullable `coordinates`, `facts`, and compatibility flag `verify`. A fact contains `id`, a typed `value`, one or more `evidence` references, and nullable `effective_from`/`effective_until`. Evidence is `{source_id, locator, method}` where method is `article_text` or `visual_attachment`. Source locators identify a section or image and the relevant row. Supporting a place name alone is insufficient evidence for its phone or hours.

Contacts are scoped facts with separate number and extension. Schedules belong to a service offering or to explicitly stated building-wide hours. Normalize weekday/time values, retain Manila time zone, and keep an `excludes_holidays` flag. Do not calculate "open now" while holiday coverage is unknown.

`data/service-updates.json` has `updates`: `id`, nullable existing `service_id`, `kind`, `title_fil`, `title_en`, `summary_fil`, `summary_en`, `place_ids`, `facts`, `sources`, and `verify`. A null service ID is allowed for BFP assistance and transport guidance until an independently justified canonical service record exists; both remain searchable sourced updates. Do not mislink them to social-welfare transport assistance or building permits.

`data/opportunities.json` has `opportunities`: `id`, `kind` (`opportunity`, `event_notice`, `closure`, `outcome`), bilingual titles/summaries, optional `service_id`, `place_ids`, `event_date`, nullable offset timestamps `starts_at`/`ends_at`/`application_deadline_at`, `eligibility_fil`/`eligibility_en`, nullable `registration_url`, tri-state `registration_open_now` and `slots_available_now`, `facts`, `sources`, and `verify`.

Every factual object needs supported evidence. Unknown values are null, never empty fabricated defaults. Zero fee is a known value, not null. An editorial title can be translated without claiming it is an official title. Explanatory translations must preserve conditions, numerical values, dates, and uncertainty.

Keep the existing `verify` semantics: true means "Sinusuri pa". The research records all retain true until independent review. Documentary checking does not establish a successful call. A number may later be marked official-document-confirmed without calling it phone-verified; record the method explicitly. A reviewed source can still become stale, disputed or event-expired.

## 8. Validation and time behavior

Add strict schemas for the new files in `src/lib/schemas.ts`, typed parsing/exports in `src/lib/data.ts`, and a pure `src/lib/freshness.ts` module. Do not rewrite every legacy schema in the same change. New factual fields must survive parsing as typed fields; do not rely on the current generic `fact` object's URL-only acceptance.

Reject duplicate IDs, broken references, invalid dates, impossible schedule intervals, a source dated after the edition date, unknown barangay/service IDs, missing claim evidence, and an eligible source without an established publication date. Validate URL protocols with `new URL` and allow only HTTP(S); official publisher verification remains an editorial task. Do not bless arbitrary look-alike domains by a substring match.

Implement `manilaDate(now)`, `windowStart(asOfDate)`, `isSourceFresh(source, now)`, `factState(fact, source, now)`, and `opportunityState(record, now)` as deterministic pure functions taking an explicit time. Date arithmetic must be calendar arithmetic in Manila, independent of the operating system time zone. The source-age range includes both endpoints. The online cutoff changes state at exactly the stored cutoff; a date-only event is handled with date precision, not an invented hour.

Use distinct states: source unchecked, source checked, independent review pending, fresh, stale, past event, schedule conditional, and live availability unknown. Do not collapse them into a single reassuring badge. New publication dates do not verify unrelated old fields. If a source fails on a later fetch, retain the last successful retrieval separately and record failure; never advance its checked timestamp on failure.

Static rendering alone cannot guarantee wall-clock expiry. Server-render dated records and their explicit conditions, then add a minimal client module which evaluates source-age and event boundaries on load, at the next relevant boundary, and when the tab becomes visible. It removes current-feed membership and active action prompts after a boundary, updates statuses, and exposes archived links. Use a scheduled review/rebuild operationally once hosting automation exists; do not claim it exists now.

For no-JavaScript visitors, use neutral dated wording and official-source links, not unconditional "open now"/"register now" assertions. Every time-sensitive card displays the actual date/time and edition checked date in HTML. The page must remain truthful after its build date without promising current live availability. Do not use a client clock to determine legal or tax eligibility; it controls presentation only.

## 9. Exact frontend implementation

Add a shared `SourceNote.astro` that prints publisher/source link, publication date, checked date and documentary-review wording. It must not call every old service checked on October 28. A service with an older base charter and a recent update displays both dates against their respective sections.

Add `PlacePage.astro` and Filipino/English routes `/lugar/[id]/` and `/en/lugar/[id]/`. Build 12 places in each language from the reviewed records. Content order: place name; barangay when supported; address; service-specific schedules; relevant contacts; related service updates; current dated opportunities; explicitly historical updates; source notes. Hide unknown coordinates and unknown phone fields. Omit speculative directions and current parking capacity.

Add `BarangayPage.astro` and `/barangay/[id]/` plus `/en/barangay/[id]/` for all 30 existing IDs, consistent with the backlog. Every page separates the existing older directory content from this recent sourced slice. Show the known barangay identity, then only eligible reviewed recent place/update rows. Use the exact empty wording in section 10 for the other 24. Do not duplicate unconfirmed emergency contacts as fresh facts.

Extend `PasigMap.astro` panels with a barangay-page link and the count of eligible reviewed recent records. Keep the existing map geometry and stable name-to-ID mapping. A count is derived from actual linked records; do not count citywide records as located in all 30 barangays. Existing localStorage preference stays device-only. No GPS.

Add `RecentUpdates.astro` and a weekly index at `/ngayong-linggo/` plus `/en/ngayong-linggo/`, with an archive at `/ngayong-linggo/arkibo/` and `/en/ngayong-linggo/arkibo/`. The index lists fresh applicable entries with dates. The archive lists past notices with their status and no active registration CTA.

Integrate the short recent list into `Landing.astro` below the existing search/map/service priorities. Keep emergency numbers visible first. Use lists, tables, existing 17px body text, 48px targets, visible focus, and the existing single accent. Do not load evidence screenshots in visitor pages.

Update `ServicePage.astro` to show service-specific current notices and a location table: RPT schedules are separate from business-tax schedules. On `pay-real-property-tax`, display recent advance-payment conditions and the source next to those conditions. On `pay-business-tax-online`, render the passed cutoff as a dated notice and no active Q4 online action. On `spay-neuter`, link the date-specific CaSpay opportunity without replacing the general charter rules.

Extend the current search index with record type, stable ID, localized title, bilingual searchable text and canonical localized href. Stop constructing every result URL from the service-root prefix. Index places, service updates, existing services, barangays and opportunities. Prefer applicable reviewed results; label expired results and route them to the archive. Use text rendering and the existing safe highlighting approach; never inject scraped HTML. Do not add Pagefind or a new dependency just for this slice.

## 10. Exact public wording

Use the following wording, with actual values inserted from structured data. This is proposed product copy, not quoted official prose.

| Context | Filipino | English |
| --- | --- | --- |
| Recent section | Mga bagong abiso at lugar | Recent notices and places |
| Documentary status | Sinuri sa opisyal na anunsyo. | Checked against an official announcement. |
| Review pending | Sinusuri pa | Being checked |
| Uncalled number | Nakalathalang numero; hindi pa nasusubukang tawagan. | Published number; not yet checked by phone. |
| No recent barangay record | Wala pang naidagdag na impormasyong may opisyal na anunsyo sa nakaraang 30 araw para sa barangay na ito. | No information supported by an official announcement from the past 30 days has been added for this barangay yet. |
| Stale publication | Lampas 30 araw na ang anunsyo. Tingnan ang opisyal na pahina para sa mas bagong abiso. | This announcement is over 30 days old. Check the official page for a newer notice. |
| Unknown field | Hindi nakasaad sa nasuring anunsyo. | Not stated in the announcement checked. |
| Availability unknown | Kumpirmahin sa tagapag-ayos kung tumatanggap pa ng pagpaparehistro. | Confirm with the organizer whether registration is still being accepted. |
| Expired event | Lumipas na ang nakatakdang petsa ng aktibidad. | The scheduled event date has passed. |
| BFP scope | Tulong sa transaksyon sa BFP; hindi emergency hotline. | BFP transaction assistance; not an emergency hotline. |
| Business online cutoff | Ayon sa abiso, hanggang Oktubre 28, 2026, 5:00 PM lamang ang pagtanggap ng online transaction para sa ikaapat na quarter. | The notice states that online transactions for the fourth quarter were accepted only until October 28, 2026, at 5:00 PM. |
| RPT offer | May 15% diskuwento sa buong maagang bayad ng amilyar para sa 2027 bago Disyembre 28, 2026, para sa account na walang delinquency. May hiwalay na takdang petsa ang bulk payment. | A 15% discount is announced for full advance payment of 2027 real property tax before December 28, 2026, for accounts without delinquencies. Bulk payments have a separate deadline. |
| CaSpay action | Tingnan ang opisyal na anunsyo at kumpirmahin sa VSD. | Read the official announcement and confirm with VSD. |
| Infrastructure attribution | Ayon sa ulat ng lungsod noong Oktubre 1, 2026. | According to the city's October 1, 2026 report. |

Show source dates with the existing formatting utilities. Display `Sinuri`/`Checked` beside the factual section it actually covers. Keep office names as proper names. Do not translate a date or deadline into a different condition. Keep the existing not-official disclaimer visible through `Base.astro`.

## 11. File-by-file work order

| Order | Files | Exact work | Completion evidence |
| --- | --- | --- | --- |
| 1 | Research artifacts already created | Review source snapshots, dates, hashes, image transcriptions, coverage, exclusions and factual conflicts. | Source/field review recorded; no record marked phone-verified. |
| 2 | FMD-governed change docs | Once the authorized FMD guide is accessible, create the change proposal/spec/tasks using its prescribed workflow, trace requirements and log scope. | Correct generated-doc workflow passes; no hand edits to materialized files. |
| 3 | `data/sources.json` | Promote only the 11 reviewed articles and their locators; S12/S13 remain research references. | Unique IDs and matching dates. |
| 4 | `data/places.json` | Add the 12 records, parent relationships and field evidence. | Supported six-barangay coverage and explicit null fields. |
| 5 | `data/service-updates.json`, `data/opportunities.json` | Add four service updates, one opportunity and three historical records using the exact prepared values. | Correct references, precision, conditions and archive states. |
| 6 | `data/services.json` | Correct RPT promotional timing; attach recent update IDs to the three existing services without refreshing all their old fields. | Old December 31 promotion no longer conflicts with the recent notice. |
| 7 | `src/lib/schemas.ts`, `src/lib/data.ts` | Validate new file contracts, evidence, IDs and relationships; export typed values and shared selectors. | Broken provenance or references fail locally. |
| 8 | `src/lib/freshness.ts`, client status module | Implement Manila calendar windows, event states and client expiry behavior. | Boundary scenarios in section 12 pass. |
| 9 | Shared source/place/barangay/recent components and `src/i18n.ts` | Implement exact source labels, copy, empty states and separate service schedules. | Filipino/English facts and conditions match. |
| 10 | New place, barangay, weekly and archive routes | Generate the specified localized static paths with source and disclaimer. | 24 place pages and 60 barangay pages build; weekly/archive routes resolve. |
| 11 | `Landing.astro`, `PasigMap.astro`, `ServicePage.astro`, `Search.astro`, `Alerts.astro` | Wire recent records, real hrefs, source notes, per-record dates and cutoff-aware presentation. | Current/expired behavior consistent across home, search and detail pages. |
| 12 | `data/README.md`, contribution docs under authorized workflow | Document the actual fields, dates, review rules, scrape command, archive handling and corrections. | Another maintainer can repeat the process without this conversation. |

Do not introduce runtime source scraping inside `astro build` or visitor requests. Network research is a separate maintainer action; builds consume reviewed local JSON and remain reproducible offline.

## 12. Verification and acceptance scenarios

The research check command is `bun scripts/verify_pasig_research.mjs`. It checks snapshot/image hashes, 11 dates in the window, source references, stable entity references and conservative review flags. It does not prove semantic accuracy, exhaustive coverage or live availability. Review the content independently as well.

For implementation, add focused tests of the new time/evidence logic using the project's existing Bun runner; no additional test dependency is needed. Include these exact cases:

1. With edition date October 28, September 29 is accepted and September 28 is rejected; October 29 is rejected as a future publication.
2. An October 1 source is fresh at October 30 23:59:59 Manila and stale at October 31 00:00:00, regardless of the machine's local time zone.
3. An updated retrieval timestamp leaves an old publication stale.
4. A source missing publication evidence cannot enter the fresh feed, even if its URL returns 200.
5. An unrelated date in navigation, metadata or Other News does not qualify an article.
6. At October 28 16:59:59 the Q4 online cutoff has not passed; at 17:00:00 it has. At the captured late-evening time it must be past.
7. A conditionally stated November 3 deadline does not render as confirmed.
8. RPT's "before December 28" remains exclusive wording; bulk payment remains separate. No fabricated exact cutoff appears.
9. On the same building page, BPLD's weekday 08:00–18:00 and RPT's Monday–Thursday 07:00–18:00 schedules remain distinct.
10. Market daily hours never become BPLD office hours.
11. A null fee is hidden or explained; the CaSpay-specific zero fee is rendered as free.
12. CaSpay shows unknown live availability, preserves the male/age/residency/vaccination conditions, and changes from upcoming to confirm-today to archived using date precision.
13. The October 7 parking notice is historical, not a current closure. The October 8 blood donation announcement does not become proof of a completed event.
14. S10's 1,067 people and 1,753 applications remain different counts.
15. A missing field citation, unknown source ID, broken parent/place/service reference, duplicate record ID or unsupported coordinate fails validation.
16. A source-backed office phone does not enter the emergency strip or acquire `call_verified: true`.
17. Source-checked badges do not automatically clear `verify` or independently-reviewed status.
18. A correction to one field changes only its provenance/check date, not every fact in the file.
19. Search results open their real localized route, including place and archive results; titles containing markup render as text.
20. The client changes status on first load, boundary crossing and return to a visible tab. No-JavaScript HTML retains dated, non-promissory wording.

Run `bun run check`, `bun run build`, and `python scripts/count_verify.py data` after implementation. The last command counts `verify: true`; it does not inspect source recency or semantic accuracy. Run the new focused logic tests and research integrity check as well. A passing build is not an independent factual review.

Current environment limitations: Python is unavailable, and the previous native-module startup issue has not been demonstrated resolved in this research task. Do not mark the Python counter, Astro check or build passed unless they actually run successfully. Resolve the supported local runtime prerequisites before code verification; do not silently skip a failed command.

Manual acceptance: open both languages, keyboard-test search/map links, inspect a narrow mobile viewport, confirm 48px targets and focus, verify the existing disclaimer, check no source HTML executes, verify no resident data or cookies were added, and measure the existing under-300KB first-load goal. Do not claim the 30-resident usability study or public launch is complete; those remain the repository's release requirements.

## 13. Review, merge, release and rollback

Before code merge, another maintainer compares each promoted value to the saved article or attachment. A barangay steward confirms only their own area. The review covers floors, barangays, extensions, service-specific schedules, conditions and source-age rules. Missing live capacity is an acceptable null, not a reason to invent availability.

Split implementation into reviewable commits: evidence/contracts; data promotion and RPT correction; validation/time logic; routes/components/search; verification and authorized docs updates. Preserve the user's existing dependency diff rather than automatically including it in this feature's commits. Leave the new evidence and plan uncommitted unless the user asks to commit.

The PR body must state the concrete resident benefit, changed record counts, source date range, exact commands that passed or failed, documentary versus phone verification, remaining coverage gaps, and the fact that this October batch must be refreshed before the December launch. Target `dev` and use the existing contributor identity. Do not claim an automated CI gate or preview deployment exists unless it has been connected and observed.

Re-scrape affected sources before publishing, compare article content and attachments, and search for superseding notices. Any changed digest requires review of the affected field. An unchanged digest does not extend the publication window. Rebuild and check the actual static output at the deployment time. A stale item may remain in the archive but not in the recent feed.

Use the repository's documented rollback: revert the scoped factual/code change and redeploy the previous Cloudflare Pages deployment when deployment is authorized. Keep prior evidence editions immutable. Never roll back unrelated user work. Wrong tax timing, wrong contact scope, or a stale opportunity presented as open is release-blocking for this slice; disable that item and correct it before continuing.

## 14. Maintenance and corrections

For each newly published item, record the next source-age boundary and the next event/action boundary. Review deadline-bearing items before those boundaries and fetch a current official notice. If no qualifying new source exists, let the item age into the archive. Assign the task to any available maintainer; do not invent a named owner or an on-call roster.

For a reported error, record the affected ID and field, preserve the old evidence, obtain the correcting source, update the narrow field and its provenance, validate, review and publish within the repository's 48-hour correction target. Never republish beneficiary names, payout lists, registrant identities, private phone messages or submitted forms. Published office contacts are enough for this guide.

Once FMD access is available, reconcile the authorized canonical docs with the implemented contracts, new routes and actual checks; materialize only through the required scripts. Keep research/plan limitations visible until resolved. Do not present those documentation updates, independent review, phone checks or launch as completed by this plan.

## 15. Completion checklist for the implementer

- [ ] The independent maintainer review is recorded for each promoted fact.
- [ ] Every field has the correct article/attachment evidence; every unknown remains null.
- [x] Twelve place records preserve building/desk and service-schedule distinctions.
- [x] Six barangays have documented assigned-place coverage; the other 24 use the honest empty state.
- [x] Four service updates, one opportunity and three historical records have correct statuses.
- [x] Old RPT promotional wording is corrected without claiming older tax rates were freshly verified.
- [x] The published online cutoff is past in the captured edition; conditional deadlines remain conditional.
- [x] Rolling 30-day source age and event expiry work in static HTML and enhanced browser presentation.
- [x] The new localized routes, search hrefs, source notes and exact public copy work.
- [x] Research integrity, focused logic checks, Astro check, build and the verification counter have actual recorded outcomes.
- [ ] Accessibility, language parity, disclaimer, page weight and privacy checks are complete.
- [ ] Authorized documentation workflow, factual review and release-time refresh are complete.
- [ ] The reviewable PR targets `dev`; publication and rollback follow existing authorization.

Implementation and local verification are recorded in implementation-audit.md. Unchecked items are not represented as complete; publication-time source refresh, independent review and the FMD-governed workflow remain required.
