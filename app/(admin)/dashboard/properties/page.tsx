"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyContent, PropertyType, TransactionType } from "@/types/property";
import { formatPrice } from "@/utils/text-formatter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter } from "lucide-react";
import PropertyCard from "@/components/shared/property-card-editable";
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
import { cn } from "@/lib/utils";
import { deleteProperty, listProperties, setPropertyActive } from "@/lib/properties";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Properties() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyContent[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<
    PropertyContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<PropertyType | "all">("all");
  const [filterTransaction, setFilterTransaction] = useState<
    TransactionType | "all"
  >("all");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    price: {
      min: 0,
      max: 50000,
    },
    bathrooms: "any",
    parking: "any",
    city: "",
    neighborhood: "",
    zip: "",
  });

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await listProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (e: any) {
        setError(e?.message || "No se pudieron cargar las propiedades");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    // Filter properties based on search and filters
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          property.location.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((property) => property.type === filterType);
    }

    // Transaction filter
    if (filterTransaction !== "all") {
      filtered = filtered.filter(
        (property) => property.transaction === filterTransaction,
      );
    }

    // Price filter
    if (advancedFilters.price.min > 0 || advancedFilters.price.max < 50000) {
      filtered = filtered.filter(
        (property) =>
          property.price >= advancedFilters.price.min &&
          property.price <= advancedFilters.price.max,
      );
    }

    // Bathrooms filter
    if (advancedFilters.bathrooms && advancedFilters.bathrooms !== "any") {
      filtered = filtered.filter(
        (property) => property.bathrooms >= parseInt(advancedFilters.bathrooms),
      );
    }

    // Parking filter
    if (advancedFilters.parking && advancedFilters.parking !== "any") {
      filtered = filtered.filter(
        (property) => property.parking >= parseInt(advancedFilters.parking),
      );
    }

    // City filter
    if (advancedFilters.city) {
      filtered = filtered.filter((property) =>
        property.location.city
          .toLowerCase()
          .includes(advancedFilters.city.toLowerCase()),
      );
    }

    // Neighborhood filter
    if (advancedFilters.neighborhood) {
      filtered = filtered.filter((property) =>
        property.location.neighborhood
          .toLowerCase()
          .includes(advancedFilters.neighborhood.toLowerCase()),
      );
    }

    // Zip filter
    if (advancedFilters.zip) {
      filtered = filtered.filter((property) =>
        property.location.zip.includes(advancedFilters.zip),
      );
    }

    // Amenities filter
    if (amenities.length > 0) {
      filtered = filtered.filter((property) =>
        amenities.every((amenity) =>
          property.tags.some((tag) =>
            tag.toLowerCase().includes(amenity.toLowerCase()),
          ),
        ),
      );
    }

    setFilteredProperties(filtered);
  }, [
    properties,
    searchTerm,
    filterType,
    filterTransaction,
    advancedFilters,
    amenities,
  ]);

  const handleDeleteProperty = async (id: string) => {
    try {
      setError(null);
      await deleteProperty(id);
      setProperties((prev) => prev.filter((property) => property.id !== id));
      setFilteredProperties((prev) => prev.filter((property) => property.id !== id));
    } catch (e: any) {
      setError(e?.message || "No se pudo eliminar la propiedad");
    }
  };

  const handleToggleActive = async (id: string, nextActive: boolean) => {
    try {
      setError(null);
      const updated = await setPropertyActive(id, nextActive);
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, active: updated.active } : p)));
      setFilteredProperties((prev) => prev.map((p) => (p.id === id ? { ...p, active: updated.active } : p)));
    } catch (e: any) {
      setError(e?.message || "No se pudo actualizar el estado de la propiedad");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await handleDeleteProperty(deleteId);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

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

  const handleApplyFilters = () => {
    // Filters are already applied in the useEffect
    // This function can be used to close the modal or show a success message
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterTransaction("all");
    setAmenities([]);
    setAdvancedFilters({
      price: {
        min: 0,
        max: 50000,
      },
      bathrooms: "any",
      parking: "any",
      city: "",
      neighborhood: "",
      zip: "",
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu portafolio de propiedades ({filteredProperties.length}{" "}
              propiedades)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar propiedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <Select
                  value={filterType}
                  onValueChange={(value: PropertyType | "all") =>
                    setFilterType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filterTransaction}
                  onValueChange={(value: TransactionType | "all") =>
                    setFilterTransaction(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de transacción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las transacciones</SelectItem>
                    <SelectItem value="sale">Venta</SelectItem>
                    <SelectItem value="rent">Renta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros Avanzados
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[95vw] sm:w-[600px] max-h-[80vh] overflow-y-auto mx-4 sm:mx-0">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Filtros Avanzados</AlertDialogTitle>
                      <AlertDialogDescription>
                        Personaliza tu búsqueda con filtros específicos
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4">
                      {/* Price Filter */}
                      <div className="grid gap-2">
                        <Label>Rango de Precio</Label>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <span className="text-gray-500 text-sm">Desde</span>
                            <Input
                              type="number"
                              placeholder={formatPrice(0)}
                              value={advancedFilters.price.min || ""}
                              onChange={(e) =>
                                setAdvancedFilters((prev) => ({
                                  ...prev,
                                  price: {
                                    ...prev.price,
                                    min: parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className="min-w-[120px]"
                            />
                          </div>

                          <span className="text-gray-500 sm:mt-8">-</span>

                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <span className="text-gray-500 text-sm">Hasta</span>
                            <Input
                              type="number"
                              placeholder={formatPrice(50000)}
                              value={advancedFilters.price.max || ""}
                              onChange={(e) =>
                                setAdvancedFilters((prev) => ({
                                  ...prev,
                                  price: {
                                    ...prev.price,
                                    max: parseInt(e.target.value) || 50000,
                                  },
                                }))
                              }
                              className="min-w-[120px]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bathrooms Filter */}
                      <div className="grid gap-2">
                        <Label htmlFor="bathrooms">Baños</Label>
                        <Select
                          value={advancedFilters.bathrooms}
                          onValueChange={(value) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              bathrooms: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Número de baños" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">
                              Cualquier número
                            </SelectItem>
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
                        <Select
                          value={advancedFilters.parking}
                          onValueChange={(value) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              parking: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Número de estacionamientos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">
                              Cualquier número
                            </SelectItem>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4 +</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location Filters */}
                      <div className="grid gap-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          placeholder="Ciudad"
                          value={advancedFilters.city}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="min-w-[200px]"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="neighborhood">Colonia</Label>
                        <Input
                          placeholder="Colonia"
                          value={advancedFilters.neighborhood}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              neighborhood: e.target.value,
                            }))
                          }
                          className="min-w-[200px]"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="zip">Código Postal</Label>
                        <Input
                          placeholder="Código Postal"
                          value={advancedFilters.zip}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              zip: e.target.value,
                            }))
                          }
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
                      <AlertDialogCancel
                        onClick={handleClearFilters}
                        className="w-full sm:w-auto"
                      >
                        Cancelar{" "}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleApplyFilters}
                        className="w-full sm:w-auto"
                      >
                        Aplicar Filtros
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>

          {/* Card Footer with Add Button */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <Link href="/dashboard/properties/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Propiedad
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                filterType !== "all" ||
                filterTransaction !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda."
                  : "Comienza agregando tu primera propiedad."}
              </p>
              {!searchTerm &&
                filterType === "all" &&
                filterTransaction === "all" && (
                  <Link href="/dashboard/properties/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primera Propiedad
                    </Button>
                  </Link>
                )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={(id) => router.push(`/properties/${id}`)}
                onEdit={(id) => {
                  router.push(`/dashboard/properties/edit/${id}`);
                }}
                onDelete={(id) => setDeleteId(id)}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar propiedad</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
