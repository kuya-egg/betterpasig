// Matches facilities.json evacuation centers to barangays.json by name ("Sta." = "Santa").
import { barangays, facilities } from "./data";

const norm = (name: string) =>
  name
    .toLowerCase()
    .replace(/\bsta\.?\s/g, "santa ")
    .replace(/\bsto\.?\s/g, "santo ")
    .replace(/\s+/g, " ")
    .trim();

export const barangayIdByCenterName = (name: string): string | undefined =>
  barangays.find((b) => norm(b.name) === norm(name))?.id;

export const evacuationCenters = facilities.evacuation_centers.map((c) => ({
  ...c,
  barangayId: barangayIdByCenterName(c.barangay),
}));

export const centersForBarangay = (id: string) => evacuationCenters.filter((c) => c.barangayId === id);
