// The site's main menus, shared by every header. `page` is the menu's own page.
import { href, type Lang, ui } from "../i18n";
import { barangays, categories, programs, transparencyLinks } from "./data";

export type NavLink = { label: string; url: string };
export type NavMenu = { id: string; label: string; title: string; page: string; links: NavLink[] };

export function navMenus(lang: Lang): NavMenu[] {
  const t = ui[lang];
  return [
    {
      id: "serbisyo", label: t.navServices, title: t.allServices, page: "/serbisyo/",
      links: categories.map((item) => ({
        label: lang === "en" ? item.name_en : item.name_fil,
        url: href(lang, `/serbisyo#${item.id}`),
      })),
    },
    {
      id: "benepisyo", label: t.navBenefits, title: t.benefitsTitle, page: "/tulong/",
      links: programs.map((item) => ({
        label: lang === "en" ? item.title_en : item.title_fil,
        url: href(lang, `/tulong/#${item.id}`),
      })),
    },
    {
      id: "mapa", label: t.navBarangay, title: t.mapPrompt, page: "/#mapa",
      links: [...barangays].sort((a, b) => a.name.localeCompare(b.name, "fil")).map((item) => ({
        label: item.name, url: href(lang, `/barangay/${item.id}/`),
      })),
    },
    {
      id: "opisyal", label: t.navOfficials, title: t.officialsPageTitle, page: "/opisyal/",
      links: [
        { label: t.mayor, url: href(lang, "/opisyal/#opisyal-mayor") },
        { label: t.viceMayor, url: href(lang, "/opisyal/#opisyal-vice-mayor") },
        { label: t.representative, url: href(lang, "/opisyal/#opisyal-representative") },
        { label: t.council1, url: href(lang, "/opisyal/#opisyal-council-1") },
        { label: t.council2, url: href(lang, "/opisyal/#opisyal-council-2") },
        { label: t.navExOfficio, url: href(lang, "/opisyal/#opisyal-ex-officio") },
        { label: t.navDepartments, url: href(lang, "/opisyal/#opisyal-departamento") },
        { label: t.navBarangayOfficials, url: href(lang, "/opisyal/#opisyal-barangay") },
      ],
    },
    {
      id: "pondo", label: t.navFunds, title: t.fundsTitle, page: "/pondo/",
      links: transparencyLinks.filter((item) => /^https?:\/\//.test(item.url)).map((item) => ({
        label: lang === "en" && item.title_en ? item.title_en : item.title_fil,
        url: item.url,
      })),
    },
  ];
}
