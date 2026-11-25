// Content script. Injected on demand (popup, menu, shortcut via activeTab) or on
// every page when the user granted <all_urls>. Idempotent: a second injection
// only re-applies settings.
import { Readability } from "@mozilla/readability";
import { api, DEFAULTS, loadSettings, TINTS, type Msg, type Settings } from "./settings";


function t(key: string, subs?: string[]) {
  return api.i18n.getMessage(key, subs) || key;
}

function init() {
  let s: Settings = { ...DEFAULTS };
  const ID = "ds-rs";
  const font = (f: string) => api.runtime.getURL(`fonts/${f}`);

  // ---------- host element with shadow root for all our UI ----------
  const host = document.createElement("ds-reading-support");
  host.style.cssText = "all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483646;";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${UI_CSS}</style>
    <div class="tint"></div>
    <div class="ruler"><div class="mask top"></div><div class="band"></div><div class="mask bottom"></div></div>`;
  document.documentElement.appendChild(host);
  const tintEl = root.querySelector<HTMLDivElement>(".tint")!;
  const rulerEl = root.querySelector<HTMLDivElement>(".ruler")!;

  // ---------- fonts + spacing: one <style> in the page ----------
  const pageStyle = document.createElement("style");
  pageStyle.id = `${ID}-style`;
  (document.head ?? document.documentElement).appendChild(pageStyle);

  const FAMILY: Record<string, string> = {
    lexend: "'DS Lexend', Lexend, Arial, sans-serif",
    opendyslexic: "'DS OpenDyslexic', OpenDyslexic, 'Comic Sans MS', sans-serif",
    arial: "Arial, Helvetica, sans-serif",
    verdana: "Verdana, Geneva, sans-serif",
  };
  // Icon fonts must keep their own family or every icon turns into a letter.
  const TEXT = `body, body *:not(code):not(pre):not(kbd):not(samp):not(svg):not(svg *):not([class*="icon"]):not([class*="Icon"]):not([class*="fa-"]):not(.material-icons):not(.material-symbols-outlined):not(.material-symbols-rounded):not([aria-hidden="true"])`;

  function applyPageStyle() {
    const rules: string[] = [
      `@font-face{font-family:'DS Lexend';font-weight:400;font-display:swap;src:url(${font("lexend-latin-400.woff2")}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`,
      `@font-face{font-family:'DS Lexend';font-weight:400;font-display:swap;src:url(${font("lexend-latin-ext-400.woff2")}) format('woff2');unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`,
      `@font-face{font-family:'DS Lexend';font-weight:700;font-display:swap;src:url(${font("lexend-latin-700.woff2")}) format('woff2')}`,
      `@font-face{font-family:'DS OpenDyslexic';font-weight:400;font-display:swap;src:url(${font("opendyslexic-400.woff2")}) format('woff2')}`,
      `@font-face{font-family:'DS OpenDyslexic';font-weight:700;font-display:swap;src:url(${font("opendyslexic-700.woff2")}) format('woff2')}`,
      `.${ID}-mirror-b{color:#2563eb!important}.${ID}-mirror-d{color:#dc2626!important}.${ID}-mirror-p{color:#16a34a!important}.${ID}-mirror-q{color:#9333ea!important}`,
    ];
    if (s.enabled) {
      const decl: string[] = [];
      if (s.font !== "page") decl.push(`font-family:${FAMILY[s.font]}!important`);
      if (s.letterSpacing > 0) decl.push(`letter-spacing:${s.letterSpacing}em!important`);
      if (s.wordSpacing > 0) decl.push(`word-spacing:${s.wordSpacing}em!important`);
      if (s.lineHeight > 0) decl.push(`line-height:${s.lineHeight}!important`);
      if (decl.length) rules.push(`${TEXT}{${decl.join(";")}}`);
    }
    pageStyle.textContent = rules.join("\n");
  }

  // ---------- tint ----------
  function applyTint() {
    if (!s.enabled || s.tint === "none") {
      tintEl.style.display = "none";
      return;
    }
    tintEl.style.display = "block";
    tintEl.style.background = TINTS[s.tint];
    tintEl.style.opacity = String(Math.min(0.5, Math.max(0.05, s.tintStrength)));
  }

  // ---------- ruler ----------
  let lastY = innerHeight / 3;
  function placeRuler(y = lastY) {
    lastY = y;
    const h = s.rulerHeight;
    const top = Math.max(0, y - h / 2);
    rulerEl.style.setProperty("--top", `${top}px`);
    rulerEl.style.setProperty("--h", `${h}px`);
  }
  function applyRuler() {
    const on = s.enabled && s.ruler !== "off";
    rulerEl.className = `ruler ${on ? s.ruler : ""}`;
    if (on) placeRuler();
  }
  addEventListener("mousemove", (e) => s.ruler !== "off" && placeRuler(e.clientY), { passive: true });
  addEventListener("touchmove", (e) => s.ruler !== "off" && e.touches[0] && placeRuler(e.touches[0].clientY), { passive: true });
  addEventListener("keydown", (e) => {
    if (s.ruler === "off" || !e.altKey) return;
    if (e.key === "ArrowDown") placeRuler(lastY + s.rulerHeight * 0.8);
    if (e.key === "ArrowUp") placeRuler(lastY - s.rulerHeight * 0.8);
  });

  // ---------- b d p q colouring ----------
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "CODE", "PRE", "SVG", "DS-READING-SUPPORT"]);
  let mirrored = false;
  function mirrorOn() {
    if (mirrored || !document.body) return;
    mirrored = true;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || SKIP.has(p.tagName) || p.isContentEditable || p.closest(`[data-${ID}]`)) return NodeFilter.FILTER_REJECT;
        // In flex/grid parents every wrapped letter would become its own item and open gaps.
        if (/flex|grid/.test(getComputedStyle(p).display)) return NodeFilter.FILTER_REJECT;
        return /[bdpq]/.test(n.nodeValue ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes: Text[] = [];
    while (walker.nextNode() && nodes.length < 20000) nodes.push(walker.currentNode as Text);
    for (const n of nodes) {
      const frag = document.createDocumentFragment();
      for (const part of (n.nodeValue ?? "").split(/([bdpq])/)) {
        if (!part) continue;
        if (/^[bdpq]$/.test(part)) {
          const span = document.createElement("span");
          span.className = `${ID}-mirror-${part}`;
          span.dataset[`dsRs`] = "m";
          span.textContent = part;
          frag.appendChild(span);
        } else frag.appendChild(document.createTextNode(part));
      }
      n.replaceWith(frag);
    }
  }
  function mirrorOff() {
    if (!mirrored) return;
    mirrored = false;
    const spans = document.querySelectorAll<HTMLSpanElement>(`span[data-ds-rs="m"]`);
    const parents = new Set<Node>();
    spans.forEach((sp) => {
      if (sp.parentNode) parents.add(sp.parentNode);
      sp.replaceWith(document.createTextNode(sp.textContent ?? ""));
    });
    parents.forEach((p) => p.normalize());
  }

  // ---------- speech panel ----------
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="bar">
      <strong>${t("panelReading")}</strong>
      <span class="grow"></span>
      <button class="pp" title="${t("pause")}">⏸</button>
      <button class="slower" title="${t("slower")}">−</button>
      <span class="rate"></span>
      <button class="faster" title="${t("faster")}">+</button>
      <button class="close" title="${t("close")}">✕</button>
    </div>
    <div class="text" lang=""></div>`;
  root.appendChild(panel);
  const textEl = panel.querySelector<HTMLDivElement>(".text")!;
  const rateEl = panel.querySelector<HTMLSpanElement>(".rate")!;
  const ppBtn = panel.querySelector<HTMLButtonElement>(".pp")!;
  let current = "";
  let offset = 0;

  function pageLang() {
    return document.documentElement.lang || navigator.language || "en";
  }

  function pickVoice(lang: string) {
    const voices = speechSynthesis.getVoices();
    if (s.voice) {
      const v = voices.find((v) => v.voiceURI === s.voice);
      if (v) return v;
    }
    const l = lang.toLowerCase();
    return voices.find((v) => v.lang.toLowerCase() === l) ?? voices.find((v) => v.lang.toLowerCase().startsWith(l.slice(0, 2)));
  }

  function renderWords(text: string, active = -1) {
    textEl.textContent = "";
    let i = 0;
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      const span = document.createElement("span");
      span.textContent = part;
      if (!/^\s+$/.test(part)) {
        span.dataset.start = String(i);
        if (active >= i && active < i + part.length) span.className = "on";
      }
      textEl.appendChild(span);
      i += part.length;
    }
  }

  function highlight(charIndex: number) {
    textEl.querySelectorAll("span.on").forEach((e) => e.classList.remove("on"));
    const spans = Array.from(textEl.querySelectorAll<HTMLSpanElement>("span[data-start]"));
    const hit = spans.filter((e) => Number(e.dataset.start) <= charIndex).pop();
    if (hit) {
      hit.classList.add("on");
      hit.scrollIntoView({ block: "nearest" });
    }
  }

  function speak(text: string, from = 0) {
    text = text.replace(/\s+/g, " ").trim().slice(0, 30000);
    if (!text) {
      toast(t("selectFirst"));
      return;
    }
    speechSynthesis.cancel();
    current = text;
    offset = from;
    panel.hidden = false;
    rateEl.textContent = `${s.rate.toFixed(1)}×`;
    ppBtn.textContent = "⏸";
    if (from === 0) renderWords(text);
    const lang = pageLang();
    textEl.lang = lang;
    const u = new SpeechSynthesisUtterance(text.slice(from));
    u.rate = s.rate;
    u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      offset = from + e.charIndex;
      highlight(offset);
    };
    u.onend = () => (ppBtn.textContent = "▶");
    speechSynthesis.speak(u);
  }

  panel.querySelector(".close")!.addEventListener("click", () => {
    speechSynthesis.cancel();
    panel.hidden = true;
  });
  ppBtn.addEventListener("click", () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      ppBtn.textContent = "▶";
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      ppBtn.textContent = "⏸";
    } else speak(current, 0);
  });
  const changeRate = (d: number) => {
    s.rate = Math.round(Math.min(1.6, Math.max(0.5, s.rate + d)) * 10) / 10;
    void api.storage.sync.set({ settings: s });
    if (speechSynthesis.speaking) speak(current, offset);
    rateEl.textContent = `${s.rate.toFixed(1)}×`;
  };
  panel.querySelector(".slower")!.addEventListener("click", () => changeRate(-0.1));
  panel.querySelector(".faster")!.addEventListener("click", () => changeRate(0.1));
  // Click a word to start reading from it.
  textEl.addEventListener("click", (e) => {
    const start = (e.target as HTMLElement).dataset?.start;
    if (start !== undefined) speak(current, Number(start));
  });

  // ---------- syllable bubble ----------
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.hidden = true;
  root.appendChild(bubble);
  document.addEventListener("mousedown", (e) => {
    if (!e.composedPath().includes(host)) bubble.hidden = true;
  });

  async function syllables(text?: string) {
    const sel = getSelection();
    const raw = (text ?? sel?.toString() ?? "").trim();
    if (!raw) {
      toast(t("selectFirst"));
      return;
    }
    const lang = s.syllableLang === "auto" ? pageLang() : s.syllableLang;
    const res: { lang: string; result: string } = await api.runtime.sendMessage({ type: "hyphenate", text: raw, lang } satisfies Msg);
    const rect = sel && sel.rangeCount ? sel.getRangeAt(0).getBoundingClientRect() : null;
    bubble.replaceChildren();
    const big = document.createElement("div");
    big.className = "syl";
    big.textContent = res.result;
    const row = document.createElement("div");
    row.className = "row";
    const say = document.createElement("button");
    say.textContent = `🔊 ${t("listen")}`;
    say.addEventListener("click", () => speakSyllables(res.result));
    const note = document.createElement("small");
    note.textContent = t("syllableNote", [res.lang.toUpperCase()]);
    row.append(say, note);
    bubble.append(big, row);
    bubble.hidden = false;
    const top = rect && rect.bottom + 12 + 120 < innerHeight ? rect.bottom + 10 : Math.max(10, (rect?.top ?? 200) - 130);
    bubble.style.top = `${top}px`;
    bubble.style.left = `${Math.min(innerWidth - 360, Math.max(10, rect?.left ?? 40))}px`;
  }

  function speakSyllables(split: string) {
    // Read each syllable as its own short utterance, with a pause between them.
    speechSynthesis.cancel();
    const lang = s.syllableLang === "auto" ? pageLang() : s.syllableLang;
    const v = pickVoice(lang);
    for (const word of split.split(/\s+/)) {
      for (const syl of word.split("·")) {
        const u = new SpeechSynthesisUtterance(syl);
        u.rate = Math.min(s.rate, 0.8);
        u.lang = lang;
        if (v) u.voice = v;
        speechSynthesis.speak(u);
      }
    }
  }

  // ---------- reading mode ----------
  let reader: HTMLDivElement | null = null;
  function readerMode() {
    if (reader) {
      reader.remove();
      reader = null;
      return;
    }
    const clone = document.cloneNode(true) as Document;
    clone.querySelectorAll("ds-reading-support").forEach((e) => e.remove());
    const article = new Readability(clone, { charThreshold: 300 }).parse();
    if (!article?.content) {
      toast(t("noArticle"));
      return;
    }
    reader = document.createElement("div");
    reader.className = "reader";
    const fam = s.font === "page" ? FAMILY.lexend : FAMILY[s.font];
    reader.style.setProperty("--ff", fam);
    reader.style.setProperty("--ls", `${s.letterSpacing}em`);
    reader.style.setProperty("--ws", `${s.wordSpacing}em`);
    reader.style.setProperty("--lh", String(s.lineHeight || 1.8));
    reader.style.setProperty("--bg", s.tint === "none" ? "#fbf8f1" : TINTS[s.tint]);
    const bar = document.createElement("div");
    bar.className = "rbar";
    const listen = document.createElement("button");
    listen.textContent = `🔊 ${t("readPage")}`;
    const close = document.createElement("button");
    close.textContent = `✕ ${t("close")}`;
    bar.append(listen, close);
    const body = document.createElement("article");
    const h1 = document.createElement("h1");
    h1.textContent = article.title ?? document.title;
    const content = document.createElement("div");
    // Readability output comes from this same page; parse inert, strip active content, then adopt.
    const parsed = new DOMParser().parseFromString(article.content, "text/html");
    parsed.querySelectorAll("script,style,iframe,object,embed,form,[onload],[onerror]").forEach((e) => e.remove());
    content.append(...Array.from(parsed.body.childNodes).map((n) => document.importNode(n, true)));
    body.append(h1, content);
    reader.append(bar, body);
    root.appendChild(reader);
    listen.addEventListener("click", () => speak(`${h1.textContent}. ${content.innerText}`));
    close.addEventListener("click", () => readerMode());
  }

  // ---------- toast ----------
  function toast(msg: string) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  // ---------- apply ----------
  function applyAll() {
    applyPageStyle();
    applyTint();
    applyRuler();
    if (s.enabled && s.mirrorLetters) mirrorOn();
    else mirrorOff();
  }

  async function refresh() {
    s = await loadSettings();
    if (!host.isConnected) document.documentElement.appendChild(host);
    applyAll();
  }

  api.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) {
      s = { ...DEFAULTS, ...(changes.settings.newValue ?? {}) };
      applyAll();
    }
  });

  api.runtime.onMessage.addListener((msg: Msg, _sender, reply) => {
    switch (msg.type) {
      case "ping":
        void refresh();
        break;
      case "readSelection":
        speak(getSelection()?.toString() ?? "");
        break;
      case "readText":
        speak(msg.text);
        break;
      case "syllables":
        void syllables(msg.text);
        break;
      case "readerMode":
        readerMode();
        break;
    }
    reply(true);
    return false;
  });

  void refresh();
  return { refresh };
}

const UI_CSS = `
:host{all:initial}
*{box-sizing:border-box;font-family:Lexend,'DS Lexend',system-ui,-apple-system,Segoe UI,Arial,sans-serif}
.tint{position:fixed;inset:0;mix-blend-mode:multiply;display:none;pointer-events:none}
.ruler{position:fixed;inset:0;pointer-events:none;display:none}
.ruler.line,.ruler.focus{display:block}
.ruler .band{position:fixed;left:0;right:0;top:var(--top);height:var(--h);border-top:2px solid rgba(79,70,229,.55);border-bottom:2px solid rgba(79,70,229,.55)}
.ruler.line .band{background:rgba(245,158,11,.16)}
.ruler .mask{position:fixed;left:0;right:0;background:rgba(15,23,42,.55);display:none}
.ruler.focus .mask{display:block}
.ruler .top{top:0;height:var(--top)}
.ruler .bottom{top:calc(var(--top) + var(--h));bottom:0}
.panel{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);width:min(760px,calc(100vw - 24px));max-height:42vh;display:flex;flex-direction:column;background:#fffdf7;color:#1e1b4b;border:1px solid #e5e1f5;border-radius:16px;box-shadow:0 18px 50px rgba(15,23,42,.25);pointer-events:auto;overflow:hidden}
.panel[hidden],.bubble[hidden]{display:none}
.bar{display:flex;align-items:center;gap:6px;padding:8px 12px;background:#4f46e5;color:#fff;font-size:14px}
.bar .grow{flex:1}
.bar button{all:unset;cursor:pointer;min-width:30px;height:30px;text-align:center;border-radius:8px;background:rgba(255,255,255,.16);font-size:15px;line-height:30px}
.bar button:hover{background:rgba(255,255,255,.3)}
.rate{min-width:38px;text-align:center;font-variant-numeric:tabular-nums}
.text{padding:14px 18px;overflow:auto;font-size:21px;line-height:1.8;letter-spacing:.04em;word-spacing:.12em}
.text span[data-start]{cursor:pointer;border-radius:5px;padding:0 1px}
.text span.on{background:#fde68a;box-shadow:0 0 0 2px #fde68a}
.bubble{position:fixed;max-width:350px;background:#fff;color:#1e1b4b;border:1px solid #e5e1f5;border-radius:14px;padding:12px 14px;box-shadow:0 12px 36px rgba(15,23,42,.22);pointer-events:auto}
.syl{font-size:26px;line-height:1.5;letter-spacing:.05em;word-break:break-word}
.row{display:flex;align-items:center;gap:10px;margin-top:8px}
.row button{all:unset;cursor:pointer;white-space:nowrap;background:#4f46e5;color:#fff;border-radius:999px;padding:5px 12px;font-size:13px}
.row small{color:#6b7280;font-size:11px;line-height:1.3}
.reader{position:fixed;inset:0;overflow:auto;background:var(--bg);pointer-events:auto;color:#1f2937}
.rbar{position:sticky;top:0;display:flex;justify-content:flex-end;gap:8px;padding:10px 16px;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);border-bottom:1px solid rgba(0,0,0,.06)}
.rbar button{all:unset;cursor:pointer;background:#4f46e5;color:#fff;border-radius:999px;padding:7px 14px;font-size:14px}
.rbar button:last-child{background:#e5e7eb;color:#111827}
.reader article{max-width:68ch;margin:0 auto;padding:28px 22px 80px;font-family:var(--ff);font-size:21px;letter-spacing:var(--ls);word-spacing:var(--ws);line-height:var(--lh)}
.reader article *{font-family:var(--ff);max-width:100%}
.reader h1{font-size:1.6em;line-height:1.3}
.reader img{height:auto;border-radius:8px}
.reader a{color:#4338ca}
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#1e1b4b;color:#fff;padding:9px 16px;border-radius:999px;font-size:14px;pointer-events:none}
`;

// Bootstrap last: UI_CSS above must be initialised before init() runs.
const W = window as any;
if (W.__dsReadingSupport) {
  W.__dsReadingSupport.refresh();
} else {
  W.__dsReadingSupport = init();
}
