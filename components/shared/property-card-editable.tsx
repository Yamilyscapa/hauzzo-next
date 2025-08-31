import { Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyContent } from "@/types/property";
import { formatPrice } from "@/utils/text-formatter";
import { Eye, Edit, Trash2 } from "lucide-react";

interface PropertyCardProps {
  property: PropertyContent;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, nextActive: boolean) => void;
}

export default function PropertyCard({
  property,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}: PropertyCardProps) {
  const formattedContent = {
    transaction: property.transaction === "sale" ? "VENTA" : "RENTA",
    price: formatPrice(property.price),
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
      <div className="h-48 bg-gray-200 relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className={`w-full h-full object-cover ${property.active === false ? "grayscale opacity-70" : ""}`}
          />
        ) : (
          <div
            className={`w-full h-full bg-gray-200 flex items-center justify-center ${property.active === false ? "grayscale opacity-70" : ""}`}
          >
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              property.transaction === "sale"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {formattedContent.transaction}
          </span>
          {property.active === false && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700 border">
              Deshabilitada
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="text-2xl font-bold text-hauzzo mb-2">
          {formattedContent.price}
        </p>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>{property.bedrooms} hab</span>
          <span>{property.bathrooms} baños</span>
          <span>{property.parking} estac.</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">
            {property.location.neighborhood}, {property.location.city}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onView?.(property.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`${property.active === false ? "text-green-700" : "text-gray-700"}`}
            onClick={() =>
              onToggleActive?.(property.id, !(property.active !== false))
            }
          >
            {property.active === false ? "Activar" : "Desactivar"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(property.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(property.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
