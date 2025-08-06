import { Navbar } from "../Navbar/Navbar"
import styles from "./pagina-inicial.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function PaginaInicial(){
    const navigate = useNavigate();

    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Eventualmente, a requisição para o back será feita aqui
        console.log('aaaaaa')
            setTimeout(() => {
                navigate('/historico')
            }
            , 1000)
    }

    return(
        <div className={styles.base}>
            <Navbar vazio={true} />
            <div className={styles.content}>
                <div className={styles.box}>
                    <span className={styles.indicator}>Insira seu dados para entrar no sistema</span>
                    <form onSubmit={handleSubmit} className={styles.form}>
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
                                label="Senha" 
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <div className={styles.divBotao}>
                            <Button type="submit" className={styles.botao} variant="contained">Entrar</Button>
                        </div>
                        <div className={styles.divBotao}>
                            <Button className={styles.botao} variant="contained">Registro Rápido</Button>
                        </div>
                    </form>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} variant="outlined">Como registrar?</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}