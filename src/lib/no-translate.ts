// Barangay names are proper names. A browser's page translator ("Translate to English") must leave them as they are:
// "Bagong Ilog" is not "New River", "Santa Cruz" is not "Holy Cross". Every rendered name is wrapped in
// <span translate="no">: server HTML by src/middleware.ts, text written later by scripts through markNamesInNode.

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Every barangay name, plus the "Sta." / "Sto." forms the sources also use; longest first so "San Jose" never splits. */
export function nameVariants(names: string[]): string[] {
  const all = names.flatMap((name) => {
    const short = name.replace(/^Santa /, "Sta. ").replace(/^Santo /, "Sto. ");
    return short === name ? [name] : [name, short];
  });
  return [...new Set(all)].sort((a, b) => b.length - a.length);
}

/** Whole-word match of any variant; a letter on either side means it is part of another word. */
export function namePattern(variants: string[]): RegExp {
  return new RegExp(`(?<!\\p{L})(?:${variants.map(escape).join("|")})(?!\\p{L})`, "gu");
}

// Text in these elements cannot hold a <span>, or is not shown as text.
const RAW: Record<string, true> = { script: true, style: true, title: true, textarea: true, option: true, noscript: true, template: true, svg: true };

/** Wraps names in the text between tags; tags, attributes and raw-text elements are left as they are. */
export function markNamesInHtml(html: string, pattern: RegExp): string {
  let raw: string | null = null;
  return html.replace(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g, (part) => {
    if (part.startsWith("<")) {
      const close = /^<\/([a-zA-Z][\w-]*)/.exec(part);
      if (raw) {
        if (close?.[1].toLowerCase() === raw) raw = null;
        return part;
      }
      const open = /^<([a-zA-Z][\w-]*)/.exec(part);
      if (open && RAW[open[1].toLowerCase()] && !part.endsWith("/>")) raw = open[1].toLowerCase();
      return part;
    }
    return raw ? part : part.replace(pattern, (name) => `<span translate="no">${name}</span>`);
  });
}

/** The same for text a script has just written into the page (search results). */
export function markNamesInNode(root: Node, pattern: RegExp): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node as Text);
  for (const text of texts) {
    const value = text.data;
    const matches = [...value.matchAll(pattern)];
    if (!matches.length) continue;
    const frag = document.createDocumentFragment();
    let at = 0;
    for (const match of matches) {
      const start = match.index ?? 0;
      frag.append(value.slice(at, start));
      const span = document.createElement("span");
      span.translate = false;
      span.textContent = match[0];
      frag.append(span);
      at = start + match[0].length;
    }
    frag.append(value.slice(at));
    text.replaceWith(frag);
  }
}
