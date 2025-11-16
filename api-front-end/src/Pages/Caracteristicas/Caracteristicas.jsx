import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./caracteristicas.module.css"
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function Caracteristicas() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Características";
    }, []);

    const [popupAdicionarAberto, setPopupAdicionarAberto] = useState(false)
    const [popupRemoverAberto, setPopupRemoverAberto] = useState(false)
    const [popupAtualizarAberto, setPopupAtualizarAberto] = useState(false)
    const [id, setId] = useState(0);

    const handleSelectCaracteristica = (event) => {
        setId(event.target.value)
    }

    const cadastrarCaracteristica = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const nome = formJson.nomeCaracteristica
        let duplicado = false;
        dadosCaracteristicas.map(r => {
            if (r.nome == nome) {
                document.getElementById('alert-cadastro-add').style.display = "flex"
                duplicado = true
            }
        })
        if (!duplicado) {
            axios.post("/api/categorias", {
                nome: nome,
                categoriaPai: { idCategoria: 3 }
            })
                .then(() => {
                    setPopupAdicionarAberto(false)
                    reload();
                })
                .catch(error => {
                    console.error("Erro ao cadastrar Categoria: ", error);
                });
        }
    }

    const removerCaracteristica = (event) => {
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const id = formJson.idCaracteristica
        event.preventDefault()

        if (id == 0) {
            document.getElementById('alert-cadastro-remove').style.display = "flex"
            return;
        }

        console.log(id)

        axios.delete(`/api/categorias/caracteristica/${id}`)
            .then(() => {
                setPopupRemoverAberto(false);
                reload();
            })
            .catch(error => console.error("Erro ao remover:", error));

    }

    const atualizarCaracteristica = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const { idCaracteristica: id, nomeCaracteristica: nome } = Object.fromEntries(formData.entries());

        const duplicado = dadosCaracteristicas.some(r => r.nome === nome);

        if (duplicado) {
            document.getElementById('alert-cadastro-atualiza').style.display = "flex";
        }

        try {
            await axios.put(`/api/categorias/${id}`, {
                nome,
                categoriaPai: { idCategoria: 3 },
            });
            setPopupAtualizarAberto(false);
            reload();
        } catch (error) {
            console.error("Erro ao atualizar Categoria:", error);
        }
    };


    const [dadosCaracteristicas, setDadosCaracteristicas] = useState([])

    const reload = () => {
        axios.get("/api/categorias/tipo/caracteristica")
            .then(response => setDadosCaracteristicas(response.data))
            .catch(error => {
                if (error.response?.status === 401) navigate('/');
                console.error("Erro ao obter os dados de Características:", error);
            });
    };

    useEffect(() => {
        reload(); // agora funciona
    }, []);

    return (
        <div>
            <Navbar vazio={false} pageNumber={2} />
            <Seletor rotaPaginaUm="/Categorias" rotaPaginaDois="/Caracteristicas" pagina paginaUm="Categorias" paginaDois="Características" valor="Características" />
            <div className={styles.main}>
                <div className={styles.listCategorias}>
                    <Paper >
                        <List>
                            <ListItem key={0}>Caracteristicas</ListItem>
                            <Divider style={{ width: '100%' }} orientation='horizontal' component="li" />
                            {dadosCaracteristicas.map((caracteristica) =>
                                <ListItem key={caracteristica.id}>
                                    {caracteristica.nome}
                                </ListItem>
                            )}</List>
                    </Paper>
                    <div className={styles.divBotoes}>
                        <Button onClick={() => setPopupAdicionarAberto(true)} variant='contained'>Adicionar</Button>
                        <Button onClick={() => setPopupRemoverAberto(true)} variant='contained'>Remover</Button>
                    </div>
                    <div className={styles.divBotoes}>
                        <Button onClick={() => setPopupAtualizarAberto(true)} variant='contained'>Atualizar</Button>
                    </div>
                </div>
            </div>

            <Dialog open={popupAdicionarAberto}>

                <DialogTitle>Adiconar nova Caracteristica</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite o nome da nova caracteristica
                    </DialogContentText>
                    <br />
                    <form onSubmit={cadastrarCaracteristica} id='formAddCaracteristica'>
                        <TextField
                            autoFocus
                            required
                            name="nomeCaracteristica"
                            label="Nome da Caracteristica"
                            fullWidth
                        />
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro-add' style={{ display: "none" }}>Nome indisponível</Alert>
                    <DialogActions className={styles.divBotoes}>
                        <Button onClick={() => setPopupAdicionarAberto(false)}>Cancelar</Button>
                        <Button type='submit' form="formAddCaracteristica">Cadastrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog open={popupRemoverAberto}>
                <DialogTitle>Remover Caracteristica</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escolha a caracteristica a ser removida
                    </DialogContentText>
                    <br />
                    <form onSubmit={removerCaracteristica} id='formRemoverCaracteristica'>
                        <Select value={id} name={'idCaracteristica'} onChange={(event) => handleSelectCaracteristica(event)}  >
                            <MenuItem disabled value={0}>Escolha uma Caracteristica</MenuItem>
                            {dadosCaracteristicas.map((caracteristica) => (
                                <MenuItem key={caracteristica.id} value={caracteristica.id}>
                                    {caracteristica.nome}
                                </MenuItem>))}
                        </Select>
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro-remove' style={{ display: "none" }}>Escolha uma caracteristica</Alert>
                    <DialogActions>
                        <Button onClick={() => setPopupRemoverAberto(false)}>Cancelar</Button>
                        <Button type='submit' form="formRemoverCaracteristica">Remover</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>


            <Dialog open={popupAtualizarAberto}>
                <DialogTitle>Atualizar Caracteristica</DialogTitle>
                <DialogContent>
                    <form onSubmit={atualizarCaracteristica} id='formAtualizarCaracteristica'>
                        <DialogContentText>
                            Escolha a caracteristica a ser atualizada:
                        </DialogContentText>
                        <br />

                        <Select
                            value={id}
                            name="idCaracteristica"
                            onChange={(event) => handleSelectCaracteristica(event)}
                            fullWidth
                            required
                        >
                            <MenuItem disabled value={0}>Escolha uma Caracteristica</MenuItem>
                            {dadosCaracteristicas.map((caracteristica) => (
                                <MenuItem key={caracteristica.id} value={caracteristica.id}>
                                    {caracteristica.nome}
                                </MenuItem>
                            ))}
                        </Select>

                        <br /><br />

                        <DialogContentText>Novo nome:</DialogContentText>
                        <br />
                        <TextField
                            autoFocus
                            required
                            name="nomeCaracteristica"
                            label="Nome da Caracteristica"
                            fullWidth
                        />

                        <br />
                        <Alert severity='error' id='alert-cadastro-atualiza' style={{ display: "none" }}>
                            Nome indisponível
                        </Alert>

                        <DialogActions className={styles.divBotoes}>
                            <Button onClick={() => setPopupAtualizarAberto(false)}>Cancelar</Button>
                            <Button type='submit'>Atualizar</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>


        </div>
    )
}