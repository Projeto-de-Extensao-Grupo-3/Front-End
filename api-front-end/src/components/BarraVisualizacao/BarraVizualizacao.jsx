import styles from "./barra-visualizacao.module.css"
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";
import { JanelaInfo } from "../JanelaInfo/JanelaInfo";
import { JanelaDeletar } from "../JanelaDeletar/JanelaDeletar";
import { AuthContext } from '../Permissao/ValidadorDePermissao.jsx';
import { useContext } from "react";

// Preciso achar um nome melhor para esse componente
export function BarraVisualizacao(props) {
    const [dados, setDados] = useState(props.dados);
    const [ permissao, setPermissao ] = useState("");

    useEffect(() => {
        setDados(props.dados)
    }, [props.dados])

     useEffect(() => {
        if(props.pagina === "funcionarios"){
            setPermissao("EDITAR FUNCIONARIOS");
        }else{
            setPermissao("EDITAR ESTOQUE");
        }
    }, [props.pagina])

    const { hasPermission } = useContext(AuthContext);

    return(
        <div className={styles.card}>
            <ul className={styles.uul}>
                {props.children}

                { hasPermission(permissao) && (
                    <li>
                    <JanelaCadastro
                        cadastroDisabled={props.cadastroDisabled}
                        limparCampos={props.limparCampos}
                        form={props.form}
                        lista={props.lista}
                        func={props.func}
                        dados={dados}
                        children={
                        <>
                            <EditSquareIcon fontSize="large" color="action" sx={{color: "rgba(60, 60, 60, 1)", cursor: "pointer"}}/>
                        </>
                    } action={props.acao} message={props.confirm}/>
                    </li>
                )}
                    <li>
                    <JanelaInfo 
                        info={props.info}
                        title={props.title}
                        altura={props.altura}
                        children={
                            <InfoIcon fontSize="large" color="action" sx={{ color: "rgba(60, 60, 60, 1)", cursor: "pointer" }}/>
                        }/>
                    </li>
                    
                {hasPermission(permissao) && (
                    <li>
                    <JanelaDeletar
                        children={
                            <ClearIcon fontSize="large" color="action" sx={{ color: "rgba(169, 78, 78, 1)", cursor: "pointer" }}/>
                        }
                        deleteFunc={props.deleteFunc}
                        dadoTitle={props.dadoTitle}
                        />
                    </li>
                )}
            </ul>
        </div>
    )
}