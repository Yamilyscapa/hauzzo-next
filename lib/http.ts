const API_URL = process.env.NEXT_PUBLIC_API_URL as string | undefined;

import { useSessionStore } from "@/store/session-store";

function withBase(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = API_URL ?? "";
  if (!base) return pathOrUrl; // fallback (mainly for tests)
  if (pathOrUrl.startsWith("/")) return `${base}${pathOrUrl}`;
  return `${base}/${pathOrUrl}`;
}

export async function apiFetch(
  pathOrUrl: string,
  init?: RequestInit,
  opts?: { refreshRole?: "broker" | "user"; skipRefresh?: boolean },
): Promise<Response> {
  const url = withBase(pathOrUrl);

  const doFetch = () =>
    fetch(url, {
      credentials: "include",
      ...(init || {}),
    });

  let res = await doFetch();

  if (res.status !== 401 || opts?.skipRefresh) return res;

  // Attempt a token refresh and retry once
  const state = useSessionStore.getState();
  const role =
    opts?.refreshRole ?? (state.role as "broker" | "user") ?? "broker";

  const refreshRes = await fetch(withBase(`/auth/${role}/refresh`), {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) return res; // still unauthorized

  res = await doFetch();
  return res;
}
