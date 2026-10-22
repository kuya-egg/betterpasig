# User Protection & Regulatory Posture Register (CLR)

**Project:** BetterPasig
**Date:** 2026-10-22
**Version:** 0.1
**Owner:** BetterPasig maintainers
**Status:** Draft
**Last reconciled:** N/A
**PRD:** [prd-betterpasig.md](prd-betterpasig.md)
**SDD:** [sdd-betterpasig.md](sdd-betterpasig.md)

---

> **Awareness, not legal advice.** This register maps what data we hold, the bars that protect residents, and the choices already made in the roadmap. It does not draft a privacy policy or terms of use.

---

## 0. Target Markets

| Region | In scope? | Notes |
|--------|-----------|-------|
| Philippines (Data Privacy Act 2012, RA 10173) | Yes | Residents are in Pasig. This is the market that matters |
| European Union / UK (GDPR / UK GDPR) | Reachable, no personal data | The site is public and has no geo-block. We do not collect an identifier |
| California, USA (CCPA / CPRA) | Reachable, no sale | Same. Nothing is sold or shared as personal information |
| Other: none named | No | |

**Geo-blocking:** none. The site is a public guide.

---

## 1. Data Inventory / Record of Processing

| Activity | Purpose | Data categories | Data subjects | Recipients / sub-processors | Cross-border transfer | Retention | Legal basis |
|----------|---------|-----------------|---------------|-----------------------------|-----------------------|-----------|-------------|
| Publish city facts | Show services, hotlines, barangays, and officials | Public records and official names already published by the city | Public officials and offices, not site visitors | Visitors, via Cloudflare Pages | Pages is a global CDN | Until a sourced edit replaces the fact | Public records. We do not collect this from the visitor |
| Cookieless analytics (not connected) | Count visits | Page path. No cookie, no account | None stored by us | Cloudflare Web Analytics, when switched on | Cloudflare | Their cookieless product. We do not receive a visitor file | Only if it stays aggregate. If it starts identifying a person, remove it |
| Empty-search terms (not built) | See which words find nothing | The search term only. No IP | None | A future Worker | Cloudflare | Terms only, reviewed monthly | Do not build it if the term has to be tied to a person |

**Sensitivity flags:**

| Data type | Collected? |
|-----------|-----------|
| Basic PII (name, email) | No resident PII. Official names on the officials page are copied from public directories |
| Special-category (health, biometric, genetic, race, religion, sexuality, politics, union) | No |
| Children's data | No |
| Precise location | No. A barangay choice stays in localStorage on the device |
| Photos / camera / microphone | No |
| Device or advertising IDs | No |
| Analytics / telemetry | Planned, cookieless, not connected |
| Payment / card data | No |

---

## 2. Multi-Jurisdiction Obligations Matrix (awareness)

| Dimension | Philippines DPA 2012 | EU / UK GDPR | California CCPA / CPRA |
|-----------|----------------------|--------------|------------------------|
| **Consent / legal basis** | No visitor personal data is processed | No identifier collected | No sale or share |
| **Data subject rights** | Nothing held to access or delete for a visitor | Same | Same |
| **Breach notification** | Applies if we ever store personal data | Same | Same |
| **Registration / officer** | A DPO and NPC registration apply to controllers who process personal data. We process none today | Not material while we store nothing | A contact method is the footer corrections path, still to be built |
| **Cross-border transfer** | CDN serves public pages | Public pages only | Public pages only |
| **Posture rows** | CLR-P1 | CLR-P5 | CLR-P5 |

**Sector rules:** we are not the city, we take no payment, and we do not operate a licensed service. Two non-license duties still get rows: do not present the site as pasigcity.gov.ph (CLR-P2), and do not use the city seal (CLR-P2). Election-period neutrality is CLR-P3.

---

## 3. User-Protection Bars (non-negotiable)

| Flag | Present? | Bar we meet | Met? | Evidence |
|------|----------|-------------|------|----------|
| Any personal data | No | We do not collect resident name, email, or account. A change that adds one is rejected (PRD-F4) | Yes | SDD §3 and §5. No user table |
| Breach runbook for personal data | No | If a future change stores personal data, OPS §4 is the contain-and-notify path. Today there is no store to breach | Yes | OPS §4 |
| Children's data | No | No age gate, because we do not collect age or any child record | Yes | PRD §6 |
| Health / biometric / other special category | No | Program pages describe public benefits. They do not take a health record | Yes | `data/programs.json` is public copy |
| Payments / card data | No | Fees are text. Payment happens on the city's channel | Yes | PRD §1 |
| Precise location | No | No GPS. Barangay picker stays on the device | Yes | SDD §5 |
| Automated decisions with significant effect | No | The site does not approve or deny a benefit | Yes | PRD §1 |
| Tracking / ad-tech / profiling | No | No ad network. Analytics, when added, must stay cookieless | Yes | PRD-F4 |

