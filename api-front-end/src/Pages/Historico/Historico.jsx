import { useReducer, useEffect, useState } from "react"
import styles from "./historico.module.css"

import { Navbar } from "../../components/Navbar/Navbar"
import AlertDialog from '../../components/AlertDialog/AlertDialog';

import dayjs from "dayjs";
import 'dayjs/locale/en-gb';

import PropTypes from 'prop-types';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { NumericFormat } from 'react-number-format';

// @MUI
import { ptBR } from '@mui/x-date-pickers/locales';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, createTheme, getContrastRatio, ThemeProvider, useTheme } from '@mui/material/styles';
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
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';

const theme = createTheme({
    palette: {
        saida: {
            main: '#ef5350',
            light: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
    }
});

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
            if (state.tipoItem == 'entrada') {
                console.log(action.value.tipoItem)
                action.value.isRoupa = action.value.tipoItem == 'roupa'
            }
            if (index > -1) {
                action.value.quantidadeNova = 1;
                if (!action.value.isRoupa) {
                    action.value.quantidadeNova += 99; // começar em 100 gramas
                }
                action.value.precoNovo = Number(action.value.preco).toFixed(2);
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
            var asNumber = action.newValue.toString()
            asNumber = asNumber.match(/\d/g);
            if (index < 0 || asNumber == null) {
                // Necessário manter aqui devido a ambiente dev rodar essa função duas vezes
                return {...state}
            }
            asNumber = asNumber.join("");
            asNumber = Number(asNumber)
            if (index < 0 || action.newValue < 0 || action.newValue > Number(action.value.qtdItem)) {
                return { ...state };
            }
            action.value.quantidadeNova = asNumber;
            var auxItensParaRegistrar = state.itensParaRegistrar;
            auxItensParaRegistrar.quantidadeNova = action.newValue
            auxItensParaRegistrar[index] = action.value;
            return {
                ...state,
                itensParaRegistrar: auxItensParaRegistrar
            }
        }
        case 'alert': {
            return {
                ...state,
                alertType: action.severity,
                alertTitle: action.title,
                alertMessage: action.message,
                alertOpen: true
            }
        }
        case 'registro': {
            return {
                ...state,
                displayPopup: action.display,
                tipoItem: action.tipoItem
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
        triggerAtualizar: 1,

        brightnessMain: '100%',

        itensParaRegistrar: [],
        itensDisponiveis: [],

        parceiros: [],
        idParceiroEscolhido: -1,
        motivo: '',

        tipoItem: 0,
        displayPopup: "none",
        auxSelectItensSaida: 0,

        alertOpen: false,
        alertTitle: "",
        alertMessage: "",
        alertType: ""

    };

    const [values, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        document.title = "Histórico"
    });

    const handleBlackout = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({ type: 'simples', field: 'brightnessMain', value: '100%' })
        } else {
            dispatch({ type: 'simples', field: 'brightnessMain', value: '50%' })
        }
    }, [values.displayPopup])

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
    }, [values.entradasPorPagina, values.pagina, values.tipoMovimentacao, values.triggerAtualizar]);

    const obterDadosRegistrar = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({ type: 'simples', field: 'itensDisponiveis', value: [] });
            dispatch({ type: 'simples', field: 'itensParaRegistrar', value: [] });
            dispatch({ type: 'simples', field: 'parceiros', value: [] });
        } else {
            if (values.tipoItem == 'saida') {
                axios.get(`/api/lotes/lotesEmEstoque`)
                    .then(response => {
                        dispatch({ type: 'simples', field: 'itensDisponiveis', value: response.data })
                    }).catch(error => {
                        console.log("Erro ao obter dados de lotes em estoque: " + error)
                    });
            } else if (values.tipoItem == 'entrada') {
                axios.get(`/api/itens-estoque/itensResumidos`)
                    .then(response => {
                        var data = response.data
                        // data.forEach((e) => e)
                        dispatch({ type: 'simples', field: 'itensDisponiveis', value: response.data })
                    }).catch(error => {
                        console.log("Erro ao obter dados de lotes em estoque: " + error)
                    });
            }
            let auxParceiro = []
            axios.get(`/api/parceiros/listagem/costureira`)
                .then(response => {
                    response.data.forEach((e) => auxParceiro.push(e))
                }).catch(error => {
                    console.log("Erro ao obter dados de parceiros: " + error)
                });
            axios.get(`/api/parceiros/listagem/fornecedor`)
                .then(response => {
                    response.data.forEach((e) => auxParceiro.push(e))
                }).catch(error => {
                    console.log("Erro ao obter dados de parceiros: " + error)
                });
            dispatch({ type: 'simples', field: 'parceiros', value: auxParceiro })
        }
    }, [values.displayPopup]);

    globalThis.values = values

    const handleRegistrarSaida = () => {
        if (values.itensParaRegistrar.length == 0) {
            dispatch({ type: 'alert', severity: 'warning', title: 'Nenhum item escolhido!', message: "Escolha um ou mais itens para registrar!" });
            console.log("here")
            return;
        } else if (values.tipoItem == 'saida') {
            values.itensParaRegistrar.forEach((item) => {
                if (item.quantidadeNova == 0) {
                    dispatch({ type: 'alert', severity: 'warning', title: 'Quantidade incorreta para um ou mais itens!', message: "Todos os itens devem estar com ao menos 1 unidade saindo!" });
                    return null;
                }
            })
            values.itensParaRegistrar.forEach((item) =>
                axios.post(`/api/saidas-estoque`, {
                    data: dayjs().format('YYYY-MM-DD'),
                    hora: dayjs().format('HH:mm:ss'),
                    qtdSaida: item.quantidadeNova,
                    motivoSaida: values.motivo,
                    responsavel: {
                        idFuncionario: sessionStorage.getItem('idFuncionario')
                    },
                    loteItemEstoque: {
                        idLoteItemEstoque: item.idLoteItemEstoque
                    },
                    costureira: values.idParceiroEscolhido != -1 ? values.idParceiroEscolhido : null
                }).then(response => {
                    dispatch({ type: 'registro', tipoItem: '', display: 'none' })
                    dispatch({ type: 'alert', severity: 'success', title: 'Registro bem sucedido!', message: "Novo registro de saída concluído com sucesso!" });
                    dispatch({ type: 'simples', field: 'triggerAtualizar', value: values.triggerAtualizar + 1 })
                }).catch(error => {
                    console.log("Erro ao regsitrar saída de itens itens:" + error)
                })
            );
        } else if (values.tipoItem == 'entrada') {
            values.itensParaRegistrar.forEach((item) => {
                console.log(item.quantidadeNova )
                if (item.quantidadeNova == 0) {
                    dispatch({ type: 'alert', severity: 'warning', title: 'Quantidade incorreta para um ou mais itens!', message: "Todos os itens devem estar com ao menos 1 unidade saindo!" });
                    return null;
                }
            })
        }
        return null;
    };


    return (
        <div >
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} style={{ filter: `brightness(${values.brightnessMain})` }}>
                <div className={styles.barraFiltros}>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => dispatch({ type: 'registro', tipoItem: 'entrada', display: 'flex' })}>
                            <InventoryIcon style={{ marginRight: '5px' }} />
                            Registrar Entrada de Item
                        </Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button theme={theme} color='saida' className={styles.button} variant="contained" onClick={() => dispatch({ type: 'registro', tipoItem: 'saida', display: 'flex' })}>
                            <LogoutIcon style={{ marginRight: '5px' }} />Registrar Saída de Item
                        </Button>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.divTabela}>
                        <div className={styles.boxTituloTabela}>
                            <span className={styles.tituloTabela}>Movimentação de estoque: </span>
                            <div className={styles.boxSelect}>
                                <FormControl >
                                    <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                                    <Select value={values.tipoMovimentacao} onChange={(event) => dispatch({ type: 'simples', field: 'tipoMovimentacao', value: event.target.value })} labelId="label-tipo-slct" label="Tipo">
                                        <MenuItem value={0}>Entrada</MenuItem>
                                        <MenuItem value={1}>Saída</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
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
                                        <TableRow key={tupla.nomeItem + tupla.idLote + values.tuplas.indexOf(tupla)}>
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
            <AlertDialog alertType={values.alertType} alertTitle={values.alertTitle} alertMessage={values.alertMessage} state={values.alertOpen} />
            <div>
                <div className={styles.popupRegistro} style={{ display: values.displayPopup }}>
                    <div className={styles.blackout} onClick={() => dispatch({ type: 'registro', tipoItem: '', display: 'none' })}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar {values.tipoItem == 'saida' ? "Saída" : "Entrada"} de Itens</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <div className={styles.selectsPopup}>
                                        <Select value={values.auxSelectItensSaida} onChange={(event) => dispatch({ type: 'saida_add', value: event.target.value })}>
                                            <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                            <MenuItem value={-1} disabled>Confirme ou Selecione mais Itens</MenuItem>
                                            {values.itensDisponiveis.map((dadoItem) => (
                                                values.tipoItem == 'saida' ?
                                                    <MenuItem value={dadoItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem> :
                                                    <MenuItem value={dadoItem}>{`${dadoItem.descricao}`}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormControl>
                                            <InputLabel id="labelDestino">{values.tipoItem == 'saida' ? "Destino dos Itens" : "Origem dos itens"}</InputLabel>
                                            <Select labelId="labelDestino" label={values.tipoItem == 'saida' ? "Destino dos Itens" : "Origem dos itens"} value={values.idParceiroEscolhido} onChange={(event) => dispatch({ type: 'simples', field: 'idParceiroEscolhido', value: event.target.value })}>
                                                {values.tipoItem == 'saida' ?
                                                    <MenuItem value={-1}>Cliente (venda)</MenuItem> :
                                                    <MenuItem disabled value={-1}>Escolha o fornecedor de origem</MenuItem>
                                                }
                                                {values.parceiros.map((parceiro) => (
                                                    <MenuItem value={parceiro.id}>{parceiro.nome} ({parceiro.categoria})</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className={styles.btnCancelarPopup}>
                                        <Button onClick={() => dispatch({ type: 'registro', tipoItem: '', display: 'none' })} variant="outlined">Cancelar</Button>
                                    </div>
                                </div>
                                <br />
                                <h2 id="id-entrada-saida">Itens para registro:</h2>
                                <TableContainer sx={{ maxHeight: '600px' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{values.tipoItem == 'saida' ? "Lote" : "Imagem"}</TableCell>
                                                <TableCell>Item</TableCell>
                                                <TableCell>Quantidade</TableCell>
                                                <TableCell>Tirar Item</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values.tipoItem == 'saida' ? values.itensParaRegistrar.map((item) => (
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
                                            )) : values.itensParaRegistrar.map((item) => (
                                                <TableRow key={item.idItem}>
                                                    <TableCell><img src={item.urlImagem} className={styles.boxImagem} /></TableCell>
                                                    <TableCell>{item.descricao}</TableCell>
                                                    <TableCell>
                                                        <NumericFormat
                                                            value={item.quantidade}
                                                            customInput={TextField}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: 'saida_update',
                                                                    value: item,
                                                                    newValue: e.target.value
                                                                })
                                                            }
                                                            suffix={item.tipoItem == 'roupa' ? ' unidade(s)' : ' gramas'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => dispatch({ type: 'saida_del', value: item })}>Remover Item</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className={styles.btnConfirmarPopup}>
                                <TextField
                                    label="Motivo de saída (opcional)"
                                    value={values.motivo}
                                    onChange={(event) => dispatch({ type: 'simples', field: 'motivo', value: event.target.value })}
                                />
                                <Button onClick={() => handleRegistrarSaida()} variant={values.itensParaRegistrar.length > 0 ? "contained" : "outlined"} disabled={values.itensParaRegistrar.length == 0}>Confirmar</Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}