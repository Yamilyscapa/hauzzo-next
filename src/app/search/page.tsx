"use client"
import styles from "./page.module.scss";
import Navbar from "@/components/ui/Navbar/Navbar";
import Property from "@/components/Property/Property";
import SearchbarFilters from "@/components/ui/Searchbar/SearchbarFilters";
import { getManyProperties } from "@/logic/properties/properties.controller";
import { useEffect, useState } from "react";
import { Property as PropertyType } from "@/types";

export default function SearchPage() {
    const [properties, setProperties] = useState<PropertyType[]>([]); // TODO: Cambiar a PropertyInterface

    // Fetch properties from the API
    useEffect(() => {
        (async () => {
            try {
                const data = await getManyProperties(10, {
                    cache: 'force-cache',
                    next: {
                        revalidate: 60 * 60,
                        tags: ['main-properties']
                    }
                });

                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        })()
    }, [])

    return (
        <>
            <Navbar />

            <section className="section">
                <SearchbarFilters />

                <div >
                    <h2>Tus resultados:</h2>
                    <div className={styles.properties_container}>
                        {properties.map((property) => (
                            <Property key={property.id} data={property} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}