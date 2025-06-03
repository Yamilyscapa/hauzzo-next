"use client";
import styles from "./Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.navbar_container}`}>
                    <div className={styles.logo}>
                        <Link href="/"><img src="/hauzzo_logo.png" alt="Hauzzo" /></Link>
                    </div>
                    <ul className={styles.nav_links}>
                        {/* <li><Link href="/brokers">Publica tu propiedad en Hauzzo</Link></li> */}
                        <li><Link className="btn btn_slim" href="/login">Iniciar sesion</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}