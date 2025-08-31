"use client";
import Property from "@/components/shared/property-card";
import { PropertyContent } from "@/types/property";
import { SearchbarFilters } from "@/components/shared/searchbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchByDescription, searchByTags, searchProperties } from "@/lib/search";
import { listProperties } from "@/lib/properties";

export default function SearchPage() {
  const params = useSearchParams();
  const [properties, setProperties] = useState<PropertyContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qp = useMemo(() => params.toString(), [params]);

  useEffect(() => {
    const q = params.get("query")?.trim() || "";
    const tagsParam = params.get("tags")?.trim() || "";
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

    const hasAnyFilter =
      !!params.get("transaction") ||
      !!params.get("type") ||
      !!params.get("min_price") ||
      !!params.get("max_price") ||
      !!params.get("min_bedrooms") ||
      !!params.get("max_bedrooms") ||
      !!params.get("city") ||
      !!params.get("state");

    if (!q && tags.length === 0 && !hasAnyFilter) {
      setProperties([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const filters: any = {};
    if (q) filters.query = q;
    const tx = params.get("transaction");
    if (tx) filters.transaction = tx;
    const type = params.get("type");
    if (type) filters.type = type;
    const minp = params.get("min_price");
    if (minp) filters.min_price = Number(minp);
    const maxp = params.get("max_price");
    if (maxp) filters.max_price = Number(maxp);
    const minb = params.get("min_bedrooms");
    if (minb) filters.min_bedrooms = Number(minb);
    const maxb = params.get("max_bedrooms");
    if (maxb) filters.max_bedrooms = Number(maxb);
    const city = params.get("city");
    if (city) filters.city = city;
    const state = params.get("state");
    if (state) filters.state = state;

    const run = async () => {
      try {
        const passFilters = (p: any) => {
          if (filters.transaction && p.transaction !== filters.transaction) return false;
          if (filters.type && p.type !== filters.type) return false;
          if (filters.min_price != null && p.price < filters.min_price) return false;
          if (filters.max_price != null && p.price > filters.max_price) return false;
          if (filters.min_bedrooms != null && p.bedrooms < filters.min_bedrooms) return false;
          if (filters.max_bedrooms != null && p.bedrooms > filters.max_bedrooms) return false;
          if (filters.city && !p.location?.city?.toLowerCase().includes(String(filters.city).toLowerCase())) return false;
          if (filters.state && !p.location?.state?.toLowerCase().includes(String(filters.state).toLowerCase())) return false;
          return true;
        };

        // If both query and tags are present, intersect results
        if (q && tags.length > 0) {
          const [byText, byTags, byDescRaw] = await Promise.all([
            searchProperties(filters),
            searchByTags(tags),
            searchByDescription(q),
          ]);
          const byDesc = byDescRaw.filter(passFilters);
          const tagSet = new Set(byTags.map((p) => p.id));
          const unionIds = new Set<string>();
          const union: any[] = [];
          // Preserve byText ranking first
          byText.forEach((p) => {
            if (tagSet.has(p.id) && !unionIds.has(p.id)) {
              union.push(p);
              unionIds.add(p.id);
            }
          });
          // Add description matches that also have required tags
          byDesc.forEach((p) => {
            if (tagSet.has(p.id) && !unionIds.has(p.id)) {
              union.push(p);
              unionIds.add(p.id);
            }
          });
          setProperties(union);
          return;
        }

        // Only query (full text + server filters)
        if (q) {
          const [byText, byDescRaw] = await Promise.all([
            searchProperties(filters),
            searchByDescription(q),
          ]);
          const byDesc = byDescRaw.filter(passFilters);
          const seen = new Set(byText.map((p) => p.id));
          const merged = byText.concat(byDesc.filter((p) => !seen.has(p.id)));
          setProperties(merged);
          return;
        }

        // Only tags — apply filters client-side (fallback since API lacks tags+filters)
        if (tags.length > 0) {
          const byTags = await searchByTags(tags);
          const filtered = byTags.filter(passFilters);
          setProperties(filtered);
          return;
        }

        // Filters only (no query, no tags) — fallback to client-side filtering over a capped dataset
        if (!q && hasAnyFilter) {
          const all = await listProperties(200);
          const filtered = all.filter(passFilters);
          setProperties(filtered);
          return;
        }
      } catch (e: any) {
        setError(e?.message || "Error buscando propiedades");
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [qp, params]);

  return (
    <div className="pt-5 flex flex-col items-center justify-center gap-6 container mx-auto">
      <SearchbarFilters className="max-w-3xl" />

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {isLoading ? "Buscando..." : `Resultados: ${properties.length} propiedades`}
          </h2>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}
        </div>
        <Separator className="my-4" />
        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        {!isLoading && !error && properties.length === 0 && (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">
              No se encontraron propiedades para tu búsqueda
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10 justify-items-center">
          {properties.map((property) => (
            <div key={property.id} className="flex justify-center w-full">
              <Property {...property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
