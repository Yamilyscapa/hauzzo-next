import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.navbar_container}`}>
                    <div className={styles.logo}>
                        <a href="/"><img src="/hauzzo_logo.png" alt="Hauzzo" /></a>
                    </div>
                    <ul className={styles.nav_links}>
                        <li><a href="/brokers">Publica tu propiedad en Hauzzo</a></li>
                        <li><a className="btn btn_slim" href="/login">Iniciar sesion</a></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}