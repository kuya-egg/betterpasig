import { z } from "zod";

// A fact needs a real http(s) URL. null and verify: true stay valid.
// Grouping labels (service categories, directory barangay wrappers) are not facts.

const httpUrl = z.string().refine((value) => /^https?:\/\//.test(value), {
  message: "source must be an http(s) URL",
});

const sourceFields = {
  sources: z.array(httpUrl).optional(),
  source: httpUrl.nullable().optional(),
  verify: z.boolean().optional(),
};

type Sourced = {
  sources?: string[];
  source?: string | null;
  id?: string;
  name?: string;
  office?: string;
};

function labelOf(value: Sourced): string {
  return value.id || value.name || value.office || "";
}

function hasSource(value: Sourced): boolean {
  return (value.sources?.length ?? 0) > 0 || (typeof value.source === "string" && value.source.length > 0);
}

function sourced<T extends z.ZodRawShape>(shape: T) {
  return z.object({ ...shape, ...sourceFields }).superRefine((value, ctx) => {
    const record = value as Sourced;
    if (!hasSource(record)) {
      const label = labelOf(record);
      ctx.addIssue({
        code: "custom",
        message: label ? `${label} needs a source URL` : "needs a source URL",
      });
    }
  });
}

const fact = sourced({});

const directoryBarangay = z.object({
  name: z.string().min(1),
  punong_barangay: fact.nullable().optional(),
  sk_chair: fact.nullable().optional(),
  kagawad: z.array(fact).optional(),
  phones: z.array(fact).optional(),
  hall_address: fact.nullable().optional(),
});

export const dataSchemas = {
  site: z.object({
    emergency_featured: z.array(z.string().min(1)),
    featured_services: z.array(z.string().min(1)),
    city_hall: fact,
    alerts: z.array(fact),
  }),
  hotlines: z.object({
    hotlines: z.array(fact),
  }),
  services: z.object({
    categories: z.array(z.object({ id: z.string().min(1) })),
    offices: z.array(fact),
    services: z.array(fact),
  }),
  barangays: z.object({
    barangays: z.array(fact),
  }),
  city: z.object({
    facts: z.array(fact),
    contact: fact.and(
      z.object({
        other_sites: z.array(fact),
      }),
    ),
  }),
  programs: z.object({
    programs: z.array(fact),
  }),
  officials: z.object({
    officials: z.array(fact),
    department_heads: z.array(fact),
  }),
  facilities: z.object({
    hospitals: z.array(fact),
    evacuation_centers: z.array(fact),
    flood_prone_notes: z.array(fact),
  }),
  "officials-directory": z.object({
    term_sources: z.array(httpUrl).min(1),
    ex_officio: z.array(fact),
    departments: z.array(
      fact.and(
        z.object({
          phones: z.array(fact).optional(),
        }),
      ),
    ),
    barangays: z.array(directoryBarangay),
  }),
  transparency: z.object({
    links: z.array(fact),
    figures: z.array(fact),
  }),
} satisfies Record<string, z.ZodType>;

export function assertDataFile(file: string, data: unknown): void {
  const schema = dataSchemas[file as keyof typeof dataSchemas];
  const result = schema.safeParse(data);
  if (result.success) return;

  const lines = result.error.issues.slice(0, 8).map((issue) => {
    const path = issue.path.join(".");
    return `${path || "(root)"}: ${issue.message}`;
  });
  throw new Error(`data/${file}.json failed the source check:\n${lines.join("\n")}`);
}
