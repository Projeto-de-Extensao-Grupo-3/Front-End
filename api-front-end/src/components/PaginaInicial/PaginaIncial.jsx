import { Navbar } from "../Navbar/Navbar"
import styles from "./pagina-inicial.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"

export function PaginaInicial(){

    const [cpf, setCpf] = useState('');

    return(
        <div className={styles.base}>
            <Navbar vazio={true} />
            <div className={styles.content}>
                <div className={styles.box}>
                    <span className={styles.indicator}>Insira seu dados para entrar no sistema</span>
                    <div className={styles.input}>
                        <TextField
                            fullWidth
                            label="Cpf"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                    </div>
                    <div className={styles.input}>
                        <TextField
                            fullWidth
                            className={styles.input}
                            label="Senha" 
                            type="password"
                        />
                    </div>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} variant="contained">Entrar</Button>
                    </div>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} variant="contained">Registro Rápido</Button>
                    </div>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} variant="outlined">Como registrar?</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}