// Dates the search box needs to route an expired notice to the archive and to flag an older place source.
// Search results come from Pagefind, which indexes text, not freshness, so the browser checks these dates
// against today (Manila) with src/lib/freshness.ts. Fetched only when a notice or place result appears.
import { historicalUpdates, opportunities, pasigSources, places, serviceUpdates } from "../lib/data";

export function GET() {
  const notices: Record<string, { published: string; event: string | null; historical: boolean }> = {};
  for (const item of serviceUpdates) notices[item.id] = { published: item.published_date, event: null, historical: false };
  for (const item of opportunities) notices[item.id] = { published: item.published_date, event: item.event_date ?? null, historical: false };
  for (const item of historicalUpdates) notices[item.id] = { published: item.published_date, event: null, historical: true };
  const placeDates: Record<string, string> = {};
  for (const place of places) {
    placeDates[place.id] =
      Object.values(place.evidence)
        .flat()
        .map((ref) => pasigSources.find((source) => source.id === ref.split(":")[0])?.published_date ?? "")
        .sort()
        .at(-1) ?? "";
  }
  return new Response(JSON.stringify({ notices, places: placeDates }), { headers: { "Content-Type": "application/json" } });
}
