import styles from "./barra-visualizacao.module.css"
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import EditSquareIcon from '@mui/icons-material/EditSquare';

// Preciso achar um nome melhor para esse componente
export function BarraVisualizacao(props) {

    return(
        <div className={styles.card}>
            <ul className={styles.uul}>
                {props.children}
                <li><JanelaCadastro
                        func={props.func}
                        dados={props.dados}
                        campos={props.campos}
                        children={
                    <EditSquareIcon fontSize="large" color="action" sx={{color: "rgba(255, 255, 255, 1)", cursor: "pointer"}}/>
                    } action={props.acao} message={props.confirm}/></li>
            </ul>
        </div>
    )
}