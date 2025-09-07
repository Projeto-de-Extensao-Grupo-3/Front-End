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
    const [itemEstoque, setItemEstoque] = useState("Roupa");
    const [pesquisa, setPesquisa] = useState("Buscar roupa");
    const [categoria, setCategoria] = useState("Nova roupa");
    const [atualizarDados, setAtualizarDados] = useState("da roupa");
    const [data, setData] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const listarItensEstoque = () => {
        axios.get(`http://localhost:8080/itens-estoque/categorias?tipo=${itemEstoque}`)
        .then(response => {
            console.log(response.data);
            setData(response.data.reverse());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const buscarItemEstoque = (descricao) => {
        if (descricao == "") {
            listarItensEstoque();
        } else {
            axios.get(`http://localhost:8080/itens-estoque/filtros?descricao=${descricao}`)
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
    }

    const atualizarItemEstoque = (dados) => {
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

    const cadastrarItemEstoque = (dados) => {
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
        listarItensEstoque();
        setLoadMsg("Carregando dados...");
    }, [itemEstoque, operations]);

    const atualizarInfoTela = (tela) => {
        if (tela == "Roupa") {
            setItemEstoque("Roupa");
            setPesquisa("Buscar roupa");
            setCategoria("Nova roupa");
            setAtualizarDados("da roupa");
        } else if (tela == "Tecido") {
            setItemEstoque("Tecido");
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
                        <BarraPesquisa func={buscarItemEstoque} busca={pesquisa}/>
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarItemEstoque} id={''} categoria={""} 
                        start_index={1} break_index={5}
                        campos={["Id", "Descrição", "Peso", "Qtd. Mínima", "Qtd. Armazenada", "Subcategoria", "Características", "Tecidos", "Preço", "Imagem"]}
                        vazio={[["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]}
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
                        <li>Imagem: <br /> <img src={item.imagem.url} style={{height:"6rem"}} /> </li>
                        <hr />
                        <li>Descrição: <br /> {item.descricao} </li>
                        <hr />
                        <li>Quantidade em estoque: <br /> {item.qtdArmazenado} </li>
                        <hr />
                        </>}
                        start_index={1} break_index={6}
                        acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                        func={atualizarItemEstoque}
                        dados={Object.entries(item)}
                        campos={["Id", "Descrição", "Peso", "Qtd. Mínima", "Qtd. Armazenada", "Subcategoria", "Características", "Tecidos", "Preço", "Imagem"]}
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