---

## 4. Terms of Use / EULA Readiness

Presence check only. This file does not draft the clauses.

| Clause | Present? | Counsel before |
|--------|----------|----------------|
| License grant, acceptable use, termination | No | Before a lawyer-written terms page, if one is ever needed |
| Limitation of liability, warranty disclaimer | No. The not-official line is a product disclaimer, not a liability clause | Before public launch if counsel is hired. The disclaimer itself ships with PRD-F4 |
| Governing law, dispute resolution | No | Same |
| User content license, takedown path | No user content. Corrections are pull requests and a public log | N/A |
| Payment, refund, age eligibility | No | N/A |
| Privacy Policy linked | No privacy-policy page, because no visitor personal data is collected | Write one before any collection starts |

---

## 5. IP Infringement & Protection Readiness

| Item | Status | Counsel before |
|------|--------|----------------|
| Name and brand trademark knockout search per market | Not done | Before spending on a brand campaign |
| Open-source licenses | Map data is MIT (faeldon/philippines-json-maps). Geist is SIL Open Font License. Astro is MIT. No SBOM file yet | Before adding a copyleft dependency |
| Third-party assets licensed | Own logo, drawn from the public barangay outline. The city seal is not used | N/A |
| AI training-data provenance and output ownership | No product model | N/A |
| AI search vs training crawl policy decided | Search bots allowed. Training bots deferred (CLR-P4). `robots.txt` is not published yet | Before 15 Dec 2026 |
| Written IP assignment from every contractor and contributor | Not written. Contributors keep their copyright and license it with the repo | Before any paid contractor |

---

## 6. App Store / Platform Compliance

Not shipping to an app store. This section does not apply.

---

## 7. Regulatory Posture Register

| ID | Obligation | Applies because | Exposure | Enforcement reality | Posture | Rationale | Revisit when | Kill switch / fallback | Owner | Counsel before |
|----|-----------|-----------------|----------|---------------------|---------|-----------|--------------|------------------------|-------|----------------|
| CLR-P1 | RA 10173, Data Privacy Act | A public site could start storing complaints or accounts | NPC fines. Serious unauthorized processing can mean imprisonment. No individual is named, because the project stores no resident personal data. Name a person only if a pull request starts collecting it | The NPC acts against organizations that process personal data. A site that stores none has nothing to register today | COMPLY | Collect no resident personal data. That is the cheap way to meet the rule and the user-protection bar | A pull request adds an account, a form that stores a name, or an analytics tool that identifies a person | Remove that change in one deploy. Do not launch it | BetterPasig maintainers | Before any collection starts |
| CLR-P2 | Do not impersonate the city or use the city seal | Visitors can mistake a guide for pasigcity.gov.ph | Loss of trust, a city complaint | Informal, and immediate if the disclaimer is missing | COMPLY | Disclaimer on every page. Own logo only. Transactions go to the city | Every quarter, and before launch | Put the disclaimer back in the layout and redeploy | BetterPasig maintainers | If the city sends a letter |
| CLR-P3 | Non-partisan listing of officials | The directory names elected people | Being read as a campaign | Public and fast near an election | COMPLY | Same card size, stable sort, no endorsements, no political funding | Before any 2028 election page | Revert the partisan change the same day | BetterPasig maintainers | Before the 2028 guide is drafted |
| CLR-P4 | Training crawlers (GPTBot, Google-Extended, ClaudeBot) | A public HTML site is readable by default | Copies of public facts, which are already public | Robots rules are voluntary | DEFER | Search bots stay allowed. Training bots are not decided. Until `robots.txt` exists, nothing is blocked | Before 15 Dec 2026. The maintainers decide in Messenger, then record it in GitHub | Publish `robots.txt` with Disallow for training bots in one deploy, if that is the decision | BetterPasig maintainers | N/A |
| CLR-P5 | GDPR / UK GDPR and CCPA paperwork | The URL is reachable worldwide | Paperwork for a controller of personal data, or a sale | Not material while we store and sell nothing | DEFER | No identifier and no sale. Do not invent a policy that claims a program we do not run | We collect an identifier, or we sell or share personal information | Stop the collection. Geo-blocking is not the plan | BetterPasig maintainers | Before that collection |

**Postures:** COMPLY on CLR-P1, CLR-P2, and CLR-P3. DEFER on CLR-P4 and CLR-P5. No CONTEST row.

---

## Self-Check

- [x] §0 declares every market honestly
- [x] §1 has one row per processing activity, each with a retention period
- [x] Every present §3 flag is actually absent, and the bar is met by not collecting
- [x] Every in-scope obligation has a §7 row with a posture, an owner, and a revisit trigger
- [x] No CONTEST row
- [x] CLR-P1 notes the personal criminal exposure and names no individual. A person is named only if collection starts
- [x] §6 skipped. No app store
