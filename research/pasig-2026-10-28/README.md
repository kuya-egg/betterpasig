# Official Pasig data research, October 28, 2026

This is the evidence and prepared factual data for the [archived implementation plan](../archive/pasig-2026-10-28/implementation-plan.md). Research window: September 29–October 28, 2026, inclusive, in Asia/Manila.

All 13 requested pages returned HTTP 200 through the Windows HTTP client. Eleven are dated official city articles whose extracted publication dates match the manifest and window. The other two are a discovery index and a dynamic PAGASA reference; neither is promoted as a fresh place fact. Five attachments were inspected visually out of six downloaded images.

The prepared dataset has 12 places, four service updates, one opportunity and three historical updates. Six barangays have directly assigned place records; 24 have no qualifying place record in this batch. The coverage ledger includes all 30 existing IDs. Missing coverage does not establish that a barangay has no services.

## Files to review

- `source-manifest.json`: exact sources and the frozen research window.
- `retrieval-report.json`: publication-date matching, retrieval times, HTTP results, hashes and snapshot paths.
- `verified-facts.json`: source-backed values and explicit unknowns, prepared for implementation review.
- `coverage.json`: actual place coverage by barangay.
- `verification-review.json`: article/image review and verification limits.
- `image-retrieval-report.json`: image download URLs and hashes.
- `snapshots/`: saved HTML, full extracted text and isolated article text.
- `images/`: official attachments used to check details missing from the article text.

HTML is saved as decoded UTF-8. A SHA-256 hash covers the saved file. These files are research evidence, not visitor assets. Do not copy them into `public/`, execute them, or import them as application templates. They contain official branding which the website must not adopt as its identity.

## Verification meaning

`document_checked` means the stored value was compared against the official article or visually inspected attachment. It does not mean a phone call succeeded, the office was visited, registration remains open, a payment worked, or no newer announcement exists. Product promotion still requires another maintainer's factual review; all candidate `verify` flags remain true.

Evidence references such as `S03:image:1` identify a source and attachment number from `retrieval-report.json`. `S06:article` points to the isolated article text. A publication date does not become current because it was retrieved today.

## Repeat the collection

Run the reviewed PowerShell script from the repository root using a PowerShell session permitted to execute local scripts:

```powershell
./scripts/scrape_pasig_sources.ps1
```

Do not weaken certificate validation or change the machine-wide execution policy for this task. The initial collection used the same reviewed script body in the existing shell because local script-file execution was disabled. Re-running collection overwrites this edition's snapshots and changes the recorded hashes; preserve the current edition first and use a new date directory for an actual later research edition. Update the manifest and manually review the new evidence before promotion. Do not change the edition date just to make an old source fresh.

Run the offline integrity/reference check with Bun:

```powershell
bun scripts/verify_pasig_research.mjs
```

This check verifies files and references, not factual correctness. The full plan specifies the separate product checks, time-boundary cases, independent review and release workflow.

## Important findings for implementation

The business-tax online cutoff was October 28 at 5:00 PM; capture occurred later that evening. The notice is past its online cutoff. The November 3 onsite date is conditional and has not been confirmed by a holiday declaration in this evidence batch.

BPLD hours and RPT hours differ at the same building. Store schedules by service. CaSpay's date-specific restrictions do not replace the generic veterinary charter. Older population data, old health-center charters and unsupported coordinates are outside this edition's eligible additions.

The private FMD guide required before modifying `docs/` was unavailable; the checks and 404 results are recorded in the plan. No generated documentation was modified. No website feature, merge or publication is claimed by this research deliverable.
