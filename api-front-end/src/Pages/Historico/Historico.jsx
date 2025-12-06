import { useReducer, useEffect, useState } from "react"
import styles from "./historico.module.css"

import { Navbar } from "../../components/Navbar/Navbar"
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { TabelaHistorico } from "../../components/TabelaHistorico/TabelaHistorico";

import { useNavigate } from "react-router-dom"

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

// Configura Dayjs para usar UTC/timezone e definir locale padrão para pt-BR
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

import axios from 'axios';
import { api } from "../../provider/api";

import { NumericFormat } from 'react-number-format';

// @MUI
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';

const theme = createTheme({
    palette: {
        saida: {
            main: '#B85700',
            light: '#ca6105ff',
            dark: '#a95103ff',
            contrastText: '#ffffffff'
        },
    }
});


function reducer(state, action) {
    switch (action.type) {
        case 'simples': {
            return {
                ...state,
                [action.field]: action.value
            }
        }
        case 'registro_add': {
            var index = state.itensDisponiveis.indexOf(action.value);
            if (index > -1) {

                let nomeVarPreco = state.tipoItem == 'saida' ? 'precoItem' : 'preco'
                let quantidade = action.value.tipoItem == 'roupa' ? 1 : 50;
                let precoNovo = Number(action.value[nomeVarPreco]).toFixed(2);
                let newObject = action.value;
                newObject.quantidadeNova = Number(quantidade);
                newObject.precoItem = precoNovo;
                return {
                    ...state,
                    itensDisponiveis: state.itensDisponiveis.splice(index, 1),
                    itensParaRegistrar: state.itensParaRegistrar.push(action.value)
                }
            } else {
                return { ...state };
            }
        }
        case 'registro_del': {
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
        case 'registro_update': {
            var index = state.itensParaRegistrar.indexOf(action.value)
            var asNumber = action.newValue.toString()
            asNumber = asNumber.match(/\d/g);
            if (index < 0) {
                return { ...state }
            }
            if (asNumber == null) {
                // Necessário manter aqui devido a ambiente dev rodar essa função duas vezes
                asNumber = [0];
            }
            asNumber = asNumber.join("");
            asNumber = Number(asNumber)
            if (action.field == 'quantidadeNova') {
                action.value.quantidadeNova = asNumber;
            } else if (action.field == 'preco') {
                action.value.preco = asNumber;
            }
            var auxItensParaRegistrar = state.itensParaRegistrar;
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
                tipoItem: action.tipoItem,
                idParceiroEscolhido: -1,
                loteEscolhido: 0

            }
        }
        default: throw new Error("Erro no reducer!");
    }
}

