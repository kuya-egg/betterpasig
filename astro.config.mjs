// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://betterpasig.org",
  trailingSlash: "ignore",
  // English at /, Filipino at /fil/: the sitemap lists each page with its hreflang alternate.
  integrations: [react(), sitemap({ i18n: { defaultLocale: "en", locales: { en: "en", fil: "fil" } } })],
  vite: { plugins: [tailwindcss()] },
});
