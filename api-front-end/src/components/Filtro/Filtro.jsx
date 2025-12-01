import { useEffect, useState } from "react";
import styles from "./filtro.module.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useMediaQuery } from "@mui/material";
import { makeStyles } from '@mui/material'
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';  
import { api } from "../../provider/api";


export function Filtro(props) {
    // Responsividade: usa Box do MUI para adaptar o layout
    const matches = useMediaQuery('(min-width: 1000px)')

    const [dataInicio, setDataInicio] = useState(dayjs().subtract(12, 'months').format('YYYY-MM-DD'));
    const [dataFim, setDataFim] = useState(dayjs().format('YYYY-MM-DD'));
    const [categoria, setCategoria] = useState("Todas");
    const [caracteristica, setCaracteristica] = useState("Todas");

    const [listCaracteristicas, setListCaracteristicas] = useState([]);

    const [dadosTecido, setDadosTecido] = useState([])
    const [dadosRoupa, setDadosRoupa] = useState([])

    const obterCaracteristicas = useEffect(() => {
        api.get("/categorias/tipo/caracteristica")
            .then(response => setListCaracteristicas(response.data))
            .catch(error => {
                if (error.response?.status === 401) navigate('/');
                console.error("Erro ao obter os dados de Características:", error);
            });
    }, [])

    const obterCategorias = useEffect(() => {
    
        api.get("/categorias/tipo/tecido").then(
            response => {
                setDadosTecido(response.data)
            }).catch(error => {
                console.log("Erro ao obter os dados de Tecidos: ", error)
            })

        api.get("/categorias/tipo/roupa").then(
            response => {
                setDadosRoupa(response.data)
            }).catch(error => {
                console.log("Erro ao obter os dados de Roupas: ", error)
            })
    }, [])

    const handleDataInicio = (event) => {
        let newDate = event.target.value;
        newDate = dayjs(newDate).format('YYYY-MM-DD');
        if (dayjs(newDate).isAfter(dataFim)) {
            return;
        }
        setDataInicio(newDate);
    }

    const handleDataFim = (event) => {
        let newDate = event.target.value;
        newDate = dayjs(newDate).format('YYYY-MM-DD');
        if (dayjs(newDate).isBefore(dataFim)) {
            return;
        }
        setDataFim(newDate);
    }

    const handleCaracteristica = (event) => {
        setCaracteristica(event.target.value)
    }

    const handleCategoria = (event) => {
        setCategoria(event.target.value)
    }

    const updateData = () => {
        if (!dayjs(dataInicio).isValid()) {
            // Alerta data de início
            return;
        }
        if (!dayjs(dataFim).isValid()) {
            // Alerta data de fim
            return;
        }

        console.log(dataInicio, dataFim, caracteristica, categoria)
        props.handleFilters(dataInicio, dataFim, caracteristica == "Todas" ? "" : caracteristica, categoria == "Todas" ? "" : categoria)

    }

    

    return (
        <Box sx={{
            width: matches ? { xs: '100%', sm: 320 } : '100%',
            minWidth: 0,
            p: matches ? 2 : 0,
            borderRight: matches ? { sm: '1px solid #000000a2' } : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: '#fff'
        }}>
            <h1 style={{ width: matches ? '100%' : '80%', alignSelf: 'center', paddingTop: matches ? 0 : '10px' }}>Segmento</h1>
            <br />
            <div className={styles.pageSelector}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '25%' }} onClick={() => props.handleChangePage('produtos')}>
                    <Button
                        onClick={() => props.handleChangePage('produtos')}
                        sx={{ height: '90%', width: '100%' }}
                        variant={props.currentPage == 'produtos' ? 'contained' : 'outlined'}
                    >
                        Produtos
                    </Button>
                    {/* <PageSelector nomePagina="Produtos" ativo={props.currentPage == 'produtos'}/> */}
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '25%' }} onClick={() => props.handleChangePage('defeitos')}>
                    <Button
                        sx={{ height: '90%', width: '100%' }}
                        variant={props.currentPage == 'defeitos' ? 'contained' : 'outlined'}>
                        Defeitos
                    </Button>
                    {/* <PageSelector nomePagina="Defeitos" ativo={props.currentPage == 'defeitos'}/> */}
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '25%' }} onClick={() => props.handleChangePage('vendas')}>
                    <Button
                        sx={{ height: '90%', width: '100%' }}
                        variant={props.currentPage == 'vendas' ? 'contained' : 'outlined'}
                    >
                        Vendas
                    </Button>
                    {/* <PageSelector nomePagina="Vendas" ativo={props.currentPage == 'vendas'}/> */}
                </div>
            </div>
            <h1>Filtros</h1>
            <h3 className={styles.noBold}>Janela dos registros:</h3>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            }}>
                <TextField
                    label="Início"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    fullWidth
                    value={dataInicio}
                    onChange={(event) => handleDataInicio(event)}
                    sx={{ flex: 1, minWidth: 0 }}
                />
                <TextField
                    label="Fim"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    value={dataFim}
                    onChange={(event) => handleDataFim(event)}
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Box>
            <h3 className={styles.noBold}>Produtos:</h3>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            }}>
                <FormControl fullWidth>
                    <InputLabel id="label-caracteristica">Caracteristica</InputLabel>
                    <Select 
                        labelId="label-caracteristica" 
                        label="Caracteristica" 
                        value={caracteristica} 
                        onChange={(event) => handleCaracteristica(event)} 
                        fullWidth
                        MenuProps={{ style: { maxHeight: 400} }}
                        >
                        <MenuItem selected value={"Todas"}>Todas</MenuItem>
                        {listCaracteristicas.map((caracteristica) => (
                            <MenuItem value={caracteristica.nome}>{caracteristica.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="label-categoria">Categoria</InputLabel>
                    <Select 
                        sx={{maxHeight: '500px'}}
                        labelId="label-categoria" 
                        label="Categoria" 
                        value={categoria} 
                        onChange={(event) => handleCategoria(event)} 
                        fullWidth
                        MenuProps={{ style: { maxHeight: 400} }}
                        >
                        <MenuItem selected value={"Todas"}>Todas</MenuItem>
                            {dadosRoupa.map((categoria) => (
                                <MenuItem value={categoria.nome}>{categoria.nome}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Categoria"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={categoria}
                    onChange={(event) => handleCategoria(event)}
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Box>
            <Button variant="contained" onClick={() => updateData()}>Confirmar</Button>
        </Box>
    );
}