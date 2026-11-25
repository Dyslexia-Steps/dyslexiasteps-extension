import { api, loadSettings, saveSettings, type Msg } from "./settings";
import { markUsage } from "./usage";
import { hyphenateText } from "./syllables";

const SITE = "https://dyslexiasteps.com";
const CS_ID = "reading-support-all-sites";

api.runtime.onInstalled.addListener(async (details) => {
  api.contextMenus.removeAll(() => {
    api.contextMenus.create({ id: "read", title: api.i18n.getMessage("menuRead"), contexts: ["selection"] });
    api.contextMenus.create({ id: "syllables", title: api.i18n.getMessage("menuSyllables"), contexts: ["selection"] });
    api.contextMenus.create({ id: "reader", title: api.i18n.getMessage("menuReader"), contexts: ["page"] });
  });
  if (details.reason === "install") {
    api.tabs.create({ url: `${SITE}/extension?installed=1&utm_source=extension&utm_medium=install` });
  }
  api.runtime.setUninstallURL(`${SITE}/extension?uninstalled=1&utm_source=extension&utm_medium=uninstall`);
  await syncAllSites();
});

api.runtime.onStartup?.addListener(() => void syncAllSites());
api.permissions.onAdded.addListener(() => void syncAllSites());
api.permissions.onRemoved.addListener(() => void syncAllSites());

/** "Keep on for every site": registered only while the user has granted <all_urls>. */
export async function syncAllSites() {
  const has = await api.permissions.contains({ origins: ["<all_urls>"] });
  const existing = await api.scripting.getRegisteredContentScripts({ ids: [CS_ID] }).catch(() => []);
  if (has && existing.length === 0) {
    await api.scripting.registerContentScripts([
      { id: CS_ID, matches: ["<all_urls>"], js: ["content.js"], runAt: "document_idle", allFrames: false },
    ]);
  } else if (!has && existing.length > 0) {
    await api.scripting.unregisterContentScripts({ ids: [CS_ID] });
  }
}

async function inject(tabId: number) {
  await api.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
}

async function send(tabId: number, msg: Msg) {
  try {
    await inject(tabId);
    await api.tabs.sendMessage(tabId, msg);
  } catch {
    /* chrome:// pages, the store, PDFs: nothing to do */
  }
}

api.contextMenus.onClicked.addListener((info, tab) => {
  void markUsage();
  if (!tab?.id) return;
  if (info.menuItemId === "read") void send(tab.id, { type: "readText", text: info.selectionText ?? "" });
  if (info.menuItemId === "syllables") void send(tab.id, { type: "syllables", text: info.selectionText ?? "" });
  if (info.menuItemId === "reader") void send(tab.id, { type: "readerMode" });
});

api.commands.onCommand.addListener(async (command, tab) => {
  void markUsage();
  const t = tab ?? (await api.tabs.query({ active: true, currentWindow: true }))[0];
  if (!t?.id) return;
  if (command === "toggle-ruler") {
    const s = await loadSettings();
    await saveSettings({ ruler: s.ruler === "off" ? "line" : "off", enabled: true });
    await send(t.id, { type: "ping" });
  }
  if (command === "read-selection") void send(t.id, { type: "readSelection" });
  if (command === "reader-mode") void send(t.id, { type: "readerMode" });
});

api.runtime.onMessage.addListener((msg: Msg, _sender, reply) => {
  if (msg.type === "hyphenate") {
    reply(hyphenateText(msg.text, msg.lang));
    return false;
  }
  return false;
});
