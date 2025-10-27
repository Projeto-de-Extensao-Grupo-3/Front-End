import { useEffect, useState } from "react"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./historico.module.css"

// código baseado de: https://mui.com/x/react-date-pickers/date-picker/
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

import api from "../../provider/api"

const theme = createTheme(
    ptBR
)

    // =========== //
    //  Lógica MUI //
    // =========== //

function PaginarTabela(props) {

    const theme = useTheme()

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
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

    // ============ //
    //    Reducer   //
    // ============ //

function reducer(state, action) {

    switch (action.type) {
        case 'alterar_atributo': {
            return {
                ...state,
                [action.field]: action.value
            }
        }
        default: throw new Error("Erro no reducer!");
    }
}

    // ============== //
    //   Export Fun   //
    // ============== // 

export function Historico() {

    useEffect(() => {
        document.title = "Histórico"
    })


    // =========== //
    // Use Reducer //
    // =========== // 

    const initialState = {

        // Itens relevantes para filtros
        dtInicio: dayjs().subtract(30, 'days'),
        dtFim: dayjs(),
        itensSelecionados: 2,
        tipoMovimentacao: 1,

        // Ocultar popup de registrar movimentação
        displayPopup: "none"
    }

    const [values, dispatch] = useReducer(reducer, initialState);

    // ========= //
    // Paginação //
    // ========= //

    const [pagina, setPagina] = useState(0)
    const [entradasPorPagina, setEntradasPorPagina] = useState(9)

    const handleChangePage = (event, newPage) => {
        setPagina(newPage)
        // Por algum motivo, utilizando os hooks o valor anterior é obtido (??)
        atualizarDadosTabela(newPage, entradasPorPagina)
    }

    const handleChangeRowsPerPage = (event) => {
        setEntradasPorPagina(parseInt(event.target.value, 10))
        setPagina(0)
        atualizarDadosTabela(0, parseInt(event.target.value, 10))
    }
    
    // ==================== //
    //  Bucar Dados Tabela  //
    // ==================== //

    const [tuplas, setTuplas] = useState([]);
    const [tamanho, setTamanho] = useState(0);

    const buscarDadosTabela = useEffect(() => {
        atualizarDadosTabela(pagina, entradasPorPagina)
    }, [])

    const atualizarDadosTabela = (p, l) => {
        if (values.tipoMovimentacao == 1) {
            api.get(`/lotes-item-estoque/paginado?page=${p}&limit=${l}`)
                .then(response => {
                    let newTuplas = [];
                    response.data.conteudo.forEach(dados => {
                        newTuplas.push(dados);
                    });
                    setTuplas(newTuplas);
                    setTamanho(response.data.totalRegistros);
                })
        }
    }

            // TDB
    // ====================== //
    // Registrar Movimentação //
    // ====================== //

    const [displayPopup, setDiplayPopup] = useState("none");

    const handleDisplayPopupChange = (d) => {
        setDiplayPopup(d)
    }

    const registrarMovimentacao = () => {
        return null;
    }


    return (
        <div >
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} >
                <div className={styles.barraFiltros}>
                    <div className={styles.boxSelect}>
                        <FormControl >
                            <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                            <Select value={values.tipoMovimentacao} onChange={(newValue) => dispatch({ type: 'alterar_atributo', field: 'tipoMovimentacao', value: newValue.target.value })} labelId="label-tipo-slct" label="Tipo">
                                <MenuItem value={1}>Saída</MenuItem>
                                <MenuItem value={0}>Entrada</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained" onClick={() => handleDisplayPopupChange("flex")}>Registrar Entrada de Item</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained">Registrar Saída de Item</Button>
                    </div>
                    {/* <div className={styles.boxButton}>
                        <Button className={styles.button} variant="contained">Alterar Movimentação</Button>
                    </div> */}
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
                                        <TableCell>Destino</TableCell>
                                        <TableCell>Horário</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tuplas.map((tupla) => (
                                        <TableRow key={tupla.nomeItem + tupla.idLote}>
                                            <TableCell>
                                                <img src={tupla.url} className={styles.boxImagem}/>
                                            </TableCell>
                                            <TableCell>
                                                {tupla.nomeItem}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.idLote}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.qtdItem}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.nomeParceiro}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.dataEntrada}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            align="right"
                                            rowsPerPageOptions={[6, 9, 12]}
                                            count={tamanho} // select count aqui?
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
                                            ActionsComponent={TablePaginationActions}
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
                                    <TextField label="Buscar Item" style={{ width: "60%" }}></TextField>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="outlined">Cancelar</Button>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="contained">Registrar</Button>
                                    <FormControl>
                                        <FormLabel id="id-entrada-saida">Sentido Movimentação</FormLabel>
                                        <RadioGroup defaultValue="entrada" aria-labelledby="id-entrada-saida">
                                            <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                                            <FormControlLabel value="saida" control={<Radio />} label="Saída" />
                                        </RadioGroup>

                                    </FormControl>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}