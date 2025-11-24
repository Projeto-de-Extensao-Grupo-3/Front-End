import * as React from 'react';
import styles from "./navbar.module.css"
import ButtonReact from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useContext } from 'react';
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../Permissao/ValidadorDePermissao.jsx';

export function Navbar(props) {

    if (props.vazio) {
        return (
            <div className={styles.emptyCard}></div>
        )
    }
    // Não consegui achar uma maneira mais simples de escolher o negrito
    // se achar pode alterar (considerar alterações apáginas já feitas)
    // [0] -> Histórico
    // [1] -> Estoque
    // [2] -> Dashboard
    // [3] -> Funcionários
    const weights = ["Montserrat", "Montserrat", "Montserrat", "Montserrat"]
    weights[props.pageNumber] = "Montserrat Bold"

    // Código retirado de https://mui.com/material-ui/react-menu/#menu-positioning com leves simplificações
    // Para explicação, me procurar (Giorgio), mas não é complicado 
    const navigate = useNavigate();

    const redirecionar = (path) => {
        navigate(path);
    }

    // Menu do usuário
    const [anchorUser, setAnchorUser] = React.useState(null);
    const openUser = Boolean(anchorUser);

    const handleOpenUser = (event) => {
        setAnchorUser(event.currentTarget);
    };

    const handleCloseUser = () => {
        setAnchorUser(null);
    };

    // Menu do burger
    const [anchorBurger, setAnchorBurger] = React.useState(null);
    const openBurger = Boolean(anchorBurger);

    const handleOpenBurger = (event) => {
        setAnchorBurger(event.currentTarget);
    };

    const handleCloseBurger = () => {
        setAnchorBurger(null);
    };

    const handleLogout = () => {
        handleCloseUser();
        // Remove tudo relacionado à sessão
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('idUsuario');
        // Redirecionar para a página de login
        navigate('/');
    };

    const { hasPermission } = useContext(AuthContext);

    return (
        <div className={styles.card}>
            <div className={styles.divLinks}>
                <div onClick={() => redirecionar("/historico")} className={styles.link} style={{ fontFamily: weights[0] }}>Histórico</div>
                <div onClick={() => redirecionar("/estoque")} className={styles.link} style={{ fontFamily: weights[1] }}>Estoque</div>
                <div onClick={() => redirecionar("/categorias")} className={styles.link} style={{ fontFamily: weights[2] }}>Categorias</div>

                {hasPermission("VISUALIZAR DASHBOARD") && (
                <div onClick={() => redirecionar("/dashboard")} className={styles.link} style={{ fontFamily: weights[3] }}>Dashboard</div>
                )}
                <div onClick={() => redirecionar("/funcionarios")} className={styles.link} style={{ fontFamily: weights[4] }}>Funcionários</div>
                <div onClick={() => redirecionar("/parceiros")} className={styles.link} style={{ fontFamily: weights[5] }}>Fornecedores</div>
            </div>

            {/* Botão com foto do usuário */}
            <div
                className={styles.link}
                onClick={handleOpenUser}
                style={{ cursor: "pointer" }}
            >
                <AccountCircleIcon
                    fontSize="large"
                    sx={{ color: "white" }}
                />
            </div>

            {/* Menu deve estar FORA da div */}
            <Menu
                anchorEl={anchorUser}
                open={openUser}
                onClose={handleCloseUser}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={() => { handleCloseUser(); navigate("/perfil"); }}>
                    Ver perfil
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                    Sair
                </MenuItem>
            </Menu>

            <div className={styles.divBurger}>
                <ButtonReact onClick={handleOpenBurger}>
                    <MenuIcon
                        sx={{
                            color: "white",
                            fontSize: 55,
                            display: openBurger ? "none" : "flex"
                        }}
                    />
                    <MenuOpenIcon
                        sx={{
                            color: "white",
                            fontSize: 55,
                            display: openBurger ? "flex" : "none"
                        }}
                    />
                </ButtonReact>

                <Menu
                    anchorEl={anchorBurger}
                    open={openBurger}
                    onClose={handleCloseBurger}
                >
                    <MenuItem onClick={handleCloseBurger}>Histórico</MenuItem>
                    <MenuItem onClick={handleCloseBurger}>Estoque</MenuItem>
                    <MenuItem onClick={handleCloseBurger}>Dashboard</MenuItem>
                    <MenuItem onClick={handleCloseBurger}>Funcionários</MenuItem>
                    <MenuItem onClick={handleCloseBurger}>Fornecedores</MenuItem>
                </Menu>

            </div>
        </div>
    )
}