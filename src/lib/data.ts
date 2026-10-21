// Typed access to data/*.json until content collections land (see docs/backlog.md).
import site from "../../data/site.json";
import hotlinesFile from "../../data/hotlines.json";
import servicesFile from "../../data/services.json";

export { site };

export const hotlines = hotlinesFile.hotlines;
export const categories = servicesFile.categories;
export const offices = servicesFile.offices;
export const services = servicesFile.services;

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

export function officeName(id: string): string {
  const office = offices.find((o) => o.id === id);
  return office?.acronym ?? office?.name ?? id;
}
