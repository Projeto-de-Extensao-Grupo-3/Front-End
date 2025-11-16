import { useReducer, useEffect, useState } from "react"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./historico.module.css"

import 'dayjs/locale/en-gb';
import dayjs from "dayjs";

import PropTypes from 'prop-types';

import axios from 'axios';

// import { NumericFormat } from 'react-number-format';

// @MUI
import { ptBR } from '@mui/x-date-pickers/locales';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, TablePaginationActions } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField'

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
        case 'saida_add': {
            var index = state.itensDisponiveis.indexOf(action.value);
            if (index > -1) {
                action.value.quantidadeNova = 1;
                if (!action.value.isRoupa) {
                    action.value.quantidadeNova+=99; // começar em 100 gramas
                }
                action.value.precoNovo = Number(action.value.precoItem).toFixed(2);
                return {
                    ...state,
                    itensDisponiveis: state.itensDisponiveis.splice(index, 1),
                    itensParaRegistrar: state.itensParaRegistrar.push(action.value)
                }
            } else {
                return { ...state };
            }
        }
        case 'saida_del': {
            var index = state.itensParaRegistrar.indexOf(action.value);
            if (index > -1) {
                delete action.value.quantidadeNova;
                return {
                    ...state,
                    itensDisponiveis: state.itensDisponiveis.push(action.value),
                    itensParaRegistrar: state.itensParaRegistrar.splice(index, 1)
                }
            } else {
                return { ...state };
            }
        }
        case 'saida_update': {
            var index = state.itensParaRegistrar.indexOf(action.value)
            action.newValue = Number(action.newValue);
            if (index < 0 || isNaN(action.newValue) || action.newValue < 0 || action.newValue > Number(action.value.qtdItem)) {
                return { ...state };
            }
            action.value.quantidadeNova = action.newValue;
            var auxItensParaRegistrar = state.itensParaRegistrar;
            auxItensParaRegistrar[index] = action.value;
            return {
                ...state,
                itensParaRegistrar: auxItensParaRegistrar
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
        tamanho: 0,
        tuplas: [],

        brightnessMain: '100%',

        itensParaRegistrar: [],
        itensDisponiveis: [],

        parceiros: [],
        idParceiroEscolhido: -1,
        motivo: '',

        displayPopup: "none",
        tipoItem: 0,

        displayPopupSaida: "none",
        auxSelectItensSaida: 0,

    };

    const [values, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        document.title = "Histórico"
    });

    const handleBlackout = useEffect(() => {
        if (values.displayPopupSaida == 'none') {
            dispatch({type: 'simples', field: 'brightnessMain', value: '100%'})
        } else {
            dispatch({type: 'simples', field: 'brightnessMain', value: '50%'})
        }
    }, [values.displayPopupSaida])

    const handleChangePage = (event, newPage) => {
        dispatch({ type: 'simples', field: 'pagina', value: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        dispatch({ type: 'simples', field: 'entradasPorPagina', value: event.target.value });
        dispatch({ type: 'simples', field: 'pagina', value: 0 });
    };

    const obterDadosTabela = useEffect(() => {

        if (values.tipoMovimentacao == 0) {
            axios.get(`/api/lotes-item-estoque/paginado?page=${values.pagina}&limit=${values.entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => { newTuplas.push(dados) });
                    dispatch({ type: 'simples', field: 'tuplas', value: newTuplas });
                    newTuplas = null;
                    dispatch({ type: 'simples', field: 'tamanho', value: response.data.totalRegistros });
                })
        } else {
            axios.get(`/api/lotes-item-estoque/paginadoSaida?page=${values.pagina}&limit=${values.entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => { newTuplas.push(dados) });
                    dispatch({ type: 'simples', field: 'tuplas', value: newTuplas });
                    newTuplas = null;
                    dispatch({ type: 'simples', field: 'tamanho', value: response.data.totalRegistros });
                })
        }
    }, [values.entradasPorPagina, values.pagina, values.tipoMovimentacao]);

    const obterDadosRegistrarEntrada = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({ type: 'simples', field: 'itensDisponiveis', value: [] })
            return;
        }
        axios.get(`/api/itens-estoque/itensResumidos`)
            .then(response => { dispatch({ type: 'simples', field: 'itensDisponiveis', value: response.data }) });
    }, [values.displayPopup]);

    const obterDadosRegistrarSaida = useEffect(() => {
        if (values.displayPopupSaida == 'none') {
            dispatch({ type: 'simples', field: 'itensDisponiveis', value: [] });
            dispatch({ type: 'simples', field: 'itensParaRegistrar', value: [] });
            return;
        }
        axios.get(`/api/lotes/lotesEmEstoque`)
            .then(response => { dispatch({ type: 'simples', field: 'itensDisponiveis', value: response.data }) });

        axios.get(`/api/parceiros/listagem/costureira`) // Quando enpoint existir, colocar de todos
            .then(response => { dispatch({ type: 'simples', field: 'parceiros', value: response.data }) });
    }, [values.displayPopupSaida]);

    const handleRegistrarSaida = () => {
        var auxRegistrarSaida = [];
        values.itensParaRegistrar.forEach( (item) => 
            axios.post(`/api/saidas-estoque`, {
                data: dayjs().format('YYYY-MM-DD'),
                hora: dayjs().format('HH:mm:ss'),
                qtdSaida: item.quantidadeNova,
                motivoSaida: values.motivo,
                responsavel: {
                    idFuncionario: 1 // Como faremos para obter esse atributo?
                },
                loteItemEstoque: {
                    idLoteItemEstoque: item.idLoteItemEstoque
                },
                costureira: values.idParceiroEscolhido != -1 ? values.idParceiroEscolhido : null
            }).then(response => {
                dispatch({ type: 'simples', field: 'displayPopupSaida', value: 'none' })
                alert("Itens registrados!")
                location.reload();
            })
        )
        return null;
    };


    return (
        <div >
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} style={{filter: `brightness(${values.brightnessMain})`}}>
                <div className={styles.barraFiltros}>
                    <div className={styles.boxSelect}>
                        <FormControl >
                            <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                            <Select value={values.tipoMovimentacao} onChange={(event) => dispatch({ type: 'simples', field: 'tipoMovimentacao', value: event.target.value })} labelId="label-tipo-slct" label="Tipo">
                                <MenuItem value={0}>Entrada</MenuItem>
                                <MenuItem value={1}>Saída</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => dispatch({ type: 'simples', field: 'displayPopup', value: 'flex' })}>Registrar Entrada de Item</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => dispatch({ type: 'simples', field: 'displayPopupSaida', value: 'flex' })}>Registrar Saída de Item</Button>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.divTabela}>
                        <h1>Dados de {values.tipoMovimentacao == 0 ? 'Entrada' : 'Saída' } de Estoque</h1>
                        <br />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagem</TableCell>
                                        <TableCell>Quantidade</TableCell>
                                        <TableCell>Nome do Item</TableCell>
                                        <TableCell>Lote</TableCell>
                                        <TableCell>{values.tipoMovimentacao == 0 ? "Origem" : "Destino"}</TableCell>
                                        <TableCell>Horário</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {values.tuplas.map((tupla) => (
                                        <TableRow key={''+ tupla.nomeItem + tupla.idLote + (values.tipoMovimentacao == 0 ? dayjs(tupla.dataEntrada).format('HH:mm:ss DD/MM/YY') : dayjs(tupla.saidaEstoque).format('HH:mm:ss DD/MM/YY'))}>
                                            <TableCell><img src={tupla.url} className={styles.boxImagem} /></TableCell>
                                            <TableCell>{tupla.qtdItem}</TableCell>
                                            <TableCell>{tupla.nomeItem}</TableCell>
                                            <TableCell>{tupla.idLote}</TableCell>
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
                                                }
                                            }}
                                            onPageChange={(event, newPage) => handleChangePage(event, newPage)}
                                            onRowsPerPageChange={(event) => handleChangeRowsPerPage(event)}
                                            ActionsComponent={(props) => PaginarTabela(props)}
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
                    <div className={styles.blackout} onClick={() => dispatch({ type: 'simples', field: 'displayPopup', value: 'none' })}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Movimentação</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <Select value={values.tipoItem} onChange={(event) => dispatch({ type: 'simples', field: 'tipoItem', value: event.target.value })}>
                                        <MenuItem value={0} disabled>Tipo de Item</MenuItem>
                                        <MenuItem value={1}>Roupas</MenuItem>
                                        <MenuItem value={2}>Tecidos</MenuItem>
                                    </Select>
                                    {/* <Select value={0} onChange={(event) => handleItem(event)}>
                                        <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                        {values.itensDisponiveis.map((dadoItem) => (
                                            <MenuItem value={dadoItem.id}>{dadoItem.descricao}</MenuItem>
                                        ))}
                                    </Select> */}
                                    <Button onClick={() => dispatch({ type: 'simples', field: 'displayPopup', value: 'none' })} variant="contained">Adicionar Item</Button>
                                    <Button onClick={() => dispatch({ type: 'simples', field: 'displayPopup', value: 'none' })} variant="outlined">Cancelar</Button>
                                </div>
                                <FormControl>
                                    <FormLabel id="id-entrada-saida">Itens para registro:</FormLabel>
                                </FormControl>
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={styles.popupRegistro} style={{ display: values.displayPopupSaida }}>
                    <div className={styles.blackout} onClick={() => dispatch({ type: 'simples', field: 'displayPopupSaida', value: 'none' })}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Saída de Itens</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <div className={styles.selectsPopup}>
                                        <Select value={values.auxSelectItensSaida} onChange={(event) => dispatch({ type: 'saida_add', value: event.target.value })}>
                                            <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                            <MenuItem value={-1} disabled>Confirme ou Selecione mais Itens</MenuItem>
                                            {values.itensDisponiveis.map((dadoItem) => (
                                                <MenuItem value={dadoItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormControl>
                                            <InputLabel id="labelDestino">Destino dos Itens</InputLabel>
                                            <Select labelId="labelDestino" label="Destino dos Itens" value={values.idParceiroEscolhido} onChange={(event) => dispatch({ type: 'simples', field: 'idParceiroEscolhido', value: event.target.value })}>
                                                <MenuItem value={-1}>Cliente (venda)</MenuItem>
                                                {values.parceiros.map((parceiro) => (
                                                    <MenuItem value={parceiro.id}>{parceiro.nome} (Parceira)</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className={styles.btnCancelarPopup}>
                                        <Button onClick={() => dispatch({ type: 'simples', field: 'displayPopupSaida', value: 'none' })} variant="outlined">Cancelar</Button>
                                    </div>
                                </div>
                                <br />
                                <h2 id="id-entrada-saida">Itens para registro:</h2>
                                <TableContainer sx={{maxHeight: '600px'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Lote</TableCell>
                                                <TableCell>Item</TableCell>
                                                <TableCell>Quantidade</TableCell>
                                                <TableCell>Tirar Item</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values.itensParaRegistrar.map((item) => (
                                                <TableRow key={item.idLoteItemEstoque}>
                                                    <TableCell>{item.idLote}</TableCell>
                                                    <TableCell>{item.nomeItem}</TableCell>
                                                    <TableCell>
                                                        <NumericFormat 
                                                            value={item.quantidadeNova}
                                                            customInput={TextField}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: 'saida_update',
                                                                    value: item,
                                                                    atribute: 'quantidade',
                                                                    newValue: e.target.value
                                                                })
                                                            }
                                                            suffix={item.isRoupa ? ' unidade(s)' : ' gramas'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => dispatch({ type: 'saida_del', value: item })}>Remover Item</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className={styles.btnConfirmarPopup}>
                                <TextField 
                                    label="Motivo de saída (opcional)"
                                    value={values.motivo}
                                    onChange={(event) => dispatch({type: 'simples', field: 'motivo', value: event.target.value})}
                                />
                                <Button onClick={() => handleRegistrarSaida()} variant="contained">Confirmar</Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}