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
import pasigSourcesFile from "../../data/sources.json";
import placesFile from "../../data/places.json";
import serviceUpdatesFile from "../../data/service-updates.json";
import opportunitiesFile from "../../data/opportunities.json";
import { assertDataFile } from "./schemas";
import { assertRecentData } from "./validate-recent";

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
assertDataFile("pasig-sources", pasigSourcesFile);
assertDataFile("pasig-places", placesFile);
assertDataFile("pasig-service-updates", serviceUpdatesFile);

assertDataFile("pasig-opportunities", opportunitiesFile);

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

export const pasigDataEdition = pasigSourcesFile.edition_date;
export const pasigSources = pasigSourcesFile.sources;
export const places = placesFile.places;
export const serviceUpdates = serviceUpdatesFile.updates;
export const opportunities = opportunitiesFile.opportunities;
export const historicalUpdates = opportunitiesFile.historical_updates;

assertRecentData(pasigSourcesFile, places, serviceUpdates, opportunities, historicalUpdates, barangays.map(x => x.id), services.map(x => x.id));
const sourceIds = new Set(pasigSources.map((source) => source.id));
const placeIds = new Set(places.map((place) => place.id));
const serviceIds = new Set(services.map((service) => service.id));
function requireUnique(ids: string[], label: string) {
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate ${label} id`);
}
requireUnique(pasigSources.map((item) => item.id), "source");
requireUnique(places.map((item) => item.id), "place");
requireUnique(serviceUpdates.map((item) => item.id), "service update");
requireUnique([...opportunities, ...historicalUpdates].map((item) => item.id), "opportunity/history");
for (const place of places) {
  if (Object.values(place.evidence).some((refs) => refs.length === 0)) throw new Error(`A place evidence field is empty (${place.id})`);
  if (place.parent_id && !placeIds.has(place.parent_id)) throw new Error(`Unknown parent place ${place.parent_id} (${place.id})`);
  if (place.barangay_id && !barangays.some((barangay) => barangay.id === place.barangay_id)) throw new Error(`Unknown barangay ${place.barangay_id} (${place.id})`);
  for (const refs of Object.values(place.evidence)) for (const ref of refs) if (!sourceIds.has(ref.split(":")[0])) throw new Error(`Unknown evidence source ${ref} (${place.id})`);
}
for (const update of serviceUpdates) {
  if (update.service_id && !serviceIds.has(update.service_id)) throw new Error(`Unknown service ${update.service_id} (${update.id})`);
  for (const id of update.place_ids ?? []) if (!placeIds.has(id)) throw new Error(`Unknown place ${id} (${update.id})`);
  for (const row of update.rpt_schedules ?? []) if (!placeIds.has(row.place_id)) throw new Error(`Unknown RPT place ${row.place_id} (${update.id})`);
  for (const ref of update.evidence) if (!sourceIds.has(ref.split(":")[0])) throw new Error(`Unknown evidence source ${ref} (${update.id})`);
}
for (const item of [...opportunities, ...historicalUpdates]) {
  if ("service_id" in item && item.service_id && !serviceIds.has(item.service_id)) throw new Error(`Unknown service ${item.service_id} (${item.id})`);
  const refs = [...("place_ids" in item && item.place_ids ? item.place_ids : []), ...("place_id" in item && item.place_id ? [item.place_id] : [])];
  for (const id of refs) if (!placeIds.has(id)) throw new Error(`Unknown place ${id} (${item.id})`);
  for (const ref of item.evidence) if (!sourceIds.has(ref.split(":")[0])) throw new Error(`Unknown evidence source ${ref} (${item.id})`);
}

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
