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
import lifeEventsFile from "../../data/life-events.json";
import pasyalanFile from "../../data/pasyalan.json";
import { assertDataFile } from "./schemas";
import { assertRecentData } from "./validate-recent";
import { namePattern, nameVariants } from "./no-translate";
import { assertTrustedSources } from "./source-policy";

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

// Hard rule (docs/state.md D7): every citation is official or a major news outlet. photos.json holds image
// credits and licences, not facts, so it is not checked here.
for (const [file, data] of Object.entries({
  site,
  hotlines: hotlinesFile,
  services: servicesFile,
  barangays: barangaysFile,
  city: cityFile,
  programs: programsFile,
  "officials-directory": officialsDirectoryFile,
  facilities: facilitiesFile,
  officials: officialsFile,
  transparency: transparencyFile,
  sources: pasigSourcesFile,
  places: placesFile,
  "service-updates": serviceUpdatesFile,
  opportunities: opportunitiesFile,
  "life-events": lifeEventsFile,
  pasyalan: pasyalanFile,
})) assertTrustedSources(file, data);

export { site };

export const hotlines = hotlinesFile.hotlines;
export const hotlinesRetrieved = hotlinesFile.retrieved;
export const categories = servicesFile.categories;
export const offices = servicesFile.offices;
export const services = servicesFile.services;
export const barangays = barangaysFile.barangays;
export const city = cityFile;
/** every barangay name as a page may print it ("Santa Lucia", "Sta. Lucia"); see lib/no-translate.ts */
export const barangayNames = nameVariants(barangays.map((item) => item.name));
export const barangayNamePattern = namePattern(barangayNames);

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
export const programs = programsFile.programs;
export const officials = officialsFile.officials;
export const officialsTerm = officialsFile.term;
export const transparencyLinks = transparencyFile.links;
export const transparencyFigures = transparencyFile.figures;
export const servicesRetrieved = servicesFile.retrieved;
export const cityHallHotline = hotlines.find((item) => item.id === "pasig-city-hall-trunkline");
export const hotlineConflicts = hotlinesFile.conflicts;
export const officialsRetrieved = officialsFile.retrieved;
export const departmentHeads = officialsFile.department_heads;
export const officialsDirectory = officialsDirectoryFile;
export const facilities = facilitiesFile;
export const programsRetrieved = programsFile.retrieved;
export const transparencyRetrieved = transparencyFile.retrieved;

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

assertDataFile("life-events", lifeEventsFile);
requireUnique(lifeEventsFile.events.map((event) => event.id), "life event");
const eventIds = new Set(lifeEventsFile.events.map((event) => event.id));
// A life event groups existing records; the services and programs keep their own sources.
export const lifeEvents = lifeEventsFile.events.map((event) => {
  for (const id of event.related) if (!eventIds.has(id)) throw new Error(`Unknown related life event ${id} (${event.id})`);
  return {
    ...event,
    serviceList: event.services.map((id) => {
      const service = services.find((item) => item.id === id);
      if (!service) throw new Error(`Unknown service ${id} (life event ${event.id})`);
      return service;
    }),
    programList: event.programs.map((id) => {
      const program = programs.find((item) => item.id === id);
      if (!program) throw new Error(`Unknown program ${id} (life event ${event.id})`);
      return program;
    }),
  };
});

assertDataFile("pasyalan", pasyalanFile);
requireUnique(pasyalanFile.places.map((place) => place.id), "pasyalan");
for (const place of pasyalanFile.places) {
  if (place.barangay_id && !barangays.some((barangay) => barangay.id === place.barangay_id)) throw new Error(`Unknown barangay ${place.barangay_id} (pasyalan ${place.id})`);
}
// Places to visit; `kind: "bago"` with `opened` marks a place that opened recently.
export const pasyalan = pasyalanFile.places;
export const pasyalanRetrieved = pasyalanFile.retrieved;
export type LifeEvent = (typeof lifeEvents)[number];

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
    const parts = parsed.pathname.split("/").filter(Boolean);
    const file = decodeURIComponent(parts.pop() ?? "");
    if (!file) return host;
    // a shortened URL: host, then the file, eliding any folders between
    const short = file.length > 36 ? `…${file.slice(-32)}` : file;
    return parts.length ? `${host}/…/${short}` : `${host}/${short}`;
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
