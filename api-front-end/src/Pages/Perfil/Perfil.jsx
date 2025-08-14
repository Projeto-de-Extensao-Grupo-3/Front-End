import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./perfil.module.css";
import icon_perfil from './icon-perfil.png';
import icon_notificacao from './notificacao.png';
import icon_configuracao from './configuracao.png';
import icone_lapis from './lapis-edicao.png'; // substitua pelo ícone de lápis
import ricardo from './ricardo.jpeg'; 
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export function Perfil() {
    return (
        <div>
            <Navbar vazio={false} pageNumber={5} />
            <div className={styles.main}>

                <h1 className={styles.textPerfil}>Perfil</h1>
                <div className={styles.linha_horizontal}></div>

                <div className={styles.container}>
                    <div className={styles.side_bar}>
                        <h3>Configurações da Conta</h3>
                        <p>Nome de Usuário</p>

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

                    <div className={styles.right_container}>

                    <div className={styles.foto_container}>
                        {/* Bloco da Foto de Perfil */}
                        <div className={styles.profilePictureContainer}>
                            <img src={ricardo} alt="Foto de perfil" className={styles.profilePicture} />
                            <button className={styles.editButton}>
                                <img src={icone_lapis} alt="Editar" />
                            </button>
                        </div>

                    </div>

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

                        <div className={styles.permissoes_container}>
                            <h3>Permissões</h3>
                            <div className={styles.permissoes}>
                            <Box sx={{width: 200, height: 50, borderRadius: 0, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark', }, 
                            }}/>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
