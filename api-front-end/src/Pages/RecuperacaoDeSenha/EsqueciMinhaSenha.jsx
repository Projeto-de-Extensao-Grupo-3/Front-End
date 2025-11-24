import styles from "./esqueci-senha.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar" 

export function EsqueciMinhaSenha() {
    return (
         <div className={styles.base}>
            <Navbar vazio={true} />
            <div className={styles.content}>
                <div className={styles.box}>
                    <span className={styles.indicator}>Insira seu dados para entrar no sistema</span>
                    <form onSubmit={} className={styles.form}>
                        <div className={styles.input}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.input}>
                            <TextField
                                fullWidth
                                label="Senha" 
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <Collapse in={alertAberto}>
                            <Alert severity="warning" variant="standard"
                                action={
                                    <IconButton
                                        aria-label="fechar"
                                        color="inherit"
                                        size="small"
                                        onClick={()=>{
                                            setAlertAberto(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit"/>
                                    </IconButton>
                                }
                                sx={{mb:2}}
                            >
                                Dados inválidos: falha no login
                            </Alert>
                        </Collapse>
                        <div className={styles.divBotao}>
                            <Button type="submit" className={styles.botao} variant="contained">Entrar</Button>
                        </div>
                    </form>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} onClick={handlePopupOpen} variant="outlined">Como registrar?</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}