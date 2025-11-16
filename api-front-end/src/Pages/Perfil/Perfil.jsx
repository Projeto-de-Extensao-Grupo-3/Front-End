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

export function Perfil() {

    const navigate = useNavigate();
    const [permissoes, setPermissoes] = useState([]);
    const [funcionario, setFuncionario] = useState({});
    const [erroNome, setErroNome] = useState("");
    const [erroEmail, setErroEmail] = useState("");
    const [erroTelefone, setErroTelefone] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            const idFuncionario = decoded.sub;
            setPermissoes(decoded.permissoes || []);

            axios.get(`http://localhost:8080/funcionarios/${idFuncionario}`)
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
                senha: funcionario.senha,
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

                                <div className={styles.caixasDeTexto}>
                                    <TextField name="senhaFuncionario" id="filled-basic" label="Senha" value={funcionario?.senha || ''} variant="filled" sx={{ width: "45%" }}
                                        onChange={(e) => setFuncionario(prev => ({ ...prev, senha: e.target.value }))
                                        }
                                        error={!!erroEmail}
                                        helperText={erroEmail}
                                    />
                                    <TextField name="novaSenha" id="filled-basic" label="Nova Senha" variant="filled" sx={{ width: "45%" }}
                                        onChange={(e) => setFuncionario(prev => ({ ...prev, novaSenha: e.target.value }))
                                        }
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

                            <button className={styles.botaoSalvar} type='submit'>
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
