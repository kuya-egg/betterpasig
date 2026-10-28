const timezone = "Asia/Manila";
export function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function manilaDate(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function nextManilaMidnight(now: Date): number {
  const [year, month, day] = manilaDate(now).split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  return Date.parse(`${next}T00:00:00+08:00`);
}

export function windowStart(asOf: string): string {
  const date = new Date(`${asOf}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 29);
  return date.toISOString().slice(0, 10);
}

export function isSourceFresh(published: string | null | undefined, now: Date): boolean {
  if (!published || !validDate(published)) return false;
  const today = manilaDate(now);
  return published >= windowStart(today) && published <= today;
}

export function eventState(eventDate: string | null | undefined, now: Date): "upcoming" | "today" | "past" | "unknown" {
  if (!eventDate || !validDate(eventDate)) return "unknown";
  const today = manilaDate(now);
  return eventDate < today ? "past" : eventDate > today ? "upcoming" : "today";
}

export function factState(fact: {effective_until?: string | null}, source: {published_at?: string; review_status?: string}, now: Date) {
  return { review: source.review_status === 'reviewed' ? 'reviewed' : 'pending', age: isSourceFresh(source.published_at, now) ? 'fresh' : 'stale', effective: fact.effective_until && fact.effective_until < manilaDate(now) ? 'past' : 'unspecified' };
}
export function opportunityState(record: {published_date: string; event_date?: string | null}, now: Date) {
  return {source: isSourceFresh(record.published_date, now) ? 'fresh' : 'stale', event: eventState(record.event_date, now), availability: 'unknown'};
}

export function currentServiceState(cutoff: string | null | undefined, now: Date): "active" | "past" | "unknown" {
  if (!cutoff) return "unknown";
  const time = Date.parse(cutoff);
  return Number.isFinite(time) ? (now.getTime() >= time ? "past" : "active") : "unknown";
}
