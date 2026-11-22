// Live notices from data/site.json `alerts`: sourced, not expired (Manila date), with text in the page language.
import { site } from "./data";
import { manilaDate } from "./freshness";
import { contentLang, type Lang } from "../i18n";

type Alert = { text_fil?: string; text_en?: string; expires?: string; source?: string | null };

export function liveAlerts(lang: Lang, now = new Date()): { text: string; source: string; host: string; expires?: string }[] {
  const today = manilaDate(now);
  return (site.alerts as readonly Alert[]).flatMap((alert) => {
    const text = (contentLang(lang) === "en" ? alert.text_en || alert.text_fil : alert.text_fil)?.trim();
    if (!text || text === "...") return [];
    if (!alert.source || !/^https?:\/\//.test(alert.source)) return [];
    if (alert.expires && alert.expires < today) return [];
    return [{ text, source: alert.source, host: new URL(alert.source).hostname.replace(/^www\./, ""), expires: alert.expires }];
  });
}
