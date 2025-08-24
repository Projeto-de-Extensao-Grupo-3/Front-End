import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./caracteristicas.module.css"
import { useEffect, useState } from 'react';
import api from "../../provider/api"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

export function Caracteristicas() {

    const [popupAdicionarAberto, setPopupAdicionarAberto] = useState(false)
    const [popupEscolhido, setPopupEscolhido] = useState()

    const handlePopupAdicionarAbrir = (escolhido) => {
        setPopupEscolhido(escolhido)
        setPopupAdicionarAberto(true)
    }

    const handlePopupAdicionarFechar = () => {
        setPopupAdicionarAberto(false)
    }

    const cadastrarCategoria = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const nome = formJson.nomeCategoria
        let duplicado = false;
        let idCategoriaPai = 1; // id do tecido Tecido por padrão, para categoria Pai
        if (popupEscolhido == "Roupa") {
            dadosRoupa.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro').style.display = "flex"
                    duplicado = true
                }
            })
            idCategoriaPai = 2 // Mudando id categoria pai para para a de roupa 
        } else {
            dadosTecido.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro').style.display = "flex"
                    duplicado = true
                }
            }) 
            idCategoriaPai = 1 // Mudando id categoria pai para para a de tecido 
        }
        if (!duplicado) {
            // api.post("/categorias", {                
            //       nome: {nome},
            //       categoriaPai: {
            //         idCategoria: 1
            //       }
            // }) eventualmente cadastro aqui...
            handlePopupAdicionarFechar()
        } 
    }

    const [dadosTecido, setDadosTecido] = useState([])
    const [dadosRoupa, setDadosRoupa] = useState([])

    useEffect(() => {
        api.get("/categorias/tipo/tecido").then(
            response => {
                setDadosTecido(response.data)
            })

        api.get("/categorias/tipo/roupa").then(
            response => {
                setDadosRoupa(response.data)
            })
        // O Array vazio faz o useEffect ativas apenas ao renderizar pela primeira vez 
    }, [])

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <Seletor esquerda="Categorias" direita="Características" escolhido={2} paginaUm="/categorias" paginaDois="/caracteristicas" />
            <div className={styles.main}>
                <div className={styles.listCategorias}>
                    <Paper >
                        <List>
                            <ListItem key={0}>Roupas</ListItem>
                            <Divider style={{ width: '100%' }} orientation='horizontal' component="li" />
                            {dadosRoupa.map((categoria) =>
                                <ListItem key={categoria.id}>
                                    {categoria.nome}
                                </ListItem>
                            )}</List>
                    </Paper>
                    <div className={styles.divBotoes}>
                        <Button onClick={() => handlePopupAdicionarAbrir("Roupa")} variant='contained'>Adicionar Categoria</Button>
                        <Button variant='contained'>Remover Categoria</Button>
                    </div>
                </div>
                <div className={styles.listCategorias}>
                    <Paper >
                        <List>
                            <ListItem key={0}>Tecidos</ListItem>
                            <Divider style={{ width: '100%' }} orientation='horizontal' component="li" />
                            {dadosTecido.map((categoria) =>
                                <ListItem key={categoria.id}>
                                    {categoria.nome}
                                </ListItem>
                            )}</List>
                    </Paper>
                    <div className={styles.divBotoes}>
                        <Button onClick={() => handlePopupAdicionarAbrir("Tecido")} variant='contained'>Adicionar Categoria</Button>
                        <Button variant='contained'>Remover Categoria</Button>
                    </div>
                </div>
            </div>
            <Dialog open={popupAdicionarAberto}>
                
                <DialogTitle>Adiconar nova categoria de {popupEscolhido}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite o nome da nova categoria
                    </DialogContentText>
                    <br />
                    <form onSubmit={cadastrarCategoria} id='formAddCategoria'>
                        <TextField
                            autoFocus
                            required
                            name="nomeCategoria"
                            label="Nome da Categoria"
                            fullWidth
                            />
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro' style={{display: "none"}}>Nome indisponível</Alert>
                    <DialogActions>
                            <Button onClick={() => handlePopupAdicionarFechar()}>Cancelar</Button>
                            <Button type='submit' form="formAddCategoria">Cadastrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )
}