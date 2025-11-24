import styles from "../../Pages/Dashboard/dashboard.module.css"
import { DefeitosPorCostureira } from "./DefeitosPorCostureira"
import { DefeitosPorRoupa } from "./DefeitosPorRoupa"

export function DashDefeitos() {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className={`${styles.conteudoDash}`}>
                <div className={`${styles.conteudoGraficos}`}>
                    <DefeitosPorCostureira />
                </div>
                <div className={`${styles.conteudoGraficos}`}>
                    <DefeitosPorRoupa />
                </div>
            </div>
            <div className={`${styles.conteudoDash}`}>
                <div>
                </div>
            </div>

        </div>
    )
}