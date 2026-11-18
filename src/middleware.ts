import { defineMiddleware } from "astro:middleware";
import { barangayNamePattern } from "./lib/data";
import { markNamesInHtml } from "./lib/no-translate";

// Runs once per page at build time: barangay names in the HTML are marked translate="no" (see lib/no-translate.ts).
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.startsWith("text/html")) return response;
  return new Response(markNamesInHtml(await response.text(), barangayNamePattern), response);
});
