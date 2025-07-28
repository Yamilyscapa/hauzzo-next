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
import { useState } from "react";
import { formatPrice } from "@/utils/text-formatter";
import Link from "next/link";
import { PropertyType } from "@/types/property";

export default function Searchbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "searchbar flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-2xl",
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
        />
      </div>
      <Button size="lg" className="h-12 w-full sm:w-auto">
        <Link href="/search">
          Buscar
        </Link>
      </Button>
    </div>
  );
}

export function SearchbarFilters({ className }: { className?: string }) {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    price: {
      min: 6000,
      max: 12000,
    },
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
                  />
                </div>

                <span className="text-gray-500 sm:mt-8">-</span>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-gray-500">Hasta</span>
                  <Input
                    type="number"
                    placeholder={`${formatPrice(filters.price.max)}`}
                    className="min-w-[120px]"
                  />
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full sm: items-center gap-2 sm:gap-3">
          <Label htmlFor="email">Tipo de propiedad</Label>
          <Select>
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
          <Select>
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
              <Button variant="outline" size="default" className="text-white w-full sm:w-auto">
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
                  <Select>
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
                  <Input placeholder="Ciudad" className="min-w-[200px]" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="neighborhood">Colonia</Label>
                  <Input placeholder="Colonia" className="min-w-[200px]" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input placeholder="Código Postal" className="min-w-[200px]" />
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
                <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                <AlertDialogAction className="w-full sm:w-auto">Aplicar filtros</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
