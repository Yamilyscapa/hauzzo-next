"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/utils/text-formatter";
import { useState, use } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchbarFilters } from "@/components/shared/searchbar";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ImageGalleryProps {
  images: string[];
  title: string;
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const mainImages = images.slice(0, 3);
  const remainingImages = images.slice(3);

  const handleSlideshowOpen = () => {
    setShowSlideshow(true);
    setSlideshowIndex(0);
  };

  const handleSlideshowClose = () => {
    setShowSlideshow(false);
  };

  const nextSlide = () => {
    setSlideshowIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setSlideshowIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 h-[60vh] overflow-hidden">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 overflow-hidden">
          <img
            src={images[selectedImage]}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* First smaller image */}
        <div className="col-span-1 overflow-hidden">
          <img
            src={mainImages[1]}
            alt={title}
            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(1)}
          />
        </div>
        {/* Third image as "view all" button */}
        <div onClick={handleSlideshowOpen} className="col-span-1 relative overflow-hidden">
          <img
            src={images[2]}
            alt={title}
            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          />
          <div className="cursor-pointer absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
            <div className="text-white text-center cursor-pointer">
              <div className="text-lg font-semibold">Ver todas</div>
              <div className="text-sm">+{images.length - 2} fotos más</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Modal using Sheet */}
      <Sheet open={showSlideshow} onOpenChange={setShowSlideshow}>
        <SheetContent
          side="bottom"
          className="h-full w-full p-0 border-0 bg-black/95"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Galería de imágenes - {title}</SheetTitle>
          </SheetHeader>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              onClick={handleSlideshowClose}
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 text-white border-white/20 hover:bg-white/20 hover:text-white z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image */}
            <img
              src={images[slideshowIndex]}
              alt={`${title} - Imagen ${slideshowIndex + 1} de ${images.length}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation arrows */}
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white border-white/20 hover:bg-white/20 hover:text-white z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white border-white/20 hover:bg-white/20 hover:text-white z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {slideshowIndex + 1} / {images.length}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params);

  const fetchProperty = async () => {
    // Placeholder for the property
    return {
      id: "1",
      title: "Casa en la playa",
      description: "Hecha en casa de madera, con una vista a la playa y un jardín de 100m2 con árboles frutales y una piscina. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      price: 15000,
      tags: ["Casa", "Playa"],
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      location: {
        zip: "12345",
        city: "Puebla",
        state: "Puebla",
        street: "Calle 123",
        address: "Calle 123",
        neighborhood: "Centro",
        addressNumber: "123",
      },
      type: "house",
      transaction: "rent",
      images: ["https://placehold.co/1920x1080", "https://placehold.co/1920x1080", "https://placehold.co/1920x1080", "https://placehold.co/1920x1080"],
    }
  };

  // For demo purposes, using a mock property
  const property = {
    id: "1",
    title: "Casa en la playa",
    description: "Hecha en casa de madera, con una vista a la playa y un jardín de 100m2 con árboles frutales y una piscina. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    price: 15000,
    tags: ["Casa", "Playa"],
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    location: {
      zip: "12345",
      city: "Puebla",
      state: "Puebla",
      street: "Calle 123",
      address: "Calle 123",
      neighborhood: "Centro",
      addressNumber: "123",
    },
    type: "house",
    transaction: "rent",
    images: ["https://placehold.co/1920x1080", "https://placehold.co/1920x1080", "https://placehold.co/1920x1080", "https://placehold.co/1920x1080"],
  };

  return (
    <div className="py-5 container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          <ImageGallery images={property.images} title={property.title} />
          <SearchbarFilters />
        </div>

        <Card className="p-4 py-6">

          {/* Property Details Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="text-2xl font-semibold text-hauzzo">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              {property.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-hauzzo-light text-white text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">{property.bedrooms === 1 ? "Habitación" : "Habitaciones"}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">{property.bathrooms === 1 ? "Baño" : "Baños"}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                <div className="text-sm text-gray-600">{property.parking === 1 ? "Estacionamiento" : "Estacionamientos"}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
              <div className="text-gray-600">
                <p>{property.location.neighborhood}, {property.location.city}</p>
                <p>{property.location.state}</p>
              </div>
            </div>

            {/* Property Type and Transaction */}
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Tipo de propiedad</div>
                <div className="font-semibold text-gray-900 capitalize">{property.type === "house" ? "Casa" : "Departamento"}</div>
              </div>
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Tipo de transacción</div>
                <div className="font-semibold text-gray-900 capitalize">{property.transaction === "sale" ? "Venta" : "Renta"}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-6 gap-4 pt-4">
              <Button size="lg" className="col-span-4" variant="default">
                Contactar
              </Button>
              <Button size="lg" variant="outline" className="col-span-2">
                Agendar visita
              </Button>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
