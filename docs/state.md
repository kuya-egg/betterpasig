# Project State: BetterPasig

**Project slug:** `betterpasig`
**Owner:** BetterPasig maintainers
**Last updated:** 2026-10-22

---

## 1. Position

| Field | Value |
|-------|-------|
| **Current milestone** | Implement |
| **Entered on** | 2026-10-22 |
| **Exit condition** | Launch Must-Haves in the PRD are in the Astro site, each with a source, and the QAD happy paths can be run |
| **Next milestone** | Verify |
| **Current blocker** | Hotlines and barangay contacts are not yet phone-verified. Docs below are Draft until a maintainer pull request locks them |
| **Owner of the next step** | BetterPasig maintainers |

**What we are building, in one line:** One sourced, bilingual place where a Pasigueño can find a city service, benefit, or official in under a minute, then transact on the city's own channels.

**Engagement type:** volunteer civic site

**Vault status:** none

Narrative sources, not replaced by these operating docs: [roadmap.md](roadmap.md), [backlog.md](backlog.md), [design-system.md](design-system.md), [research.md](research.md).

---

## 2. Active signals

| Signal | True? | Evidence | Requires |
|--------|-------|----------|----------|
| S1 Frontend | yes | Astro pages in `src/`, prototype HTML, design tokens | Existing [design-system.md](design-system.md). No second design doc |
| S4 Non-trivial product behavior | yes | Services, barangays, officials, search, launch test | PRD |
| S5 Agents and people will implement | yes | Volunteer pull requests, and agents read `AGENTS.md` | BUILD |
| S7 Release to users intended | yes | Public launch 15 Dec 2026 in the roadmap | QAD, OPS, Production Readiness Gate |
| S11 Public surface | yes | Public repo README and intended https://betterpasig.org | Public-surface rules, BUILD crawler section |
| S29 Regulated activity plausibly applies | yes | RA 10173 if personal data is ever stored. The site also must not impersonate the city | CLR posture rows |

**Deliberate absences:**

- No accounts, uploads, or resident personal data, so there is no user database.
- No payments, so no unit-economics sheet.
- No AI feature in the product, so no model card.
- No second design system. Look and voice stay in `docs/design-system.md` and `design/tokens/`.
- No production users yet. The live URL is still the pre-launch placeholder.
- A small team already, and no CI, so engineering level stays L0.
- No business case, pitch, or go-to-market doc. The roadmap already states why the site exists.

---

## 3. Operating frameworks

| Dimension | Choice | Why |
|-----------|--------|-----|
| **Project management** | milestones | Launch order already lives in the backlog. A second ceremony is not earned |
| **Engineering maturity** | L0 Local validation | `bun run check` runs on a laptop. Nothing runs on every push yet |
| **Subagents** | none | People and agents both implement. No standing specialist roster |

---

## 4. Open assumptions

| ID | Assumption | Risk if wrong | Reversible? | Owner | Resolve by |
|----|-----------|---------------|-------------|-------|------------|
| A1 | Barangay names and numbers in `data/officials-directory.json` are still unverified directory data | A resident calls a wrong hall | yes | That barangay's steward | Verify milestone, phone check |
| A2 | BetterLGU already lists a Pasig project (`@ericvelasco-dev`). One shared project is still possible | Two public sites compete | yes | BetterPasig maintainers | Before public launch |
| A3 | Training crawlers stay undecided until the launch checklist | A default allow or block ships by accident | yes | BetterPasig maintainers | Before 15 Dec 2026 |

**Open questions for the maintainers:**

1. Before 15 Dec 2026, should training crawlers be allowed or disallowed? Search crawlers stay allowed. Decide in Messenger, then record the decision in GitHub. See CLR-P4.

---

## 5. Decisions

| ID | Question | Decision | Evidence class | Review when |
|----|----------|----------|----------------|-------------|
| D1 | What stack ships? | Static Astro, JSON in `data/`, Cloudflare Pages. No database and no accounts | Project Canonical | A feature needs a server |
| D2 | What personal data do we store? | None. Cookieless analytics only, and empty-search terms with no IP, when those exist | Project Canonical | A form or account is proposed |
| D3 | Which language is default? | English at `/`, Filipino under `/fil/`. Every page exists in both and links the other with hreflang, English as `x-default` (for search and answer-engine visibility). Old `/en/...` URLs redirect permanently (301) to the same path at the root (`public/_redirects`). A saved language choice still sends a visitor to their language. Barangay names are never translated (`translate="no"`). Decided 2026-11-18 | Human Decision | N/A |
| D4 | Who can appear as a contributor? | People only. The person who commits uses their own git identity. GitHub's list is the commit author, the committer, and any Co-authored-by trailer. An agent, model, or editor is never any of those, never a collaborator invite, and never a name in a contributors file | Human Decision | Any commit |
| D5 | Do operating docs replace the roadmap? | No. Roadmap, backlog, design system, and research notes stay the narrative sources | Human Decision | N/A |
| D6 | Who owns the work? | The maintainer group, not one person. A steward confirms only their barangay. Whoever takes a backlog item can do it from these docs. Any other free maintainer reviews pull requests into `dev`. Every change goes to `dev` first: open the pull request against `dev`, even though `main` is the default branch. Releases to `main`, the production branch, come only from `dev` (the `release-source` check) and need the owner's (@kuya-egg) approval, enforced by a ruleset and `.github/CODEOWNERS` (decided 2026-11-18). Messenger is how the core team talks. It is not a gate. A decision that changes the site is written in GitHub | Human Decision | N/A |
| D7 | Which sources can back a fact? | Trusted sources only, a hard rule. An official source: `*.gov.ph` or `*.gov`, an official account of a government office, an agency's own system, or an institution's own site for its own facts. Or a major news outlet: Inquirer, Philstar, GMA, Rappler, Manila Bulletin, ABS-CBN, Manila Times, Daily Tribune, Malaya, BusinessWorld, BusinessMirror, VERA Files, DZRH, PNA. Never Wikipedia, directories, listing or aggregator sites, or blogs. A fact without a trusted source is removed, or set to `null`. The build fails if a banned host appears in `data/*.json` (`src/lib/source-policy.ts`). Decided 2026-11-18 | Human Decision | A new source type is proposed |

---

## 6. Context exclusions

| Excluded | Reason | Where it lives now |
|----------|--------|--------------------|
| Engine repo contents | The public site does not vendor the engine | FMD clone, named only on the `AGENTS.md` pointer line |
| Design exploration canvases | History, not the current system | `design/canvases/` |

---

## 7. Next actions

1. A maintainer opens a pull request to lock these Draft docs, or to correct them.
2. Any maintainer phone-verifies city hotlines. A steward confirms only their own barangay.
3. The tech lane builds `/barangay/[id]` for all 30 barangays, then the officials directory at `/opisyal`.

**Artifact plan for this slice:**

| Artifact | Why it is justified now | Status |
|----------|-------------------------|--------|
| PRD | Launch behavior has to be testable | Draft |
| SDD | Static build, JSON content, and Pages are the architecture | Draft |
| CLR | Public site and the Data Privacy Act | Draft |
| QAD | A public launch needs happy, sad, and abuse tests | Draft |
| OPS | Someone has to roll back and correct facts | Draft |
| BUILD | People and agents implement from these docs | Draft |

---

## 8. Self-Check

| Check | Done |
|-------|------|
| Milestone and exit condition are current | yes |
| Every listed signal has real evidence | yes |
| Every assumption made this session is in §4 | yes |
| Next milestone or the blocker is named | yes |
