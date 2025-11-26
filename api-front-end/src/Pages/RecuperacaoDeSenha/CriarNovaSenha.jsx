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

export function CriarNovaSenha() {
    const [email, setEmail] = useState('');
    const [alertAberto, setAlertAberto] = useState(false)
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const token = new URLSearchParams(window.location.search).get("token");

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                await axios.post("http://localhost:8080/resetar-senha", {
                    token: token,
                    novaSenha: novaSenha
                });
                alert("Senha alterada com sucesso!");
            } catch (err) {
                console.error(err);
                alert("Erro ao resetar senha.");
            }
        };

        return (
            <div className={styles.base}>
                <Navbar vazio={true} />
                <div className={styles.content}>
                    <div className={styles.box}>
                        <span className={styles.indicator}>Crie uma nova senha</span>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.input}>
                                <TextField
                                    fullWidth
                                    label="Digite a nova senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />
                            </div>

                            <div className={styles.input}>
                                <TextField
                                    fullWidth
                                    label="Confirme a nova senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
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
                                    Dados inválidos: falha na recuperação de senha
                                </Alert>
                            </Collapse>
                            <div className={styles.divBotao}>
                                <Button type="submit" className={styles.botao} variant="contained">Atualizar Senha</Button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        )
    }