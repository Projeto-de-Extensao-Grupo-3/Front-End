import * as React from 'react';
import styles from "./navbar.module.css"
import ButtonReact from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.target);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const redirecionar = (path) => {
        navigate(path);
    }

    return (
        <div className={styles.card}>
            <div className={styles.divLinks}>
                <div onClick={() => redirecionar("/historico")} className={styles.link} style={{ fontFamily: weights[0] }}>Histórico</div>
                <div onClick={() => redirecionar("/estoque")} className={styles.link} style={{ fontFamily: weights[1] }}>Estoque</div>
                <div onClick={() => redirecionar("/categorias")} className={styles.link} style={{ fontFamily: weights[2] }}>Categorias</div>
                <div onClick={() => redirecionar("/dashboard")} className={styles.link} style={{ fontFamily: weights[3] }}>Dashboard</div>
                <div onClick={() => redirecionar("/funcionarios")} className={styles.link} style={{ fontFamily: weights[4] }}>Funcionários</div>
                <div onClick={() => redirecionar("/parceiros")} className={styles.link} style={{ fontFamily: weights[5] }}>Fornecedores</div>
            </div>
            <div className={styles.link} onClick={() => redirecionar("/perfil")}>
                <AccountCircleIcon fontSize="large" color="action" 
                sx={
                    {color: "rgba(255, 255, 255, 1)", cursor: "pointer", display: "flex", alignItems: "center"}
                }/>
            </div>
            <div className={styles.divBurger}>
                <ButtonReact onClick={handleClick}>
                    <MenuIcon color='primary' sx={{color: "white", fontSize: 55, display: anchorEl == null ? 'flex' : 'none'}} />
                    <MenuOpenIcon color='primary' sx={{color: "white", fontSize: 55, display: anchorEl == null ? 'none' : 'flex'}} />

                </ButtonReact>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
                    <MenuItem onClick={handleClose}>Histórico</MenuItem>
                    <MenuItem onClick={handleClose}>Estoque</MenuItem>
                    <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                    <MenuItem onClick={handleClose}>Funcionários</MenuItem>
                    <MenuItem onClick={handleClose}>Fornecedores</MenuItem>
                </Menu>
            </div>
        </div>
    )
}