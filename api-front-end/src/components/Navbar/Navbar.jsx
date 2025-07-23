import * as React from 'react';
import styles from "./Navbar.module.css"
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import burgerIco from "../../assets/white-burger.png"
import { MenuItem } from "@mui/material";

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
    const weights = ["normal", "normal", "normal", "normal"]
    weights[props.pageNumber] = "900"

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

    return (
        <div className={styles.card}>
            <div className={styles.divLinks}>
                <a href="" className={styles.link} style={{ fontWeight: weights[0] }}>Histórico</a>
                <a href="" className={styles.link} style={{ fontWeight: weights[1] }}>Estoque</a>
                <a href="" className={styles.link} style={{ fontWeight: weights[2] }}>Dashboard</a>
                <a href="" className={styles.link} style={{ fontWeight: weights[3] }}>Funcionarios</a>
            </div>
            <div className={styles.divBurger}>
                <Button onClick={handleClick}>
                    <img src={burgerIco} style={{maxWidth: "50px"}} />
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
                    <MenuItem onClick={handleClose}>Histórico</MenuItem>
                    <MenuItem onClick={handleClose}>Estoque</MenuItem>
                    <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                    <MenuItem onClick={handleClose}>Funcionários</MenuItem>
                </Menu>
            </div>
        </div>
    )
}