// Everyday Filipino words and the terms the data uses. Pagefind has no synonym feature, so the search box
// runs one extra Pagefind query per matching pair ("sedula" also searches "community tax" and "cedula")
// and merges the results. This is the only list; add a pair here, nowhere else.
export const synonyms: [string, string[]][] = [
  ["amilyar", ["real property tax"]],
  ["tulong pinansyal", ["financial assistance", "ayuda"]],
  ["parke", ["park"]],
  ["sedula", ["community tax", "cedula"]],
  ["kapanganakan", ["birth"]],
  ["kasal", ["marriage"]],
  ["namatay", ["death"]],
  ["libing", ["burial"]],
  ["negosyo", ["business"]],
  ["trabaho", ["job", "employment"]],
  ["lisensya", ["license"]],
  ["pensyon", ["pension"]],
  ["iskolar", ["scholarship"]],
  ["nakatatanda", ["senior"]],
  ["kapansanan", ["pwd", "disability"]],
  ["ospital", ["hospital"]],
  ["baha", ["flood"]],
];

const phrase = (term: string) => (term.includes(" ") ? `"${term}"` : term);
const wholeWord = (term: string) => new RegExp(`(?<![\\p{L}\\p{N}])${term}(?![\\p{L}\\p{N}])`, "u");

// The query itself first, then the query with one whole word or phrase swapped for its counterpart.
export function searchVariants(query: string): string[] {
  const q = query.trim().toLowerCase();
  const variants = [q];
  for (const [word, terms] of synonyms) {
    if (wholeWord(word).test(q)) for (const term of terms) variants.push(q.replace(wholeWord(word), phrase(term)));
    for (const term of terms) if (wholeWord(term).test(q)) variants.push(q.replace(wholeWord(term), word));
  }
  return [...new Set(variants)].slice(0, 8);
}
