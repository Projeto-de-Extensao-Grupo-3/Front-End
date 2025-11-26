import styles from "../../Pages/Dashboard/dashboard.module.css"
import { GraficoVendas } from "./GraficoVendas"

export function DashVendas() {
    return (
        <div style={{width: '100%', height: '100%', display: "flex"}}>
            <div className={`${styles.graficoVenda}`}>
                <GraficoVendas />
            </div>
            {/* <div className={`${styles.kpiVenda}`}>
                <div>
                </div>
            </div> */}
        </div>
    )
}