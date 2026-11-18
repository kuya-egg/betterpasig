// Photographs of Pasig (data/photos.json) joined to their files in src/assets/photos for astro:assets.
import type { ImageMetadata } from "astro";
import photosFile from "../../data/photos.json";
import type { Lang } from "../i18n";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/photos/*.jpg", { eager: true });

export const photos = photosFile.photos.map((photo) => {
  const file = files[`../assets/photos/${photo.file}`];
  if (!file) throw new Error(`data/photos.json: missing src/assets/photos/${photo.file}`);
  if (!/^https:\/\/commons\.wikimedia\.org\//.test(photo.page)) throw new Error(`data/photos.json: ${photo.id} needs its Commons page`);
  return { ...photo, image: file.default };
});

export type Photo = (typeof photos)[number];

export function photo(id: string): Photo {
  const found = photos.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown photo "${id}"`);
  return found;
}

export const photoAlt = (item: Photo, lang: Lang) => (lang === "en" ? item.alt_en : item.alt_fil);
