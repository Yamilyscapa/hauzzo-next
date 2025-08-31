"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  House,
  Users,
  UserSearch,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { listProperties } from "@/lib/properties";
import { listLeads, type LeadRow } from "@/lib/leads";
import type { PropertyContent } from "@/types/property";
import { formatPrice } from "@/utils/text-formatter";

export default function Dashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyContent[]>([]);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [leadsCount, setLeadsCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const [props, myLeads] = await Promise.all([
          listProperties(200),
          listLeads(),
        ]);
        setProperties(props);
        setPropertyCount(props.length);
        setLeads(myLeads);
        setLeadsCount(myLeads.length);
      } catch {
        // ignore, keep defaults
      }
    })();
  }, []);

  const recentLeads = useMemo(() => (leads || []).slice(0, 5), [leads]);

  const propertyStats = useMemo(() => {
    const total = properties.length || 0;
    if (!total) {
      return { sale: 0, rent: 0, house: 0, apartment: 0, avgPrice: 0 };
    }
    let sale = 0, rent = 0, house = 0, apartment = 0, sum = 0;
    for (const p of properties) {
      if (p.transaction === 'sale') sale++;
      if (p.transaction === 'rent') rent++;
      if (p.type === 'house') house++;
      if (p.type === 'apartment') apartment++;
      sum += Number(p.price) || 0;
    }
    return { sale, rent, house, apartment, avgPrice: Math.round(sum / total) };
  }, [properties]);

  const leadsTrend = useMemo(() => {
    const days: { key: string; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({ key: d.toISOString().slice(0,10), label: d.toLocaleDateString('es-MX', { weekday: 'short' }) });
    }
    const counts = days.map((d) => leads.filter((l) => {
      try {
        const kd = new Date(l.created_at);
        kd.setHours(0,0,0,0);
        return kd.toISOString().slice(0,10) === d.key;
      } catch {
        return false;
      }
    }).length);
    const max = Math.max(1, ...counts);
    return { days, counts, max };
  }, [leads]);

  function formatWhen(d: string) {
    try {
      const date = new Date(d);
      const diff = Date.now() - date.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "justo ahora";
      if (mins < 60) return `hace ${mins} min`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `hace ${hours} h`;
      const days = Math.floor(hours / 24);
      return `hace ${days} d`;
    } catch {
      return d;
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido al panel de administración de Hauzzo
          </p>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards (real data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Propiedades
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{propertyCount}</p>
                </div>
                <House className="h-8 w-8 text-hauzzo" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{leadsCount}</p>
                </div>
                <UserSearch className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En venta</p>
                  <p className="text-2xl font-bold text-gray-900">{propertyStats.sale}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-hauzzo rounded" style={{ width: `${propertyCount ? Math.round((propertyStats.sale / propertyCount) * 100) : 0}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En renta</p>
                  <p className="text-2xl font-bold text-gray-900">{propertyStats.rent}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-blue-500 rounded" style={{ width: `${propertyCount ? Math.round((propertyStats.rent / propertyCount) * 100) : 0}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Casas</p>
              <p className="text-2xl font-bold text-gray-900">{propertyStats.house}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Apartamentos</p>
              <p className="text-2xl font-bold text-gray-900">{propertyStats.apartment}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Precio promedio</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(propertyStats.avgPrice)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <House className="h-5 w-5 text-hauzzo" />
                Propiedades
              </CardTitle>
              <CardDescription>
                Gestiona tu portafolio de propiedades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{propertyCount} propiedades</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/dashboard/properties/new");
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nueva
                </Button>
              </div>
              <div className="mt-3">
                <Link href="/dashboard/properties" className="text-sm text-hauzzo hover:underline">
                  Ver todas →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserSearch className="h-5 w-5 text-blue-600" />
                Clientes
              </CardTitle>
              <CardDescription>
                Administra tu base de datos de clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {leadsCount} clientes
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/dashboard/clients");
                  }}
                >
                  Ver
                </Button>
              </div>
              <div className="mt-3">
                <Link href="/dashboard/clients" className="text-sm text-hauzzo hover:underline">
                  Buscar / gestionar →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Brokers
              </CardTitle>
              <CardDescription>Gestiona tu equipo de brokers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Equipo</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/dashboard/brokers");
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Invitar
                </Button>
              </div>
              <div className="mt-3">
                <Link href="/dashboard/brokers" className="text-sm text-hauzzo hover:underline">
                  Crear / editar →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
          </div>

          {/* Right rail: trend + recent */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de clientes (7 días)</CardTitle>
                <CardDescription>Leads diarios recientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-28">
                  {leadsTrend.counts.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-6 rounded bg-blue-500"
                        style={{ height: `${Math.max(8, Math.round((v / (leadsTrend.max || 1)) * 100))}%` }}
                        title={`${v}`}
                      />
                      <span className="text-[10px] text-gray-500">{leadsTrend.days[i].label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>Últimos clientes interesados en tus propiedades</CardDescription>
              </CardHeader>
              <CardContent>
                {recentLeads.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600">Sin actividad reciente.</div>
                ) : (
                  <div className="space-y-3">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Nuevo cliente: {lead.lead_email || lead.lead_phone || 'Sin datos'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {Array.isArray(lead.properties) && lead.properties.length > 0
                              ? `Interesado en ${lead.properties[0].title || lead.properties[0].id}`
                              : 'Sin propiedad vinculada'}
                            {` · ${formatWhen(lead.created_at)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
