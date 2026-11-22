// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://betterpasig.org",
  trailingSlash: "ignore",
  // English at /. Every other language is /<code>/: the sitemap lists each page with its hreflang alternate.
  integrations: [react(), sitemap({
    i18n: {
      defaultLocale: "en",
      locales: { en: "en", fil: "fil", ceb: "ceb", ilo: "ilo", hil: "hil", war: "war", bcl: "bcl", pam: "pam" },
    },
  })],
  vite: { plugins: [tailwindcss()] },
});
