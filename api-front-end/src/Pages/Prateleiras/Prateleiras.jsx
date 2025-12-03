import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./prateleiras.module.css"
import { use, useEffect, useState } from 'react';
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
import { api } from '../../provider/api';

export function Prateleiras() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Prateleiras";
    }, []);

    const [popupAdicionarAberto, setPopupAdicionarAberto] = useState(false)
    const [popupRemoverAberto, setPopupRemoverAberto] = useState(false)
    const [popupAtualizarAberto, setPopupAtualizarAberto] = useState(false)
    const [isPrimeiroRender, setIsPrimeiroRender] = useState(true)
    const [id, setId] = useState(0);

    const handleSelectPrateleira = (event) => {
        setId(event.target.value)
    }

    const cadastrarPrateleira = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const codigo = formJson.codigoPrateleira
        dadosPrateleiras.map(p => {
            if (p.codigo == codigo) {
                document.getElementById('alert-cadastro-add').style.display = "flex"
                return;
            }
        })
        console.log("codigo : " + codigo)
        // api.post("/prateleiras", {
        //     codigo: codigo
        // }).then(() => {
        //     setPopupAdicionarAberto(false)
        //     reload();
        // }).catch(error => {
        //     console.error("Erro ao cadastrar Categoria: ", error);
        // });
    }

    const removerPrateleira = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())
        const id = formJson.idPrateleira
        console.log(id)

        if (id == 0) {
            document.getElementById('alert-cadastro-remove').style.display = "flex"
            return;
        }
        var possuiItens = false;
        // api.get(`/prateleiras/existeItem/${id}`).then((response) => {
        //     possuiItens = response.data.existeItem;
        // })
        if (possuiItens) {
            document.getElementById('alert-cadastro-remove-conflito').style.display = "flex"
            return;
        }

        console.log(id)
        // api.delete(`/prateleiras/${id}`).then(() => {
        //         setPopupRemoverAberto(false);
        //         reload();
        //     }).catch(error => console.error("Erro ao remover:", error));
    }

    const atualizarPrateleira = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        dadosPrateleiras.map(p => {
            if (p.codigo == formJson.codigo) {
                document.getElementById('alert-cadastro-atualiza').style.display = "flex"
                return;
            }
        })

        console.log(formJson)
        // api.put(`/categorias/${formJson.id}`, {
        //     codigo: formJson.codigo
        // }).then( (response) => {

        //     setPopupAtualizarAberto(false);
        //     reload();
        // }).catch(error => console.error("Erro ao remover:", error));
    };


    const [dadosPrateleiras, setDadosPrateleiras] = useState([])

    const reload = () => {
        api.get("/prateleiras")
            .then(response => {
                setDadosPrateleiras(response.data)
            })
            .catch(error => {
                if (error.response?.status === 401) navigate('/');
                console.error("Erro ao obter os dados de Características:", error);
            });
    };

    useEffect(() => {
        reload();
    }, []);

    const [filtroPrateleira, setFiltroPrateleira] = useState("");

    // Filtra os itens conforme o texto digitado
    const dadosPrateleiraFiltrado = dadosPrateleiras.filter((prateleira) =>
        prateleira.codigo.toLowerCase().includes(filtroPrateleira.toLowerCase())
    );



    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <div className={styles.main}>
                <div className={styles.lista}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Pesquisar Prateleira..."
                        fullWidth
                        value={filtroPrateleira}
                        onChange={(e) => setFiltroPrateleira(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Paper style={{ maxHeight: 300, overflowY: 'auto' }}>
                        <List>
                            <ListItem style={{ fontWeight: 'bold', textAlign: 'center' }} key={0}>Prateleiras</ListItem>
                            <Divider style={{ width: '100%' }} orientation='horizontal' component="li" />
                            {dadosPrateleiraFiltrado.map((prateleira) => (
                                <ListItem key={prateleira.id}>
                                    {prateleira.codigo}
                                </ListItem>
                            ))}

                            {dadosPrateleiraFiltrado.length === 0 && (
                                <ListItem style={{ opacity: 0.6, fontStyle: "italic" }}>
                                    Nenhum resultado encontrado...
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
                <DialogTitle>Adiconar nova Prateleira</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite o nome da nova prateleira
                    </DialogContentText>
                    <br />
                    <form onSubmit={cadastrarPrateleira} id='formAddPrateleira'>
                        <TextField
                            autoFocus
                            required
                            name="codigoPrateleira"
                            label="Nome da Prateleira"
                            fullWidth
                        />
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro-add' style={{ display: "none" }}>Nome indisponível</Alert>
                    <DialogActions className={styles.divBotoes}>
                        <Button onClick={() => setPopupAdicionarAberto(false)}>Cancelar</Button>
                        <Button type='submit' form="formAddPrateleira">Cadastrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog open={popupRemoverAberto}>
                <DialogTitle>Remover Prateleira</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escolha a prateleira a ser removida
                    </DialogContentText>
                    <br />
                    <form onSubmit={removerPrateleira} id='formRemoverPrateleira'>
                        <Select value={id} name={'idPrateleira'} onChange={(event) => handleSelectPrateleira(event)}  >
                            <MenuItem disabled value={0}>Escolha uma Prateleira</MenuItem>
                            {dadosPrateleiras.map((prateleira) => (
                                <MenuItem key={prateleira.id} value={prateleira.id}>
                                    {prateleira.codigo}
                                </MenuItem>))}
                        </Select>
                    </form>
                    <br />
                    <Alert severity='error' id='alert-cadastro-remove' style={{ display: "none" }}>Escolha uma prateleira</Alert>
                    <Alert severity='error' id='alert-cadastro-remove-conflict' style={{ display: "none" }}>Essa prateleira está em uso</Alert>
                    <DialogActions>
                        <Button onClick={() => setPopupRemoverAberto(false)}>Cancelar</Button>
                        <Button type='submit' form="formRemoverPrateleira">Remover</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog open={popupAtualizarAberto}>
                <DialogTitle>Atualizar Prateleira</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escolha a prateleira a ser atualizada:
                    </DialogContentText>
                    <br />
                    <form onSubmit={atualizarPrateleira} id='formAtualizarPrateleira'>
                        <Select value={id} name="id" onChange={(event) => handleSelectPrateleira(event)} fullWidth required>
                            <MenuItem disabled value={0}>Escolha uma Prateleira</MenuItem>
                            {dadosPrateleiras.map((prateleira) => (
                                <MenuItem key={prateleira.id} value={prateleira.id}>
                                    {prateleira.codigo}
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <DialogContentText>Novo nome:</DialogContentText>
                        <br />
                        <TextField
                            autoFocus
                            required
                            name="codigo"
                            label="Nome da Prateleira"
                            fullWidth
                        />
                        <br />
                        <Alert severity='error' id='alert-cadastro-atualiza' style={{ display: "none" }}>Nome indisponível</Alert>
                        <DialogActions className={styles.divBotoes}>
                            <Button onClick={() => setPopupAtualizarAberto(false)}>Cancelar</Button>
                            <Button type='submit' form='formAtualizarPrateleira'>Atualizar</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>


        </div>
    )
}