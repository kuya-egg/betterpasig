// Pagefind indexes only <main> of detail pages. The home page, the services list and 404 are left out so a
// result is the page that answers the query. `kind` (the section) becomes the result's category label.
export function pagefindSection(url: URL): { indexed: boolean; section: string } {
  const [section = "", detail] = url.pathname.replace(/^\/en(?=\/|$)/, "").split("/").filter(Boolean);
  const needsDetail = ["serbisyo", "lugar", "barangay", "buhay"].includes(section);
  const indexed = section !== "" && section !== "404" && (!needsDetail || Boolean(detail));
  return { indexed, section };
}
