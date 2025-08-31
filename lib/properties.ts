import type { PropertyContent, PropertyLocationType } from "@/types/property";
import { apiFetch } from "@/lib/http";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiResponse<T> = {
  status: string;
  message: string;
  data?: T;
  error?: any;
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
  // Maps API row to UI type
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
    active: row.active !== false,
  };
}

export async function listProperties(limit = 200): Promise<PropertyContent[]> {
  const res = await apiFetch(`/properties/all?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  const json: ApiResponse<any[]> = await res.json();
  const rows = (json.data || []) as any[];
  return rows.map(mapProperty);
}

export async function getProperty(id: string): Promise<PropertyContent> {
  const res = await apiFetch(`/properties/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  const json: ApiResponse<any> = await res.json();
  return mapProperty(json.data);
}

export type CreatePropertyInput = {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  type: "house" | "apartment";
  transaction: "rent" | "sale";
  location: PropertyLocationType;
  tags: string[];
  images?: File[];
};

export async function createProperty(input: CreatePropertyInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("price", String(input.price));
  fd.append("bedrooms", String(input.bedrooms));
  fd.append("bathrooms", String(input.bathrooms));
  fd.append("parking", String(input.parking));
  fd.append("type", input.type);
  fd.append("transaction", input.transaction);
  // Send location as JSON for server to parse
  fd.append("location", JSON.stringify(input.location));
  // Send tags as repeated fields to preserve array type
  input.tags.forEach((t) => fd.append("tags", t));
  (input.images || []).forEach((file) => fd.append("images", file));

  const res = await apiFetch(`/properties/create`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Failed to create property");
  const json: ApiResponse<any> = await res.json();
  return mapProperty(json.data);
}

export async function updateProperty(
  id: string,
  data: Partial<
    Pick<
      CreatePropertyInput,
      "title" | "description" | "price" | "tags" | "location"
    >
  >,
) {
  const res = await apiFetch(`/properties/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update property");
  const json: ApiResponse<any> = await res.json();
  return mapProperty(json.data);
}

export async function deleteProperty(id: string) {
  const res = await apiFetch(`/properties/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete property");
  return true;
}

export async function updatePropertyImages(
  id: string,
  keepUrls: string[],
  files: File[],
) {
  const fd = new FormData();
  fd.append("keep", JSON.stringify(keepUrls || []));
  (files || []).forEach((f) => fd.append("images", f));

  const res = await apiFetch(`/properties/images/${id}`, {
    method: "PUT",
    body: fd,
  });
  if (!res.ok) throw new Error("Failed to update images");
  const json: ApiResponse<any> = await res.json();
  return mapProperty(json.data);
}

export async function setPropertyActive(id: string, active: boolean) {
  const res = await apiFetch(`/properties/active/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) throw new Error("Failed to update property status");
  const json: ApiResponse<any> = await res.json();
  return mapProperty(json.data);
}
