# Store listing — Dyslexia Steps Reading Support

Upload: `dist/dyslexiasteps-extension-chrome-<v>.zip` → Chrome Web Store, Edge Add-ons (same zip).
`dist/dyslexiasteps-extension-firefox-<v>.zip` → addons.mozilla.org (source: readable, unminified bundle;
if asked, upload this repo without node_modules/dist + "npm ci && npm run build").

## Name
Dyslexia Steps Reading Support  (localised in _locales/*/messages.json, 7 languages)

## Summary (≤132)
Reading ruler, letter spacing, readable fonts, read-aloud with word highlighting and syllable breaks on any web page.

## Category
Chrome: Accessibility · Edge: Accessibility · Firefox: Accessibility (+ Education)

## Description
Make any web page easier to read — without an account and without sending anything anywhere.

READING RULER
• Line mode highlights the line you are reading; Focus mode dims everything above and below.
• Follows your mouse; Alt+↑/↓ moves it, Alt+Shift+R turns it on or off.

TEXT SETTINGS
• Font: keep the page font or switch to Lexend, OpenDyslexic, Arial or Verdana.
• Letter spacing, word spacing and line height sliders.
• Optional colouring of b, d, p and q.
• Background tint in five colours with adjustable strength.

READ ALOUD
• Select text and press Alt+Shift+S (or right-click → Read aloud).
• Words are highlighted as they are spoken; click any word to start from there.
• Speed control and voice choice (uses the voices already in your browser).

SYLLABLES
• Right-click a word → Split into syllables to see it broken up (read·ing), then hear it syllable by syllable.
• English, German, French, Spanish, Dutch, Portuguese and Turkish. Breaks come from hyphenation rules, so they are close to spoken syllables but not always identical.

READING MODE
• Opens the article on its own, without menus and ads, using your font, spacing and tint. One click to read the whole page aloud.

HONEST NOTE
These are comfort settings. Research has not shown that special fonts or coloured overlays make reading faster; wider letter spacing helps some readers. Try what feels best.

PRIVACY
No account, no analytics, no tracking. Settings are saved in your browser's sync storage. The extension only touches a page when you open it there, use a menu item or shortcut — or, if you choose "Keep on for every site", on every page you visit.

Made by Dyslexia Steps — free dyslexia screening test and parent guides at dyslexiasteps.com.

## Single purpose (CWS field)
Help people read text on web pages more comfortably: reading ruler, text spacing/font, tint, read-aloud, syllable breaks and a distraction-free reading view.

## Permission justifications
- activeTab: apply reading settings to the page the user is on when they open the popup, use the context menu or a shortcut.
- scripting: inject the reading-support script into that page.
- storage: remember the user's settings.
- contextMenus: "Read aloud", "Split into syllables", "Open reading mode".
- optional host permission <all_urls>: only requested if the user turns on "Keep on for every site", so settings apply on every page without opening the popup.
- Remote code: No.

## Data usage (CWS privacy tab)
Collects nothing. Tick none of the data types. Certify: not sold, not used for unrelated purposes, not used for creditworthiness.
Privacy policy URL: https://dyslexiasteps.com/extension#privacy  (section must exist on the landing before submission)

## Assets
- Icon 128: static/icons/128.png
- Screenshots 1280×800: store/screenshot-*.png
- Small promo tile 440×280: store/promo-small-440x280.png
- Homepage: https://dyslexiasteps.com/extension
