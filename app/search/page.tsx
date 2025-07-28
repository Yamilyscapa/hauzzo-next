"use client";
import Property from "@/components/shared/property";
import { PropertyContent } from "@/types/property";
import { SearchbarFilters } from "@/components/shared/searchbar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const content: PropertyContent = {
    id: "1",
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

export default function SearchPage() {
    const [properties, setProperties] = useState<PropertyContent[]>([]);

    useEffect(() => {
        // Placeholder for the search results
        for (let i = 0; i < 10; i++) {
            setProperties(prev => [...prev, content]);
        }
    }, []);

    return (
        <div className="pt-5 flex flex-col items-center justify-center gap-6 container mx-auto">
            <SearchbarFilters className="max-w-3xl " />

            <div className="w-full">
                <h2 className="text-3xl font-semibold text-gray-800">Resultados:</h2>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-10">
                    {properties.map((property, index) => (
                        <Property key={index} {...property} />
                    ))}
                </div>
            </div>
        </div>
    )
}