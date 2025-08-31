"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PropertyType, TransactionType } from "@/types/property";
import { createProperty } from "@/lib/properties";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Properties() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    type: "" as PropertyType | "",
    transaction: "" as TransactionType | "",
    // Location fields
    street: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
    // Tags
    tags: [] as string[],
    newTag: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Basic validation
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.price.trim() ||
        !formData.type ||
        !formData.transaction
      ) {
        throw new Error("Completa los campos obligatorios");
      }

      const location = {
        address: formData.street,
        addressNumber: formData.addressNumber,
        street: formData.street,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      };

      await createProperty({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price, 10) || 0,
        bedrooms: parseInt(formData.bedrooms, 10) || 0,
        bathrooms: parseInt(formData.bathrooms, 10) || 0,
        parking: parseInt(formData.parking, 10) || 0,
        type: formData.type as PropertyType,
        transaction: formData.transaction as TransactionType,
        location,
        tags: formData.tags,
        images: files,
      });

      router.push("/dashboard/properties");
    } catch (err: any) {
      setError(err?.message || "No se pudo crear la propiedad");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Crear Nueva Propiedad</h1>
          <p className="text-gray-600 mt-2">
            Agregar una nueva propiedad a tu portafolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Basic Information */}
          <Card className="pt-0">
            <CardHeader className="pt-6">
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Ingresa los detalles básicos de la propiedad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Propiedad</Label>
                  <Input
                    id="title"
                    placeholder="Ingresa el título de la propiedad"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Ingresa el precio"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa la descripción de la propiedad"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Propiedad</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">Casa</SelectItem>
                      <SelectItem value="apartment">Departamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction">Tipo de Transacción</Label>
                  <Select
                    value={formData.transaction}
                    onValueChange={(value) =>
                      handleInputChange("transaction", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la transacción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Venta</SelectItem>
                      <SelectItem value="rent">Renta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="pt-0">
            <CardHeader className="pt-6">
              <CardTitle>Detalles de la Propiedad</CardTitle>
              <CardDescription>
                Especifica las características y amenidades de la propiedad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="Número de habitaciones"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange("bedrooms", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="Número de baños"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange("bathrooms", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking">Espacios de Estacionamiento</Label>
                  <Input
                    id="parking"
                    type="number"
                    placeholder="Número de espacios de estacionamiento"
                    value={formData.parking}
                    onChange={(e) =>
                      handleInputChange("parking", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Etiquetas y Características</Label>
                <Input
                  placeholder="Agregar característica (presiona Enter)"
                  value={formData.newTag}
                  onChange={(e) => handleInputChange("newTag", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (
                        formData.newTag.trim() &&
                        !formData.tags.includes(formData.newTag.trim())
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          tags: [...prev.tags, prev.newTag.trim()],
                          newTag: "",
                        }));
                      }
                    }
                  }}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 min-h-5 mt-2 border border-gray-200 p-2 rounded-md">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md text-sm cursor-pointer"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="pt-0">
            <CardHeader className="pt-6">
              <CardTitle>Información de Ubicación</CardTitle>
              <CardDescription>
                Ingresa los detalles de la dirección de la propiedad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Calle</Label>
                  <Input
                    id="street"
                    placeholder="Ingresa el nombre de la calle"
                    value={formData.street}
                    onChange={(e) =>
                      handleInputChange("street", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressNumber">Número de Dirección</Label>
                  <Input
                    id="addressNumber"
                    placeholder="Ingresa el número de dirección"
                    value={formData.addressNumber}
                    onChange={(e) =>
                      handleInputChange("addressNumber", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Colonia</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Ingresa la colonia"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      handleInputChange("neighborhood", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    placeholder="Ingresa la ciudad"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="Ingresa el estado"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input
                    id="zip"
                    placeholder="Ingresa el código postal"
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="pt-0">
            <CardHeader className="pt-6">
              <CardTitle>Imágenes de la Propiedad</CardTitle>
              <CardDescription>Sube imágenes de la propiedad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const list = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        setFiles(list);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Subir Imágenes
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                  {files.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {files.length} archivo(s) seleccionado(s)
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/properties")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creando..." : "Crear Propiedad"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
