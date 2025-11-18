import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { SelectOptions } from '../../components/SelectOptions/SelectOptions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from "../Parceiros/parceiros.module.css"
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import axios from 'axios';
import { formatTelefone, aplicarMascaraTelefone, formatCnpj, formatCpf, aplicarMascaraCnpj, aplicarMascaraCpf, validarEmail } from '../../functions/utils.js';

export function Funcionarios() {

    /*============================= Variáveis ============================*/

    // Mensagem de carregamento enquanto dados não são carregados
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    // Variáveis para dados
    const [data, setData] = useState([]); // Dados dos funcionários obtidos na listagem
    const [permissoes, setPermissoes] = useState([]); // Lista de permissões disponíveis
    const [permissoesAtualizacao, setPermissoesAtualizacao] = useState([""]); // Permissões selecionadas para atualização
    const [dadosAtualizacao, setDadosAtualizacao] = useState([]); // Guarda os dados que serão atualizados no PUT
    const [dadosCadastro, setDadosCadastro] = useState({}); // Guarda os dados que serão cadastrados no POST

    // Controla refresh da página a cada operação
    const [operations, setOperations] = useState(0);

    // Variável para mostrar/ocultar senha no cadastro
    const [showPassword, setShowPassword] = useState(false);

    // Variáveis para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    /*=====================================================================*/


    /*=============================== Funções ==============================*/

    // Funções para requisições na API
    const listarFuncionarios = () => {
        axios.get(`/api/funcionarios`)
            .then(response => {
                console.log(response.data);
                setData(response.data);
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarPermissoes = () => { // É necessário listar permissões para popular o select no cadastro/atualização
        axios.get(`/api/permissoes`)
            .then(response => {
                setPermissoes(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const buscarFuncionario = (nome) => {
        axios.get(`/api/funcionarios/busca?nome=${nome}`)
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
        axios.post(`/api/funcionarios`,
            {
                "nome": dados.nome,
                "cpf": dados.cpf,
                "telefone": dados.telefone,
                "email": dados.email,
                "senha": dados.senha,
                "permissoes": permissoesAtualizacao
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Cadastro realizado com sucesso!");
                setAlertMessage(`Os dados do funcionário foram cadastrados com sucesso.`);
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (error.response.status === 409) {
                    setAlertType("warning");
                    setAlertTitle("Cadastro já existente!");
                    setAlertMessage(`Já existe um funcionário cadastrado com o e-mail e/ou CPF informados.`);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao realizar cadastro!");
                    setAlertMessage(`Ocorreu um erro ao cadastrar as informações do funcionário. Entre em contato com o suporte.`);
                }
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            });
    }

    const atualizarFuncionario = (dados) => {
        axios.put(`/api/funcionarios/${dados.idFuncionario}`,
            {
                "nome": dados.nome,
                "cpf": dados.cpf,
                "telefone": dados.telefone,
                "email": dados.email,
                "senha": "",
                "permissoes": permissoesAtualizacao[0] === "" ? dados.permissoes : permissoesAtualizacao // Se não foram selecionadas novas permissões, mantém as antigas
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Dados atualizados com sucesso!");
                setAlertMessage(`As informações do funcionário foram atualizadas com sucesso.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações do funcionário. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            });
    }

    const deletarFuncionario = (funcionario) => {
        axios.delete(`/api/funcionarios/${funcionario.idFuncionario}`)
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Remoção bem sucedida!");
                setAlertMessage(`Os dados de ${funcionario.nome} foram apagados com sucesso.`);
                setAlertOpen(true);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Erro ao deletar funcionário:', error);
                if (error.response.status === 409) {
                    deletarFuncionarioReferenciado(funcionario);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao apagar dados!");
                    setAlertMessage(`Ocorreu um erro ao remover as informações de ${funcionario.nome}. Entre em contato com o suporte.`);
                    setAlertOpen(true);
                    setOperations(operations + 1);
                }
            });
    }

    const deletarFuncionarioReferenciado = (funcionario) => {
        axios.put(`/api/funcionarios/${funcionario.idFuncionario}`,
            {
                "nome": funcionario.nome,
                "cpf": null,
                "telefone": null,
                "email": null,
                "senha": null,
                "permissoes": null
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Remoção bem sucedida!");
                setAlertMessage(`Os dados de ${funcionario.nome} foram apagados com sucesso.`);
                setAlertOpen(true);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações de ${funcionario.nome}. Entre em contato com o suporte.`);
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

    // Lista funcionários e permissões ao carregar a página e após operações
    useEffect(() => {
        listarFuncionarios();
        listarPermissoes();
        setLoadMsg("Carregando dados...");
    }, [operations]);

    // Seta os atributos do funcionário para cadastro
    const setAtribute = (valor, key) => {
        if ((key === "cpf" && valor.length > 14) ||
            (key === "telefone" && valor.length > 15)) {
            return;
        }
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro; // Cria uma cópia dos dados de cadastro ou um objeto vazio se ainda não houver dados
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        console.log(dadosCadastro);
    }

    // Seta os dados do funcionário para atualização
    const updateDados = (item, novoValor, key) => {
        console.log(dadosAtualizacao)
        console.log(item)
        let index = dadosAtualizacao.findIndex(dado => dado.idFuncionario === item.idFuncionario) // Busca o funcionário por ID na lista de parceiros em "dadosAtualizacao"
        console.log(index)
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor; // Atualiza o atributo com base no index do parceiro e na chave do atributo
        setDadosAtualizacao(copiaDados);
        console.log(permissoesAtualizacao);
    };

    // Mostra/oculta senha no cadastro
    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
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
            <Navbar vazio={false} pageNumber={4} />
            <div className={styles.main}>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarFuncionario} busca={"Buscar funcionário por nome"} />
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarFuncionario}
                            cadastroDisabled={isCadastroDisabled}
                            limparCampos={limparCampos}
                            dados={dadosCadastro}
                            children={
                                <Button variant="contained" size="large" sx={
                                    { p: "1rem 2rem 1rem 2rem", color: "rgba(255, 255, 255, 1)" }
                                }>Cadastrar Funcionário</Button>
                            } action={`Cadastrar Funcionário`} message={"Confirmar cadastro"}
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
                                        <h3>CPF</h3>
                                        <TextField size='small' error={errorIdentificacao} helperText={helperTextIdentificacao} key="cpf" required={true} onChange={(e) => { setAtribute(e.target.value, "cpf"); formatCpf(e, setErrorIdentificacao, setHelperTextIdentificacao); }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Senha</h3>
                                        <OutlinedInput size='small' type={showPassword ? 'text' : 'password'} key="senha" required={true} onChange={(e) => setAtribute(e.target.value, "senha")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <h3>Permissões</h3>
                                        <SelectOptions lista={permissoes}
                                            chave={"descricao"}
                                            id={"idPermissao"}
                                            dados={permissoesAtualizacao.map((item) => item.permissao)}
                                            func={setPermissoesAtualizacao}>
                                        </SelectOptions>
                                    </div>
                                </>
                            } />
                    </div>
                </div>
                <AlertDialog alertType={alertType} alertTitle={alertTitle} alertMessage={alertMessage} state={alertOpen} />
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                            <BarraVisualizacao key={item.idFuncionario}
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
                                acao={`Atualizar dados do funcionário`} confirm={"Confirmar alterações"}
                                func={atualizarFuncionario}
                                dadoTitle={`de ${item.nome}`}
                                deleteFunc={() => deletarFuncionario(item)}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.idFuncionario === item.idFuncionario)]}
                                form={<>
                                    <div>
                                        <h3>Nome</h3>
                                        <TextField size='small' key="nome" required={true} defaultValue={item.nome} onChange={(e) => updateDados(item, e.target.value, "nome")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Telefone</h3>
                                        <TextField size='small' error={errorTelefone} helperText={helperTextTelefone} key="telefone" required={true} defaultValue={aplicarMascaraTelefone(item.telefone)} onChange={(e) => { updateDados(item, e.target.value, "telefone"); formatTelefone(e, setErrorTelefone, setHelperTextTelefone) }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>E-mail</h3>
                                        <TextField size='small' error={errorEmail} helperText={helperTextEmail} key="email" required={true} defaultValue={item.email} onChange={(e) => { updateDados(item, e.target.value, "email"); validarEmail(e, setErrorEmail, setHelperTextEmail) }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h3>CPF</h3>
                                        <TextField size='small' error={errorIdentificacao} helperText={helperTextIdentificacao} key="cpf" required={true} defaultValue={aplicarMascaraCpf(item.cpf)} onChange={(e) => { updateDados(item, e.target.value, "cpf"); formatCpf(e, setErrorIdentificacao, setHelperTextIdentificacao) }}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Permissões</h3>
                                        <SelectOptions lista={permissoes}
                                            chave={"descricao"}
                                            id={"idPermissao"}
                                            dados={item.permissoes.map((dado) => dado.descricao)}
                                            func={setPermissoesAtualizacao}>

                                        </SelectOptions>
                                    </div>
                                </>
                                }
                                info={
                                    <>
                                        <div>
                                            <h3>Nome:</h3>
                                            <p key="nome" style={{ width: '100%', marginBottom: '2rem' }} id="outlined-basic" variant="outlined">{item.nome}</p>
                                            <h3>Telefone:</h3>
                                            <p key="telefone" style={{ width: '100%', marginBottom: '2rem' }} id="outlined-basic" variant="outlined">{aplicarMascaraTelefone(item.telefone)}</p>
                                            <h3>E-mail:</h3>
                                            <p key="email" style={{ width: '100%', marginBottom: '2rem' }} id="outlined-basic" variant="outlined">{item.email}</p>
                                        </div>
                                        <div>
                                            <h3>CPF:</h3>
                                            <p key="cpf" style={{ width: '100%', marginBottom: '2rem' }} id="outlined-basic" variant="outlined">{aplicarMascaraCpf(item.cpf)}</p>
                                            <h3>Permissões:</h3>
                                            {item.permissoes.map((dado) => <p>{dado.descricao}</p>)}
                                        </div>
                                    </>
                                }
                                title={`Informações do funcionário`}
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