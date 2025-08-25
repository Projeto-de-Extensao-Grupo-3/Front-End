import { Filtro } from "../../components/Filtro/Filtro"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./dashboard.module.css"

export function Dashboard() {
    return( 
        <div>
            <Navbar />
            <div className={styles.sectionDash}>
                <Filtro />
                <div className={styles.containerDash}>
                    <div className={`${styles.conteudoDash}`}>
                        <div className={`${styles.conteudoGraficos}`}>
                            <h1>Gráfico de Barras</h1>
                        </div>
                        <div className={`${styles.conteudoGraficos}`}>
                            <h1>Card de Defeitos</h1>
                        </div>
                    </div>
                    <div className={`${styles.conteudoDash}`}>
                        <h1>Gráfico de Linhas</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}