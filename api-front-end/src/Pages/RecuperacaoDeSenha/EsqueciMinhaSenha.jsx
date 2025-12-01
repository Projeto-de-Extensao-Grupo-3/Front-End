import styles from "./esqueci-senha.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar"
import axios from "axios";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import { api } from "../../provider/api";

export function EsqueciMinhaSenha() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');

        // Variáveis para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("http://localhost:8080/funcionarios/esqueci-minha-senha", {
                email: email
            });
            console.log("EMAIL ENVIADO" );
            setAlertType("success");
            setAlertTitle("Email enviado com sucesso!");
            setAlertMessage(`Um email para recuperação de senha foi enviado para ${email}.`);
            setAlertOpen(true);
            setTimeout(() => {
                    navigate("/")
                }
                , 3000);
        } catch (err) {
            console.error(err);
            console.log("EMAIL NÃO ENVIADO" );
            setAlertType("error");
            setAlertTitle("Erro ao enviar email");
            setAlertMessage(`Ocorreu um erro ao tentar enviar o email para ${email}.`);
            setAlertOpen(true);
            setAlertAberto(true)
        }
    }

    return (
        <div className={styles.base}>
            <Navbar vazio={true} />
            <div className={styles.content}>

                <AlertDialog alertType={alertType} alertTitle={alertTitle} alertMessage={alertMessage} state={alertOpen} />

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

                        <div className={styles.divBotao}>
                            <Button type="submit" className={styles.botao} variant="contained">Enviar email</Button>
                        </div>
                    </form>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao}  onClick={() => navigate("/")} variant="outlined">Voltar</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}