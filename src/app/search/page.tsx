"use client"
import styles from "./page.module.scss";
import Navbar from "@/components/ui/Navbar/Navbar";
import Property from "@/components/Property/Property";
import SearchbarFilters, { ExtraFilters } from "@/components/ui/Searchbar/SearchbarFilters";
import { getManyProperties } from "@/logic/properties/properties.controller";
import { useEffect, useState } from "react";
import { Property as PropertyType } from "@/types";
import Modal from "@/components/ui/Modal/Modal";

export default function SearchPage() {
    const [properties, setProperties] = useState<PropertyType[]>([]); // TODO: Cambiar a PropertyInterface
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    function handleModalVisibility() {
        setIsModalVisible(!isModalVisible);
    }
    
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

            <Modal isVisible={isModalVisible} onClose={() => handleModalVisibility()}>
                <ExtraFilters />
            </Modal>

            <section className="section">
                <SearchbarFilters modal={() => handleModalVisibility()} />

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