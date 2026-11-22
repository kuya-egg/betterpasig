// Home page presentation helpers: line icons for service categories and the short labels used on the home shortcuts.
// Every fact (titles, fees, dates, numbers) still comes from data/*.json.

export const arrowPath = "M5 12h14 M13 6l6 6-6 6";
export const phonePath = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z";
export const messagePath = "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z";

// keyed by the `icon` field of data/services.json categories
const categoryIcons: Record<string, string> = {
  document: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6",
  business: "M3 9l1-5h16l1 5 M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 M5 12v8h14v-8",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6",
  home: "M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6",
  health: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1 M17 11a2.5 2.5 0 1 0 0-5 M21 19v-1a4 4 0 0 0-3-3.8",
  school: "M2 9l10-5 10 5-10 5z M6 11v5c3 2.5 9 2.5 12 0v-5",
  briefcase: "M3 8h18v12H3z M8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3 M3 13h18",
  leaf: "M5 19C5 10 10 5 20 4c0 10-4 15-12 15 M5 19c2-5 5-8 9-10",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  megaphone: "M3 11v3h3l8 4V7L6 11z M18 9a4 4 0 0 1 0 6 M7 14l1 6h3l-1-5",
  building: "M5 21V4h9v17 M14 9h5v12 M8 8h3 M8 12h3 M8 16h3 M3 21h18",
};

export const categoryIcon = (icon: string | undefined) => categoryIcons[icon ?? ""] ?? categoryIcons.document;

// "Madalas hanapin" links under the search box. The words live in ui.popularLink.
export const popularLinkIds = ["senior-citizen-id", "business-permit-renewal", "aics", "pay-real-property-tax"] as const;
