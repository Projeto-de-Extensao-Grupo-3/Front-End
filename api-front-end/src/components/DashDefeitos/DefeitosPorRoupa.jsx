import { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from "@mui/material";
import { useState } from 'react';

export function DefeitosPorRoupa() {

    const [dados, setDados] = useState([]);

    const chamarApi = useEffect(() => {
        // Apos chamada de api, logica permanece similar
        const retorno = [{
            "produto": "Vestido azul florido",
            "qtd_defeitos": 9,
        }, {
            "produto": "Camisa vermelha lisa",
            "qtd_defeitos": 7,
        }, {
            "produto": "Bermuda cinza com listras vermelhas",
            "qtd_defeitos": 12,
        }, {
            "produto": "Vestido azul e preto",
            "qtd_defeitos": 1,
        }, {
            "produto": "Vestido branco e dourado",
            "qtd_defeitos": 2,
        }, {
            "produto": "Camiseta Estampa Florida",
            "qtd_defeitos": 4,
        }, {
            "produto": "Camiseta Branca sem Estampa",
            "qtd_defeitos": 5,
        }, {
            "produto": "Jeans Rasgado",
            "qtd_defeitos": 22,
        }, {
            "produto": "Jeans Baggy",
            "qtd_defeitos": 12,
        }, {
            "produto": "Saia Pregas bege",
            "qtd_defeitos": 19,
        },]
        let total_defeitos = 0;
        retorno.forEach(dado => total_defeitos+=dado.qtd_defeitos)

        retorno.forEach(dado => (dado.qtd_defeitos = dado.qtd_defeitos / total_defeitos * 100).toFixed())

        setDados(retorno)

    }, [])
    return (
        <TableContainer component={Paper} sx={{maxHeight : 400, width: '70%'}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Defeitos (comparado ao todo)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dados.map((data) => (
                        <TableRow key={data.produto}>
                            <TableCell>{data.produto}</TableCell>
                            <TableCell >{data.qtd_defeitos.toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}