import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from "./parceiros.module.css"
import axios from 'axios';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { formatTelefone, aplicarMascaraTelefone, formatCnpj, formatCpf, aplicarMascaraCnpj, aplicarMascaraCpf, validarEmail } from '../../functions/utils.js';

export function Parceiros() {

    /*============================= Variáveis ============================*/

    // Tipo de parceiro mostrado na página (costureira ou fornecedor)
    const [parceiro, setParceiro] = useState("costureira");
    const [pesquisa, setPesquisa] = useState("Buscar costureira");
    const [categoria, setCategoria] = useState("Nova Costureira");
    const [atualizarDados, setAtualizarDados] = useState("da costureira");

    // Mensagem de carregamento enquanto dados não são carregados
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    // Variáveis para dados
    const [data, setData] = useState([]); // Dados da costureira/fornecedor obtidos na listagem
    const [dadosAtualizacao, setDadosAtualizacao] = useState([]); // Guarda os dados que serão atualizados no PUT
    const [dadosCadastro, setDadosCadastro] = useState({}); // Guarda os dados que serão cadastrados no POST

    // Controla refresh da página a cada operação
    const [operations, setOperations] = useState(0);

    // Variáveis para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    /*=====================================================================*/


    /*=============================== Funções ==============================*/

    // Funções para requisições na API
    const listarParceiros = () => {
        axios.get(`/api/parceiros/listagem/${parceiro}`)
            .then(response => {
                setData(response.data);
                console.log(response.data)
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const buscarParceiro = (nome) => {
        axios.get(`/api/parceiros/${parceiro}/nome?nome=${nome}`)
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
        axios.put(`/api/parceiros/${dados.id}`,
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
                setAlertType("success");
                setAlertTitle("Dados atualizados com sucesso!");
                setAlertMessage(`As informações ${atualizarDados} foram atualizadas com sucesso.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            });
    }

    const cadastrarParceiro = (dados) => {
        console.log(dados);
        axios.post(`/api/parceiros`,
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
                setAlertType("success");
                setAlertTitle("Cadastro realizado com sucesso!");
                setAlertMessage(`Os dados ${atualizarDados} foram cadastrados com sucesso.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (error.response.status === 409) {
                    setAlertType("warning");
                    setAlertTitle("Cadastro já existente!");
                    setAlertMessage(`Já existe um mesmo cadastro com o e-mail e/ou CNPJ/CPF informados.`);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao realizar cadastro!");
                    setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                }
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            });
    }

    const deletarParceiro = (id, nome) => {
        axios.delete(`/api/parceiros/${id}`)
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Remoção bem sucedida!");
                setAlertMessage(`Os dados de ${nome} foram apagados com sucesso.`);
                setAlertOpen(true);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Erro ao deletar parceiro:', error);
                if (error.response.status === 409) {
                    setAlertType("warning");
                    setAlertTitle("Remoção não permitida!");
                    setAlertMessage(`Não é possível apagar os dados de ${nome}, pois está referenciado(a) em outras partes do sistema.`);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao apagar dados!");
                    setAlertMessage(`Ocorreu um erro ao remover as informações de ${nome}. Entre em contato com o suporte.`);
                }
                setAlertOpen(true);
                setOperations(operations + 1);
            });
    }

    /*=====================================================================*/


    /*================== Variáveis para validação de input ================*/

    // Telefone (XX)XXXXX-XXXX
    const [errorTelefone, setErrorTelefone] = useState(false);
    const [helperTextTelefone, setHelperTextTelefone] = useState("");

    // CNPJ 00.000.000/0000-00 ou  CPF 000.000.000-00
    const [errorIdentificacao, setErrorIdentificacao] = useState(false);
    const [helperTextIdentificacao, setHelperTextIdentificacao] = useState("");

    // E-mail
    const [errorEmail, setErrorEmail] = useState(false);
    const [helperTextEmail, setHelperTextEmail] = useState("");

    // Desativar botão de cadastro caso campo esteja inválido
    const [isCadastroDisabled, setIsCadastroDisabled] = useState(false);

    useEffect(() => {
        if (errorTelefone || errorIdentificacao || errorEmail) {
            setIsCadastroDisabled(true);
        } else {
            setIsCadastroDisabled(false);
        }
    }, [errorTelefone, errorIdentificacao, errorEmail]);

    /*=====================================================================*/


    /*============================ Funções gerais =========================*/

    // Lista parceiros ao carregar a página e após operações
    useEffect(() => {
        listarParceiros();
        setLoadMsg("Carregando dados...");
    }, [parceiro, operations]);

    // Atualiza informações da tela conforme o tipo de parceiro selecionado
    const atualizarInfoTela = (tela) => {
        if (tela == "costureira") {
            setDadosAtualizacao([]);
            setParceiro("costureira");
            setPesquisa("Buscar costureira");
            setCategoria("Nova Costureira");
            setAtualizarDados("da costureira");
        } else if (tela == "fornecedor") {
            setDadosAtualizacao([]);
            setParceiro("fornecedor");
            setPesquisa("Buscar fornecedor");
            setCategoria("Novo Fornecedor");
            setAtualizarDados("do fornecedor");
        }
    }

    // Seta os atributos do parceiro para cadastro
    const setAtribute = (valor, key) => {
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro; // Cria uma cópia dos dados de cadastro ou um objeto vazio se ainda não houver dados
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        setOperations(operations + 1);
        console.log(dadosCadastro);
    }

    // Seta os dados do parceiro para atualização
    const updateDados = (item, novoValor, key) => {
        console.log(dadosAtualizacao)
        let index = dadosAtualizacao.findIndex(dado => dado.id === item.id) // Busca o parceiro por ID na lista de parceiros em "dadosAtualizacao"
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor; // Atualiza o atributo com base no index do parceiro e na chave do atributo
        setDadosAtualizacao(copiaDados);
        setOperations(operations + 1);
    };

    // Fecha o alerta (sucesso, erro, aviso) automaticamente após 10 segundos
    useEffect(() => {
        if (alertOpen) {
            console.log("ALERT OPENED");
            const timer = setTimeout(() => {
                setAlertOpen(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [alertOpen]);

    // Reseta o estado dos campos do formulário de cadastro
    const limparCampos = () => {
        setErrorTelefone(false);
        setHelperTextTelefone("");
        setErrorIdentificacao(false);
        setHelperTextIdentificacao("");
        setErrorEmail(false);
        setHelperTextEmail("");
    }

    /*======================================================================*/

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
                            cadastroDisabled={isCadastroDisabled}
                            limparCampos={limparCampos}
                            dados={dadosCadastro}
                            children={
                                <Button variant="contained" size="large" sx={
                                    { width: '25vw', p: "1rem 2rem 1rem 2rem", color: "rgba(255, 255, 255, 1)"}
                                }>Cadastrar {categoria}</Button>
                            } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}
                            form={
                                <>
                                    <div>
                                        <h3>Nome</h3>
                                        <TextField size='small' key="nome" required={true} onChange={(e) => setAtribute(e.target.value, "nome")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Telefone</h3>
                                        <TextField size='small' error={errorTelefone} helperText={helperTextTelefone} key="telefone" required={true} onChange={(e) => { setAtribute(e.target.value, "telefone"); formatTelefone(e, setErrorTelefone, setHelperTextTelefone); }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>E-mail</h3>
                                        <TextField size='small' error={errorEmail} helperText={helperTextEmail} key="email" required={true} onChange={(e) => { setAtribute(e.target.value, "email"); validarEmail(e, setErrorEmail, setHelperTextEmail); }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h3>Endereço</h3>
                                        <TextField size='small' key="endereco" required={true} onChange={(e) => setAtribute(e.target.value, "endereco")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>{parceiro === "fornecedor" ? "CNPJ:" : "CPF:"}</h3>
                                        <TextField size='small' error={errorIdentificacao} helperText={helperTextIdentificacao} key="identificacao" required={true} onChange={(e) => {setAtribute(e.target.value, "identificacao"); parceiro === "fornecedor" ? formatCnpj(e, setErrorIdentificacao, setHelperTextIdentificacao) : formatCpf(e, setErrorIdentificacao, setHelperTextIdentificacao)}}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                </>
                            } />
                    </div>
                </div>
                <AlertDialog alertType={alertType} alertTitle={alertTitle} alertMessage={alertMessage} state={alertOpen} />
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                            <BarraVisualizacao key={item.id}
                                children={
                                    <>
                                        <li>Nome: <br /> {item.nome} </li>
                                        <hr />
                                        <li>Telefone: <br /> {aplicarMascaraTelefone(item.telefone)} </li>
                                        <hr />
                                        <li>E-mail: <br /> {item.email} </li>
                                        <hr />
                                    </>}
                                cadastroDisabled={isCadastroDisabled}
                                limparCampos={limparCampos}
                                acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                                func={atualizarParceiro}
                                dadoTitle={item.nome}
                                deleteFunc={() => deletarParceiro(item.id, item.nome)}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.id === item.id)]}
                                form={<>
                                    <div>
                                        <h3>Nome</h3>
                                        <TextField size='small' key="nome" required={true} defaultValue={item.nome} onChange={(e) => updateDados(item, e.target.value, "nome")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Telefone</h3>
                                        <TextField size='small' error={errorTelefone} helperText={helperTextTelefone} key="telefone" required={true} defaultValue={aplicarMascaraTelefone(item.telefone)} onChange={(e) => {updateDados(item, e.target.value, "telefone"); formatTelefone(e, setErrorTelefone, setHelperTextTelefone)}}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>E-mail</h3>
                                        <TextField size='small' error={errorEmail} helperText={helperTextEmail} key="email" required={true} defaultValue={item.email} onChange={(e) => {updateDados(item, e.target.value, "email"); validarEmail(e, setErrorEmail, setHelperTextEmail)}}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h3>Endereço</h3>
                                        <TextField size='small' key="endereco" required={true} defaultValue={item.endereco} onChange={(e) => updateDados(item, e.target.value, "endereco")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>{parceiro === "fornecedor" ? "CNPJ:" : "CPF:"}</h3>
                                        <TextField size='small' error={errorIdentificacao} helperText={helperTextIdentificacao} key="identificacao" required={true} defaultValue={parceiro === "fornecedor" ? aplicarMascaraCnpj(item.identificacao) : aplicarMascaraCpf(item.identificacao)} onChange={(e) => {updateDados(item, e.target.value, "identificacao");parceiro === "fornecedor" ? formatCnpj(e, setErrorIdentificacao, setHelperTextIdentificacao) : formatCpf(e, setErrorIdentificacao, setHelperTextIdentificacao)}}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                </>
                                }
                                info={<>
                                    <div>
                                        <h3>Nome:</h3>
                                        <p key="nome" style={{ width: '100%', marginBottom: '2rem' }}> {item.nome}</p>
                                        <h3>Telefone:</h3>
                                        <p key="telefone" style={{ width: '100%', marginBottom: '2rem' }}> {aplicarMascaraTelefone(item.telefone)}</p>
                                        <h3>E-mail:</h3>
                                        <p key="email" style={{ width: '100%', marginBottom: '2rem' }}> {item.email}</p>
                                    </div>
                                    <div>
                                        <h3>Endereço:</h3>
                                        <p key="endereco" style={{ width: '100%', marginBottom: '2rem' }}> {item.endereco}</p>
                                        <h3>{parceiro === "fornecedor" ? "CNPJ:" : "CPF:"}</h3>
                                        <p key="identificacao" style={{ width: '100%', marginBottom: '2rem' }}> {parceiro === "fornecedor" ? aplicarMascaraCnpj(item.identificacao) : aplicarMascaraCpf(item.identificacao)}</p>
                                    </div>
                                </>}
                                title={`Informações ${atualizarDados}`}
                                altura={"35vh"}
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