"use client"
import Searchbar from "./Searchbar";
import styles from "./SearchbarFilters.module.scss";

export default function SearchbarFilters({ modal }: { modal: () => void }) {
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
                    <button onClick={() => modal()}>Ver más</button>
                </div>
            </form>
        </div>
    )
}

export function ExtraFilters() {
    return (
        <form className={styles.search_controller_filters}>
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
                <label htmlFor="rooms">Cuartos:</label>
                <select name="rooms" id="rooms">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                </select>
            </div>

            <div className={styles.search_controller_filters_item}>
                <label htmlFor="transaction_type">Amueblado:</label>
                <select name="furnished" id="furnished">
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div className={styles.search_controller_filters_item}>
                <label htmlFor="parking">Estacionamiento:</label>
                <select name="parking" id="parking">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                </select>
            </div>

            <div className={styles.search_controller_filters_item}>
                <label htmlFor="pets">Permite mascotas:</label>
                <select name="pets" id="pets">
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div className={styles.search_controller_filters_item}>
                <label htmlFor="m2">m²:</label>
                <input type="number" name="m2" id="m2" min={0} placeholder="Metros cuadrados" />
            </div>

              <div className={styles.search_controller_filters_item}>
                <button className={`btn ${styles.btn}`}>Aplicar</button>
            </div>
        </form>
    );
}