import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./categorias.module.css"
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
import axios from "axios";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function Categorias() {

    useEffect(() => {
        document.title = "Categorias"
    })


    const [popupAdicionarAberto, setPopupAdicionarAberto] = useState(false)
    const [popupRemoverAberto, setPopupRemoverAberto] = useState(false)
    const [popupEscolhido, setPopupEscolhido] = useState()
    const [popupRemoverEscolhido, setPopupRemoverEscolhido] = useState()
    const [id, setId] = useState(0);

    const handlePopupAdicionarAbrir = (escolhido) => {
        setPopupEscolhido(escolhido)
        setPopupAdicionarAberto(true)
    }

    const handlePopupAdicionarFechar = () => {
        setPopupAdicionarAberto(false)
    }

    const handlePopupRemoverAbrir = (escolhido) => {
        setPopupRemoverEscolhido(escolhido)
        setPopupRemoverAberto(true)
    }

    const handlePopupRemoverFechar = () => {
        setPopupRemoverAberto(false)
    }

    const handleSelectCategoria = (event) => {
        setId(event.target.value)
    }

    const cadastrarCategoria = (event) => {
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const nome = formJson.nomeCategoria
        let duplicado = false;
        if (popupEscolhido == "Roupa") {
            dadosRoupa.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro').style.display = "flex"
                    duplicado = true
                }
            })
        } else {
            dadosTecido.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro').style.display = "flex"
                    duplicado = true
                }
            })
        }
        if (!duplicado) {
            if (popupEscolhido == "Roupa") {
                axios.post("/api/categorias", {
                    "nome": nome,
                    "categoriaPai": {
                    "idCategoria": 2
                    }
                }).catch(error => {
                    console.log("Erro ao cadastrar Categoria: ", error)
                })
                handlePopupAdicionarFechar()
            } else if (popupEscolhido == "Tecido") { // if como failsafe
                axios.post("/api/categorias", {
                    "nome": nome,
                    "categoriaPai": {
                    "idCategoria": 1
                    }
                }).catch(error => {
                    console.log("Erro ao cadastrar Categoria: ", error)
                })
                handlePopupAdicionarFechar()
            }
        }
    }

    const removerCategoria = (event) => {
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const id = formJson.idCategoria
        event.preventDefault()
        
        if (id == 0) {
            document.getElementById('alert-cadastro').style.display = "flex"
            return;
        }

        console.log(id)
        if (popupRemoverEscolhido == "Roupa") {
            axios.delete(`/api/categorias/${id}`)
            handlePopupAdicionarFechar()
        } else if (popupRemoverEscolhido == "Tecido") { // if como failsafe
            axios.delete(`/api/categorias/${id}`)
            handlePopupAdicionarFechar()
        }

    }


    const [dadosTecido, setDadosTecido] = useState([])
    const [dadosRoupa, setDadosRoupa] = useState([])

    // O Array vazio faz o useEffect ativas apenas ao renderizar pela primeira vez 
    const initialState = useEffect(() => getDados, [])

    const getDados = () => {
        axios.get("/api/categorias/tipo/tecido").then(
            response => {
                setDadosTecido(response.data)
            }).catch(error => {
                console.log("Erro ao obter os dados de Tecidos: ", error)
            })

        axios.get("/api/categorias/tipo/roupa").then(
            response => {
                setDadosRoupa(response.data)
            }).catch(error => {
                console.log("Erro ao obter os dados de Roupas: ", error)
            })
    }


    return (
        <div>
            <Navbar vazio={false} pageNumber={2} />
            <Seletor rotaPaginaUm="/Categorias" rotaPaginaDois="/Caracteristicas" paginaUm="Categorias" paginaDois="Características" valor="Categorias" />
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
                        <Button onClick={() => handlePopupRemoverAbrir("Roupa")} variant='contained'>Remover Categoria</Button>
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
                        <Button onClick={() => handlePopupRemoverAbrir("Tecido")} variant='contained'>Remover Categoria</Button>
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
                    <Alert severity='error' id='alert-cadastro' style={{ display: "none" }}>Nome indisponível</Alert>
                    <DialogActions>
                        <Button onClick={() => handlePopupAdicionarFechar()}>Cancelar</Button>
                        <Button type='submit' form="formAddCategoria">Cadastrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog open={popupRemoverAberto}>
                <DialogTitle>Remover categoria de {popupRemoverEscolhido}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escolha a categoria a ser removida
                    </DialogContentText>
                    <br />
                    <form onSubmit={removerCategoria} id='formRemoverCategoria'>
                        <Select value={id} name={'idCategoria'} onChange={(event) => handleSelectCategoria(event)}  >
                            <MenuItem disabled value={0}>Escolha uma Categoria</MenuItem>
                            {popupRemoverEscolhido == 'Roupa' ? 
                            dadosRoupa.map((categoria) => (<MenuItem key={categoria.id} value={categoria.id}>{categoria.nome}</MenuItem>)) 
                            : dadosTecido.map((categoria) => (<MenuItem value={categoria.id}>{categoria.nome}</MenuItem>))}
                        </Select>
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro' style={{ display: "none" }}>Escolha uma categoria</Alert>
                    <DialogActions>
                        <Button onClick={() => handlePopupRemoverFechar()}>Cancelar</Button>
                        <Button type='submit' form="formRemoverCategoria">Remover</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )
}