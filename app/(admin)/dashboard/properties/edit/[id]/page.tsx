"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { formatPrice } from "@/utils/text-formatter";
import { getProperty, updateProperty, updatePropertyImages } from "@/lib/properties";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditProperty() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const p = await getProperty(propertyId);
        setFormData({
          title: p.title,
          description: p.description,
          price: String(p.price),
          bedrooms: String(p.bedrooms),
          bathrooms: String(p.bathrooms),
          parking: String(p.parking),
          type: p.type as PropertyType,
          transaction: p.transaction as TransactionType,
          street: p.location.street,
          addressNumber: p.location.addressNumber,
          neighborhood: p.location.neighborhood,
          city: p.location.city,
          state: p.location.state,
          zip: p.location.zip,
          tags: p.tags,
          newTag: "",
        });
        const imgs = p.images || [];
        setImages(imgs);
        setInitialImages(imgs);
      } catch (e: any) {
        setError(e?.message || "No se pudo cargar la propiedad");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [propertyId]);

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
    setIsSaving(true);

    try {
      setError(null);
      await updateProperty(propertyId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price, 10) || 0,
        tags: formData.tags,
        location: {
          address: formData.street,
          addressNumber: formData.addressNumber,
          street: formData.street,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
      });
      // Update images if changed or new files added
      const imagesChanged =
        images.length !== initialImages.length ||
        images.some((u, i) => u !== initialImages[i]) ||
        newFiles.length > 0;
      if (imagesChanged) {
        await updatePropertyImages(propertyId, images, newFiles);
      }
      router.push("/dashboard/properties");
    } catch (e: any) {
      setError(e?.message || "No se pudo actualizar la propiedad");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/properties");
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p>Cargando datos de la propiedad...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar Propiedad</h1>
          <p className="text-gray-600 mt-2">
            Modifica los detalles de la propiedad
          </p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="pt-0">
            <CardHeader className="pt-6">
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Modifica los detalles básicos de la propiedad
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
                    type="text"
                    placeholder="Ingresa el precio"
                    value={
                      formData.price
                        ? formatPrice(parseInt(formData.price))
                        : ""
                    }
                    onChange={(e) => {
                      // Remover caracteres no numéricos para el valor interno
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                      handleInputChange("price", numericValue);
                    }}
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
                      <SelectItem value="apartment">Apartamento</SelectItem>
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
                Modifica las características y amenidades de la propiedad
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
                Modifica los detalles de la dirección de la propiedad
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
              <CardDescription>
                Modifica las imágenes de la propiedad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing images */}
                {images && images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                      <div key={url+idx} className="relative group">
                        <img src={url} alt={`Imagen ${idx+1}`} className="w-full h-32 object-cover rounded-md border" />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                          className="absolute top-2 right-2 bg-white/80 text-red-600 border border-red-200 rounded-full px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
                          aria-label="Eliminar imagen"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No hay imágenes actuales.</div>
                )}

                {/* Add new images */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <input
                      id="new-images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const list = e.target.files ? Array.from(e.target.files) : [];
                        setNewFiles((prev) => [...prev, ...list]);
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('new-images')?.click()}>
                      Agregar imágenes
                    </Button>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                </div>

                {/* New files preview */}
                {newFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Nuevas imágenes</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {newFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => setNewFiles((prev) => prev.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 bg-white/80 text-red-600 border border-red-200 rounded-full px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
                          >
                            Quitar
                          </button>
                          <div className="mt-1 text-xs text-gray-600 truncate" title={file.name}>{file.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
