// Interface text in Filipino (default, served at /) and English (served at /en/).
// Content text comes from the _fil / _en fields in data/.

export const langs = ["fil", "en"] as const;
export type Lang = (typeof langs)[number];

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

    inProgress: "Ginagawa pa",
    heroTitle: "Bawat serbisyo ng Pasig, malinaw at nasa isang lugar.",
    heroBody: (n: number) =>
      `Inaayos namin ang ${n} serbisyo, mga benepisyo at ang direktoryo ng mga opisyal ng Lungsod ng Pasig para mahanap mo ang kailangan mo sa loob ng isang minuto.`,
    meanwhileBefore: "Habang hinihintay:",
    meanwhileAfter: "para sa opisyal na transaksyon.",
    pageDescription:
      "Ginagawa pa ang BetterPasig: bawat serbisyo, benepisyo at opisyal ng Lungsod ng Pasig, malinaw at nasa isang lugar.",

    mapLabel: "Mapa ng Pasig at ang 30 barangay nito",
    mapPrompt: "Pindutin ang isang barangay",
    mapHint: "Kilalanin ang 30 barangay ng Pasig habang hinihintay.",
    district: "Distrito",
    visited: "Nabisita",
    complete: "Kumpleto! Nabisita mo ang lahat ng 30 barangay ng Pasig.",

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

    inProgress: "Work in progress",
    heroTitle: "Every Pasig service, clear and in one place.",
    heroBody: (n: number) =>
      `We're organizing ${n} Pasig City services, its benefits and its directory of officials so you can find what you need in under a minute.`,
    meanwhileBefore: "In the meantime, go to",
    meanwhileAfter: "for official transactions.",
    pageDescription:
      "BetterPasig is being built: every Pasig City service, benefit and official, clear and in one place.",

    mapLabel: "Map of Pasig and its 30 barangays",
    mapPrompt: "Tap a barangay",
    mapHint: "Get to know Pasig's 30 barangays while you wait.",
    district: "District",
    visited: "Visited",
    complete: "Complete! You've visited all 30 barangays of Pasig.",

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
