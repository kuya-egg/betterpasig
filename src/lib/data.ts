// Typed access to data/*.json. A missing source fails the build here.
import site from "../../data/site.json";
import hotlinesFile from "../../data/hotlines.json";
import servicesFile from "../../data/services.json";
import barangaysFile from "../../data/barangays.json";
import cityFile from "../../data/city.json";
import programsFile from "../../data/programs.json";
import officialsDirectoryFile from "../../data/officials-directory.json";
import facilitiesFile from "../../data/facilities.json";
import officialsFile from "../../data/officials.json";
import transparencyFile from "../../data/transparency.json";
import { assertDataFile } from "./schemas";

assertDataFile("site", site);
assertDataFile("hotlines", hotlinesFile);
assertDataFile("services", servicesFile);
assertDataFile("barangays", barangaysFile);
assertDataFile("city", cityFile);
assertDataFile("programs", programsFile);
assertDataFile("officials-directory", officialsDirectoryFile);
assertDataFile("facilities", facilitiesFile);
assertDataFile("officials", officialsFile);
assertDataFile("transparency", transparencyFile);

export { site };

export const hotlines = hotlinesFile.hotlines;
export const hotlinesRetrieved = hotlinesFile.retrieved;
export const categories = servicesFile.categories;
export const offices = servicesFile.offices;
export const services = servicesFile.services;
export const barangays = barangaysFile.barangays;
export const city = cityFile;

export type Hotline = (typeof hotlines)[number];
export type Service = (typeof services)[number];

function byId<T extends { id: string }>(items: T[], ids: string[]): T[] {
  return ids.map((id) => {
    const item = items.find((x) => x.id === id);
    if (!item) throw new Error(`data/site.json references unknown id "${id}"`);
    return item;
  });
}

export const emergencyHotlines = byId(hotlines, site.emergency_featured);
export const featuredServices = byId(services, site.featured_services);
export const otherHotlines = hotlines.filter((h) => !site.emergency_featured.includes(h.id));
export const programs = programsFile.programs;
export const officials = officialsFile.officials;
export const officialsTerm = officialsFile.term;
export const transparencyLinks = transparencyFile.links;
export const transparencyFigures = transparencyFile.figures;
export const servicesRetrieved = servicesFile.retrieved;
export const cityHallHotline = hotlines.find((item) => item.id === "pasig-city-hall-trunkline");

export function serviceStaticPaths() {
  return services.map((service) => {
    if (!service.sources?.length) {
      throw new Error(`A service page needs at least one source (${service.id})`);
    }
    return { params: { id: service.id } };
  });
}

export function officeById(id: string) {
  return offices.find((office) => office.id === id);
}

export function sourceLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const file = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
    if (!file) return host;
    const short = file.length > 36 ? `…${file.slice(-32)}` : file;
    return `${host} · ${short}`;
  } catch {
    return url;
  }
}

export const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`;

export const mapsHref = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export function officeName(id: string): string {
  const office = offices.find((o) => o.id === id);
  return office?.acronym ?? office?.name ?? id;
}
