import { useEffect, useState } from "react"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./historico.module.css"

// Limpar localização após conversa com duarte
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/en-gb';

// Select baseado em: https://mui.com/material-ui/react-select/
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";

import Button from '@mui/material/Button';

// Tabela
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, TablePaginationActions } from "@mui/material";
// import { useTheme } from '@mui/material/styles'; 
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import TextField from '@mui/material/TextField'
import { useReducer } from "react";

import axios from 'axios';

const theme = createTheme(
    ptBR
);

function PaginarTabela(props) {

    const theme = useTheme();

    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box className={styles.btnPaginas}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="Primeira Página"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="Página Anterior"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Próxima Paáina"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Última Página"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
};

PaginarTabela.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function reducer(state, action) {

    switch (action.type) {
        case 'simples': {
            return {
                ...state,
                [action.field]: action.value
            }
        }
        default: throw new Error("Erro no reducer!");
    }
}

export function Historico() {

    const initialState = {

        tipoMovimentacao: 0,
        pagina: 0,
        entradasPorPagina: 9,
        tuplas: [],
        tamanho: 0,
        displayPopup: "none",
        dadosItensSimples: [],
        itensParaRegistrar: [],
        tipoItem: 0,
        displayPopupSaida: "none",
        auxSelectItensSaida: 0

    };

    const [values, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        document.title = "Histórico"
    });

    const handleChangePage = (event, newPage) => {
        dispatch({type: 'simples', field: 'pagina', value: newPage});
    };

    const handleChangeRowsPerPage = (event) => {
        dispatch({type: 'simples', field: 'entradasPorPagina', value: event.target.value});
        dispatch({type: 'simples', field: 'pagina', value: 0});
    };

    const obterDadosTabela = useEffect(() => {

        if (values.tipoMovimentacao == 0) {
            axios.get(`/api/lotes-item-estoque/paginado?page=${values.pagina}&limit=${values.entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => {newTuplas.push(dados)});
                    dispatch({type: 'simples', field: 'tuplas', value: newTuplas});
                    newTuplas = null;
                    dispatch({type: 'simples', field: 'tamanho', value: response.data.totalRegistros});
                })
        } else {
            axios.get(`/api/lotes-item-estoque/paginadoSaida?page=${values.pagina}&limit=${values.entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => {newTuplas.push(dados)});
                    dispatch({type: 'simples', field: 'tuplas', value: newTuplas});
                    newTuplas = null;
                    dispatch({type: 'simples', field: 'tamanho', value: response.data.totalRegistros});
                })
        }
    }, [values.entradasPorPagina, values.pagina, values.tipoMovimentacao]);

    const [itensParaRegistrar, setItensParaRegostrar] = useState([]);

    const handleChangeTipoItem = (event) => {
        setTipoItem(event.target.value);
    }

    const obterDadosRegistrarEntrada = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({type: 'simples', field: 'dadosItensSimples', value: []})
            return;
        }
        axios.get(`/api/itens-estoque/itensResumidos`)
            .then(response => {dispatch({type: 'simples', field: 'dadosItensSimples', value: response.data})});
    }, [values.displayPopup]);

    const handleItem = (event) => {
        var aux = itensParaRegistrar;
        // Se for entrada de item
        if (values.displayPopup != 'none') {
            aux.push({
                "data": dayjs(),
                "quantidade": 1,
                "preco": 1.00,
                "itemEstoque": event.target.value
            })
        } else {
            aux.push({
                "data": dayjs().format('YYYY-MM-DD'),
                "hora": dayjs().format('HH:mm:ss'),
                "quantidade": 1,
                "preco": 1.00,
                "responsal": {
                    "idFuncionario": 1 // Temos de pegar o id do usuário de alguma maneira...
                },
                "loteItemEstoque": {
                    "idLoteItemEstoque": 1
                },
                "costureira": null
            })
        }
        
        
        
        aux.length > 0 ? dispatch({type: 'simples', field: 'auxSelectItensSaida', value: -1}) : dispatch({type: 'simples', field: 'auxSelectItensSaida', value: 0})
    }

    const obterDadosRegistrarSaida = useEffect(() => {
        if (values.displayPopupSaida == 'none') {
            dispatch({type: 'simples', field: 'dadosItensSimples', value: []})
            return;
        }
        axios.get(`/api/lotes/lotesEmEstoque`)
            .then(response => {dispatch({type: 'simples', field: 'dadosItensSimples', value: response.data})});
    }, [values.displayPopupSaida]);

    const registrarMovimentacao = () => {
        return null;
    };


    return (
        <div >
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} >
                <div className={styles.barraFiltros}>
                    <div className={styles.boxSelect}>
                        <FormControl >
                            <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                            <Select value={values.tipoMovimentacao} onChange={(event) => dispatch({type: 'simples', field: 'tipoMovimentacao', value: event.target.value})} labelId="label-tipo-slct" label="Tipo">
                                <MenuItem value={0}>Entrada</MenuItem>
                                <MenuItem value={1}>Saída</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => dispatch({type: 'simples', field: 'displayPopup', value: 'flex'})}>Registrar Entrada de Item</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => dispatch({type: 'simples', field: 'displayPopupSaida', value: 'flex'})}>Registrar Saída de Item</Button>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.divTabela}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagem</TableCell>
                                        <TableCell>Nome do Item</TableCell>
                                        <TableCell>Lote</TableCell>
                                        <TableCell>Quantidade</TableCell>
                                        <TableCell>{values.tipoMovimentacao == 0 ? "Origem" : "Destino"}</TableCell>
                                        <TableCell>Horário</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {values.tuplas.map((tupla) => (
                                        <TableRow key={tupla.nomeItem + tupla.idLote}>
                                            <TableCell><img src={tupla.url} className={styles.boxImagem} /></TableCell>
                                            <TableCell>{tupla.nomeItem}</TableCell>
                                            <TableCell>{tupla.idLote}</TableCell>
                                            <TableCell>{tupla.qtdItem}</TableCell>
                                            <TableCell>{tupla.nomeParceiro}</TableCell>
                                            <TableCell>
                                                {values.tipoMovimentacao == 0 ? dayjs(tupla.dataEntrada).format('HH:mm:ss DD/MM/YY') : dayjs(tupla.saidaEstoque).format('HH:mm:ss DD/MM/YY')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            align="right"
                                            rowsPerPageOptions={[6, 9, 12]}
                                            colSpan={6}
                                            count={values.tamanho}
                                            rowsPerPage={values.entradasPorPagina}
                                            page={values.pagina}
                                            slotProps={{
                                                select: {
                                                    inputProps: {
                                                        'aria-label': 'Entradas por Página',
                                                    },
                                                    native: true,
                                                },
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={PaginarTabela}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <div>
                <div className={styles.popupRegistro} style={{ display: values.displayPopup }}>
                    <div className={styles.blackout} onClick={() => dispatch({type: 'simples', field: 'displayPopup', value: 'none'})}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Movimentação</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <Select value={values.tipoItem} onChange={(event) => dispatch({type: 'simples', field: 'tipoItem', value: event.target.value})}>
                                        <MenuItem value={0} disabled>Tipo de Item</MenuItem>
                                        <MenuItem value={1}>Roupas</MenuItem>
                                        <MenuItem value={2}>Tecidos</MenuItem>
                                    </Select>
                                    {/* <Select value={0} onChange={(event) => handleItem(event)}>
                                        <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                        {values.dadosItensSimples.map((dadoItem) => (
                                            <MenuItem value={dadoItem.id}>{dadoItem.descricao}</MenuItem>
                                        ))}
                                    </Select> */}
                                    <Button onClick={() => dispatch({type: 'simples', field: 'displayPopup', value: 'none'})} variant="contained">Adicionar Item</Button>
                                    <Button onClick={() => dispatch({type: 'simples', field: 'displayPopup', value: 'none'})} variant="outlined">Cancelar</Button>
                                </div>
                                <FormControl>
                                    <FormLabel id="id-entrada-saida">Itens para registro:</FormLabel>
                                </FormControl>
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={styles.popupRegistro} style={{ display: values.displayPopupSaida }}>
                    <div className={styles.blackout} onClick={() => dispatch({type: 'simples', field: 'displayPopupSaida', value: 'none'})}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Saída de Itens</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <Select value={values.auxSelectItensSaida} onChange={(event) => handleItem(event)}>
                                        <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                        <MenuItem value={-1} disabled>Confirme ou Selecione mais Itens</MenuItem>
                                        {values.dadosItensSimples.map((dadoItem) => (
                                            <MenuItem value={'' + dadoItem.idLote + dadoItem.idItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem>
                                        ))}
                                    </Select>
                                    <Button onClick={() => dispatch({type: 'simples', field: 'displayPopupSaida', value: 'none'})} variant="contained">Adicionar Item</Button>
                                    <Button onClick={() => dispatch({type: 'simples', field: 'displayPopupSaida', value: 'none'})} variant="outlined">Cancelar</Button>
                                </div>
                                <div id="id-entrada-saida">Itens para registro:</div>
                                {itensParaRegistrar.map((item) => (
                                    <div key={'' + item.idLote + item.idItem}>
                                        Lote: {item.idLote}

                                    </div>    
                                ))}
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}