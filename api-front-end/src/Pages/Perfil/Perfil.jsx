import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./perfil.module.css";
import icon_perfil from './icon-perfil.png';
import icon_notificacao from './notificacao.png';
import icon_configuracao from './configuracao.png';
import TextField from '@mui/material/TextField';
import { Permissao } from "../../components/Permissao/Permissao.jsx";
import FotoPerfil from "../../components/fotoPerfil/FotoPerfil.jsx";

export function Perfil() {

    const [permissao, setPermissao] = useState("permissao");
    const [data, setData] = useState([]);
    let contador = 0;

    const listarPermissoes = () => {
            axios.get(`http://localhost:8080/permissoes`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }

        useEffect(() => {
            listarPermissoes();
        }, [permissao]);

    return (
        <div>
            <Navbar vazio={false} pageNumber={5} />
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

                    <button className={styles.botaoSair}>
                            Sair
                    </button>

                </div>

                    <div className={styles.right_container}>

                    <FotoPerfil />

                        <div className={styles.userInfo}>

                            <div className={styles.caixasDeTexto}>
                                <TextField id="filled-basic" label="Nome" variant="filled"  sx={{ width: "45%" }} />
                                <TextField id="filled-basic" label="CPF" variant="filled" sx={{ width: "45%" }} />
                            </div>

                            <div className={styles.caixasDeTexto}>
                                <TextField id="filled-basic" label="E-mail" variant="filled" sx={{ width: "45%" }} />
                                <TextField id="filled-basic" label="Telefone" variant="filled" sx={{ width: "45%" }} />
                            </div>

                        </div>

                    <div className={styles.permissoesContainer}>
                    <h3>Permissões</h3>

                    {data.length > 0 ? (
                        <div className={styles.permissoes}>
                        {data.map(item => (
                            <Permissao 
                            key={item.idPermissao}
                            permissaoNome={item.descricao}
                            />
                        ))}
                        </div>
                    ) : (
                        <p>Carregando dados...</p>
                    )}
                    </div>

                      <button className={styles.botaoSalvar}>
                            Salvar Alterações
                    </button>
                    
                    </div>
                </div>
            </div>
        </div>
    );
}
