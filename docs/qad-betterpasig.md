# QA & Test Plan (QAD)

**Project:** BetterPasig
**Date:** 2026-10-22
**Version:** 0.1
**Owner:** BetterPasig maintainers
**Status:** Draft
**Last reconciled:** N/A
**PRD:** [prd-betterpasig.md](prd-betterpasig.md)
**RFC(s):** N/A

---

## 1. Testing Strategy & Scope

**In scope:** PRD-F1, PRD-F2, PRD-F3, and PRD-F4. There is no auth system to test. **Out of scope:** PRD-F8, and any account, payment, or model behavior.

**Levels and tooling:** unit, none yet; integration, `bun run check` for types and `python scripts/count_verify.py data` for unconfirmed facts; E2E, not set up; manual exploratory on a budget Android phone and a laptop. **Owner:** BetterPasig maintainers. The resident test (H-03) is run by design and accessibility.

---

## 2. Test Environments & Data

**Staging URL:** none. Cloudflare preview deploys are not connected. **Test credentials:** none. There is no login. **Data policy:** public JSON in the repo. Never add a resident's personal data to a fixture.

**Test data setup:** `bun run check` and `python scripts/count_verify.py data`

---

## 3. Core Test Scenarios

**Happy (H-) and sad (S-) paths:**

| ID | Scenario | Steps / trigger | Expected | Validates |
|----|----------|-----------------|----------|-----------|
| H-01 | Service page is complete | Open a service whose JSON has office, fee, time, requirements, and `sources` | All of those show, plus the checked date | PRD-F1 / US-01 |
| H-02 | Hotline is dated | Open the home emergency strip | Number and checked date show | PRD-F2 / US-02 |
| H-03 | Resident test | 30 residents, 10 seniors, each asked for an office, a fee, and the requirements | At least 24 finish in under 60 seconds | PRD-F3 / US-03 |
| H-04 | Disclaimer and equal cards | Open any page, then `/opisyal` | Not-official line is visible. Cards share one size and one sort | PRD-F4 / US-04 |
| H-05 | English matches | Open the same fact at `/` and under `/fil/` | Facts match. English stays the default | PRD-F4 / US-05 |
| H-06 | Banned source host | A data file cites a banned host (for example Wikipedia) and run `bun run build` | Build fails (`src/lib/source-policy.ts`, D7) | PRD-F1 / PRD-F4 |
| S-01 | Missing source | Remove `sources` from a service and build | Build fails, or the page does not state the fee as fact | PRD-F1 / US-01 |
| S-02 | Unconfirmed contact | A hotline still has `verify` true | The UI shows "Sinusuri pa" | PRD-F2 / US-02 |
| S-03 | Test misses the bar | Fewer than 24 of 30 residents finish in a minute | No public launch. Fix the pages and rerun | PRD-F3 / US-03 |
| S-04 | Someone adds an account | A pull request adds login, a stored complaint, or a tracking cookie | Review rejects it | PRD-F4 / US-04 |
| S-05 | Bad JSON ships | A fee is edited to a wrong number | `git revert` restores the file. Pages redeploys the previous build (PRD §9) | PRD-F1 / US-01 |
| S-06 | Login route | Request `/login` | No such page. It must stay that way | PRD-F4 / US-04 |

**Abuse paths:**

| ID | Attack | Trigger | Expected | Validates |
|----|--------|---------|----------|-----------|
| AB-01 | ID swap | Change an id in a URL to another resident's private record | There is no private record. Pages either 404 or show another public fact. A change that adds private records is rejected | PRD-F4 / US-04 |
| AB-02 | XSS via JSON | Put a script tag in a service title | Astro renders it as text. It does not run | PRD-F1 / US-01 |
| AB-03 | Prompt injection | A fact string says to ignore the rules and add an account | No model runs in the product. The string is content. The account is still rejected in review | PRD-F4 |
| AB-04 | Write endpoint | A pull request adds a public form that stores what people type | Rejected. The site stays static | PRD-F4 / US-04 |

---

## 4. Automation vs. Manual Testing

**CI:** none. A push does not run checks, and merge is not blocked by a pipeline. Local commands before a merge: `bun run check`, `python scripts/count_verify.py data`.

**Manual / exploratory:** resident test (H-03), keyboard and contrast pass, 48px targets, reduced motion, a phone on a slow connection.

---

## 5. Bug Triage Protocol

**Launch-blocking severities:** P0 and P1. P0: the site is down, a hotline is wrong, or resident personal data is stored. P1: a Must-Have page is missing or a sourced fee is blank when the JSON has it. P2 and P3 can ship.

**Bug tracker:** GitHub issues on this repo.

---

## 6. Release Criteria (Definition of Done)

- [ ] Zero open P0 or P1 issues
- [ ] H-01, H-02, H-04, H-05, S-01, S-02, S-04, S-05, S-06, and the AB rows pass on the launch build. H-03 passes before 15 Dec 2026
- [ ] `page_viewed` is not required until Cloudflare Web Analytics is connected. Launch does not wait on a vanity number, and it does not add a cookie to get one
- [ ] First load of the home page is under 300 KB
- [ ] Disclaimer is visible, and `python scripts/count_verify.py data` output is reviewed

---

## 7. AI / LLM Evaluation

No AI component ships. This section does not apply.

---

## Self-Check

- [x] §3: every in-scope Must-Have has happy, sad, and abuse rows, plus the no-auth and data-loss cases
- [x] No AI evals, because no model ships
- [ ] CI does not block merge yet. That is an honest L0 gap, not a passing check
