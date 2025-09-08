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

const theme = createTheme(
    ptBR
)

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

function criarTupla(img, nome, idLote, tipo, quantidade, preco, destino, dtHora) {
    return { img, nome, idLote, tipo, quantidade, preco, destino, dtHora }
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export function Historico() {

    useEffect(() => {
        document.title = "Histórico"
    })

    // 30 dias atrás
    const [DtInicio, SetDtInicio] = useState(dayjs().subtract(30, 'days'))
    // Hoje
    const [DtFim, SetDtFim] = useState(dayjs())

    // Ambos
    const [ItemSelecionado, SetItemSelecionado] = useState(2)

    const handleItemSelecionado = (e) => {
        SetItemSelecionado(e.target.value)
    }

    // Ambos
    const [tipoMocimentacao, SetTipoMovimentacao] = useState(2)

    const handleTipoMovimentacao = (e) => {
        SetTipoMovimentacao(e.target.value)
    }

    const [displayBarraFiltros, SetDisplayBarraFiltros] = useState("none")

    const handleDisplayBarraFiltros = () => {
        if (displayBarraFiltros == "flex") {
            SetDisplayBarraFiltros("none")
        } else {
            SetDisplayBarraFiltros("flex")
        }
    }

    const [pagina, setPagina] = useState(0)
    const [entradasPorPagina, setEntradasPorPagina] = useState(9)
    const [tuplas, setTuplas] = useState([])

    const handleChangePage = (event, newPage) => {
        setPagina(newPage)
    }

    const buscarDadosTabela = useEffect(() => {
        // Eventualemente lógica sinistra do back aqui
        setTuplas([
            criarTupla("img", "Camisa Amarela treino", 6, "Entrada", 10, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Vestido Azul Listrado", 6, "Entrada", 8, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Algodão Preto", 6, "Entrada", 2000, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Algodão Listrado Azul", 5, "Entrada", 1400, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Nylon Preto", 5, "Entrada", 1347, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Nylon Amarelo", 1, "Entrada", 1308, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Top Amarelo Acad", 1, "Entrada", 20, 90.0, "Armazém", "dthora"),
            criarTupla("img", "55% Algodão 45% Nylon Verde Musgo", 1, "Entrada", 500, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Saia Longa Verde", 1, "Entrada", 13, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Nylon Preto", 1, "Entrada", 9, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Shorts Jeans Curto", 1, "Entrada", 13, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Calça Jeans Baggy", 1, "Entrada", 10, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Jeans Simples", 1, "Entrada", 12, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Algodão Amarelo Florido", 1, "Entrada", 1032, 90.0, "Armazém", "dthora"),
            criarTupla("img", "Algodão Azul Listrado", 1, "Entrada", 2039, 90.0, "Armazém", "dthora")
        ])
    }, [])

    const handleChangeRowsPerPage = (event) => {
        setEntradasPorPagina(parseInt(event.target.value, 10))
        setPagina(0)
    }

    const registrarMovimentacao = () => {
        return null;
    }

    const [displayPopup, setDiplayPopup] = useState("none");

    const handleDisplayPopupChange = (d) => {
        setDiplayPopup(d)

    }

    return (
        <div >

            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} >
                <div className={styles.barraFiltros} style={{ display: displayBarraFiltros }}>
                    <div className={styles.bigBoxData} >
                        <LocalizationProvider
                            localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
                            dateAdapter={AdapterDayjs}
                            adapterLocale="en-gb"
                        >
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <div className={styles.boxData}>
                                    <DatePicker
                                        className={styles.data}
                                        label="Início"
                                        value={DtInicio}
                                        onChange={(newValue) => SetDtInicio(newValue)}
                                    />
                                    <DatePicker
                                        className={styles.data}
                                        label="Fim"
                                        value={DtFim}
                                        onChange={(newValue) => SetDtFim(newValue)}
                                    />
                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className={styles.boxSelect}>
                        <FormControl>
                            <InputLabel id="label-categoria-slct">Categoria</InputLabel>
                            <Select value={ItemSelecionado} onChange={handleItemSelecionado} labelid="label-categoria-slct" label="Categoria">
                                <MenuItem value={0}>Tecidos</MenuItem>
                                <MenuItem value={1}>Produtos</MenuItem>
                                <MenuItem selected value={2}>Ambos</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxSelect}>
                        <FormControl >
                            <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                            <Select value={tipoMocimentacao} onChange={handleTipoMovimentacao} labelId="label-tipo-slct" label="Tipo">
                                <MenuItem value={1}>Saída</MenuItem>
                                <MenuItem value={0}>Entrada</MenuItem>
                                <MenuItem selected value={2}>Ambos</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxSelect}>
                        <FormControl fullWidth>
                            <InputLabel id="label-item-slct">Itens</InputLabel>
                            <Select value={-1} className={styles.selectCampo} labelId="label-item-slct" label="Itens">
                                {/* Aqui posteriormente terá uma lógica para os filtros. Agora está estático para propósito de demonstração e desenvolvimento */}
                                <MenuItem value={-1}>Todos</MenuItem>
                                <MenuItem value={0}>Algodão azul</MenuItem>
                                <MenuItem value={1}>Jeans marrom</MenuItem>
                                <MenuItem value={2}>Cropped Rosa Salmão</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxSelect}>
                        <FormControl fullWidth>
                            <InputLabel id="label-destino-slct">Destino</InputLabel>
                            <Select value={-1} className={styles.selectCampo} labelId="label-destino-slct" label="Destino">
                                <MenuItem value={-1}>Todos</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxSelect}>
                        <FormControl fullWidth>
                            <InputLabel id="label-lote-slct">Lote</InputLabel>
                            <Select value={-1} className={styles.selectCampo} labelId="label-lote-slct" label="lote">
                                <MenuItem value={-1}>Todos</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.boxConfirmarFiltros}>
                        <Button variant="contained" style={{ height: "80%" }}>Aplicar Filtros</Button>
                    </div>
                </div>
                <div className={styles.barraAcoes}>
                    <div className={styles.boxButton}>
                        <Button onClick={() => handleDisplayBarraFiltros()} variant="outlined">Ver Filtros</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button variant="contained" onClick={() => handleDisplayPopupChange("flex")}>Registrar Movimentação</Button>
                    </div>
                    <div className={styles.boxButton}>
                        <Button variant="contained">Alterar Movimentação</Button>
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
                                        <TableCell>Movimento</TableCell>
                                        <TableCell>Preço</TableCell>
                                        <TableCell>Destino</TableCell>
                                        <TableCell>Horário</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(entradasPorPagina > 0
                                        ? tuplas.slice(pagina * entradasPorPagina, pagina * entradasPorPagina + entradasPorPagina)
                                        : tuplas
                                    ).map((tupla) => (
                                        <TableRow key={tupla.nome}
                                        // key terá que ser diferente dps, para ser única
                                        >
                                            <TableCell>
                                                {tupla.img}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.nome}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.idLote}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.tipo}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.quantidade}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.preco}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.destino}
                                            </TableCell>
                                            <TableCell>
                                                {tupla.dtHora}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            align="right"
                                            rowsPerPageOptions={[6, 9, 12, { label: 'Todas', value: -1 }]}
                                            colSpan={8}

                                            // Aqui vai ficar um select count eventualmente, devido a lógica
                                            // de paginação
                                            count={tuplas.length}
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
                {/* Popups */}
                <div className={styles.popupRegistro} style={{ display: displayPopup }}>
                    <div className={styles.blackout} onClick={() => handleDisplayPopupChange("none")}>
                        <Paper className={styles.popupWindow} onClick={(e) => e.stopPropagation()}>
                            <h2 className={styles.tituloPopup}>Registrar Movimentação</h2>
                            <div>
                                <div className={styles.barraPopup}>
                                    <TextField label="Buscar Item" style={{width:"60%"}}></TextField>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="contained">Cancelar</Button>
                                    <Button onClick={() => handleDisplayPopupChange("none")} variant="contained">Registrar</Button>
                                    {/* <FormControl>
                                        <FormLabel id="id-entrada-saida">Sentido Movimentação</FormLabel>
                                        <RadioGroup defaultValue="entrada" aria-labelledby="id-entrada-saida">
                                            <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                                            <FormControlLabel value="saida" control={<Radio />} label="Saída" />
                                        </RadioGroup>
                                    </FormControl> */}
                                </div>
                                <div></div>
                            </div>
                            <div>

                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}