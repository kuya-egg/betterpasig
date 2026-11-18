# Operations & Observability Runbook (OPS)

**Project:** BetterPasig
**Date:** 2026-10-22
**Version:** 0.1
**Owner:** BetterPasig maintainers
**Status:** Draft
**Last reconciled:** N/A
**SDD:** [sdd-betterpasig.md](sdd-betterpasig.md)

---

## 1. SLOs & SLIs

Targets come from SDD §7. Measurement is what exists today, not a monitor we do not have.

| SLI | SLO | Measured by | Breach action |
|-----|-----|-------------|---------------|
| Homepage availability | Returns 200 after each deploy | Whoever deployed opens `/` after the deploy. No uptime monitor is wired | Redeploy the previous Pages deployment. PRD §9. Post in Messenger and open a GitHub issue |
| First load size | Under 300 KB | Browser devtools on the home page, until a CI check exists | Do not launch that build |
| Correction time | A reported wrong fact is fixed within 48 hours | GitHub issue open-to-close time, until the public corrections log exists | The maintainer who took that fact, or the steward for that barangay, patches the JSON. They do not wait on another role |
| Contact freshness | No hotline or barangay date older than 90 days | `python scripts/count_verify.py data` and the checked dates | Mark "Sinusuri pa" and schedule the call |

---

## 2. Observability; Logs, Metrics, Traces

| Pillar | Tool | What is captured | Retention |
|--------|------|------------------|-----------|
| Logs | Cloudflare Pages build log | Build success or failure. No visitor identity | Cloudflare's retention for the project |
| Metrics | Not connected | Cloudflare Web Analytics is the planned cookieless visitor count. It is off | None until it is connected |
| Traces | None | A static file has no request trace | N/A |

**Dashboards:** the Pages deployment list. No custom dashboard.
**Correlation ID:** none. There is no app server. A bad deploy is identified by its Pages deployment id.
**No PII or secrets in logs:** do not print tokens. Do not log a search term next to an IP. The empty-search Worker, if built, stores the term only.

---

## 3. Alerting & On-Call

| Alert | Condition | Severity | Owner | Channel |
|-------|-----------|----------|-------|---------|
| Wrong or dead emergency number | A resident, steward, or the post-deploy check finds a bad hotline or a homepage that does not load | P0 | BetterPasig maintainers. The steward for that barangay if it is theirs | Messenger and a GitHub issue |
| Wrong fee on a live service | A sourced fee does not match its charter | P1 | Content lead, or any maintainer who takes the issue | Messenger and a GitHub issue |

**On-call model:** no single person. Alerts land in the Messenger group and a GitHub issue. A steward handles their own barangay. Any free maintainer handles a city-wide page.

---

## 4. Incident Response

Severity uses the QAD P0 to P3 scale. Acknowledge, stop the bad page, then diagnose. Communicate on the corrections log once that page exists. A P0 or P1 gets a postmortem file within 48 hours.

**Personal data exposed:** there is no resident store. If a change starts storing personal data, contain it by reverting that change, then tell the people affected. CLR §3.
**Rollback:** PRD §9.
**Kill switches / feature flags:** none. The switch is the revert plus the Pages redeploy.

---

## 5. Routine Operations

- **Secret rotation:** no secret in the repo. A Cloudflare token stays with the person who deploys and is rotated if it leaks.
- **Dependency and security patches:** within 7 days when a person is available.
- **Backup restore drill:** not done. First drill is the M5 rollback rehearsal in the PRD. Git is the backup.
- **Cost review:** monthly. Expect the domain fee, on the order of the roadmap's yearly hosting cap.
- **Cert and domain expiry:** Cloudflare renews the edge certificate once the domain is attached. The maintainers watch the domain expiry date.

---

## Self-Check

- [x] Every §1 SLO names a real measurement, including the manual ones
- [x] Logs have no PII rule. There is no app correlation id, and §2 says so
- [x] §3 alerts go to the maintainers on Messenger and GitHub. No single on-call person
- [x] §4 points at PRD §9 and states there is no feature flag
- [ ] A backup restore has not been done yet
- [x] P0/P1 postmortem SLA is 48 hours
