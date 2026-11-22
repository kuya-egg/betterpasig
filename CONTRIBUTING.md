# Contributing to BetterPasig

## Report a problem without editing code

[Check existing issues](https://github.com/kuya-egg/betterpasig/issues), then [open an issue](https://github.com/kuya-egg/betterpasig/issues/new) if nobody has reported it. Include the BetterPasig page link, what needs changing, and a public source URL if you have one. For a site bug, include the steps to reproduce it, your browser and device, and a screenshot if it helps. Don't post personal records, private contact details, or application documents.

## Help with Pasig information

- **Correct a fact.** Find the record in [`data/`](data/) and follow the [data guide](data/README.md). Prefer a city or national government source; use established news outlets only where the data guide allows them. Include the source URL and, for a long document, the page or section that supports the change.
- **Verify your barangay's directory.** Confirm the public office information with your barangay hall. Include the date you checked and a public source for any proposed change. If the hall confirms something by phone but you can't find a public source, report it in an issue so it can be reviewed; don't mark it verified yourself.
- **Keep English and Filipino content in sync.** Update the `_en` and `_fil` fields together where applicable. The other language pages reuse the Filipino fields. Keep names, amounts, dates, and phone numbers consistent. Don't translate barangay names. Use `null` for unknown values and keep `verify: true` on details still being checked.

A maintainer who didn't author the change reviews factual updates before merge. Keep the guide nonpartisan, preserve the unofficial-site disclaimer, and don't add personal data or tracking cookies.

## Submit a pull request

1. [Fork the repository](https://github.com/kuya-egg/betterpasig/fork) if you don't have write access. Start a new branch from the latest `dev` in the upstream repository, not from the default branch, `main`.
2. Follow the [local setup](README.md#quick-start). For page or wording changes, check the affected pages in English (`/`) and Filipino (`/fil/`). If you change interface text, also check one regional page such as `/ceb/`. For search changes, use the built preview.
3. Run the checks below. If you changed content in `data/`, also run `bun scripts/count_verify.mjs data` and review which records are still flagged. The count is not a fact check.
4. Push your branch and open a pull request with **`kuya-egg/betterpasig:dev` as the base**. Describe what changed and how you checked it. Include source links for facts and before/after screenshots for visible changes.

```bash
bun run check
bun run build
```

See the [check workflow](.github/workflows/check.yml) for the full CI checks and the [scripts guide](scripts/README.md) for browser verification. Maintainers merge approved changes into `dev` first, then open a separate pull request from `dev` to `main` to release them.
