// Typed access to data/*.json until content collections land (see docs/backlog.md).
import site from "../../data/site.json";
import hotlinesFile from "../../data/hotlines.json";
import servicesFile from "../../data/services.json";
import barangaysFile from "../../data/barangays.json";
import cityFile from "../../data/city.json";

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

export const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`;

export const mapsHref = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export function officeName(id: string): string {
  const office = offices.find((o) => o.id === id);
  return office?.acronym ?? office?.name ?? id;
}
