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
    viewSection: "Tingnan ang seksyon",
    viewPage: "Buksan ang pahina",
    navExOfficio: "Ex-officio na konsehal",
    navDepartments: "Mga pinuno ng opisina",
    navBarangayOfficials: "Mga opisyal ng barangay",
    searchKinds: {
      serbisyo: "Serbisyo",
      lugar: "Lugar",
      barangay: "Barangay",
      tulong: "Benepisyo",
      opisyal: "Opisyal",
      emergency: "Emergency",
      pondo: "Pondo",
      "ngayong-linggo": "Abiso",
      tungkol: "Tungkol",
    } as Record<string, string>,
    searchArchived: "arkibo",
    searchOlderSource: "lumang sanggunian",
    previousPage: "Nakaraan",
    nextPage: "Susunod",
    menuPageLabel: "Pahina {current} sa {total}",
    darkMode: "Madilim na mode",
    useLightMode: "Gumamit ng maliwanag na mode",
    useDarkMode: "Gumamit ng madilim na mode",

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

    // Page /opisyal
    officialsPageTitle: "Mga opisyal ng Pasig",
    cityOfficialsHeading: "Mga opisyal ng lungsod",
    exOfficioHeading: "Ex-officio sa Sangguniang Panlungsod",
    exOfficioConflict: "Hindi magkatugma ang dalawang pinagmulan kung sino ang mga ex-officio. Ipinapakita namin ang dalawa habang kinukumpirma pa.",
    exOfficioSetA: "Unang talaan (opisyal ng lungsod)",
    exOfficioSetB: "Ikalawang talaan (direktoryo)",
    departmentsHeading: "Mga pinuno ng tanggapan",
    barangayOfficialsHeading: "Mga opisyal ng barangay",
    barangayOfficialsNote: "Lahat ng 30 barangay. Galing ang mga pangalan sa mga listahang hindi pa kumpirmado ng opisyal na source.",
    punongBarangay: "Punong Barangay",
    skChair: "SK Chairperson",
    kagawad: "Mga Kagawad",
    hallAddress: "Barangay hall",
    phones: "Telepono",

    // Page /emergency
    allHotlines: "Lahat ng hotline",
    emergencyPageTitle: "Emergency at kaligtasan",
    emergencyLead: "Mga numero at lugar na makakatulong sa oras ng sakuna. Sa matinding emergency, tumawag agad.",
    emergencyGroupMain: "Pangunahing emergency",
    emergencyJump: "Pumunta sa",
    conflictsTitle: "Mga numerong magkakaiba ang sabi ng mga sanggunian",
    conflictsIntro: "Hindi nagkakasundo ang mga sanggunian sa mga numerong ito. Hindi pa tiyak kung alin ang unang subukan. Huwag umasa sa isa lang; subukan muna ang mga numero sa itaas.",
    hospitalsTitle: "Mga ospital",
    hospitalPublic: "Pampubliko",
    hospitalPrivate: "Pribado",
    noContactListed: "Wala pang nakalistang numero.",
    evacTitle: "Mga evacuation center",
    evacCaveat: "Paalala: hindi ito opisyal na listahan.",
    evacNoAddress: "Walang nakalistang address.",
    floodTitle: "Mga lugar na madalas bahain",
    evacBarangayTitle: "Mga evacuation center",
    evacBarangayNone: "Wala pang nakalistang evacuation center para sa barangay na ito.",
    evacBarangayAll: "Tingnan ang lahat ng evacuation center",
    evacBarangayNote: "Mga sentrong binuksan ng lungsod sa mga nakaraang ulan; hindi opisyal na listahan.",

    // Page /tulong (title: benefitsTitle)
    benefitsIntro: "Ang mga benepisyong ito ay mula sa mga ulat at pahina ng lungsod. Ang aplikasyon ay dumadaan sa mga opisyal na tanggapan ng lungsod; kumpirmahin doon ang halaga at petsa.",
    benefitsAll: "Lahat ng benepisyo",
    benefitFor: "Sino ang kwalipikado",
    benefitAmount: "Benepisyo",
    benefitHow: "Paano mag-apply",
    benefitOffice: "Tanggapan",
    relatedBenefits: "Kaugnay na benepisyo",

    // Page /pondo (title: fundsTitle)
    fundsPageIntro: "Ang mga numero ay galing sa mga dokumento at balita ng lungsod. Ang hindi pa kumpirmado ay may markang \"Sinusuri pa\".",
    fundsAll: "Lahat ng numero at link",
    figuresTitle: "Mga numero",
    figureLabel: "Paglalarawan",
    figureValue: "Halaga",
    figureAsOf: "Petsa o taon",
    linksTitle: "Mga link",

    // Page /tungkol
    aboutTitle: "Tungkol sa BetterPasig",
    aboutMissionTitle: "Misyon",
    aboutMission:
      "Ipunin sa isang malinaw, may sanggunian at dalawang-wikang lugar ang lahat ng handog at desisyon ng Lungsod ng Pasig. Panatilihin itong napapanahon para masundan ng mga residente ang nangyayari sa kanilang lungsod.",
    aboutStance:
      "Bukas na ang mga talaan ng Pasig: may sariling FOI ordinance (Ordinance No. 37, s. 2018), may tanggapang Ugnayan sa Pasig, at live-stream ang bidding. Kaya ang BetterPasig ay gabay at tagasubaybay, hindi watchdog. Layunin nitong gawing madaling hanapin at sundan ang mga bukas ngunit nakakalat na talaan.",
    aboutPrinciplesTitle: "Pitong prinsipyo",
    aboutPrinciples: [
      ["Lagyan ng sanggunian ang bawat pahayag.", "Bawat datos ay may link sa opisyal na dokumentong pinagmulan, at petsa kung kailan ito sinuri."],
      ["Ituro ang lungsod, huwag palitan.", "Nagpapaliwanag at gumagabay kami. Ang bayad, aplikasyon at reklamo ay dumadaan sa opisyal na channel."],
      ["Laging walang kinikilingang partido.", "Walang eendorso, walang kulay ng partido, walang pondong pampulitika. Pantay ang pagkakalista ng mga opisyal."],
      ["Para sa bawat edad.", "Payak na Filipino muna, malalaking letra, gumagana sa murang telepono at mabagal na data."],
      ["Bukas mula simula.", "Hayag sa GitHub ang code at datos; kahit sino ay puwedeng magmungkahi ng pagwawasto."],
      ["Aminin agad ang mali.", "Itinatama sa loob ng 48 oras ang mga mali at inilalathala ang talaan ng pagwawasto."],
      ["Walang kokolektahing personal na datos.", "Walang account, walang itinatagong reklamo, walang tracking cookie."],
    ],
    aboutPledgeTitle: "Pangako: walang kinikilingan",
    aboutPledge:
      "Walang kinikilingang partido ang BetterPasig. Pantay ang pagkakalista ng lahat ng opisyal. Walang kulay ng partido at walang eendorso.",
    aboutDataTitle: "Pinagmulan ng datos",
    aboutDataSources: [
      ["Pasig Citizen's Charters 2025", "https://assets.pasigcity.gov.ph", "para sa mga serbisyo"],
      ["PSA PSGC barangay boundaries (faeldon/philippines-json-maps, MIT)", "https://github.com/faeldon/philippines-json-maps", "para sa mapa at logo"],
      ["Resulta ng COMELEC at pambansang balita (Philstar, Inquirer, Rappler, Manila Bulletin, PNA)", "", "para sa mga opisyal"],
    ],
    aboutDataNote:
      "Hinaharang ng pasigcity.gov.ph ang awtomatikong pagbasa, kaya mano-manong sinusuri ng mga boluntaryo ang mga pahina nito at humihiling kami ng datos sa pamamagitan ng eFOI.",
    aboutDisclaimerTitle: "Paunawa",
    aboutGlanceTitle: "Pasig sa isang tingin",
    aboutGlanceNote: "May nakalistang sanggunian ang bawat halaga.",
    aboutFactHead: "Datos",
    aboutValueHead: "Halaga",
    aboutAsOf: "Noong",
    aboutContribTitle: "Open source at pagwawasto",
    aboutContribText:
      "Bukas sa publiko ang code at datos. Kung may mali, iulat ito: itatama sa loob ng 48 oras at ilalathala ang pagwawasto.",
    aboutGithub: "Code at datos sa GitHub",
    aboutReport: "Mag-ulat ng mali",

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
    viewSection: "View section",
    viewPage: "Open page",
    navExOfficio: "Ex-officio councilors",
    navDepartments: "Department heads",
    navBarangayOfficials: "Barangay officials",
    searchKinds: {
      serbisyo: "Service",
      lugar: "Place",
      barangay: "Barangay",
      tulong: "Benefit",
      opisyal: "Official",
      emergency: "Emergency",
      pondo: "Funds",
      "ngayong-linggo": "Notice",
      tungkol: "About",
    } as Record<string, string>,
    searchArchived: "archived",
    searchOlderSource: "older source",
    previousPage: "Previous",
    nextPage: "Next",
    menuPageLabel: "Page {current} of {total}",
    darkMode: "Dark mode",
    useLightMode: "Use light mode",
    useDarkMode: "Use dark mode",

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

    // Page /opisyal
    officialsPageTitle: "Pasig officials",
    cityOfficialsHeading: "City officials",
    exOfficioHeading: "Ex-officio members of the City Council",
    exOfficioConflict: "The two sources disagree on who the ex-officio members are. We show both while this is being confirmed.",
    exOfficioSetA: "First list (city officials)",
    exOfficioSetB: "Second list (directory)",
    departmentsHeading: "Office heads",
    barangayOfficialsHeading: "Barangay officials",
    barangayOfficialsNote: "All 30 barangays. These names come from lists not yet confirmed by an official source.",
    punongBarangay: "Punong Barangay",
    skChair: "SK Chairperson",
    kagawad: "Kagawad",
    hallAddress: "Barangay hall",
    phones: "Phone",

    // Page /emergency
    allHotlines: "All hotlines",
    emergencyPageTitle: "Emergency and safety",
    emergencyLead: "Numbers and places that can help in a disaster. In a serious emergency, call right away.",
    emergencyGroupMain: "Main emergency lines",
    emergencyJump: "Jump to",
    conflictsTitle: "Numbers the sources disagree on",
    conflictsIntro: "The sources disagree on these numbers. Which one to try first is not confirmed. Do not rely on only one; try the numbers above first.",
    hospitalsTitle: "Hospitals",
    hospitalPublic: "Public",
    hospitalPrivate: "Private",
    noContactListed: "No number listed yet.",
    evacTitle: "Evacuation centers",
    evacCaveat: "Note: this is not an official list.",
    evacNoAddress: "No address listed.",
    floodTitle: "Flood-prone areas",
    evacBarangayTitle: "Evacuation centers",
    evacBarangayNone: "No evacuation center is listed yet for this barangay.",
    evacBarangayAll: "See all evacuation centers",
    evacBarangayNote: "Centers the city opened during past rains; not an official list.",

    // Page /tulong (title: benefitsTitle)
    benefitsIntro: "These benefits come from city reports and pages. Applications go through the city's official offices; confirm amounts and dates there.",
    benefitsAll: "All benefits",
    benefitFor: "Who qualifies",
    benefitAmount: "Benefit",
    benefitHow: "How to apply",
    benefitOffice: "Office",
    relatedBenefits: "Related benefits",

    // Page /pondo (title: fundsTitle)
    fundsPageIntro: "These figures come from city documents and news. Anything not yet confirmed is marked \"Being checked\".",
    fundsAll: "All figures and links",
    figuresTitle: "Figures",
    figureLabel: "Description",
    figureValue: "Value",
    figureAsOf: "As of",
    linksTitle: "Links",

    // Page /tungkol
    aboutTitle: "About BetterPasig",
    aboutMissionTitle: "Mission",
    aboutMission:
      "Gather everything the City of Pasig offers and decides into one clear, sourced, bilingual place, and keep it current so residents can follow what is happening in their city.",
    aboutStance:
      "Pasig's records are already open: a local FOI ordinance (Ordinance No. 37, s. 2018), the Ugnayan sa Pasig transparency office, and livestreamed bidding. So BetterPasig is a guide and tracker, not a watchdog. Its job is to make open-but-scattered records easy to find and follow.",
    aboutPrinciplesTitle: "Seven principles",
    aboutPrinciples: [
      ["Source every claim.", "Each fact links to the official document it came from, with the date we checked it."],
      ["Point to the city, never replace it.", "We explain and guide; payments, applications and complaints go through official channels."],
      ["Non-partisan always.", "No endorsements, no party colors, no political funding. Officials are listed equally."],
      ["Built for every age.", "Plain Filipino first, large text, works on a budget phone and slow data."],
      ["Open by default.", "Code and data are public on GitHub; anyone can suggest a correction."],
      ["Admit mistakes fast.", "Corrections are fixed within 48 hours and logged publicly."],
      ["Collect nothing personal.", "No accounts, no stored complaints, no tracking cookies."],
    ],
    aboutPledgeTitle: "Our non-partisan pledge",
    aboutPledge:
      "BetterPasig is non-partisan. Every official is listed equally. There are no party colors and no endorsements.",
    aboutDataTitle: "Data sources",
    aboutDataSources: [
      ["Pasig Citizen's Charters 2025", "https://assets.pasigcity.gov.ph", "for services"],
      ["PSA PSGC barangay boundaries (faeldon/philippines-json-maps, MIT)", "https://github.com/faeldon/philippines-json-maps", "for the map and logo"],
      ["COMELEC results and national news (Philstar, Inquirer, Rappler, Manila Bulletin, PNA)", "", "for officials"],
    ],
    aboutDataNote:
      "pasigcity.gov.ph blocks automated readers, so volunteers check its pages by hand and we request data through eFOI.",
    aboutDisclaimerTitle: "Notice",
    aboutGlanceTitle: "Pasig at a glance",
    aboutGlanceNote: "Each value lists its sources.",
    aboutFactHead: "Fact",
    aboutValueHead: "Value",
    aboutAsOf: "As of",
    aboutContribTitle: "Open source and corrections",
    aboutContribText:
      "Code and data are public. If something is wrong, report it: corrections are fixed within 48 hours and logged publicly.",
    aboutGithub: "Code and data on GitHub",
    aboutReport: "Report a correction",

    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
} satisfies Record<Lang, unknown>;

export type UI = (typeof ui)[Lang];

export function langFromUrl(url: URL): Lang {
  return url.pathname === "/en" || url.pathname.startsWith("/en/") ? "en" : "fil";
}

/** The same page in the other language: /foo <-> /en/foo. */
export function pathIn(lang: Lang, url: URL): string {
  if (/\/(?:en\/)?404(?:\.html)?\/?$/.test(url.pathname)) return lang === 'en' ? '/en/' : '/';
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
