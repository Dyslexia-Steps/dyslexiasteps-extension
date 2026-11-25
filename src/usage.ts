import { api } from "./settings";

/**
 * "Rate this extension" link: shown in the popup only after the extension was used on
 * at least RATE_AFTER_DAYS different days, and never again once dismissed or clicked.
 * Stored in storage.local only (not synced, never sent anywhere).
 */
export const RATE_AFTER_DAYS = 5;
/** Firefox listing URL once the add-on is live on AMO; null hides the link in Firefox. */
export const AMO_URL: string | null = null;

type Usage = { usageDays?: string[]; rateDone?: boolean };

const today = () => new Date().toISOString().slice(0, 10);

export async function markUsage(): Promise<void> {
  const u = (await api.storage.local.get(["usageDays", "rateDone"])) as Usage;
  if (u.rateDone) return;
  const days = u.usageDays ?? [];
  const d = today();
  if (days.includes(d) || days.length >= RATE_AFTER_DAYS) return;
  await api.storage.local.set({ usageDays: [...days, d] });
}

export async function shouldAskForRating(): Promise<boolean> {
  const u = (await api.storage.local.get(["usageDays", "rateDone"])) as Usage;
  return !u.rateDone && (u.usageDays?.length ?? 0) >= RATE_AFTER_DAYS;
}

export async function ratingDone(): Promise<void> {
  await api.storage.local.set({ rateDone: true });
}

/** Store review page for the browser we are running in, or null when unknown (Firefox without AMO_URL). */
export function ratingUrl(): string | null {
  const id = api.runtime.id;
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return AMO_URL ? `${AMO_URL.replace(/\/$/, "")}/reviews/` : null;
  const brands = ((navigator as any).userAgentData?.brands ?? []) as { brand: string }[];
  if (brands.some((b) => /Microsoft Edge/i.test(b.brand)) || /Edg\//.test(ua)) return `https://microsoftedge.microsoft.com/addons/detail/${id}`;
  return `https://chromewebstore.google.com/detail/${id}/reviews`;
}
