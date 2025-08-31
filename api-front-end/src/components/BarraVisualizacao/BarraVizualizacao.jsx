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
                        lista={props.lista}
                        func={props.func}
                        dados={props.dados}
                        campos={props.campos}
                        start_index={props.start_index} /*Index inicial para ser considerado ao visualizar os dados*/ 
                        break_index={props.break_index} /*Index para realizar divisão da tela*/ 
                        children={
                    <EditSquareIcon fontSize="large" color="action" sx={{color: "rgba(255, 255, 255, 1)", cursor: "pointer"}}/>
                    } action={props.acao} message={props.confirm}/></li>
            </ul>
        </div>
    )
}