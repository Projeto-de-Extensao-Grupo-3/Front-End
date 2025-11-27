import styles from "../../Pages/Dashboard/dashboard.module.css"
import { GraficoMargemLucro } from "./GraficoMargemLucro"
import { GraficoCustos } from "./GraficoCustos"
import { TabelaBaixoGiro } from "./TabelaBaixoGiro"

export function DashProdutos(props) {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className={`${styles.conteudoDash}`}>
                <div className={`${styles.conteudoGraficos}`}>
                    <GraficoMargemLucro filters={props.filters}/>
                </div>
                <div className={`${styles.conteudoGraficos}`}>
                    <GraficoCustos filters={props.filters} />
                </div>
            </div>
            <div className={`${styles.conteudoDash}`}>
                <div>
                    <TabelaBaixoGiro filters={props.filters} />
                </div>
            </div>

        </div>
    )
}