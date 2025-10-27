import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

    const [dadosAtualizacao, setDadosAtualizacao] = useState([]);
    const [dadosCadastro, setDadosCadastro] = useState({});

    const hostBack = import.meta.env.VITE_APP_BACK_HOST;

    const listarParceiros = () => {
        axios.get(`http://${hostBack}:8080/parceiros/listagem/${parceiro}`)
            .then(response => {
                setData(response.data);
                console.log(data)
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const buscarParceiro = (nome) => {
        axios.get(`http://${hostBack}:8080/parceiros/${parceiro}/nome?nome=${nome}`)
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
        console.log(dados);
        axios.put(`http://${hostBack}:8080/parceiros/${dados.id}`,
            {
                "categoria": parceiro,
                "nome": dados.nome,
                "telefone": dados.telefone,
                "email": dados.email,
                "endereco": dados.endereco,
                "identificacao": dados.identificacao,
            }
        )
            .then(response => {
                console.log(response.data);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const cadastrarParceiro = (dados) => {
        console.log(dados);
        axios.post(`http://${hostBack}:8080/parceiros`,
            {
                "categoria": parceiro,
                "nome": dados.nome,
                "telefone": dados.telefone,
                "email": dados.email,
                "endereco": dados.endereco,
                "identificacao": dados.identificacao,
            }
        )
            .then(response => {
                console.log(response.data);
                setOperations(operations + 1);
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

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const setAtribute = (valor, key) => {
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro;
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        setOperations(operations + 1);
        console.log(dadosCadastro);
    }

    const updateDados = (item, novoValor, key) => {
        console.log(dadosAtualizacao)
        let index = dadosAtualizacao.findIndex(dado => dado.id === item.id)
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor;
        setDadosAtualizacao(copiaDados);
        setOperations(operations + 1);
    };

    return (
        <div>
            <Navbar vazio={false} pageNumber={5} />
            <div className={styles.main}>
                <Options item1={"Costureiras"} item2={"Fornecedores de Tecido"} opt1={"costureira"} opt2={"fornecedor"} acao={atualizarInfoTela} />
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarParceiro} busca={pesquisa} />
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarParceiro} id={''} categoria={parceiro}
                            dados={dadosCadastro}
                            children={
                                <Button variant="outlined" size="large" sx={
                                    { p: "1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)" }
                                }>Cadastrar {categoria}</Button>
                            } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}
                            form={
                                <>
                                    <div>
                                        <h2>Nome</h2>
                                        <TextField key="nome" required={true} onChange={(e) => setAtribute(e.target.value, "nome")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Telefone</h2>
                                        <TextField key="telefone" required={true} onChange={(e) => setAtribute(e.target.value, "telefone")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>E-mail</h2>
                                        <TextField key="email" required={true} onChange={(e) => setAtribute(e.target.value, "email")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h2>Endereço</h2>
                                        <TextField key="endereco" required={true} onChange={(e) => setAtribute(e.target.value, "endereco")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>CPF/CNPJ</h2>
                                        <TextField key="identificacao" required={true} onChange={(e) => setAtribute(e.target.value, "identificacao")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                </>
                            } />
                    </div>
                </div>
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                            <BarraVisualizacao key={item.id}
                                children={
                                    <>
                                        <li>Nome: <br /> {item.nome} </li>
                                        <hr />
                                        <li>Telefone: <br /> {item.telefone} </li>
                                        <hr />
                                        <li>E-mail: <br /> {item.email} </li>
                                        <hr />
                                    </>}
                                acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                                func={atualizarParceiro}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.id === item.id)]}
                                form={<>
                                    <div>
                                        <h2>Nome</h2>
                                        <TextField key="nome" required={true} defaultValue={item.nome} onChange={(e) => updateDados(item, e.target.value, "nome")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Telefone</h2>
                                        <TextField key="telefone" required={true} defaultValue={item.telefone} onChange={(e) => updateDados(item, e.target.value, "telefone")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>E-mail</h2>
                                        <TextField key="email" required={true} defaultValue={item.email} onChange={(e) => updateDados(item, e.target.value, "email")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h2>Endereço</h2>
                                        <TextField key="endereco" required={true} defaultValue={item.endereco} onChange={(e) => updateDados(item, e.target.value, "endereco")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>CPF/CNPJ</h2>
                                        <TextField key="identificacao" required={true} defaultValue={item.identificacao} onChange={(e) => updateDados(item, e.target.value, "identificacao")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                </>
                                }
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