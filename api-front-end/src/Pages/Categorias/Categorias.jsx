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
import AlertDialog from '../../components/AlertDialog/AlertDialog';

export function Categorias() {

    useEffect(() => {
        document.title = "Categorias";
    }, []);


    // Variáveis para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    const [popupAdicionarAberto, setPopupAdicionarAberto] = useState(false)
    const [popupRemoverAberto, setPopupRemoverAberto] = useState(false)
    const [popupEscolhido, setPopupEscolhido] = useState()
    const [popupRemoverEscolhido, setPopupRemoverEscolhido] = useState()
    const [popupAtualizarAberto, setPopupAtualizarAberto] = useState(false);

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

    const handlePopupAtualizarAbrir = (tipo) => {
        setPopupEscolhido(tipo);
        setPopupAtualizarAberto(true);
    }

    const handlePopupAtualizarFechar = () => {
        setPopupAtualizarAberto(false);
    }


    const handleSelectCategoria = (event) => {
        setId(event.target.value)
    }

    const cadastrarCategoria = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const nome = formJson.nomeCategoria
        let duplicado = false;
        if (popupEscolhido == "Roupa") {
            dadosRoupa.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro-add').style.display = "flex"
                    duplicado = true
                }
            })
        } else {
            dadosTecido.map(r => {
                if (r.nome == nome) {
                    document.getElementById('alert-cadastro-add').style.display = "flex"
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
                })
                    .then(response => {
                        console.log(response.data);
                        setAlertType("success");
                        setAlertTitle("Categoria cadastrada com sucesso!");
                        setAlertMessage(`Os dados ${nome} foram cadastrados com sucesso.`);
                        setAlertOpen(true);
                        getDados();
                        handlePopupAdicionarFechar()
                    })
                    .catch(error => {
                        console.log("Erro ao cadastrar Categoria: ", error)
                        if (error.response.status === 409) {
                            setAlertType("warning");
                            setAlertTitle("Cadastro já existente!");
                            setAlertMessage(`Já existe uma categoria cadastrada com o nome informado.`);
                        } else {
                            setAlertType("error");
                            setAlertTitle("Erro ao realizar cadastro!");
                            setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${nome}. Entre em contato com o suporte.`);
                        }
                        setAlertOpen(true);
                        handlePopupAdicionarFechar()
                    })
            } else if (popupEscolhido == "Tecido") { // if como failsafe
                axios.post("/api/categorias", {
                    "nome": nome,
                    "categoriaPai": {
                        "idCategoria": 1
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        setAlertType("success");
                        setAlertTitle("Categoria cadastrada com sucesso!");
                        setAlertMessage(`Os dados ${nome} foram cadastrados com sucesso.`);
                        setAlertOpen(true);
                        getDados();
                        handlePopupAdicionarFechar();
                    })
                    .catch(error => {
                        console.log("Erro ao cadastrar Categoria: ", error)
                        if (error?.response?.status === 409) {
                            setAlertType("warning");
                            setAlertTitle("Cadastro já existente!");
                            setAlertMessage(`Já existe uma categoria cadastrada com o nome informado.`);
                        } else {
                            setAlertType("error");
                            setAlertTitle("Erro ao realizar cadastro!");
                            setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${nome}. Entre em contato com o suporte.`);
                        }
                        setAlertOpen(true);
                        handlePopupAdicionarFechar();
                    })
            }
        }
    }

    const removerCategoria = (event) => {
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const id = formJson.idCategoria
        const nome = formJson.nomeCategoria
        event.preventDefault()

        if (id == 0) {
            document.getElementById('alert-cadastro-remove').style.display = "flex"
            return;
        }

        console.log(id)

        axios.delete(`/api/categorias/${id}`)
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Remoção bem sucedida!");
                setAlertMessage(`Categoria "${nome}" apagada com sucesso.`);
                setAlertOpen(true);
                getDados();
            })
            .catch(error => {
                console.error('Erro ao remover categoria:', error);
                if (error.response.status === 422) {
                    setAlertType("warning");
                    setAlertTitle("Remoção não permitida!");
                    setAlertMessage(`Não é possível apagar ${nome}, pois está referenciado(a) por uma roupa ou tecido no sistema.`);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao apagar dados!");
                    setAlertMessage(`Ocorreu um erro ao remover as informações de ${nome}. Entre em contato com o suporte.`);
                }
                setAlertOpen(true);
            });
        handlePopupRemoverFechar()
    }

    const atualizarCategoria = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const id = formJson.idCategoria;
        const nome = formJson.nomeCategoria;
        const idCategoriaPai = popupEscolhido === "Roupa" ? 2 : 1;

        const duplicado = false;
        if(idCategoriaPai === 2){
        const duplicado = dadosRoupa.some(r => r.nome === nome);
        }else{
            const duplicado = dadosTecido.some(r => r.nome === nome);
        }


        if (duplicado) {
            console.error('Error fetching data:', error);
            setAlertType("error");
            setAlertTitle("Erro ao atualizar dados!");
            setAlertMessage(`Ocorreu um erro ao atualizar as informações ${nome}. Entre em contato com o suporte.`);
            setAlertOpen(true);
            return;
        }

        axios.put(`/api/categorias/${id}`,
            {
                "nome": nome,
                "categoriaPai": {
                    "idCategoria": idCategoriaPai
                }
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Categoria atualizada com sucesso!");
                setAlertMessage(`A categoria ${nome} foi atualizada com sucesso..`);
                setAlertOpen(true);
                handlePopupAtualizarFechar();
                getDados();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações ${nome}. Entre em contato com o suporte.`);
                setAlertOpen(true);
            });
    }


    const [dadosTecido, setDadosTecido] = useState([])
    const [dadosRoupa, setDadosRoupa] = useState([])

    // O Array vazio faz o useEffect ativas apenas ao renderizar pela primeira vez 
    const initialState = useEffect(() => { getDados(); }, [])

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

    // Fecha o alerta (sucesso, erro, aviso) automaticamente após 10 segundos
    useEffect(() => {
        if (alertOpen) {
            console.log("ALERT OPENED");
            const timer = setTimeout(() => {
                setAlertOpen(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [alertOpen]);

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
                        <Button onClick={() => handlePopupAtualizarAbrir("Roupa")} variant='contained'> Atualizar Categoria</Button>
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
                        <Button onClick={() => handlePopupAtualizarAbrir("Tecido")} variant='contained'> Atualizar Categoria</Button>

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
                    <Alert severity='error' id='alert-cadastro-add' style={{ display: "none" }}>Nome indisponível</Alert>
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
                    <Alert severity='error' id='alert-cadastro-remove' style={{ display: "none" }}>Escolha uma categoria</Alert>
                    <DialogActions>
                        <Button onClick={() => handlePopupRemoverFechar()}>Cancelar</Button>
                        <Button type='submit' form="formRemoverCategoria">Remover</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog open={popupAtualizarAberto}>
                <DialogTitle>Atualizar categoria de {popupEscolhido}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escolha a categoria e digite o novo nome
                    </DialogContentText>
                    <br />
                    <form onSubmit={atualizarCategoria} id='formAtualizarCategoria'>
                        <Select
                            value={id}
                            name={'idCategoria'}
                            onChange={(event) => handleSelectCategoria(event)}
                            fullWidth
                        >
                            <MenuItem disabled value={0}>Escolha uma Categoria</MenuItem>
                            {popupEscolhido === 'Roupa'
                                ? dadosRoupa.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                                ))
                                : dadosTecido.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                                ))
                            }
                        </Select>
                        <br /><br />
                        <TextField
                            autoFocus
                            required
                            name="nomeCategoria"
                            label="Novo nome da Categoria"
                            fullWidth
                        />
                    </form>
                    <br />
                    <DialogActions>
                        <Button onClick={() => handlePopupAtualizarFechar()}>Cancelar</Button>
                        <Button type='submit' form="formAtualizarCategoria">Atualizar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <AlertDialog
                alertType={alertType}
                alertTitle={alertTitle}
                alertMessage={alertMessage}
                state={alertOpen}
            />
        </div>
    )
}