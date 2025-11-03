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
        <Box>
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

export function Historico() {

    useEffect(() => {
        document.title = "Histórico"
    });

    const [tipoMovimentacao, setTipoMovimentacao] = useState(0);

    const handleTipoMovimentacao = (event) => {
        setTipoMovimentacao(event.target.value)
    };

    const [pagina, setPagina] = useState(0);
    const [entradasPorPagina, setEntradasPorPagina] = useState(9);

    const handleChangePage = (event, newPage) => {
        setPagina(newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setEntradasPorPagina(parseInt(event.target.value, 10))
        setPagina(0)
    };

    const [tuplas, setTuplas] = useState([]);
    const [tamanho, setTamanho] = useState(0);

    const obterDadosTabela = useEffect(() => {

        if (tipoMovimentacao == 0) {
            axios.get(`/api/lotes-item-estoque/paginado?page=${pagina}&limit=${entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => {
                        newTuplas.push(dados);
                    });
                    setTuplas(newTuplas);
                    setTamanho(response.data.totalRegistros);
                })
        } else {
            axios.get(`/api/lotes-item-estoque/paginadoSaida?page=${pagina}&limit=${entradasPorPagina}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => {
                        newTuplas.push(dados);
                    });
                    setTuplas(newTuplas);
                    setTamanho(response.data.totalRegistros);
                })
        }
    }, [entradasPorPagina, pagina, tipoMovimentacao]);


    const handleDisplayPopupChange = (d) => {
        setDiplayPopup(d);
    };

    const [displayPopup, setDiplayPopup] = useState("none");
    const [dadosItensSimples, setdadosItensSimples] = useState([]);
    const [itensParaRegistrar, setItensParaRegostrar] = useState([]);

    const obterDadosRegistrarEntrada = useEffect(() => {
        if (displayPopup == 'none') {
            setdadosItensSimples([]);
            return;
        }
        axios.get(`/api/itens-estoque/itensResumidos`)
            .then(response => {
                setdadosItensSimples(response.data);
            });
    }, [displayPopup]);

    const handleItem = (event) => {
        var aux = itensParaRegistrar;
        // Se for entrada de item
        if (displayPopup != 'none') {
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
        
        
        
        aux.length > 0 ? setAuxSelectItensSaida(-1) : setAuxSelectItensSaida(0)
    }

    const [displayPopupSaida, setDisplayPopupSaida] = useState("none");
    const [auxSelectItensSaida, setAuxSelectItensSaida] = useState(0);

    const handleDisplayPopupChangeSaida = (d) => {
        setDisplayPopupSaida(d);
    };

    const obterDadosRegistrarSaida = useEffect(() => {
        if (displayPopupSaida == 'none') {
            setdadosItensSimples([]);
            return;
        }
        axios.get(`/api/lotes/lotesEmEstoque`)
            .then(response => {
                setdadosItensSimples(response.data);
            });
    }, [displayPopupSaida]);

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
                            <Select value={tipoMovimentacao} onChange={(event) => handleTipoMovimentacao(event)} labelId="label-tipo-slct" label="Tipo">
                                <MenuItem value={1}>Saída</MenuItem>
                                <MenuItem value={0}>Entrada</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => handleDisplayPopupChange("flex")}>Registrar Entrada de Item</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => handleDisplayPopupChangeSaida("flex")}>Registrar Saída de Item</Button>
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
                                        <TableCell>{tipoMovimentacao == 0 ? "Origem" : "Destino"}</TableCell>
                                        <TableCell>Horário</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tuplas.map((tupla) => (
                                        <TableRow key={tupla.nomeItem + tupla.idLote}>
                                            <TableCell><img src={tupla.url} className={styles.boxImagem} /></TableCell>
                                            <TableCell>{tupla.nomeItem}</TableCell>
                                            <TableCell>{tupla.idLote}</TableCell>
                                            <TableCell>{tupla.qtdItem}</TableCell>
                                            <TableCell>{tupla.nomeParceiro}</TableCell>
                                            <TableCell>
                                                {tipoMovimentacao == 0 ? dayjs(tupla.dataEntrada).format('HH:mm:ss DD/MM/YY') : dayjs(tupla.saidaEstoque).format('HH:mm:ss DD/MM/YY')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            align="right"
                                            rowsPerPageOptions={[6, 9, 12]}
                                            count={tamanho}
                                            rowsPerPage={entradasPorPagina}
                                            page={pagina}
                                            slotProps={{
                                                select: {
                                                    inputProps: {
                                                        'aria-label': 'Entradas por Página',
                                                    },
                                                    // native: true,
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
                <div className={styles.popupRegistro} style={{ display: displayPopup }}>
                    <div className={styles.blackout} onClick={() => handleDisplayPopupChange("none")}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Movimentação</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <Select value={0} onChange={(event) => handleItem(event)}>
                                        <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                        {dadosItensSimples.map((dadoItem) => (
                                            <MenuItem value={dadoItem.id}>{dadoItem.descricao}</MenuItem>
                                        ))}
                                    </Select>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="contained">Adicionar Item</Button>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="outlined">Cancelar</Button>
                                </div>
                                <FormControl>
                                    <FormLabel id="id-entrada-saida">Itens para registro:</FormLabel>
                                </FormControl>
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={styles.popupRegistro} style={{ display: displayPopupSaida }}>
                    <div className={styles.blackout} onClick={() => handleDisplayPopupChangeSaida("none")}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Saída de Itens</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <Select value={auxSelectItensSaida} onChange={(event) => handleItem(event)}>
                                        <MenuItem value={0} disabled>Selecione um Item</MenuItem>
                                        <MenuItem value={-1} disabled>Confirme ou Selecione mais Itens</MenuItem>
                                        {dadosItensSimples.map((dadoItem) => (
                                            <MenuItem value={'' + dadoItem.idLote + dadoItem.idItem}>{`Lote: ${dadoItem.idLote} ${dadoItem.nomeItem} (${dadoItem.qtdItem})`}</MenuItem>
                                        ))}
                                    </Select>
                                    <Button onClick={() => handleDisplayPopupChangeSaida("none")} variant="contained">Adicionar Item</Button>
                                    <Button onClick={() => handleDisplayPopupChangeSaida("none")} variant="outlined">Cancelar</Button>
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