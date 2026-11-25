// Build: esbuild bundles src/*.ts, static/ is copied, then one folder + zip per browser.
// Chrome zip also goes to Edge and Opera; Firefox gets its own manifest (background.scripts + gecko id).
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const base = JSON.parse(readFileSync("static/manifest.json", "utf8"));
base.version = pkg.version;

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/tmp", { recursive: true });

await build({
  entryPoints: { background: "src/background.ts", content: "src/content.ts", popup: "src/popup.ts" },
  bundle: true,
  minify: false, // readable bundles: AMO asks for source otherwise, CWS reviews faster
  format: "iife",
  target: ["chrome110", "firefox115"],
  outdir: "dist/tmp",
  legalComments: "eof",
});

const FONTS = [
  ["@fontsource/lexend/files/lexend-latin-400-normal.woff2", "lexend-latin-400.woff2"],
  ["@fontsource/lexend/files/lexend-latin-ext-400-normal.woff2", "lexend-latin-ext-400.woff2"],
  ["@fontsource/lexend/files/lexend-latin-700-normal.woff2", "lexend-latin-700.woff2"],
  ["@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2", "opendyslexic-400.woff2"],
  ["@fontsource/opendyslexic/files/opendyslexic-latin-700-normal.woff2", "opendyslexic-700.woff2"],
];

function out(target, manifest) {
  const dir = `dist/${target}`;
  cpSync("static", dir, { recursive: true });
  for (const f of ["background.js", "content.js", "popup.js"]) copyFileSync(`dist/tmp/${f}`, `${dir}/${f}`);
  mkdirSync(`${dir}/fonts`, { recursive: true });
  for (const [from, to] of FONTS) copyFileSync(`node_modules/${from}`, `${dir}/fonts/${to}`);
  cpSync("LICENSES", `${dir}/LICENSES`, { recursive: true });
  writeFileSync(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2));
  execSync(`cd ${dir} && zip -qr ../${pkg.name}-${target}-${pkg.version}.zip . -x "*.DS_Store"`);
}

out("chrome", base);

const ff = structuredClone(base);
ff.background = { scripts: ["background.js"] };
ff.browser_specific_settings = { gecko: { id: base.gecko_id ?? "reading-support@dyslexiasteps.com", strict_min_version: "140.0", data_collection_permissions: { required: ["none"] } } };
ff.browser_specific_settings.gecko_android = { strict_min_version: "142.0" };
delete ff.gecko_id;
delete base.gecko_id;
out("firefox", ff);
rmSync("dist/tmp", { recursive: true, force: true });
// Source package for Firefox AMO review (bundled code → reviewers rebuild it with `npm ci && npm run build`).
const srcZip = `dist/${pkg.name}-source-${pkg.version}.zip`;
rmSync(srcZip, { force: true });
execSync(`zip -qr ${srcZip} . -x "node_modules/*" "dist/*" ".git/*" "store/*" "*.DS_Store"`);
console.log("built", pkg.version, "→ dist/chrome, dist/firefox + zips (+ source zip for AMO)");
