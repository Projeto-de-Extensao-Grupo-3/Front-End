import styles from "./barra-visualizacao.module.css"
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import EditSquareIcon from '@mui/icons-material/EditSquare';

// Preciso achar um nome melhor para esse componente
export function BarraVisualizacao(props) {

    return(
        <div className={styles.card}>
            <ul className={styles.uul}>
                <li>Nome: <br /> {props.nome} </li>
                <hr />
                <li>Telefone: <br /> {props.telefone} </li>
                <hr />
                <li>E-mail: <br /> {props.email} </li>
                <hr />
                <li>Identificação: <br /> {props.identificacao} </li>
                <hr />
                <li><JanelaCadastro 
                        nome={props.nome}
                        telefone={props.telefone}
                        email={props.email}
                        endereco={props.endereco}
                        identificacao={props.identificacao} children={
                    <EditSquareIcon fontSize="large" color="action" sx={{color: "rgba(255, 255, 255, 1)", cursor: "pointer"}}/>
                    } action={props.acao} message={props.confirm}/></li>
               
            </ul>
        </div>
    )
}