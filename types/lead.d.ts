export interface Lead {
  id: string;
  broker_id: string;
  lead_email?: string | null;
  lead_phone?: string | null;
  created_at: string;
  properties_count?: number;
  property_ids?: string[];
  properties?: { id: string; title: string }[];
}
