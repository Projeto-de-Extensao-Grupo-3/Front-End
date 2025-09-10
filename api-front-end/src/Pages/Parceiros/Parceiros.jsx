import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import styles from "./parceiros.module.css"
import axios from "axios";

export function Parceiros() {
    const [parceiro, setParceiro] = useState("costureira");
    const [pesquisa, setPesquisa] = useState("Buscar costureira");
    const [categoria, setCategoria] = useState("Nova Costureira");
    const [atualizarDados, setAtualizarDados] = useState("da costureira");
    const [data, setData] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const listarParceiros = () => {
        axios.get(`http://localhost:8080/parceiros/listagem/${parceiro}`)
        .then(response => {
            setData(response.data.reverse());
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const buscarParceiro = (nome) => {
        axios.get(`http://localhost:8080/parceiros/${parceiro}/nome?nome=${nome}`)
        .then(response => {
            console.log(response.data);
            if (response.data.length === 0) {
                setData([])
                setLoadMsg("Nenhum dado encontrado");
            } else {
                console.log("Teste")
                setData(response.data.reverse());
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const atualizarParceiro = (dados) => {
        axios.put(`http://localhost:8080/parceiros/${dados[0][1]}`, 
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
        axios.post(`http://localhost:8080/parceiros`, 
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
        console.log("listando")
        listarParceiros();
        console.log(data);
        setLoadMsg("Carregando dados...");
    }, [parceiro, operations]);

    const atualizarInfoTela = (tela) => {
        if (tela == "costureira") {
            setParceiro("costureira");
            setPesquisa("Buscar costureira");
            setCategoria("Nova Costureira");
            setAtualizarDados("da costureira");
        } else if (tela == "fornecedor") {
            setParceiro("fornecedor");
            setPesquisa("Buscar fornecedor");
            setCategoria("Novo Fornecedor");
            setAtualizarDados("do fornecedor");
        }
    }
    
    return(
        <div>
            <Navbar vazio={false} pageNumber={5}/>
            <div className={styles.main}>
                <Options item1={"Costureiras"} item2={"Fornecedores de Tecido"} opt1={"costureira"} opt2={"fornecedor"} acao={atualizarInfoTela}/>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarParceiro} busca={pesquisa}/>
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarParceiro} id={''} categoria={parceiro} 
                        start_index={2} break_index={5}
                        campos={["Id", "Categoria", "Nome", "Telefone", "E-mail", "Endereço", "CPF/CNPJ"]}
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
                        {console.log(data)}
                        {data.map(item => (
                        <BarraVisualizacao key={item.idParceiro}
                        children={
                        <>
                        <li>Nome: <br /> {item.nome} </li>
                        <hr />
                        <li>Telefone: <br /> {item.telefone} </li>
                        <hr />
                        <li>E-mail: <br /> {item.email} </li>
                        <hr />
                        </>}
                        start_index={2} break_index={5}
                        acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                        func={atualizarParceiro}
                        dados={Object.entries(item)}
                        campos={["Id", "Categoria", "Nome", "Telefone", "E-mail", "Endereço", "CPF/CNPJ"]}
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