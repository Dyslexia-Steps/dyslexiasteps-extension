// Syllable breaks from TeX hyphenation patterns (the `hyphen` package).
// Patterns mark where a word may be hyphenated, which is close to — not the same
// as — spoken syllables; the UI says "approximate". Runs in the background only,
// so the ~1.3 MB of patterns never loads into web pages.
import { hyphenateSync as en } from "hyphen/en-us";
import { hyphenateSync as de } from "hyphen/de-1996";
import { hyphenateSync as fr } from "hyphen/fr";
import { hyphenateSync as es } from "hyphen/es";
import { hyphenateSync as nl } from "hyphen/nl";
import { hyphenateSync as pt } from "hyphen/pt";
import { hyphenateSync as tr } from "hyphen/tr";

type Fn = (text: string, opts?: { hyphenChar?: string; minWordLength?: number }) => string;
export const PATTERNS: Record<string, Fn> = { en, de, fr, es, nl, pt, tr } as Record<string, Fn>;

export function pickLang(lang: string): string {
  const k = (lang || "en").toLowerCase().slice(0, 2);
  return k in PATTERNS ? k : "en";
}

export function hyphenateText(text: string, lang: string): { lang: string; result: string } {
  const k = pickLang(lang);
  return { lang: k, result: PATTERNS[k](text.slice(0, 2000), { hyphenChar: "·", minWordLength: 4 }) };
}
