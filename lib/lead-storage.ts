const STORAGE_KEY = "hauzzo_leads_sent";

type LeadSentMap = Record<string, number>; // propertyId -> timestamp

function safeGetStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getSentMap(): LeadSentMap {
  const ls = safeGetStorage();
  if (!ls) return {};
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? (parsed as LeadSentMap) : {};
  } catch {
    return {};
  }
}

export function hasLeadForProperty(propertyId: string): boolean {
  if (!propertyId) return false;
  const map = getSentMap();
  return !!map[propertyId];
}

export function markLeadForProperty(propertyId: string) {
  if (!propertyId) return;
  const ls = safeGetStorage();
  if (!ls) return;
  const map = getSentMap();
  map[propertyId] = Date.now();
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}
