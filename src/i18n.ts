// Interface text in Filipino (default, served at /) and English (served at /en/).
// Content text comes from the _fil / _en fields in data/.

export const langs = ["fil", "en"] as const;
export type Lang = (typeof langs)[number];

const popular = ["amilyar", "business permit", "birth certificate", "senior", "scholarship"];

export const ui = {
  fil: {
    htmlLang: "fil",
    ogLocale: "fil_PH",
    otherLangName: "English",
    switchLabel: "Basahin sa English",
    skip: "Lumaktaw sa nilalaman",
    home: "BetterPasig, simula",
    tagline: "Bawat serbisyo, benepisyo at opisyal ng Lungsod ng Pasig, malinaw at nasa isang lugar.",
    ogImageAlt: "BetterPasig: ang hugis ng Pasig at ang pangalan ng site",

    emergency: "Emergency",
    moreNumbers: "Iba pang numero",

    heroTitle: "Paano ka namin matutulungan?",
    heroLede: "Serbisyo, benepisyo at impormasyon ng Lungsod ng Pasig, mula sa Citizen's Charter ng bawat opisina.",
    pageDescription:
      "Serbisyo, benepisyo at impormasyon ng Lungsod ng Pasig, mula sa Citizen's Charter ng bawat opisina.",

    navLabel: "Pangunahing menu",
    navServices: "Serbisyo",
    navBenefits: "Benepisyo",
    navBarangay: "Barangay",
    navOfficials: "Opisyal",
    navFunds: "Pondo ng bayan",

    searchLabel: "Maghanap ng serbisyo",
    searchPlaceholder: "Hal. amilyar, birth certificate",
    searchButton: "Hanapin",
    popularLabel: "Madalas hanapin:",
    popular,
    noMatch: "Walang tugma. Subukan ang ibang salita o tingnan ang lahat ng serbisyo.",
    matchOne: "1 tugma",
    matchMany: "{n} tugma",
    searchKeys: "Taas at baba para pumili",

    featuredTitle: "Pinakamadalas na serbisyo",
    featuredLede: "Opisina, tagal at bayad, mula sa Citizen's Charter.",
    colService: "Serbisyo",
    colOffice: "Opisina",
    colTime: "Tagal",
    colFee: "Bayad",
    onlineTag: "May online",

    allServices: "Lahat ng serbisyo",
    fullList: "Buong listahan",
    serviceCount: (services: number, cats: number, offices: number) =>
      `${services} serbisyo sa ${cats} kategorya, mula sa ${offices} opisina.`,
    emptyCategory: "Wala pang serbisyo sa kategoryang ito.",
    requirements: "Mga kailangan",
    stepsLabel: "Mga hakbang",
    whereLabel: "Saan",
    officeContact: "Kontak",
    doOnline: "Gawin ito online",

    benefitsTitle: "Benepisyo at tulong",
    officialsHeading: (term: string) => `Mga opisyal, ${term}`,
    fullDirectory: "Buong direktoryo",
    mayor: "Alkalde",
    viceMayor: "Bise alkalde",
    representative: "Kinatawan",
    councilor: "Konsehal",
    council1: "Konsehal, unang distrito",
    council2: "Konsehal, ikalawang distrito",

    fundsTitle: "Pondo ng bayan",
    fundsLede: "Mga numero mula sa mga dokumento ng Lungsod.",

    mapLabel: "Mapa ng 30 barangay ng Pasig",
    mapPrompt: "Pumili ng barangay",
    yourBarangay: "Ang barangay mo",
    district: "Distrito",
    district1: "Unang distrito",
    district2: "Ikalawang distrito",
    captain: "Punong barangay",
    phone: "Telepono",
    mapCaption: "Hangganan: PSA PSGC. Pindutin ang mapa para pumili.",

    copyNumber: (n: string) => `Kopyahin ang ${n}`,
    copied: "Nakopya:",
    copyFailed: "Hindi makopya. Ang numero:",

    cityHall: "Pasig City Hall",
    cityHallNote: "Pansamantalang City Hall habang itinatayo ang bagong City Hall sa Caruncho Ave.",
    address: "Address",
    openMaps: "Buksan sa Google Maps",
    hours: "Oras",
    trunkline: "Telepono (trunkline)",
    annexes: "Mga annex",
    online: "Online",
    sources: "Pinagmulan",
    checked: "Sinuri",

    otherHotlines: "Iba pang hotline",
    tapToCall: "Pindutin ang numero para tumawag.",
    groupPoliceFire: "Pulis at bumbero",
    groupMedical: "Ospital",
    groupOther: "Rescue at iba pa",

    verify: "Sinusuri pa",
    verifyTitle: "Mula sa hindi opisyal o lumang source. Kinukumpirma pa namin.",

    partOf: "Bahagi ng",
    dataUpdated: "Na-update ang datos",

    notFoundTitle: "Hindi nahanap",
    notFound: "Hindi nahanap ang pahinang ito.",
    backHome: "Bumalik sa simula",

    months: ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"],
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_PH",
    otherLangName: "Filipino",
    switchLabel: "Basahin sa Filipino",
    skip: "Skip to content",
    home: "BetterPasig, home",
    tagline: "Every Pasig City service, benefit and official, clear and in one place.",
    ogImageAlt: "BetterPasig: the outline of Pasig and the site name",

    emergency: "Emergency",
    moreNumbers: "More numbers",

    heroTitle: "How can we help?",
    heroLede: "Pasig City services, benefits, and information, from each office's Citizen's Charter.",
    pageDescription: "Pasig City services, benefits, and information, from each office's Citizen's Charter.",

    navLabel: "Main menu",
    navServices: "Services",
    navBenefits: "Benefits",
    navBarangay: "Barangay",
    navOfficials: "Officials",
    navFunds: "Public funds",

    searchLabel: "Search for a service",
    searchPlaceholder: "e.g. amilyar, birth certificate",
    searchButton: "Search",
    popularLabel: "Often searched:",
    popular,
    noMatch: "No match. Try another word, or look through all services.",
    matchOne: "1 match",
    matchMany: "{n} matches",
    searchKeys: "Up and down to choose",

    featuredTitle: "Most used services",
    featuredLede: "Office, time, and fee, from the Citizen's Charter.",
    colService: "Service",
    colOffice: "Office",
    colTime: "Time",
    colFee: "Fee",
    onlineTag: "Online",

    allServices: "All services",
    fullList: "Full list",
    serviceCount: (services: number, cats: number, offices: number) =>
      `${services} services in ${cats} categories, from ${offices} offices.`,
    emptyCategory: "No services in this category yet.",
    requirements: "Requirements",
    stepsLabel: "Steps",
    whereLabel: "Where",
    officeContact: "Contact",
    doOnline: "Do this online",

    benefitsTitle: "Benefits and assistance",
    officialsHeading: (term: string) => `Officials, ${term}`,
    fullDirectory: "Full directory",
    mayor: "Mayor",
    viceMayor: "Vice mayor",
    representative: "Representative",
    councilor: "Councilor",
    council1: "Councilors, first district",
    council2: "Councilors, second district",

    fundsTitle: "Public funds",
    fundsLede: "Figures from city documents.",

    mapLabel: "Map of Pasig's 30 barangays",
    mapPrompt: "Choose a barangay",
    yourBarangay: "Your barangay",
    district: "District",
    district1: "First district",
    district2: "Second district",
    captain: "Punong barangay",
    phone: "Phone",
    mapCaption: "Boundaries: PSA PSGC. Tap the map to choose.",

    copyNumber: (n: string) => `Copy ${n}`,
    copied: "Copied:",
    copyFailed: "Couldn't copy. The number:",

    cityHall: "Pasig City Hall",
    cityHallNote: "Temporary City Hall while the new City Hall is built on Caruncho Ave.",
    address: "Address",
    openMaps: "Open in Google Maps",
    hours: "Hours",
    trunkline: "Phone (trunkline)",
    annexes: "Annexes",
    online: "Online",
    sources: "Sources",
    checked: "Checked",

    otherHotlines: "Other hotlines",
    tapToCall: "Tap a number to call.",
    groupPoliceFire: "Police and fire",
    groupMedical: "Hospitals",
    groupOther: "Rescue and others",

    verify: "Being checked",
    verifyTitle: "From an unofficial or older source. We're still confirming it.",

    partOf: "Part of",
    dataUpdated: "Data updated",

    notFoundTitle: "Not found",
    notFound: "This page wasn't found.",
    backHome: "Back to home",

    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
} satisfies Record<Lang, unknown>;

export type UI = (typeof ui)[Lang];

export function langFromUrl(url: URL): Lang {
  return url.pathname === "/en" || url.pathname.startsWith("/en/") ? "en" : "fil";
}

/** The same page in the other language: /foo <-> /en/foo. */
export function pathIn(lang: Lang, url: URL): string {
  const base = url.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return lang === "en" ? `/en${base === "/" ? "/" : base}` : base;
}

/** Link to a page in `lang`, e.g. href("en", "/#hotlines") -> "/en/#hotlines". */
export function href(lang: Lang, path: string): string {
  return lang === "en" ? `/en${path}` : path;
}

/** "2026-10-19" -> "Okt 19, 2026" / "Oct 19, 2026". */
export function formatDate(lang: Lang, iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${ui[lang].months[m - 1]} ${d}, ${y}`;
}
