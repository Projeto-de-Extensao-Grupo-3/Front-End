import { useState } from "react";
import { Filtro } from "../../components/Filtro/Filtro"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./dashboard.module.css"

export function Dashboard() {

    const [currentPage, setCurrentPage] = useState('produtos');


    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    }

    return( 
        <div>
            <Navbar pageNumber={3}/>
            <div className={styles.sectionDash}>
                <Filtro currentPage={currentPage} handleChangePage={handleChangePage}/>
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