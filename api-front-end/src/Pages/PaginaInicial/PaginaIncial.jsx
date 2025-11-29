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
import { useContext } from "react";
import { AuthContext } from "../../components/Permissao/ValidadorDePermissao.jsx";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { Link } from "react-router-dom";

export function PaginaInicial(){

    useEffect(() => {
        document.title = "Login"
    })

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [alertAberto, setAlertAberto] = useState(false)

    // Carregar Permissões
    const { carregarPermissoes } = useContext(AuthContext);

    const handleSubmit = (e) => {

        // Prevent default necessário, pois "submit" do formulário recarrega a página atual,
        // Sobrescrevendo o navigate.
        
        e.preventDefault();
        // Eventualmente, a requisição para o back será feita aqui. Por enquanto, apenas redirecionamento sem validação
        // Será necessário diferenciar entre registro rápido e login normal (corte de escopo?)
        
        axios.post('/api/funcionarios/login', {
            email: email,
            senha: senha
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200 && response.data?.token) {
                sessionStorage.setItem('authToken', response.data.token)
                sessionStorage.setItem('usuario', response.data.nome)
                sessionStorage.setItem('idFuncionario', response.data.idFuncionario)
                carregarPermissoes(); 
                setTimeout(() => {
                    navigate('/historico')
                }
                , 1000);
            }
        }).catch(error => {
            console.log(error)
            if (error.status === 401) {
                setAlertAberto(true)
            }
        })



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
                        <Link to="/esqueci-minha-senha" className={styles.linkSenha}>
                            Esqueci minha senha
                        </Link>
                    </form>
                    <div className={styles.divBotao}>
                        <Button className={styles.botao} onClick={handlePopupOpen} variant="outlined">Como registrar?</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}