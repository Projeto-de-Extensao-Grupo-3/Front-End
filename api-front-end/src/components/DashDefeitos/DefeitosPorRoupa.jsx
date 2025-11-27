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

export function DefeitosPorRoupa(props) {

    const [dados, setDados] = useState([]);

    const chamarApi = useEffect(() => {
        axios.get('/api/itens-estoque/defeitos-por-roupa', {
            params: props.filters
        }).then((response) => {
            setDados(response.data)
        })
    }, [])

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 800, width: '70%' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Defeitos %</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dados.map((data) => (
                        <TableRow key={data.roupa}>
                            <TableCell>{data.roupa}</TableCell>
                            <TableCell >{data.taxaDefeitoPercentual.toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}