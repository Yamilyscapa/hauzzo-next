"use client"
import Searchbar from "./Searchbar";
import styles from "./SearchbarFilters.module.scss";

export default function SearchbarFilters() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <div className={styles.search_controller}>

            <div className={styles.searchbar}>
                <Searchbar />
            </div>

            <form onSubmit={handleSubmit} className={styles.search_controller_filters}>
                <div className={styles.search_controller_filters_item}>
                    <label htmlFor="price_from">Precio:</label>
                    <div className={styles.search_controller_filters_item_input}>
                        <input id="price_from" name="price_from" min={0} type="number" step={1000} placeholder="Desde..." />
                        <input id="price_to" name="price_to" min={0} type="number" step={1000} placeholder="Hasta..." />
                    </div>
                </div>

                <div className={styles.search_controller_filters_item}>
                    <label htmlFor="property_type">Tipo de propiedad:</label>
                    <select name="property_type" id="property_type">
                        <option value="house">Casa</option>
                        <option value="apartment">Departamento</option>
                    </select>
                </div>

                <div className={styles.search_controller_filters_item}>
                    <label htmlFor="transaction_type">Tipo de transacción:</label>
                    <select name="transaction_type" id="transaction_type">
                        <option value="rent">Renta</option>
                        <option value="sale">Venta</option>
                    </select>
                </div>

                <div className={styles.search_controller_filters_item}>
                    <label>Más filtros:</label>
                    <button>Ver más</button>
                </div>
            </form>
        </div>
    )
}