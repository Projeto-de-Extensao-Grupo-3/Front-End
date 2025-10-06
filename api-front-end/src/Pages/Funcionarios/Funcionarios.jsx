import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { SelectOptions } from '../../components/SelectOptions/SelectOptions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from "../Parceiros/parceiros.module.css"
import axios from "axios";

export function Funcionarios() {
    const [data, setData] = useState([]);
    const [permissoes, setPermissoes] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const [dadosAtualizacao, setDadosAtualizacao] = useState([]);
    const [dadosCadastro, setDadosCadastro] = useState({});

    const listarFuncionarios = () => {
        axios.get(`http://localhost:8080/funcionarios`)
            .then(response => {
                console.log(response.data);
                setData(response.data.reverse());
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data.reverse());
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarPermissoes = () => {
        axios.get(`http://localhost:8080/permissoes`)
            .then(response => {
                setPermissoes(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const buscarFuncionario = (nome) => {
        axios.get(`http://localhost:8080/funcionarios/busca?nome=${nome}`)
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

    const cadastrarFuncionario = (dados) => {
        axios.post(`http://localhost:8080/funcionarios`,
            {
                "nome": dados[2][1],
                "cpf": dados[3],
                "telefone": dados[4][1],
                "email": dados[5][1],
                "senha": dados[6][1]
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

    const atualizarFuncionario = (dados) => {
        axios.put(`http://localhost:8080/funcionarios/${dados.idFuncionario}`,
            {
                "nome": dados.nome,
                "cpf": dados.cpf,
                "telefone": dados.telefone,
                "email": dados.email,
                "senha": "",
                "permissoes": dados.permissao
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
        listarFuncionarios();
        listarPermissoes();
        setLoadMsg("Carregando dados...");
    }, [operations]);

    const setAtribute = (valor, key) => {
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro;
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        setOperations(operations + 1);
        console.log(dadosCadastro);
    }

    const updateDados = (item, novoValor, key) => {
        console.log(dadosAtualizacao)
        let index = dadosAtualizacao.findIndex(dado => dado.idFuncionario === item.idFuncionario)
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor;
        setDadosAtualizacao(copiaDados);
        setOperations(operations + 1);
    };

    return (
        <div>
            <Navbar vazio={false} pageNumber={5} />
            <div className={styles.main}>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarFuncionario} busca={"Buscar funcionário por nome"} />
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarFuncionario} id={''}
                            dados={dadosCadastro}
                            children={
                                <Button variant="outlined" size="large" sx={
                                    { p: "1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)" }
                                }>Cadastrar Funcionário</Button>
                            } action={`Cadastrar $Funcionário`} message={"Confirmar cadastro"}
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
                            <BarraVisualizacao key={item.idFuncionario}
                                children={
                                    <>
                                        <li>Nome: <br /> {item.nome} </li>
                                        <hr />
                                        <li>Telefone: <br /> {item.telefone} </li>
                                        <hr />
                                        <li>E-mail: <br /> {item.email} </li>
                                        <hr />
                                    </>}
                                acao={`Atualizar dados do funcionário`} confirm={"Confirmar alterações"}
                                func={atualizarFuncionario}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.idFuncionario === item.idFuncionario)]}
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
                                        <h2>CPF</h2>
                                        <TextField key="endereco" required={true} defaultValue={item.cpf} onChange={(e) => updateDados(item, e.target.value, "cpf")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Permissões</h2>
                                        <SelectOptions lista={permissoes} dados={item.permissoes.map((dado) => ({"idPermissao": dado.idPermissao, "descricao": dado.descricao}))}></SelectOptions>
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