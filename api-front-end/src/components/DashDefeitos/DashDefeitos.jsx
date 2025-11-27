import styles from "../../Pages/Dashboard/dashboard.module.css"
import { DefeitosPorCostureira } from "./DefeitosPorCostureira"
import { DefeitosPorRoupa } from "./DefeitosPorRoupa"

export function DashDefeitos() {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className={`${styles.conteudoDash}`} style={{height: '100%'}}>
                <div className={`${styles.conteudoGraficos}`} style={{width: '65%'}}>
                    <DefeitosPorCostureira />
                </div>
                <div className={`${styles.conteudoGraficos}`} style={{width: '35%'}}>
                    <DefeitosPorRoupa />
                </div>
            </div>
            {/* <div className={`${styles.conteudoDash}`}>
                <div>
                </div>
            </div> */}

        </div>
    )
}