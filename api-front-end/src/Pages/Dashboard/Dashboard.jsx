import { useState } from "react";
import { Filtro } from "../../components/Filtro/Filtro"
import { Navbar } from "../../components/Navbar/Navbar"
import { DashProdutos } from "../../components/DashProdutos/DashProdutos"
import styles from "./dashboard.module.css"
import { DashDefeitos } from "../../components/DashDefeitos/DashDefeitos";
import { DashVendas } from "../../components/DashVendas/DashVendas";

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
                <div className={styles.containerDash}>{
                    currentPage == 'produtos' ? <DashProdutos /> : 
                    currentPage == 'vendas' ? <DashVendas /> :
                    <DashDefeitos />
                }
                    {/* <div className={`${styles.conteudoDash}`}>
                        <div className={`${styles.conteudoGraficos}`}>
                            <h1>Gráfico de Barras</h1>
                        </div>
                        <div className={`${styles.conteudoGraficos}`}>
                            <h1>Card de Defeitos</h1>
                        </div>
                    </div>
                    <div className={`${styles.conteudoDash}`}>
                        <h1>Gráfico de Linhas</h1>
                    </div> */}
                </div>
            </div>
        </div>
    )
}