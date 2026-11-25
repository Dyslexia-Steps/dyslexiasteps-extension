# Store listing — Dyslexia Steps Reading Support

Upload: `dist/dyslexiasteps-extension-chrome-<v>.zip` → Chrome Web Store, Edge Add-ons (same zip).
`dist/dyslexiasteps-extension-firefox-<v>.zip` → addons.mozilla.org (source: readable, unminified bundle;
if asked, upload this repo without node_modules/dist + "npm ci && npm run build").

## Name
Dyslexia Steps: Read Aloud & Reading Ruler  (localised in _locales/*/messages.json, 7 languages; per-language table in "1.0.1 update" below)

## Summary (≤132)
Read aloud any web page with word highlighting, plus a reading ruler, dyslexia-friendly fonts, spacing and syllables. Free, private.

## Category
Chrome: Accessibility · Edge: Accessibility · Firefox: Accessibility (+ Education)

## Description
Paste `store/descriptions/en.md` (other languages: `store/descriptions/<locale>.md`).

## Single purpose (CWS field)
Help people read text on web pages more comfortably: reading ruler, text spacing/font, tint, read-aloud, syllable breaks and a distraction-free reading view.

## Permission justifications (paste each into its own CWS field)

**activeTab**
Applies the user's reading settings (ruler, spacing, font, tint, read-aloud) to the page they are on, only when they open the popup, use the right-click menu or a keyboard shortcut.

**scripting**
Injects the extension's own bundled reading-support script into the current tab so the ruler, spacing, font, tint, read-aloud and reading view can be shown. No remote code is loaded.

**storage**
Saves the user's reading settings (font, spacing, ruler, tint, speech rate) in browser sync storage so they stay the same across pages and sessions. No personal data is stored.

**contextMenus**
Adds three right-click items on selected text: "Read aloud", "Split into syllables" and "Open reading mode".

**Host permission (optional <all_urls>)**
Optional. Requested only if the user turns on "Keep on for every site", so their reading settings apply on every page without opening the popup each time. The extension works without it.

**Remote code:** No.

## Data usage (CWS privacy tab)
Collects nothing. Tick none of the data types. Certify: not sold, not used for unrelated purposes, not used for creditworthiness.
Privacy policy URL: https://dyslexiasteps.com/extension#privacy  (section must exist on the landing before submission)

## Assets
- Icon 128: static/icons/128.png
- Screenshots 1280×800: store/screenshot-*.png
- Small promo tile 440×280: store/promo-small-440x280.png
- Homepage: https://dyslexiasteps.com/extension


## CWS panel — every field, in panel order
Nothing on this list is optional to check; fields marked (leave empty) really stay empty.

### Package
Upload `dist/dyslexiasteps-extension-chrome-<version>.zip` (current: 1.0.1).

### Store listing
- Description: "Description" section above (paste as-is).
- Category: Accessibility
- Language: English (other languages come from _locales automatically).
- Store icon: static/icons/128.png
- Screenshots: every store/screenshot-*.png (1280×800), in file-name order.
- Small promo tile: store/promo-small-440x280.png
- Marquee promo tile, promo video: (leave empty)
- Official URL: https://dyslexiasteps.com (shows only after the domain is verified in Search Console with this same Google account)
- Homepage URL: https://dyslexiasteps.com/extension
- Support URL: https://dyslexiasteps.com/extension
- Mature content: No

### Privacy
- Single purpose: "Single purpose" section above.
- Permission justifications: one field per permission, text from "Permission justifications" above.
- Are you using remote code? **No** (justification field: leave empty)
- Data usage — "What user data do you plan to collect?": tick **none** of the 9 boxes
  (personally identifiable, health, financial/payment, authentication, personal communications,
  location, web history, user activity, website content). Reading the open page or camera
  locally is not "collecting": nothing leaves the browser.
- Data usage — tick **all 3** certifications (not sold/transferred, not used for unrelated
  purposes, not used for creditworthiness/lending).
- Privacy policy URL: https://dyslexiasteps.com/extension#privacy (must be live before "Submit for review")

### Distribution
- Payments: Free (no in-app purchases)
- Visibility: Public
- Regions: All regions

### Test instructions
- Doesn't need one. Install, select text on any page, right-click → Read aloud / Split into syllables / Open reading mode, or open the toolbar popup to change font, spacing, ruler and tint.
- Username / password: (leave empty)

### Account (once per developer account)
- Trader declaration: non-trader (user's decision 2026-11-25)
- Publisher display name: brand name; verify the contact email.


## 1.0.1 update — panel steps (Chrome Web Store)
Do this only after 1.0.0 is approved (a new package during review restarts it).

1. Package → **Upload new package** → `dist/dyslexiasteps-extension-chrome-1.0.1.zip`.
2. Name and summary are inside the package (`_locales/*/messages.json`); the store picks them up per language automatically.
3. Store listing → language dropdown → for each language below, paste the description file into **Description**. Screenshots, icon and tile stay the same.

| Language in dropdown | Description file | Name (auto) | Summary (auto) |
|---|---|---|---|
| English | `store/descriptions/en.md` | Dyslexia Steps: Read Aloud & Reading Ruler | Read aloud any web page with word highlighting, plus a reading ruler, dyslexia-friendly fonts, spacing and syllables. Free, private. |
| German (Deutsch) | `store/descriptions/de.md` | Dyslexia Steps: Vorlesen & Leselineal | Text vorlesen lassen mit Wortmarkierung, Leselineal, Legasthenie-Schriften, mehr Abstand und Silben auf jeder Webseite. Kostenlos. |
| French (Français) | `store/descriptions/fr.md` | Dyslexia Steps : voix haute et règle de lecture | Lecture à voix haute surlignée, règle de lecture, police pour la dyslexie, espacement et syllabes sur tout site. Gratuit et privé. |
| Spanish (Español) | `store/descriptions/es.md` | Dyslexia Steps: Texto a voz y regla de lectura | Leer en voz alta cualquier web con palabras resaltadas, regla de lectura, letra para dislexia, espaciado y sílabas. Gratis, privado. |
| Dutch (Nederlands) | `store/descriptions/nl.md` | Dyslexia Steps: Voorlezen & leesliniaal | Tekst voorlezen met woordmarkering, leesliniaal, dyslexie-lettertypes, meer afstand en lettergrepen op elke website. Gratis, privé. |
| Portuguese – Brazil (Português) | `store/descriptions/pt_BR.md` | Dyslexia Steps: Leitor de texto e régua de leitura | Ler em voz alta qualquer site com palavras destacadas, régua de leitura, fonte para dislexia, espaçamento e sílabas. Grátis. |
| Turkish (Türkçe) | `store/descriptions/tr.md` | Dyslexia Steps: Sesli Okuma ve Okuma Cetveli | Her sitede metni sesli okuma ve kelime vurgusu, okuma cetveli, disleksi dostu yazı tipleri, aralık ve heceleme. Ücretsiz, gizli. |

4. Save draft → **Submit for review**.
5. New in 1.0.1: a "Rate this extension" link appears in the popup footer only after the extension has been used on 5 different days; it disappears for good once clicked or dismissed. No incentive, nothing sent anywhere (count kept in storage.local). No new permissions, so no new justification fields.

### Keyword research behind the 1.0.1 names
| Market | Term | Monthly searches | Used in |
|---|---|---|---|
| US | read aloud | 49,500 | name, summary, description |
| US | read aloud chrome extension | 8,100 | name ("Read Aloud") |
| US | text to speech chrome extension | 1,300 | description, Edge terms |
| US | read aloud extension | 1,300 | name |
| US | dyslexia reader | 1,300 | brand + name |
| US | reading ruler | 880 | name |
| US | dyslexia reading ruler | 480 | name + brand |
| US | reading mode chrome extension | 320 | description, Edge terms |
| US | dyslexia chrome extension | 70 | brand |
| DE | text vorlesen lassen | 6,600 | summary |
| DE | vorlesen | 5,400 | name |
| DE | text vorlesen | 2,900 | description |
| DE | lesehilfe | 1,600 | Edge terms |
| DE | leselineal | 720 | name |
| FR | police dyslexie | 1,600 | summary |
| FR | synthèse vocale | 1,300 | Edge terms |
| FR | lecture à voix haute | 880 | name ("voix haute"), summary |
| FR | règle de lecture | 880 | name |
| ES | texto a voz | 5,400 | name |
| ES | lector de texto | 1,300 | Edge terms |
| ES | leer en voz alta | 880 | summary |
| ES | letra para dislexia | 320 | summary |
| ES | regla de lectura | 170 | name |
| NL | voorlezen | 2,400 | name |
| NL | tekst voorlezen | 1,600 | summary |
| NL | leesliniaal | 880 | name |
| BR | leitor de texto | 14,800 | name |
| BR | régua de leitura | 1,900 | name |
| BR | ler em voz alta | 1,600 | summary |
| TR | disleksi | 9,900 | summary ("disleksi dostu") |
| TR | sesli okuma | 3,600 | name |
| TR | metin okuma | 1,600 | Edge terms |
| TR | metni sesli okuma | 880 | summary |
| TR | okuma cetveli | 30 | name |

Source: DataForSEO Google Ads search volume, 2026-11-25, each market in its own language. Extension-specific
phrases ("… erweiterung", "extension dyslexie", "sesli okuma eklentisi") have no measurable volume outside the US, so
the names use the generic local terms.


## Microsoft Edge Add-ons (Partner Center) — every field
URL: https://partner.microsoft.com/dashboard/microsoftedge → **Create new extension**. Account: Microsoft account opened with hi@dyslexiasteps.com (no Outlook mailbox needed).

### 1. Packages
- Upload `dist/dyslexiasteps-extension-chrome-1.0.1.zip` (the Chrome zip; Edge uses the same package).

### 2. Availability
- Visibility: **Public**
- Markets: **All markets** (select all)

### 3. Properties
- Category: **Accessibility**
- Does your extension access, collect, or transmit personal information? **No** → still fill the privacy policy URL:
- Privacy policy URL: `https://dyslexiasteps.com/extension#privacy`
- Website URL: `https://dyslexiasteps.com/extension`
- Support contact: `https://dyslexiasteps.com/extension` (or hi@dyslexiasteps.com)
- Mature content: **No**

### 4. Store listings (add every language below with **Add a language**)
Same for every language:
- Extension Store logo (300×300, required): `store/edge-logo-300x300.png`
- Small promotional tile 440×280 (optional): `store/promo-small-440x280.png`
- Screenshots (1280×800): `store/screenshot-1…4-*.png` in order
- Large promotional tile, YouTube video: leave empty

Description (Edge requires ≥250 characters; every file is longer) — paste the file. Short description is taken from the package summary. Search terms: max 7, each ≤30 characters, ≤21 words in total (checked):

| Language | Description | Search terms (one per box) |
|---|---|---|
| English | `store/descriptions/en.md` | read aloud · text to speech · dyslexia · reading ruler · dyslexia font · reading mode · OpenDyslexic |
| German (Deutsch) | `store/descriptions/de.md` | vorlesen · text vorlesen · Leselineal · Lesehilfe · Legasthenie · Legasthenie Schrift · Sprachausgabe |
| French (Français) | `store/descriptions/fr.md` | lecture à voix haute · synthèse vocale · règle de lecture · dyslexie · police dyslexie · lecteur vocal · mode lecture |
| Spanish (Español) | `store/descriptions/es.md` | leer en voz alta · texto a voz · lector de texto · regla de lectura · dislexia · letra para dislexia · modo lectura |
| Dutch (Nederlands) | `store/descriptions/nl.md` | voorlezen · tekst voorlezen · leesliniaal · dyslexie · voorleesfunctie · dyslexie lettertype · leesmodus |
| Portuguese – Brazil (Português) | `store/descriptions/pt_BR.md` | leitor de texto · ler em voz alta · régua de leitura · texto para fala · dislexia · fonte para dislexia · modo leitura |
| Turkish (Türkçe) | `store/descriptions/tr.md` | sesli okuma · metni sesli okuma · metin okuma · okuma cetveli · disleksi · disleksi yazı tipi · okuma modu |

### 5. Submit
- Notes for certification:
```
No login or test account needed. Open any article (e.g. a Wikipedia page), click the toolbar icon to change font, spacing, tint and the reading ruler. Select text and press Alt+Shift+S (or right-click > Read aloud) to hear it with word highlighting; right-click a word > Split into syllables. The optional <all_urls> permission is requested only if the user ticks "Keep on for every site" in the popup. No data is collected or sent; source: https://github.com/Dyslexia-Steps/dyslexiasteps-extension
```
- **Publish**. Review: up to 7 business days.



## Firefox Add-ons (AMO) — every field
URL: https://addons.mozilla.org/developers/addon/submit/ (Firefox account opened with hi@dyslexiasteps.com).

### 1. Distribution
- **On this site** (listed on addons.mozilla.org)

### 2. Upload
- File: `dist/dyslexiasteps-extension-firefox-1.0.1.zip`
- Compatible with: **Firefox** and **Firefox for Android** (both ticked; the manifest supports Android 142+)

### 3. Source code
- "Do you need to submit source code?" → **Yes**. The code is bundled with esbuild (readable, not minified, but it includes the Readability and hyphen libraries), and AMO policy asks for source for any bundled code.
- Upload: `dist/dyslexiasteps-extension-source-1.0.1.zip` (repository without node_modules/dist; checked: `npm ci && npm run build` in a clean folder produces byte-identical `dist/firefox`).

### 4. Describe add-on (English first; other languages below)
- Name: comes from the package: `Dyslexia Steps: Read Aloud & Reading Ruler`
- Add-on URL: `https://addons.mozilla.org/firefox/addon/dyslexiasteps-reading-support/` (slug: `dyslexiasteps-reading-support`)
- Summary (≤250):
```
Read aloud any web page with word highlighting, plus a reading ruler, dyslexia-friendly fonts, spacing and syllables. Free, private. No account, no tracking; source code is public.
```
- Description: paste `store/descriptions/en.md`
- This add-on is experimental: **No** · Requires payment: **No**
- Categories — Firefox: **Accessibility** if listed; otherwise **Language Support** + **Other**. Firefox for Android: **Other** (+ **User Interface** if allowed).
- Tags (pick only from AMO's list, max 10): accessibility, reading, text to speech — skip any that the list does not offer.
- Support email: `hi@dyslexiasteps.com`
- Support website: `https://dyslexiasteps.com/extension`
- License: **MIT License**
- Privacy policy: tick **This add-on has a privacy policy** and paste:
```
Dyslexia Steps Reading Support collects no personal data. There is no account, no analytics, no advertising and no tracking; nothing you read, select or hear is sent to Dyslexia Steps or anyone else. Settings (font, spacing, ruler, tint, speech rate, voice) are kept in your browser's own storage and are deleted when you remove the add-on. Read-aloud uses the voices installed in your browser or operating system. The add-on only acts on a page when you open it there, use the context menu or a shortcut, or on every page if you turn on "Keep on for every site". When you install or remove it, the browser opens dyslexiasteps.com/extension, which uses the website's own analytics described at dyslexiasteps.com/privacy. Full policy: https://dyslexiasteps.com/extension#privacy
```
- Notes to reviewer:
```
Build: the files are esbuild output (IIFE bundles, not minified). To rebuild from the attached source: Node 20+, `npm ci && npm run build`; output is dist/firefox (identical to the uploaded package). Public repository: https://github.com/Dyslexia-Steps/dyslexiasteps-extension. Bundled third-party code: @mozilla/readability (Apache-2.0), hyphen (ISC); fonts Lexend and OpenDyslexic (OFL), licences in LICENSES/. Test: open any article, click the toolbar icon; select text + Alt+Shift+S to read aloud; right-click a word > Split into syllables. No remote code, no data collection (data_collection_permissions: none).
```
- **Submit version**. Review: usually hours to a few days.

### 5. Other languages (after submission: Edit Product Page → language selector at the top → each language)
| Locale on AMO | Name (auto from package) | Summary (paste) | Description |
|---|---|---|---|
| Deutsch | Dyslexia Steps: Vorlesen & Leselineal | Text vorlesen lassen mit Wortmarkierung, Leselineal, Legasthenie-Schriften, mehr Abstand und Silben auf jeder Webseite. Kostenlos. Ohne Konto, ohne Tracking; Quellcode öffentlich. | `store/descriptions/de.md` |
| Français | Dyslexia Steps : voix haute et règle de lecture | Lecture à voix haute surlignée, règle de lecture, police pour la dyslexie, espacement et syllabes sur tout site. Gratuit et privé. Sans compte ni pistage ; code source public. | `store/descriptions/fr.md` |
| Español | Dyslexia Steps: Texto a voz y regla de lectura | Leer en voz alta cualquier web con palabras resaltadas, regla de lectura, letra para dislexia, espaciado y sílabas. Gratis, privado. Sin cuenta ni rastreo; código abierto. | `store/descriptions/es.md` |
| Nederlands | Dyslexia Steps: Voorlezen & leesliniaal | Tekst voorlezen met woordmarkering, leesliniaal, dyslexie-lettertypes, meer afstand en lettergrepen op elke website. Gratis, privé. Zonder account of tracking; broncode openbaar. | `store/descriptions/nl.md` |
| Português (do Brasil) | Dyslexia Steps: Leitor de texto e régua de leitura | Ler em voz alta qualquer site com palavras destacadas, régua de leitura, fonte para dislexia, espaçamento e sílabas. Grátis. Sem conta nem rastreamento; código aberto. | `store/descriptions/pt_BR.md` |
| Türkçe | Dyslexia Steps: Sesli Okuma ve Okuma Cetveli | Her sitede metni sesli okuma ve kelime vurgusu, okuma cetveli, disleksi dostu yazı tipleri, aralık ve heceleme. Ücretsiz, gizli. Hesap yok, takip yok; kaynak kodu açık. | `store/descriptions/tr.md` |
