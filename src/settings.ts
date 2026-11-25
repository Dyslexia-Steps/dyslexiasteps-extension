// One settings object in storage.sync. The content script reads it and follows
// storage.onChanged, so the popup only writes storage — it never talks to the page.
export type RulerMode = "off" | "line" | "focus";
export type FontChoice = "page" | "lexend" | "opendyslexic" | "arial" | "verdana";
export type Tint = "none" | "cream" | "blue" | "green" | "rose" | "grey";

export interface Settings {
  enabled: boolean;
  ruler: RulerMode;
  rulerHeight: number; // px
  font: FontChoice;
  letterSpacing: number; // em, 0 = page default
  wordSpacing: number; // em
  lineHeight: number; // unitless, 0 = page default
  tint: Tint;
  tintStrength: number; // 0..0.5
  mirrorLetters: boolean; // b d p q colouring
  rate: number; // speech rate 0.5..1.5
  voice: string; // voiceURI, "" = browser default for the language
  syllableLang: string; // "auto" or a key of PATTERNS
}

export const DEFAULTS: Settings = {
  enabled: true,
  ruler: "off",
  rulerHeight: 44,
  font: "page",
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 0,
  tint: "none",
  tintStrength: 0.18,
  mirrorLetters: false,
  rate: 0.9,
  voice: "",
  syllableLang: "auto",
};

export const TINTS: Record<Exclude<Tint, "none">, string> = {
  cream: "#f5e6b8",
  blue: "#b9d7f0",
  green: "#c4e6c1",
  rose: "#f2c4cf",
  grey: "#c9c9c9",
};

export const api: typeof chrome = (globalThis as any).browser ?? chrome;

export async function loadSettings(): Promise<Settings> {
  const got = await api.storage.sync.get("settings");
  return { ...DEFAULTS, ...((got?.settings as Partial<Settings>) ?? {}) };
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await loadSettings()), ...patch };
  await api.storage.sync.set({ settings: next });
  return next;
}

// Messages between background, popup and content script.
export type Msg =
  | { type: "ping" }
  | { type: "toggleRuler" }
  | { type: "readSelection" }
  | { type: "readText"; text: string }
  | { type: "syllables"; text?: string }
  | { type: "readerMode" }
  | { type: "hyphenate"; text: string; lang: string };
