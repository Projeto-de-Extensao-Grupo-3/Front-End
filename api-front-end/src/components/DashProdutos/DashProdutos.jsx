import styles from "../../Pages/Dashboard/dashboard.module.css"
import { GraficoMargemLucro } from "./GraficoMargemLucro"
import { TabelaBaixoGiro } from "./TabelaBaixoGiro"

export function DashProdutos() {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className={`${styles.conteudoDash}`}>
                <div className={`${styles.conteudoGraficos}`}>
                    <GraficoMargemLucro />
                </div>
                <div className={`${styles.conteudoGraficos}`}>
                    <h2>Algo aqui?</h2>
                </div>
            </div>
            <div className={`${styles.conteudoDash}`}>
                <div>
                    <TabelaBaixoGiro />
                </div>
            </div>

        </div>
    )
}