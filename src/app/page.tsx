"use client";

import styles from "./page.module.css";
// Components
import Navbar from "@/components/ui/Navbar/Navbar";
import Searchbar from "@/components/ui/Searchbar/Searchbar";
import Property from "@/components/Property/Property";
import { Property as PropertyType } from "@/types";

import { useEffect, useState } from "react";
// Logic
import { getManyProperties } from "@/logic/properties/properties.controller";

export default function App() {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  // Fetch properties from the API
  useEffect(() => {
    (async () => {
      try {
        if (localStorage.getItem('properties')) {
          const cachedProperties = localStorage.getItem('properties');
          if (cachedProperties) {
            const cachedData: PropertyType[] = JSON.parse(cachedProperties);
            setProperties(cachedData);
            return;
          }
        }

        // Fetch properties from the API

        const data: PropertyType[] = await getManyProperties(4);

        function savePropertiesToLocalStorage(properties: PropertyType[]) {
          localStorage.setItem('properties', JSON.stringify(properties));
        }

        setProperties(data);
        savePropertiesToLocalStorage(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    })()
  }, [])

  return (
    <>
      <Navbar />

      <section className={`container center ${styles.hero}`}>
        <div className={` ${styles.hero_container}`}>

          <div className={styles.hero_text}>
            <h1 className={styles.h1}>Encuentra un <span className={styles.h1_detail}>hogar</span>,
              pensado para ti</h1>
            <p className={styles.subtitle}>Imagina tu hogar ideal, nosotros lo encontramos según tus gustos.</p>
          </div>

          <div className={styles.searchbar}>
            <Searchbar />
          </div>
        </div>


        <div className={`flex ${styles.properties_container}`}>
          {properties.map((property) => (
            <Property key={property.id} data={property} />
          ))}
        </div>

      </section>

      <section className={`section ${styles.properties}`}>
        <h3 className={styles.h3}>Encuentra por ubicacion</h3>

        <div className={`flex ${styles.properties_container}`}>
          {properties.map((property) => (
            <Property key={property.id} data={property} />
          ))}
        </div>
      </section>

      <section className={`section ${styles.properties}`}>
        <h3 className={styles.h3}>Destacadas</h3>


        <div className={`flex ${styles.properties_container}`}>
          {properties.map((property) => (
            <Property key={property.id} data={property} />
          ))}
        </div>
      </section>
    </>
  )
}