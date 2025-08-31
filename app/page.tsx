"use client";
import Property from "@/components/shared/property-card";
import { PropertyContent } from "@/types/property";
import Searchbar from "@/components/shared/searchbar";
import { listProperties } from "@/lib/properties";
import { useEffect, useState } from "react";

export default function Home() {
  const [properties, setProperties] = useState<PropertyContent[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      const properties = await listProperties(8);
      setProperties(properties);
    };
    loadProperties();
  }, []);

  return (
    <section className="hero font-inter min-h-screen flex items-center justify-center px-4 py-8 md:py-16">
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-7xl">
        <h1 className="text-4xl xl:w-5/6 md:text-5xl sm:text-5xl lg:text-7xl font-extrabold text-center px-4 md:px-8 lg:px-16">
          Encuentra un
          <span className="bg-gradient-to-r from-hauzzo to-hauzzo-dark bg-clip-text text-transparent">
            {" "}
            hogar
          </span>
          , pensado para ti
        </h1>
        <p className="text-base md:text-lg text-center text-gray-500 px-4 md:px-8 max-w-2xl">
          Imagina tu hogar ideal, nosotros lo encontramos según tus gustos.
        </p>

        <div className="w-full flex justify-center max-w-4xl px-4 md:px-8">
          <Searchbar />
        </div>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-10">
            {properties.map((property) => (
              <div key={property.id} className="w-full flex justify-center">
                <Property {...property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
