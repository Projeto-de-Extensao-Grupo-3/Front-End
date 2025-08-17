import { useState } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import styles from "./parceiros.module.css"

export function Parceiros() {
    const [pesquisa, setPesquisa] = useState("Buscar costureira");
    const [categoria, setCategoria] = useState("Nova Costureira");
    const [atualizarDados, setAtualizarDados] = useState("da costureira");

    const atualizarInfoTela = (tela) => {
        if (tela == "costureira") {
            setPesquisa("Buscar costureira");
            setCategoria("Nova Costureira");
            setAtualizarDados("da costureira");
        } else if (tela == "fornecedor") {
            setPesquisa("Buscar fornecedor");
            setCategoria("Novo Fornecedor");
            setAtualizarDados("do fornecedor");
        }
    }
    
    return(
        <div>
            <Navbar vazio={false} pageNumber={4}/>
            <div className={styles.main}>
                <Options item1={"Costureiras"} item2={"Fornecedores de Tecido"} acao={atualizarInfoTela}/>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa busca={pesquisa}></BarraPesquisa>
                    </div>
                    <JanelaCadastro children={
                        <Button variant="outlined" size="large" sx={
                            {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                        }>Cadastrar {categoria}</Button>
                    } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}/>
                </div>
                <BarraVisualizacao acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}/>
                <BarraVisualizacao acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}/>
                <BarraVisualizacao acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}/>
            </div>
        </div>
    )
}