import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./perfil.module.css";
import icon_perfil from './icon-perfil.png';
import icon_notificacao from './notificacao.png';
import icon_configuracao from './configuracao.png';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { Permissao } from "../../components/Permissao/Permissao.jsx";
import FotoPerfil from "../../components/fotoPerfil/FotoPerfil.jsx";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export function Perfil() {

    const navigate = useNavigate();
    const [permissoes, setPermissoes] = useState([]);
    const [funcionario, setFuncionario] = useState({});
    const [popupSenhaAberto, setPopupSenhaAberto] = useState(false)
    const [erroNome, setErroNome] = useState("");
    const [erroEmail, setErroEmail] = useState("");
    const [erroTelefone, setErroTelefone] = useState("");
    const [erroSenhaInvalida, setErroSenhaInvalida] = useState("");
    const [erroNovaSenhaInvalida, setErroNovaSenhaInvalida] = useState("");
    const [erroNovaSenhaDiferente, setErroNovaSenhaDiferente] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            const id = decoded.sub;
            setPermissoes(decoded.permissoes || []);

            axios.get(`http://localhost:8080/funcionarios/${id}`)
                .then(response => {
                    setFuncionario(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);

    const atualizarFuncionario = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const { nomeFuncionario: nome, cpfFuncionario: cpf, emailFuncionario: email, telefoneFuncionario: telefone } = Object.fromEntries(formData.entries());

        if (!nome.trim()) {
            setErroNome("O nome não pode estar vazio");
            return;
        } else {
            setErroNome("");
        }

        if (!email.trim()) {
            setErroEmail("O e-mail não pode estar vazio");
            return;
        } else {
            setErroEmail("");
        }

        if (!telefone.trim()) {
            setErroTelefone("O telefone não pode estar vazio");
            return;
        } else {
            setErroTelefone("");
        }

        try {
            await axios.put(`/api/funcionarios/${funcionario.idFuncionario}`, {
                nome,
                cpf: funcionario.cpf,
                telefone,
                email,
                permissoes: funcionario.permissoes
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Usuário atualizado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Erro ao atualizar Funcionário:", error);
        }
    };

    const atualizarSenha = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const { senhaAtual, novaSenha, confirmarNovaSenha } = Object.fromEntries(formData.entries());

        // Validar força da senha
        const novaSenhaValida =
            novaSenha.length >= 8 &&
            /[^a-zA-Z0-9]/.test(novaSenha) &&
            !/\s/.test(novaSenha);

        if (!novaSenhaValida) {
            setErroNovaSenhaInvalida("A nova senha deve ter pelo menos 8 caracteres, incluindo um caractere especial e sem espaços");
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            setErroNovaSenhaDiferente("As senhas não coincidem");
            return;
        }

        try {
            console.log("ID FUNCIONARIO: ", funcionario.idFuncionario);
            await axios.patch(`/api/funcionarios/${funcionario.idFuncionario}/senha`, {
                senhaAtual,
                novaSenha
            });

            setPopupSenhaAberto(false);

            Swal.fire({
                title: "Sucesso!",
                text: "Senha alterada com sucesso!",
                icon: "success"
            });

        } catch (error) {
            if (error.response?.status === 400) {
                setErroSenhaInvalida("A senha atual está incorreta");
            } else {
                console.error("Erro ao atualizar senha:", error);
            }
        }
    };


    const handleLogout = () => {
        // Remove tudo relacionado à sessão
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('idUsuario');

        // Redireciona para a página inicial
        navigate('/');
    };

    return (
        <div>
            <Navbar vazio={false} pageNumber={6} />
            <div className={styles.main}>

                <h1 className={styles.textPerfil}>Perfil</h1>
                <div className={styles.linha_horizontal}></div>

                <div className={styles.container}>

                    <div className={styles.side_bar}>

                        <div className={styles.navegacaoSideBarTop}>
                            <h3>Configurações da Conta</h3>
                            <p>Nome de Usuário</p>
                        </div>

                        <div className={styles.navegacaoSideBarContainer}>

                            <div className={styles.navegacaoSideBar}>
                                <img src={icon_perfil} alt="" />
                                <Link to="/perfil">Minha Conta</Link>
                            </div>

                            <div className={styles.navegacaoSideBar}>
                                <img src={icon_notificacao} alt="" />
                                <Link to="/perfil">Notificações</Link>
                            </div>

                            <div className={styles.navegacaoSideBar}>
                                <img src={icon_configuracao} alt="" />
                                <Link to="/perfil">Configurações</Link>
                            </div>

                        </div>

                        <button variant="contained" color="error" onClick={handleLogout} className={styles.botaoSair}>
                            Sair
                        </button>

                    </div>

                    <div className={styles.right_container}>
                        <form onSubmit={atualizarFuncionario} id="formAtualizarFuncionario">
                            <FotoPerfil />

                            <div className={styles.userInfo}>

                                <div className={styles.caixasDeTexto}>
                                    <TextField name="nomeFuncionario" id="filled-basic" label="Nome" value={funcionario?.nome || ''} variant="filled" sx={{ width: "45%" }}
                                        onChange={(e) => setFuncionario(prev => ({ ...prev, nome: e.target.value }))
                                        }
                                        error={!!erroNome}
                                        helperText={erroNome}
                                    />

                                    <TextField name="cpfFuncionario" id="filled-basic" label="CPF" value={funcionario?.cpf || ''} variant="filled" sx={{ width: "45%" }} disabled readOnly
                                    />
                                </div>

                                <div className={styles.caixasDeTexto}>
                                    <TextField name="emailFuncionario" id="filled-basic" label="E-mail" value={funcionario?.email || ''} variant="filled" sx={{ width: "45%" }}
                                        onChange={(e) => setFuncionario(prev => ({ ...prev, email: e.target.value }))
                                        }
                                        error={!!erroEmail}
                                        helperText={erroEmail}
                                    />
                                    <TextField name="telefoneFuncionario" id="filled-basic" label="Telefone" value={funcionario?.telefone || ''} variant="filled" sx={{ width: "45%" }}
                                        onChange={(e) => setFuncionario(prev => ({ ...prev, telefone: e.target.value }))
                                        }
                                        error={!!erroTelefone}
                                        helperText={erroTelefone}
                                    />
                                </div>
                            </div>

                            <div className={styles.permissoesContainer}>
                                <h3>Permissões</h3>

                                {permissoes.length > 0 ? (
                                    <div className={styles.permissoes}>
                                        {permissoes.map(item => (
                                            <Permissao
                                                key={item.idPermissao}
                                                permissaoNome={item.descricao}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>Você não possui permissões atribuídas.</p>
                                )}
                            </div>

                            <div className={styles.botoes}>
                                <button onClick={() => setPopupSenhaAberto(true)} variant='contained' className={styles.botaoSalvar} type='button'>
                                    Alterar Senha
                                </button>
                                <button className={styles.botaoSalvar} type='submit'>
                                    Salvar Alterações
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>


            <Dialog open={popupSenhaAberto}>

                <DialogTitle>Alteração de Senha</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Senha Atual
                    </DialogContentText> */}
                    <br />
                    <form onSubmit={atualizarSenha} id='formAtualizarSenha'>
                        <TextField
                            autoFocus
                            required
                            name="senhaAtual"
                            label="Senha Atual"
                            fullWidth
                            error={!!erroSenhaInvalida}
                            helperText={erroSenhaInvalida}
                        />
                        <br /> <br />
                        <TextField
                            autoFocus
                            required
                            name="novaSenha"
                            label="Nova Senha"
                            fullWidth
                            error={!!erroNovaSenhaInvalida}
                            helperText={erroNovaSenhaInvalida}
                        />
                        <br /> <br />
                        <TextField
                            autoFocus
                            required
                            name="confirmarNovaSenha"
                            label="Confirmar Nova Senha"
                            fullWidth
                            error={!!erroNovaSenhaDiferente}
                            helperText={erroNovaSenhaDiferente}
                        />
                    </form>
                    <br />
                    <Alert severity='error' id='alert-atualizar-senha' style={{ display: "none" }}>Nome indisponível</Alert>
                    <DialogActions className={styles.divBotoes}>
                        <Button onClick={() => setPopupSenhaAberto(false)}>Cancelar</Button>
                        <Button type='submit' form="formAtualizarSenha">Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

        </div>
    );
}
