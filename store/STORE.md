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
Upload `dist/dyslexiasteps-extension-chrome-<version>.zip`.

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
