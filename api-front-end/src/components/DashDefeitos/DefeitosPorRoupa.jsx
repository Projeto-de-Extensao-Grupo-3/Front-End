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
            if (response.status == 204) {
                setDados([])
                return;
            }
            setDados(response.data)
        })
    }, [props.filters])

    return (

        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
                dados.length > 0
                    ? <TableContainer component={Paper} sx={{ maxHeight: 800, width: '70%' }}>
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
                    : <Paper sx={{ p: '40px'}} elevation={4}>Nenhum dado a ser exibido, tente mudar os filtros</Paper>
            }
        </div>
    )
}