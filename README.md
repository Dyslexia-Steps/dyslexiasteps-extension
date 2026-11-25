# Dyslexia Steps Reading Support (browser extension)

Manifest V3, no remote code, no analytics. One build → Chrome/Edge/Opera/Brave zip + Firefox zip.

    npm ci
    npm run check          # tsc + build + web-ext lint
    # e2e (Playwright Chromium; needs `npx playwright install chromium` once):
    #   serve test/page.html on :8765, then node test/e2e-runner.mjs dist/chrome http://localhost:8765/ dys test/e2e-steps.mjs

src/content.ts   page features (ruler, spacing/font, tint, b d p q, read-aloud panel, syllable bubble, reading mode)
src/background.ts context menus, shortcuts, "every site" registration, hyphenation
src/syllables.ts TeX hyphenation patterns (hyphen package) for 7 languages — background only
src/popup.ts     settings UI; writes storage, content script follows storage.onChanged
store/STORE.md   listing text, permission justifications, privacy answers
Third-party licences in LICENSES/ (Lexend, OpenDyslexic: OFL-1.1; Readability: Apache-2.0; hyphen: ISC).
