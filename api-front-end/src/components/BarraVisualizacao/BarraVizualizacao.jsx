import styles from "./barra-visualizacao.module.css"
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import EditSquareIcon from '@mui/icons-material/EditSquare';

// Preciso achar um nome melhor para esse componente
export function BarraVisualizacao() {

    return(
        <div className={styles.card}>
            <ul className={styles.uul}>
                <li>Nome da costureira: <br /> Costureira teste </li>
                <hr />
                <li>Telefone: <br /> +55 (11) 99999-9999 </li>
                <hr />
                <li>E-mail: <br /> email@gmail.com </li>
                <hr />
                <li>Identificação: <br /> 0000000000 </li>
                <hr />
                <li><JanelaCadastro children={
                    <EditSquareIcon fontSize="large" color="action" sx={{color: "rgba(255, 255, 255, 1)", cursor: "pointer"}}/>
                    } action={"Atualizar dados da costureira"} message={"Confirmar alterações"}/></li>
               
            </ul>
        </div>
    )
}