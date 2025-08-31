import Property from "@/components/shared/property-card";
import { PropertyContent } from "@/types/property";
import Searchbar from "@/components/shared/searchbar";

export default function Home() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-10">
          <Property {...content} />
          <Property {...content} />
          <Property {...content} />
          <Property {...content} />
        </div>
      </div>
    </section>
  );
}
