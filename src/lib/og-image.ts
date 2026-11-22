// Shared by SiteHead and scripts/og-images.mjs so the URL and the file land on the same path.
export const ogTitleSuffix = " · BetterPasig";

/** /serbisyo/x/ -> /og/serbisyo/x.png, / -> /og/index.png. The 404 page keeps /og.png. */
export function ogImagePath(pathname: string): string {
  const path = pathname.replace(/\/index\.html$/i, "").replace(/\/+$/, "") || "/";
  if (/(^|\/)404$/.test(path)) return "/og.png";
  if (path === "/") return "/og/index.png";
  return `/og${path}.png`;
}
