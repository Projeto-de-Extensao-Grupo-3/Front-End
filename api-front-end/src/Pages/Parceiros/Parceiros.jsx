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
        axios.get(`http://localhost:8080/servico-terceiros/listagem/${parceiro}`)
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

    const atualizarParceiro = (id, categoria, nome, telefone, email, endereco, identificacao) => {
        axios.put(`http://localhost:8080/servico-terceiros/${id}`, 
            {
                "categoria": categoria,
                "nome": nome,
                "telefone": telefone,
                "email": email,
                "endereco": endereco,
                "identificacao": identificacao,
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

    const cadastrarParceiro = (id, categoria, nome, telefone, email, endereco, identificacao) => {
        axios.post(`http://localhost:8080/servico-terceiros`, 
            {
                "categoria": categoria,
                "nome": nome,
                "telefone": telefone,
                "email": email,
                "endereco": endereco,
                "identificacao": identificacao,
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
            <Navbar vazio={false} pageNumber={4}/>
            <div className={styles.main}>
                <Options item1={"Costureiras"} item2={"Fornecedores de Tecido"} acao={atualizarInfoTela}/>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarParceiro} busca={pesquisa}></BarraPesquisa>
                    </div>
                    <JanelaCadastro func={cadastrarParceiro} id={''} categoria={parceiro} children={

                        <Button variant="outlined" size="large" sx={
                            {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                        }>Cadastrar {categoria}</Button>
                    } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}/>
                </div>
                    {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                        <BarraVisualizacao key={item.idParceiro}
                        acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                        func={atualizarParceiro}
                        id={item.idParceiro}
                        categoria={parceiro}
                        nome={item.nome}
                        telefone={item.telefone}
                        email={item.email}
                        endereco={item.endereco}
                        identificacao={item.identificacao}
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