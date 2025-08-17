import { Filtro } from "../../components/Filtro/Filtro"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./dashboard.module.css"

export function Dashboard() {
    return( 
        <div>
            <Navbar />
            <div className={styles.containerDash}>
                <Filtro />
            </div>
        </div>
    )
}