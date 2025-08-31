"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, LeadRow } from "@/lib/leads";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, User, Mail, Phone, Home, ExternalLink } from "lucide-react";
import Link from "next/link";

function formatDate(d: string) {
  try {
    const date = new Date(d);
    return date.toLocaleString();
  } catch {
    return d;
  }
}

export default function ClientsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState<string>("");

  const filtered = useMemo(() => {
    if (!q) return leads;
    const s = q.toLowerCase();
    return leads.filter((l) =>
      (l.lead_email || "").toLowerCase().includes(s) ||
      (l.lead_phone || "").toLowerCase().includes(s)
    );
  }, [leads, q]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const rows = await listLeads();
        setLeads(rows);
      } catch (e: any) {
        setError(e?.message || "No se pudieron cargar los clientes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await listLeads(q);
      setLeads(rows);
    } catch (e: any) {
      setError(e?.message || "No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestiona tus prospectos y contactos.</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por email o teléfono..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Buscar</Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600">
              No hay clientes todavía.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <User className="h-4 w-4" />
                    <span>{lead.lead_email || lead.lead_phone || 'Sin datos'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{lead.lead_email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{lead.lead_phone || '—'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <Home className="h-4 w-4 mt-0.5" />
                    <div className="flex-1">
                      <div className="mb-1">
                        {(lead.properties_count || 0)} { (lead.properties_count || 0) === 1 ? 'propiedad vinculada' : 'propiedades vinculadas' }
                      </div>
                      {Array.isArray(lead.properties) && lead.properties.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {lead.properties.slice(0, 3).map((p) => (
                            <Link key={p.id} href={`/properties/${p.id}`} className="text-hauzzo hover:underline inline-flex items-center gap-1">
                              <span className="truncate max-w-[22rem]">{p.title || p.id}</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          ))}
                          {lead.properties.length > 3 ? (
                            <span className="text-xs text-gray-500">y {lead.properties.length - 3} más…</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Creado: {formatDate(lead.created_at)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
