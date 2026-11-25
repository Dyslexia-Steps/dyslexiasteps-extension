import { api, DEFAULTS, loadSettings, saveSettings, type Msg, type Settings } from "./settings";
import { markUsage, ratingDone, ratingUrl, shouldAskForRating } from "./usage";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const SITE = "https://dyslexiasteps.com";
const SITE_PATH: Record<string, string> = { de: "/de", fr: "/fr", es: "/es", nl: "/nl", pt: "/pt-br", tr: "/tr" };

function i18n() {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    el.textContent = api.i18n.getMessage(el.dataset.i18n!) || el.textContent;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    el.title = api.i18n.getMessage(el.dataset.i18nTitle!);
  });
  const ui = api.i18n.getUILanguage().slice(0, 2);
  document.documentElement.lang = ui;
  $<HTMLAnchorElement>("site").href = `${SITE}${SITE_PATH[ui] ?? ""}?utm_source=extension&utm_medium=popup`;
}

async function activeTab() {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function ensureInjected(): Promise<number | null> {
  const tab = await activeTab();
  if (!tab?.id) return null;
  try {
    await api.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    return tab.id;
  } catch {
    $("notice").hidden = false;
    return null;
  }
}

async function send(msg: Msg) {
  const id = await ensureInjected();
  if (id !== null) await api.tabs.sendMessage(id, msg).catch(() => {});
}

const fmt: Partial<Record<keyof Settings, (v: number) => string>> = {
  rulerHeight: (v) => `${v}px`,
  letterSpacing: (v) => (v ? `${v.toFixed(2)}` : "—"),
  wordSpacing: (v) => (v ? `${v.toFixed(2)}` : "—"),
  lineHeight: (v) => (v ? v.toFixed(1) : "—"),
  tintStrength: (v) => `${Math.round(v * 100)}%`,
  rate: (v) => `${v.toFixed(1)}×`,
};

function render(s: Settings) {
  $<HTMLInputElement>("enabled").checked = s.enabled;
  for (const k of ["rulerHeight", "letterSpacing", "wordSpacing", "lineHeight", "tintStrength", "rate"] as const) {
    const input = $<HTMLInputElement>(k);
    input.value = String(s[k]);
    input.nextElementSibling!.textContent = fmt[k]!(s[k]);
  }
  $<HTMLSelectElement>("font").value = s.font;
  $<HTMLSelectElement>("syllableLang").value = s.syllableLang;
  $<HTMLSelectElement>("voice").value = s.voice;
  $<HTMLInputElement>("mirrorLetters").checked = s.mirrorLetters;
  document.querySelectorAll<HTMLButtonElement>("#ruler button").forEach((b) => b.classList.toggle("on", b.dataset.v === s.ruler));
  document.querySelectorAll<HTMLButtonElement>("#tint button").forEach((b) => b.classList.toggle("on", b.dataset.v === s.tint));
}

async function set(patch: Partial<Settings>) {
  render(await saveSettings(patch));
}

function voices() {
  const sel = $<HTMLSelectElement>("voice");
  const list = speechSynthesis.getVoices();
  if (!list.length) return;
  const keep = sel.value;
  sel.querySelectorAll("option:not([value=''])").forEach((o) => o.remove());
  for (const v of [...list].sort((a, b) => a.lang.localeCompare(b.lang))) {
    const o = document.createElement("option");
    o.value = v.voiceURI;
    o.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(o);
  }
  sel.value = keep;
}

async function rating() {
  await markUsage();
  const url = ratingUrl();
  if (!url || !(await shouldAskForRating())) return;
  const link = $<HTMLAnchorElement>("rateLink");
  link.href = url;
  $("rating").hidden = false;
  link.addEventListener("click", () => void ratingDone());
  $("rateDismiss").addEventListener("click", async () => {
    await ratingDone();
    $("rating").hidden = true;
  });
}

async function main() {
  i18n();
  void rating();
  const s = await loadSettings();
  render(s);
  voices();
  speechSynthesis.onvoiceschanged = () => {
    voices();
    void loadSettings().then(render);
  };
  void ensureInjected();

  $<HTMLInputElement>("enabled").addEventListener("change", (e) => set({ enabled: (e.target as HTMLInputElement).checked }));
  for (const k of ["rulerHeight", "letterSpacing", "wordSpacing", "lineHeight", "tintStrength", "rate"] as const) {
    $<HTMLInputElement>(k).addEventListener("input", (e) => set({ [k]: Number((e.target as HTMLInputElement).value), enabled: true }));
  }
  $<HTMLSelectElement>("font").addEventListener("change", (e) => set({ font: (e.target as HTMLSelectElement).value as Settings["font"], enabled: true }));
  $<HTMLSelectElement>("syllableLang").addEventListener("change", (e) => set({ syllableLang: (e.target as HTMLSelectElement).value }));
  $<HTMLSelectElement>("voice").addEventListener("change", (e) => set({ voice: (e.target as HTMLSelectElement).value }));
  $<HTMLInputElement>("mirrorLetters").addEventListener("change", (e) => set({ mirrorLetters: (e.target as HTMLInputElement).checked, enabled: true }));
  document.querySelectorAll<HTMLButtonElement>("#ruler button").forEach((b) =>
    b.addEventListener("click", () => set({ ruler: b.dataset.v as Settings["ruler"], enabled: true })),
  );
  document.querySelectorAll<HTMLButtonElement>("#tint button").forEach((b) =>
    b.addEventListener("click", () => set({ tint: b.dataset.v as Settings["tint"], enabled: true })),
  );
  $("read").addEventListener("click", () => send({ type: "readSelection" }));
  $("syl").addEventListener("click", () => send({ type: "syllables" }));
  $("reader").addEventListener("click", async () => {
    await send({ type: "readerMode" });
    window.close();
  });
  $("reset").addEventListener("click", () => set({ ...DEFAULTS }));

  const all = $<HTMLInputElement>("allSites");
  all.checked = await api.permissions.contains({ origins: ["<all_urls>"] });
  all.addEventListener("change", async () => {
    // permissions.request must run inside the click handler (user gesture).
    if (all.checked) all.checked = await api.permissions.request({ origins: ["<all_urls>"] });
    else await api.permissions.remove({ origins: ["<all_urls>"] });
  });
}

void main();
