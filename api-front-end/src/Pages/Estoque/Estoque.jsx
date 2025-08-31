import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import styles from "../Parceiros/parceiros.module.css"
import axios from "axios";

export function Estoque() {
    const [parceiro, setParceiro] = useState("Roupa");
    const [pesquisa, setPesquisa] = useState("Buscar roupa");
    const [categoria, setCategoria] = useState("Nova roupa");
    const [atualizarDados, setAtualizarDados] = useState("da roupa");
    const [data, setData] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const listarParceiros = () => {
        axios.get(`http://localhost:8080/itens-estoque/categorias?tipo=${parceiro}`)
        .then(response => {
            console.log(response.data);
            setData(response.data.reverse());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const buscarParceiro = (nome) => {
        axios.get(`http://localhost:8080/servico-terceiros/${parceiro}/busca?nome=${nome}`)
        .then(response => {
            console.log(response.data);
            if (response.data.length === 0) {
                setData([])
                setLoadMsg("Nenhum dado encontrado");
            } else {
                setData(response.data.reverse());
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const atualizarParceiro = (dados) => {
        axios.put(`http://localhost:8080/servico-terceiros/${dados[0][1]}`, 
            {
                "categoria": dados[1][1],
                "nome": dados[2][1],
                "telefone": dados[3][1],
                "email": dados[4][1],
                "endereco": dados[5][1],
                "identificacao": dados[6][1],
            }
        )
        .then(response => {
            console.log(response.data);
            setOperations(operations+1);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const cadastrarParceiro = (dados) => {
        axios.post(`http://localhost:8080/servico-terceiros`, 
            {
                "categoria": dados[1][1],
                "nome": dados[2][1],
                "telefone": dados[3][1],
                "email": dados[4][1],
                "endereco": dados[5][1],
                "identificacao": dados[6][1],
            }
        )
        .then(response => {
            console.log(response.data);
            setOperations(operations+1);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        listarParceiros();
        setLoadMsg("Carregando dados...");
    }, [parceiro, operations]);

    const atualizarInfoTela = (tela) => {
        if (tela == "Roupa") {
            setParceiro("Roupa");
            setPesquisa("Buscar roupa");
            setCategoria("Nova roupa");
            setAtualizarDados("da roupa");
        } else if (tela == "Tecido") {
            setParceiro("Tecido");
            setPesquisa("Buscar tecido");
            setCategoria("Novo tecido");
            setAtualizarDados("do tecido");
        }
    }

    return(
        <div>
            <Navbar vazio={false} pageNumber={1}/>
            <div className={styles.main}>
                <Options opt1={"Roupa"} opt2={"Tecido"} acao={atualizarInfoTela}/>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarParceiro} busca={pesquisa}/>
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarParceiro} id={''} categoria={parceiro} 
                        campos={["Id", "Descrição", "Peso", "Qtd. Mínima", "Qtd. Armazenada", "Subcategoria", "Características"]}
                        vazio={[["", ""], ["", `${parceiro}`], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]}
                        children={
                            <Button variant="outlined" size="large" sx={
                                {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                            }>Cadastrar {categoria}</Button>
                        } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}/>
                    </div>
                </div>
                    {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                        <BarraVisualizacao key={item.idParceiro}
                        children={
                        <>
                        <li>Imagem <br /> {"1011001"} </li>
                        <hr />
                        <li>Descrição: <br /> {item.descricao} </li>
                        <hr />
                        <li>Quantidade em estoque: <br /> {item.qtdArmazenado} </li>
                        <hr />
                        </>}
                        acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                        func={atualizarParceiro}
                        dados={Object.entries(item)}
                        campos={["Id", "Descrição", "Peso", "Qtd. Mínima", "Qtd. Armazenada", "Subcategoria", "Características"]}
                        />
                        ))}
                    </div>
                    ) : (
                    <p>{loadMsg}</p>
                    )}
            </div>
        </div>
    )
}