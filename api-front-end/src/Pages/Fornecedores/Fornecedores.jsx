import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import Button from '@mui/material/Button';
import styles from "./fornecedores.module.css"

export function Fornecedores() {
    
    return(
        <div>
            <Navbar vazio={false} pageNumber={4}/>
            <div className={styles.main}>
                <div className={styles.opcoes}>
                    <div className={styles.btn_selected}>Costureiras</div>
                    <div className={styles.btn}>Fornecedores de Tecido</div>
                </div>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa busca={"Buscar costureira"}></BarraPesquisa>
                    </div>
                    <JanelaCadastro children={
                        <Button variant="outlined" size="large" sx={
                            {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                        }>Cadastrar Nova Costureira</Button>
                    } action={"Cadastrar nova costureira"} message={"Confirmar cadastro"}/>
                </div>
                <BarraVisualizacao/>
                <BarraVisualizacao/>
                <BarraVisualizacao />
            </div>
        </div>
    )
}