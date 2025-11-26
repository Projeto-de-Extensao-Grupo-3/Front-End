import styles from "./esqueci-senha.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar"
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

export function EsqueciMinhaSenha() {


    const [email, setEmail] = useState('');
    const [alertAberto, setAlertAberto] = useState(false)

    const handlePopupOpen = () => { 
        setBoolPopupOpen(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            return axios.post("http://localhost:8080/esqueci-minha-senha", {
                email: email
            });
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar email de recuperação.");
            setAlertAberto(true)
        }
    }

    return (
        <div className={styles.base}>
            <Navbar vazio={true} />
            <div className={styles.content}>
                <div className={styles.box}>
                    <span className={styles.indicator}>Recuperação de Senha</span>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.input}>
                            <TextField
                                fullWidth
                                label="Digite o email o qual deseja recuperar a senha"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Collapse in={alertAberto}>
                            <Alert severity="warning" variant="standard"
                                action={
                                    <IconButton
                                        aria-label="fechar"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setAlertAberto(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                            >
                                Erro ao enviar email de recuperação.
                            </Alert>
                        </Collapse>
                        <div className={styles.divBotao}>
                            <Button type="submit" className={styles.botao} variant="contained">Enviar email</Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}