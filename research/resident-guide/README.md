# BetterPasig resident and visitor guide

November 18, 2026 · Asia/Manila

BetterPasig serves anyone looking for a city service, assistance, a barangay, or a place to visit. It uses familiar tasks such as paying amilyar and renewing a business permit as direct links. The destination presents the available office, eligibility, fees, requirements, steps and sources. Benefits keep their published eligibility, including residency requirements where applicable. [BetterPasig product brief](../../PRODUCT.md) · [GOV.UK service design guidance](https://www.gov.uk/service-manual/design/introduction-designing-government-services)

## Sources and design decisions

- The header pulls its two call links from the published Pasig DRRMO and national emergency records. The emergency directory carries the source links and existing verification information. This update checked the published numbers without placing calls. [Pasig City emergency contact numbers](https://pasigcity.gov.ph/news-and-releases/emergency-contact-numbers-ng-lungsod-ng-pasig-393) · [Philippine emergency hotline directory](https://ehotlines.e.gov.ph/)
- The clock formats the device clock in `Asia/Manila`. The browser updates once a minute and on return to the tab. The clock makes no synchronization requests. [ECMAScript Internationalization API](https://tc39.es/ecma402/#sec-intl-datetimeformat-constructor) · [PAGASA Philippine Standard Time](https://www.pagasa.dost.gov.ph/astronomy)
- The homepage pairs a Plaza Rizal photograph with shortcuts first on phones. Four more credited photographs anchor the city showcase. Park hours, fees and addresses come from BetterPasig’s sourced place records. The page shows dates and exceptions where recorded. [Photo credits](../../data/photos.json) · [Places and visit sources](../../data/pasyalan.json) · [Astro image guidance](https://docs.astro.build/en/guides/images/)
- The shared navigation uses ordinary links and a native disclosure. Search loads Pagefind on demand, puts focus on the input, and announces result counts and failure states. A visit result can open directly at a place on the homepage. [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Browser evidence

- [Homepage, desktop](home-desktop.jpg) and [homepage, mobile](home-mobile.jpg)
- [Business permit renewal, desktop](service-desktop.jpg) and [financial assistance, mobile](service-mobile.jpg)
- [Maybunga Rainforest Park, mobile](explore-mobile.jpg)

The six featured services have English translations of their original instructions. Older records without translations identify Filipino text for assistive technology. The Draft PRD resident study is still a launch milestone. Generated-document reconciliation requires access to the private FMD guide. [Browser verification commands](../../scripts/README.md)
