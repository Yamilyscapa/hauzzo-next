import type {
  PropertyContent,
  PropertyLocationType,
  PropertyType,
  TransactionType,
} from "@/types/property";
import { apiFetch } from "@/lib/http";

type ApiResponse<T> = {
  status: string;
  message: string;
  data?: T;
  error?: any;
};

export type SearchFilters = {
  query: string;
  transaction?: TransactionType;
  type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  city?: string;
  state?: string;
};

function parsePgTextArray(val: any): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
    const inner = val.slice(1, -1);
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    let esc = false;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (esc) {
        cur += ch;
        esc = false;
        continue;
      }
      if (ch === "\\") {
        esc = true;
        continue;
      }
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    if (cur.length > 0) out.push(cur);
    return out.map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function mapProperty(row: any): PropertyContent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price) || 0,
    tags: Array.isArray(row.tags)
      ? row.tags
      : typeof row.tags === "string" && row.tags.startsWith("{")
        ? row.tags.replace(/[{}]/g, "").split(",").filter(Boolean)
        : [],
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    parking: Number(row.parking) || 0,
    location: row.location as PropertyLocationType,
    type: row.type,
    transaction: row.transaction,
    images: parsePgTextArray(row.images),
  };
}

export async function searchProperties(
  filters: SearchFilters,
): Promise<PropertyContent[]> {
  const params = new URLSearchParams();
  params.set("query", filters.query);
  if (filters.transaction) params.set("transaction", filters.transaction);
  if (filters.type) params.set("type", filters.type);
  if (filters.min_price != null)
    params.set("min_price", String(filters.min_price));
  if (filters.max_price != null)
    params.set("max_price", String(filters.max_price));
  if (filters.min_bedrooms != null)
    params.set("min_bedrooms", String(filters.min_bedrooms));
  if (filters.max_bedrooms != null)
    params.set("max_bedrooms", String(filters.max_bedrooms));
  if (filters.city) params.set("city", filters.city);
  if (filters.state) params.set("state", filters.state);

  const res = await apiFetch(`/search?${params.toString()}`);
  if (!res.ok) {
    // Surface server message if present
    let msg = "Search request failed";
    try {
      const errJson: ApiResponse<any> = await res.json();
      msg = errJson?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const json: ApiResponse<any[]> = await res.json();
  const rows = (json.data || []) as any[];
  return rows.map(mapProperty);
}

export async function searchByTags(tags: string[]): Promise<PropertyContent[]> {
  const res = await apiFetch(`/search/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: tags }),
  });
  if (!res.ok) {
    let msg = "Tags search request failed";
    try {
      const errJson: ApiResponse<any> = await res.json();
      msg = errJson?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const json: ApiResponse<any[]> = await res.json();
  const rows = (json.data || []) as any[];
  return rows.map(mapProperty);
}

export async function searchByDescription(
  query: string,
): Promise<PropertyContent[]> {
  const res = await apiFetch(`/search/description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  // Treat 404 as empty result set
  if (res.status === 404) return [];
  if (!res.ok) {
    let msg = "Description search request failed";
    try {
      const errJson: ApiResponse<any> = await res.json();
      msg = errJson?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const json: ApiResponse<any[]> = await res.json();
  const rows = (json.data || []) as any[];
  return rows.map(mapProperty);
}
