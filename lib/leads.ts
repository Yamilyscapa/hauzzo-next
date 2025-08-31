import { apiFetch } from "@/lib/http";

type ApiResponse<T> = {
  status: string;
  message: string;
  data?: T;
  error?: any;
};

export type CreateLeadInput = {
  propertyId: string;
  email?: string;
  phone?: string;
  brokerId?: string;
};

export async function createLead(input: CreateLeadInput) {
  const res = await apiFetch(
    `/leads/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    { skipRefresh: true },
  );

  const json: ApiResponse<any> = await res.json();
  if (!res.ok) {
    const msg = json?.message || "No se pudo crear el lead";
    throw new Error(msg);
  }
  return json.data;
}

export type LeadRow = {
  id: string;
  broker_id: string;
  lead_email?: string | null;
  lead_phone?: string | null;
  created_at: string;
  properties_count?: number | string;
  property_ids?: string[];
  properties?: { id: string; title: string }[];
};

export async function listLeads(q?: string): Promise<LeadRow[]> {
  const qs = q && q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const res = await apiFetch(`/leads/mine${qs}`);
  const json: ApiResponse<any[]> = await res.json();
  if (!res.ok) {
    const msg = json?.message || "No se pudieron cargar los clientes";
    throw new Error(msg);
  }
  const rows = (json.data || []) as any[];
  return rows.map((r) => ({
    id: r.id,
    broker_id: r.broker_id,
    lead_email: r.lead_email ?? null,
    lead_phone: r.lead_phone ?? null,
    created_at: r.created_at,
    properties_count:
      typeof r.properties_count === "string"
        ? parseInt(r.properties_count)
        : r.properties_count,
    property_ids: Array.isArray(r.property_ids) ? r.property_ids : [],
    properties: Array.isArray(r.properties)
      ? r.properties.map((p: any) => ({ id: p.id, title: p.title }))
      : [],
  }));
}
