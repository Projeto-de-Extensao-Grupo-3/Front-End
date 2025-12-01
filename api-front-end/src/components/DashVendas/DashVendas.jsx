import styles from "../../Pages/Dashboard/dashboard.module.css"
import { GraficoVendas } from "./GraficoVendas"

export function DashVendas(props) {
    return (
        <div style={{width: '100%', height: '100%', display: "flex"}}>
            <div className={`${styles.graficoVenda}`}>
                {/* <GraficoVendas filters={props.filters} /> */}
            </div>
        </div>
    )
}