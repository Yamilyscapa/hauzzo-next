"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/text-formatter";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyType } from "@/types/property";
import { searchProperties } from "@/lib/search";

export default function Searchbar({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugs, setShowSugs] = useState(false);
  const [focused, setFocused] = useState(false);
  const [loadingSugs, setLoadingSugs] = useState(false);
  const [sugsError, setSugsError] = useState<string | null>(null);

  const submit = () => {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  // Keep input in sync with URL `query` so / and /search are consistent
  useEffect(() => {
    const qp = params?.get("query") || "";
    setQ(qp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.toString()]);

  // Build phrase suggestions from top results (tags, location, title/description)
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setShowSugs(false);
      return;
    }
    setSugsError(null);
    setLoadingSugs(true);
    const handle = setTimeout(async () => {
      try {
        const results = await searchProperties({ query: term });

        const normalize = (s: string) =>
          s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        const uniqueCount = new Map<string, number>();
        const addCount = (val?: string) => {
          if (!val) return;
          const key = val.trim();
          if (!key) return;
          uniqueCount.set(key, (uniqueCount.get(key) || 0) + 1);
        };

        const tags = new Map<string, number>();
        const cities = new Map<string, number>();
        const neighborhoods: Map<string, number> = new Map();
        const states = new Map<string, number>();
        const wordCounts = new Map<string, number>();

        const inc = (map: Map<string, number>, v?: string) => {
          if (!v) return;
          const k = v.trim();
          if (!k) return;
          map.set(k, (map.get(k) || 0) + 1);
        };

        const takeTopKeys = (map: Map<string, number>) =>
          Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([k]) => k);

        const splitWords = (txt?: string) => {
          if (!txt) return [] as string[];
          return txt
            .toLowerCase()
            .split(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ0-9]+/)
            .filter((w) => w && w.length >= 4);
        };

        results.forEach((p) => {
          (p.tags || []).forEach((t) => inc(tags, t));
          inc(cities, p.location?.city);
          inc(neighborhoods, p.location?.neighborhood);
          inc(states, p.location?.state);
          splitWords(p.title).forEach((w) => inc(wordCounts, w));
          splitWords(p.description).forEach((w) => inc(wordCounts, w));
        });

        const lastTokenMatch = term.match(/^(.*?)([^\s]*)$/);
        const base = lastTokenMatch ? lastTokenMatch[1] : term + " ";
        const lastTok = lastTokenMatch ? lastTokenMatch[2] : "";
        const lastNorm = normalize(lastTok);

        const pushUnique = (arr: string[], s: string) => {
          const trimmed = s.replace(/\s+/g, " ").trim();
          if (!trimmed) return arr;
          if (!arr.includes(trimmed)) arr.push(trimmed);
          return arr;
        };

        const byPref = (vals: string[]) =>
          vals.filter((v) => normalize(v).startsWith(lastNorm));
        const isConnector = ["en", "con", "de", "del"].includes(lastNorm);

        let out: string[] = [];
        const composeBase = isConnector ? `${base}${lastTok} ` : base;
        // Location first: neighborhoods -> cities -> states
        const locPh = (
          isConnector
            ? [
                ...takeTopKeys(neighborhoods),
                ...takeTopKeys(cities),
                ...takeTopKeys(states),
              ]
            : [
                ...byPref(takeTopKeys(neighborhoods)),
                ...byPref(takeTopKeys(cities)),
                ...byPref(takeTopKeys(states)),
              ]
        );
        locPh.forEach((v) => (out = pushUnique(out, `${composeBase}${v}`)));

        // Tags next: complete last word with tags
        (isConnector ? takeTopKeys(tags) : byPref(takeTopKeys(tags))).forEach(
          (v) => (out = pushUnique(out, `${composeBase}${v}`)),
        );

        // Fallback from frequent words in title/description
        byPref(
          Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([w]) => w),
        ).forEach((v) => (out = pushUnique(out, `${composeBase}${v}`)));

        // Limit suggestions
        const limited = out.slice(0, 8);
        setSuggestions(limited);
        // Only show while input is focused
        setShowSugs((prev) => (focused && limited.length > 0 ? true : false));
      } catch (e: any) {
        setSugsError(e?.message || "");
        setSuggestions([]);
        setShowSugs(false);
      } finally {
        setLoadingSugs(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [q, focused]);

  return (
    <div
      className={cn(
        "searchbar relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-2xl",
        className,
      )}
    >
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search-icon lucide-search size-5"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>

        <Input
          className="h-12 pl-11 w-full min-w-[200px]"
          type="text"
          placeholder="Tu nueva direccion esta aqui..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          onFocus={() => {
            setFocused(true);
            if (suggestions.length > 0) setShowSugs(true);
          }}
          onBlur={() => {
            setFocused(false);
            // Slight delay to allow click selection
            setTimeout(() => setShowSugs(false), 100);
          }}
        />
      </div>
      <Button size="lg" className="h-12 w-full sm:w-auto" onClick={submit}>
        Buscar
      </Button>
      {showSugs && suggestions.length > 0 && (
        <div className="absolute z-20 top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 shadow-md rounded-md overflow-hidden">
          <ul className="max-h-80 overflow-auto">
            {suggestions.map((sug) => (
              <li
                key={sug}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onMouseDown={(e) => {
                  // prevent input blur before click
                  e.preventDefault();
                }}
                onClick={() => {
                  setQ(sug);
                  router.push(`/search?query=${encodeURIComponent(sug)}`);
                }}
              >
                <div className="text-sm text-gray-900 truncate">
                  <span className="font-medium">{q}</span>
                  <span className="text-gray-500">{sug.slice(q.length)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SearchbarFilters({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    price: {
      min: 6000,
      max: 12000,
    },
    type: undefined as PropertyType | undefined,
    bedrooms: undefined as number | undefined,
    transaction: undefined as ("rent" | "sale") | undefined,
    city: "",
    state: "",
  });

  const handleEnterAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();

      if (value && !amenities.includes(value)) {
        setAmenities([...amenities, value]);
        input.value = "";
      }
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  // Initialize amenities from URL params to keep UI in sync on reload
  useEffect(() => {
    const t = params.get("tags");
    if (t) {
      const list = t.split(",").filter(Boolean);
      setAmenities(list);
    }
    // Initialize other filters from URL
    const type = params.get("type");
    const minb = params.get("min_bedrooms");
    const tx = params.get("transaction");
    const minp = params.get("min_price");
    const maxp = params.get("max_price");
    const city = params.get("city") || "";
    const state = params.get("state") || "";

    setFilters((f) => ({
      price: {
        min: minp ? Number(minp) : f.price.min,
        max: maxp ? Number(maxp) : f.price.max,
      },
      type: (type as any) || undefined,
      bedrooms: minb ? Number(minb) : undefined,
      transaction: (tx as any) || undefined,
      city,
      state,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.toString()]);

  const pushFilters = (overrides?: Partial<typeof filters>) => {
    const eff = { ...filters, ...(overrides || {}) };
    const sp = new URLSearchParams(params?.toString());
    if (eff.type) sp.set("type", eff.type as any);
    else sp.delete("type");
    if (eff.bedrooms != null) sp.set("min_bedrooms", String(eff.bedrooms));
    else sp.delete("min_bedrooms");
    if (eff.transaction) sp.set("transaction", eff.transaction);
    else sp.delete("transaction");
    if (eff.price.min != null) sp.set("min_price", String(eff.price.min));
    else sp.delete("min_price");
    if (eff.price.max != null) sp.set("max_price", String(eff.price.max));
    else sp.delete("max_price");
    if (eff.city) sp.set("city", eff.city);
    else sp.delete("city");
    if (eff.state) sp.set("state", eff.state);
    else sp.delete("state");
    if (amenities.length > 0) sp.set("tags", amenities.join(","));
    else sp.delete("tags");
    // Always push filters to URL even without a keyword; SearchPage handles fallbacks
    const qs = sp.toString();
    router.push(qs ? `/search?${qs}` : `/search`);
  };

  const applyFilters = () => {
    pushFilters();
  };

  return (
    <Card
      className={cn(
        "p-4 searchbar-filters flex flex-col items-center gap-4 sm:gap-6 w-full h-fit",
        className,
      )}
    >
      <Searchbar />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-2 w-full">
        <div className="grid w-full sm: items-center gap-2 sm:gap-3">
          <Label htmlFor="">Precio</Label>
          <Select>
            <SelectTrigger className="w-full min-w-[140px]">
              <SelectValue
                placeholder={`${formatPrice(filters.price.min)} - ${formatPrice(filters.price.max)}`}
              />
            </SelectTrigger>

            <SelectContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-gray-500">Desde</span>
                  <Input
                    type="number"
                    placeholder={`${formatPrice(filters.price.min)}`}
                    className="min-w-[120px]"
                    value={filters.price.min}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        price: { ...f.price, min: Number(e.target.value || 0) },
                      }))
                    }
                    onBlur={(e) => {
                      const n = Number((e.target as HTMLInputElement).value || 0);
                      pushFilters({ price: { ...filters.price, min: n } as any });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const n = Number((e.target as HTMLInputElement).value || 0);
                        pushFilters({ price: { ...filters.price, min: n } as any });
                      }
                    }}
                  />
                </div>

                <span className="text-gray-500 sm:mt-8">-</span>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-gray-500">Hasta</span>
                  <Input
                    type="number"
                    placeholder={`${formatPrice(filters.price.max)}`}
                    className="min-w-[120px]"
                    value={filters.price.max}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        price: { ...f.price, max: Number(e.target.value || 0) },
                      }))
                    }
                    onBlur={(e) => {
                      const n = Number((e.target as HTMLInputElement).value || 0);
                      pushFilters({ price: { ...filters.price, max: n } as any });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const n = Number((e.target as HTMLInputElement).value || 0);
                        pushFilters({ price: { ...filters.price, max: n } as any });
                      }
                    }}
                  />
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full sm: items-center gap-2 sm:gap-3">
          <Label htmlFor="email">Tipo de propiedad</Label>
          <Select
            value={filters.type}
            onValueChange={(v: PropertyType) => {
              setFilters((f) => ({ ...f, type: v }));
              // Immediately apply outside-of-modal filter changes
              pushFilters({ type: v });
            }}
          >
            <SelectTrigger className="w-full min-w-[140px]">
              <SelectValue placeholder="Casa" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="house">Casa</SelectItem>
              <SelectItem value="apartment">Departamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full sm: items-center gap-2 sm:gap-3">
          <Label htmlFor="email">Cuartos</Label>
          <Select
            value={filters.bedrooms ? String(filters.bedrooms) : undefined}
            onValueChange={(v) => {
              const n = Number(v);
              setFilters((f) => ({ ...f, bedrooms: n }));
              pushFilters({ bedrooms: n });
            }}
          >
            <SelectTrigger className="w-full min-w-[140px]">
              <SelectValue placeholder="Número de cuartos" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5 +</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full sm: items-center gap-2 sm:gap-3">
          <Label className="opacity-0">Más filtros</Label>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="text-white w-full sm:w-auto"
              >
                Ver más filtros
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[95vw] sm:w-[600px] max-h-[80vh] overflow-y-auto mx-4 sm:mx-0">
              <AlertDialogHeader>
                <AlertDialogTitle>Filtros adicionales</AlertDialogTitle>

                <AlertDialogDescription>
                  Personaliza tu búsqueda con filtros específicos
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="grid gap-4">
                {/* Bathrooms Filter */}
                <div className="grid gap-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Número de baños" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5 +</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parking Filter */}
                <div className="grid gap-2">
                  <Label htmlFor="parking">Estacionamientos</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Número de estacionamientos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4 +</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Type Filter */}
                <div className="grid gap-2">
                  <Label htmlFor="transaction">Tipo de transacción</Label>
                  <Select value={filters.transaction} onValueChange={(v: any) => setFilters((f) => ({ ...f, transaction: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Renta o Venta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Renta</SelectItem>
                      <SelectItem value="sale">Venta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filters */}
                <div className="grid gap-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    placeholder="Ciudad"
                    className="min-w-[200px]"
                    value={filters.city}
                    onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    placeholder="Estado"
                    className="min-w-[200px]"
                    value={filters.state}
                    onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input
                    placeholder="Código Postal"
                    className="min-w-[200px]"
                  />
                </div>

                {/* Property Features */}
                <div className="grid gap-2">
                  <Label>Características</Label>
                  <Input
                    placeholder="Agregar característica (presiona Enter)"
                    onKeyDown={(e) => handleEnterAmenity(e)}
                    className="min-w-[200px]"
                  />

                  <div
                    className={cn(
                      "flex flex-wrap gap-2 min-h-5 mt-2 border border-gray-200 p-2 rounded-md",
                      amenities.length === 0 && "hidden",
                    )}
                  >
                    {amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md text-sm cursor-pointer"
                      >
                        <span>{amenity}</span>
                        <button
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <div className="w-4 h-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction className="w-full sm:w-auto" onClick={applyFilters}>
                  Aplicar filtros
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
