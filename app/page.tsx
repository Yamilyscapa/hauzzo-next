import Property from "@/components/shared/property";
import { PropertyContent } from "@/types/property";
import { Button } from "@/components/ui/button";
import Searchbar, { SearchbarFilters } from "@/components/shared/searchbar";

export default function Home() {
  const content: PropertyContent = {
    title: "Casa en la playa",
    description:
      "Hecha en casa de madera, con una vista a la playa y un jardín de 100m2 con árboles frutales y una piscina. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
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
    transaction: "sale",
    images: ["https://placehold.co/600x800"],
  };
  return (
    <div>
      <Property {...content} />
      <Searchbar className="mb-4" />
      <SearchbarFilters />
    </div>
  );
}
