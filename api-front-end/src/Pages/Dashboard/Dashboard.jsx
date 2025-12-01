import { useEffect, useState } from "react";
import { Filtro } from "../../components/Filtro/Filtro"
import { Navbar } from "../../components/Navbar/Navbar"
import { DashProdutos } from "../../components/DashProdutos/DashProdutos"
import styles from "./dashboard.module.css"
import { DashDefeitos } from "../../components/DashDefeitos/DashDefeitos";
import { DashVendas } from "../../components/DashVendas/DashVendas";
import dayjs from "dayjs";

export function Dashboard() {

    const [currentPage, setCurrentPage] = useState('produtos');

    const [filters, setFilters] = useState({
            dataInicio: dayjs().subtract(12, 'months').format('YYYY-MM-DD'),
            dataFim: dayjs().format('YYYY-MM-DD'),
            caracteristica: "",
            categoria: ""
    });

    // const handleFilters = (dataInicio, dataFim, caracteristica, categoria) => {
    //     const object = {
    //         dataInicio: dataInicio,
    //         dataFim: dataFim,
    //         caracteristica: caracteristica,
    //         categoria: categoria
    //     }
    //     setFilters(object);
    // };

    // const handleChangePage = (newPage) => {
    //     setCurrentPage(newPage);
    // }

    return( 
        <div>
            <Navbar pageNumber={3}/>
            <div className={styles.sectionDash}>
                {/* <Filtro currentPage={currentPage} handleChangePage={handleChangePage} handleFilters={handleFilters}/> */}
                <div className={styles.containerDash}>{
                    currentPage == 'produtos' ? 
                    <div></div>
                    : currentPage == 'vendas' ? 
                    <div></div> 
                    : 
                    <div></div>
                }
                </div>
            </div>
        </div>
    )
}