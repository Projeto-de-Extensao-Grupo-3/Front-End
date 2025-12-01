import { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, TablePaginationActions } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import styles from "./tabela.module.css"
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';
import { useState } from 'react';
import axios from 'axios';
import { api } from "../../provider/api";



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

// PaginarTabela.propTypes = {
//     count: PropTypes.number.isRequired,
//     onPageChange: PropTypes.func.isRequired,
//     page: PropTypes.number.isRequired,
//     rowsPerPage: PropTypes.number.isRequired,
// };

export function TabelaHistorico(props) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9)
    const [tableData, setTableData] = useState([])
    const [tableSize, setTableSize] = useState(0)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0)
    }

    const obterDadosTabela = useEffect(() => {
        let endpoint = 'paginado'
        if (props.tipoMovimentacao == 1) { 
            endpoint = 'paginadoSaida'
        }
        api.get(`/lotes-item-estoque/${endpoint}?page=${page}&limit=${rowsPerPage}`)
            .then((response) => {
                setTableData(response.data.conteudo)
                setTableSize(response.data.totalRegistros)
                console.log(response.data.conteudo)
            }).catch((error) => {
                console.error(`Erro ao obter os dados de ${props.tipoMovimentacao}: ` + error)
            });
    }, [rowsPerPage, page, props.tipoMovimentacao, props.triggerAtualizar]);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imagem</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Nome do Item</TableCell>
                            <TableCell>Lote</TableCell>
                            <TableCell>{props.tipoMovimentacao == 0 ? "Origem" : "Destino"}</TableCell>
                            <TableCell>Horário</TableCell>
                            {/* <TableCell>Motivo</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((data) => (
                            <TableRow key={data.nomeItem + data.idLote + tableData.indexOf(data)}>
                                <TableCell><img src={data.url} className={styles.boxImagem} /></TableCell>
                                <TableCell >{data.qtdItem}</TableCell>
                                <TableCell>{data.nomeItem}</TableCell>
                                <TableCell>{data.idLote}</TableCell>
                                <TableCell>{data.nomeParceiro}</TableCell>
                                <TableCell>
                                    {props.tipoMovimentacao == 0 ? dayjs(data.dataEntrada).format('HH:mm:ss DD/MM/YY') : dayjs(data.saidaEstoque).format('HH:mm:ss DD/MM/YY')}
                                </TableCell>
                                {/* <TableCell>{data.motivo}</TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                align="right" rowsPerPageOptions={[6, 9, 12]} colSpan={6}
                                count={tableSize} rowsPerPage={rowsPerPage} page={page}
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
    )
}