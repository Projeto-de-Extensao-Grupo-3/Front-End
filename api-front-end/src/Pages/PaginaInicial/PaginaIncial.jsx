import styles from "./pagina-inicial.module.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react"

export function PaginaInicial(){

        useEffect(() => {
            document.title = "Login"
        })

    const navigate = useNavigate();

    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {

        // Prevent default necessário, pois "submit" do formulário recarrega a página atual,
        // Sobrescrevendo o navigate.

        e.preventDefault();
        // Eventualmente, a requisição para o back será feita aqui. Por enquanto, apenas redirecionamento sem validação
        // Será necessário diferenciar entre registro rápido e login normal
            setTimeout(() => {
                navigate('/historico')
            }
            , 1000);
    }

    const [boolPopupOpen, setBoolPopupOpen] = useState(false);

    const handlePopupOpen = () => {
        setBoolPopupOpen(true);
    }

    const handlePopupClose = () => {
        setBoolPopupOpen(false);
    }

    return(
        <div className={styles.base}>
            <Navbar vazio={true} />
            <Dialog
                className={styles.popUp}
                open={boolPopupOpen}
                onClose={handlePopupClose}
            >
                <DialogTitle>
                    Como Criar uma Conta
                </DialogTitle>
                <DialogContent>
                    Apenas um administrador do sistema consegue adicionar novos funcionários. 
                    Entre em contato com um para ter sua conta adicionada
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePopupClose}>Entendido</Button>
                </DialogActions>
            </Dialog>
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
                            <Button type="submit" className={styles.botao} variant="contained">Registro Rápido</Button>
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