export function Historico() {

    const navigate = useNavigate();
    

    const initialState = {

        tipoMovimentacao: 0,
        triggerAtualizar: 1,

        brightnessMain: '100%',

        itensParaRegistrar: [],
        itensDisponiveis: [],

        lotesDisponiveis: [],
        loteEscolhido: 0,

        parceiros: [],
        idParceiroEscolhido: -1,
        motivo: '',

        tipoItem: "",
        displayPopup: "none",
        auxSelectItensSaida: 0,

        alertOpen: false,
        alertTitle: "",
        alertMessage: "",
        alertType: ""

    };

    const [values, dispatch] = useReducer(reducer, initialState);

    const [isPostReady, setIsPostReady] = useState(false);

    const handlePostReady = useEffect(() => {
        if (values.itensParaRegistrar.length == 0) {
            setIsPostReady(false);
            return;
        }
        for (let i = 0; i < values.itensParaRegistrar.length; i++) {
            let item = values.itensParaRegistrar[i]
            if (item.quantidadeNova <= 0) {
                setIsPostReady(false)
                return;
            }

            if (values.tipoItem == 'saida' && item.quantidadeNova > item.qtdItem) {
                setIsPostReady(false)
                return;
            }

            if (values.tipoItem != 'saida' && values.idParceiroEscolhido == -1) {
                setIsPostReady(false)
                return;
            }
        }
        setIsPostReady(true)

    }, [values]);

    const setPageName = useEffect(() => {
        document.title = "Histórico"
    }, []);

    const handleBlackout = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({ type: 'simples', field: 'brightnessMain', value: '100%' })
        } else {
            dispatch({ type: 'simples', field: 'brightnessMain', value: '50%' })
        }
    }, [values.displayPopup])

    const obterDadosRegistrar = useEffect(() => {
        if (values.displayPopup == 'none') {
            dispatch({ type: 'simples', field: 'itensDisponiveis', value: [] });
            dispatch({ type: 'simples', field: 'itensParaRegistrar', value: [] });
            dispatch({ type: 'simples', field: 'parceiros', value: [] });
            dispatch({ type: 'simples', field: 'lotesDisponiveis', value: [] });
        } else {
            let endpoint = values.tipoItem == 'saida' ? 'lotes/lotesEmEstoque' : 'itens-estoque/itensResumidos';
            api.get(`/${endpoint}`)
                .then(response => {
                    if (response.status == 204 || response.data.length == 0) {
                        dispatch({ type: 'simples', field: 'itensDisponiveis', value: [] })
                        return;
                    }
                    let auxLotes = []
                    response.data.map((dado) => {
                        if (auxLotes.indexOf(dado.idLote) == -1) {
                            auxLotes.push(dado.idLote)
                        }
                    })
                    dispatch({ type: 'simples', field: 'itensDisponiveis', value: response.data })
                    dispatch({ type: 'simples', field: 'lotesDisponiveis', value: auxLotes })
                }).catch(error => {
                    console.log("Erro ao obter dados de lotes em estoque: " + error)
                });

            let auxParceiro = []
            api.get(`/parceiros/listagem/costureira`)
                .then(response => {
                    response.data.forEach((e) => auxParceiro.push(e))
                }).catch(error => {
                    console.log("Erro ao obter dados de parceiros: " + error)
                });

            api.get(`/parceiros/listagem/fornecedor`)
                .then(response => {
                    response.data.forEach((e) => auxParceiro.push(e))
                }).catch(error => {
                    console.log("Erro ao obter dados de parceiros: " + error)
                });

            dispatch({ type: 'simples', field: 'parceiros', value: auxParceiro })
        }
    }, [values.displayPopup]);

    const handleRegistrar = () => {
        let motivo = values.motivo;

        if (values.motivo == "") {
            motivo = "Não determinado";
        }

        if (values.motivo == "" && values.tipoItem == 'saida' && values.idParceiroEscolhido) {
            motivo = "Venda (Não determinado)";
        }

        console.log(values.tipoItem)

        if (values.tipoItem == 'saida') {
            values.itensParaRegistrar.forEach((item) =>
                api.post(`/saidas-estoque`, {
                    data: dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                    hora: dayjs().tz('America/Sao_Paulo').format('HH:mm:ss'),
                    qtdSaida: item.quantidadeNova,
                    motivoSaida: motivo,
                    responsavel: {
                        idFuncionario: sessionStorage.getItem('idFuncionario')
                    },
                    loteItemEstoque: {
                        idLoteItemEstoque: item.idLoteItemEstoque
                    },
                    costureira: values.idParceiroEscolhido != -1 ? values.idParceiroEscolhido : null
                }).catch(error => {
                    console.error("Erro ao regsitrar saída de itens:" + error)
                    return;
                })
            );
            dispatch({ type: 'registro', tipoItem: '', display: 'none' })
            dispatch({ type: 'alert', severity: 'success', title: 'Registro bem sucedido!', message: "Novo registro de saída concluído com sucesso!" });
            dispatch({ type: 'simples', field: 'triggerAtualizar', value: values.triggerAtualizar + 1 })
        } else if (values.tipoItem == 'entrada') {
            let lote = 0;
            api.post(`lotes`, {
                descricao: motivo,
                dataEntrada: dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss'),
                parceiro: values.idParceiroEscolhido,
                responsavel: sessionStorage.getItem('idFuncionario')
            }).then(response => {
                lote = response.data.idLote;
                values.itensParaRegistrar.forEach((item) => {
                    api.post(`/lotes-item-estoque`, {
                        qtdItem: item.quantidadeNova,
                        preco: item.preco,
                        itemEstoque: item.idItem,
                        lote: response.data.idLote
                    }).then(response =>
                        console.log(response)
                    ).catch(error => {
                        console.error("Erro ao registrar entrada de itens: " + error)
                        return;
                    })
                })
            }).catch((error) => {
                console.log("Erro ao criar lote: " + error);
                dispatch({ type: 'alert', severity: 'error', title: 'Ocorreu um erro!', message: "Ocorreu um erro!" });
                return;
            })
            dispatch({ type: 'registro', tipoItem: '', display: 'none' })
            dispatch({ type: 'alert', severity: 'success', title: 'Registro bem sucedido!', message: "Novo registro de entrada concluído com sucesso!" });
            dispatch({ type: 'simples', field: 'triggerAtualizar', value: values.triggerAtualizar + 1 })
        }
    };

    const obterDados = (endpoint, page, limit) => {
        return api.get(`/lotes-item-estoque/${endpoint}?page=${page}&limit=${limit}`)
    }

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
                                <div className={styles.boxButton}>
                                <Button sx={{height: '100%', p: 2}} variant="contained" onClick={() => navigate('/lotes')}>
                                    Visualizar Lotes
                                </Button>
                                </div>
                        </div>
                        <br />
                        <TabelaHistorico tipoMovimentacao={values.tipoMovimentacao} triggerAtualizar={values.triggerAtualizar} obter={obterDados} />
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
                                        {values.tipoItem == 'saida' && 
                                        <FormControl>
                                            <InputLabel id="labelFiltroLote">Filtrar Lote</InputLabel>
                                            <Select MenuProps={{ style: { maxHeight: 400} }} sx={{minWidth: 200}} labelId='labelFiltroLote' label="Filtrar Lote" value={values.loteEscolhido} onChange={(event) => dispatch({ type: 'simples', field: 'loteEscolhido', value: event.target.value })}>
                                                <MenuItem value={0}>Todos os Lotes</MenuItem>
                                                {values.lotesDisponiveis.map((lote) => (
                                                        <MenuItem value={lote}>{`Lote: ${lote} `}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>}
                                        <FormControl>
                                            <InputLabel id="labelItensDisponiveis">Selecione um ou mais itens</InputLabel>
                                            <Select MenuProps={{ style: { maxHeight: 400} }} sx={{minWidth: 200}} labelId='labelItensDisponiveis' label="Selecione um ou mais itens" value={values.auxSelectItensSaida} onChange={(event) => dispatch({ type: 'registro_add', value: event.target.value })}>
                                                <MenuItem value={0} disabled>Selecionar itens</MenuItem>
                                                <MenuItem value={-1} disabled>Confirme ou Selecione mais Itens</MenuItem>
                                                {values.itensDisponiveis.map((dadoItem) => (
                                                    values.tipoItem != 'saida' ? <MenuItem value={dadoItem}>{`${dadoItem.descricao}`}</MenuItem> :
                                                    values.loteEscolhido == dadoItem.idLote ? <MenuItem value={dadoItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem> 
                                                    : values.loteEscolhido == 0  ? <MenuItem value={dadoItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem> 
                                                    : "nada"
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel id="labelDestino">{values.tipoItem == 'saida' ? "Destino dos Itens" : "Origem dos itens"}</InputLabel>
                                            <Select MenuProps={{ style: { maxHeight: 400} }} labelId="labelDestino" label={values.tipoItem == 'saida' ? "Destino dos Itens" : "Origem dos itens"} value={values.idParceiroEscolhido} onChange={(event) => dispatch({ type: 'simples', field: 'idParceiroEscolhido', value: event.target.value })}>
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
                                                <TableCell>{values.tipoItem == 'saida' ? "Preço (Venda)" : "Custo (Despesa)"}</TableCell>
                                                <TableCell>Remover Item</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values.itensParaRegistrar.length == 0 ? 
                                                <TableRow key={'persona5'}>
                                                    <TableCell colSpan={7}>Comece inserindo um ou mais utens</TableCell>
                                                </TableRow>
                                            : values.tipoItem == 'saida' ? values.itensParaRegistrar.map((item) => (
                                                <TableRow key={item.idLoteItemEstoque}>
                                                    <TableCell>{item.idLote}</TableCell>
                                                    <TableCell>{item.nomeItem}</TableCell>
                                                    <TableCell>
                                                        <NumericFormat
                                                            value={item.quantidadeNova}
                                                            customInput={TextField}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: 'registro_update',
                                                                    value: item,
                                                                    newValue: e.target.value,
                                                                    field: 'quantidadeNova'
                                                                })
                                                            }
                                                            suffix={item.isRoupa ? ' unidade(s)' : ' gramas'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{item.isRoupa ? item.precoItem + " cada, " + Number(item.precoItem) * Number(item.quantidadeNova) + " total"
                                                        : "Não se aplica"
                                                    }</TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => dispatch({ type: 'registro_del', value: item })}>Remover Item</Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : values.itensParaRegistrar.map((item) => (
                                                <TableRow key={item.idItem}>
                                                    <TableCell><img src={item.urlImagem} className={styles.boxImagem} /></TableCell>
                                                    <TableCell>{item.descricao}</TableCell>
                                                    <TableCell>
                                                        <NumericFormat
                                                            value={item.quantidadeNova}
                                                            customInput={TextField}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: 'registro_update',
                                                                    value: item,
                                                                    newValue: e.target.value,
                                                                    field: 'quantidadeNova'
                                                                })

                                                            }
                                                            suffix={item.tipoItem == 'roupa' ? ' unidade(s)' : ' metro(s)'}

                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <NumericFormat
                                                            value={item.preco}
                                                            customInput={TextField}
                                                            onChange={(e) =>
                                                                dispatch({
                                                                    type: 'registro_update',
                                                                    value: item,
                                                                    newValue: e.target.value,
                                                                    field: 'preco'
                                                                })
                                                            }
                                                            suffix={item.tipoItem == 'roupa' ? ' por peça' : ' por metro'}

                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => dispatch({ type: 'registro_del', value: item })}>Remover Item</Button>
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
                                    label={values.tipoItem == 'saida' ? "Motivo de saída (opcional)" : "Descrição do lote (opcional)"}
                                    value={values.motivo}
                                    onChange={(event) => dispatch({ type: 'simples', field: 'motivo', value: event.target.value })}
                                    sx={{ width: '500px' }}
                                />
                                <Button
                                    onClick={() => handleRegistrar()}
                                    variant="contained"
                                    disabled={!isPostReady}
                                >Confirmar</Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}