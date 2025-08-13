import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./perfil.module.css"
import icon_perfil from './icon-perfil.png';
import icon_notificacao from './notificacao.png';
import icon_configuracao from './configuracao.png';

export function Perfil() {
    return (
        <div>
            <Navbar vazio={false} pageNumber={5}/>
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
                    <div className={styles.perfil_info}>fernando</div>
                </div>
            </div>
        </div>
    );
}