import { useState } from "react";
import styles from "./filtro.module.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { PageSelector } from "../PageSelectorDash/PageSelector";
import { useMediaQuery } from "@mui/material";
import dayjs from "dayjs";

export function Filtro(props) {
    // Responsividade: usa Box do MUI para adaptar o layout
    const matches = useMediaQuery('(min-width: 1000px)')

    const [dataInicio, setDataInicio] = useState(dayjs().subtract(12, 'months').format('YYYY-MM-DD'));
    const [dataFim, setDataFim] = useState(dayjs().format('YYYY-MM-DD'));
    const [categoria, setCategoria] = useState("");
    const [caracteristica, setCaracteristica] = useState("");

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
        props.handleFilters(dataInicio, dataFim, caracteristica, categoria)

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
            <h1 style={{width: matches ? '100%' : '80%', alignSelf: 'center', paddingTop: matches ? 0 : '10px'}}>Segmento</h1>
            <br />
            <div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}} onClick={() => props.handleChangePage('produtos')}>
                    <PageSelector nomePagina="Produtos" ativo={props.currentPage == 'produtos'}/>
                </div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}  onClick={() => props.handleChangePage('defeitos')}>
                    <PageSelector nomePagina="Defeitos" ativo={props.currentPage == 'defeitos'}/>
                </div>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}  onClick={() => props.handleChangePage('vendas')}>
                    <PageSelector nomePagina="Vendas" ativo={props.currentPage == 'vendas'}/>
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
                <TextField 
                    label="Caracteristica"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={caracteristica}
                    onChange={(event) => handleCaracteristica(event)}
                    sx={{ flex: 1, minWidth: 0 }}
                />
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