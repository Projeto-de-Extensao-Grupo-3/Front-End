import { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from "@mui/material";
import { useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from "@mui/material";

export function TabelaBaixoGiro(props) {

    const matches = useMediaQuery('(min-width: 600px)')
    const [dados, setDados] = useState([]);

    const obterDadosTabela = useEffect(() => {
        axios.get("/api/itens-estoque/produtos-giro-baixo", {
            params: props.filters
        }).then((response) => {
            setDados(response.data)
        })

    }, [props.filters]);

    return (<div>
        {
            dados.length > 0
                ?
                <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%' }}>
                    <Table>
                        <TableHead>
                            <TableRow >
                                <TableCell>Produto</TableCell>
                                <TableCell>Total Vendido</TableCell>
                                <TableCell>Quantidade de Vendas</TableCell>
                                <TableCell>Estoque Atual</TableCell>
                                <TableCell>Dias sem Vender</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dados.map((data) => (
                                <TableRow key={data.produto}>
                                    <TableCell>{data.produto}</TableCell>
                                    <TableCell >{data.totalVendido}</TableCell>
                                    <TableCell>{data.quantidadeVendas}</TableCell>
                                    <TableCell>{data.estoqueAtual}</TableCell>
                                    <TableCell>{data.diasSemVender}</TableCell>
                                    <TableCell>{data.statusRecomendacao}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Paper sx={{ p: '40px' }} elevation={4}>Nenhum dado a ser exibido, tente mudar os filtros</Paper>
        }
    </div>
    )
}