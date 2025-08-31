import { apiFetch } from "@/lib/http";

export type Broker = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  role?: "broker";
};

type ApiResponse<T> = {
  status: string;
  message: string;
  data?: T;
  error?: any;
};

function mapBroker(row: any): Broker {
  if (!row) return row;
  // Support both snake_case and camelCase from API
  return {
    id: row.id,
    firstName: row.firstName ?? row.first_name ?? "",
    lastName: row.lastName ?? row.last_name ?? "",
    email: row.email,
    phone: row.phone ?? null,
    role: row.role ?? "broker",
  };
}

export type CreateBrokerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export async function createBroker(input: CreateBrokerInput): Promise<Broker> {
  const res = await apiFetch(`/brokers/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || "Failed to create broker");
  }
  const json: ApiResponse<any> = await res.json();
  return mapBroker(json.data);
}

export async function getBrokerByEmail(email: string): Promise<Broker | null> {
  const res = await apiFetch(`/brokers/email/${encodeURIComponent(email)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || "Failed to fetch broker by email");
  }
  const json: ApiResponse<any> = await res.json();
  return mapBroker(json.data);
}

export async function getBrokerById(id: string): Promise<Broker | null> {
  const res = await apiFetch(`/brokers/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || "Failed to fetch broker");
  }
  const json: ApiResponse<any> = await res.json();
  return mapBroker(json.data);
}

export async function updateBroker(
  id: string,
  data: Partial<
    Pick<
      CreateBrokerInput,
      "firstName" | "lastName" | "email" | "phone" | "password"
    >
  >,
): Promise<Broker> {
  const res = await apiFetch(`/brokers/edit/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || "Failed to update broker");
  }
  const json: ApiResponse<any> = await res.json();
  return mapBroker(json.data);
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
