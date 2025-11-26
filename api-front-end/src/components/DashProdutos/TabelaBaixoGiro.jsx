import { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from "@mui/material";
import { useState } from 'react';

export function TabelaBaixoGiro() {

    const [dados, setDados] = useState([]);

    const obterDadosTabela = useEffect(() => {
        const retorno = [
            {
                "produto": "Vestido azul florido",
                "total_vendido": 0.0,
                "qtd_vendas": 0,
                "estoque_atual": 0.0,
                "dias_sem_vender": "Nunca vendeu",
                "status_recomendacao": "CRÍTICO - Nunca vendeu"
            },
            {
                "produto": "Camisa vermelha lisa",
                "total_vendido": 0.0,
                "qtd_vendas": 0,
                "estoque_atual": 0.0,
                "dias_sem_vender": "Nunca vendeu",
                "status_recomendacao": "CRÍTICO - Nunca vendeu"
            },
            {
                "produto": "Bermuda cinza com listras vermelhas",
                "total_vendido": 0.0,
                "qtd_vendas": 0,
                "estoque_atual": 0.0,
                "dias_sem_vender": "Nunca vendeu",
                "status_recomendacao": "CRÍTICO - Nunca vendeu"
            },
            {
                "produto": "Tecido vermelho liso",
                "total_vendido": 0.0,
                "qtd_vendas": 0,
                "estoque_atual": 0.0,
                "dias_sem_vender": "Nunca vendeu",
                "status_recomendacao": "CRÍTICO - Nunca vendeu"
            },
            {
                "produto": "Tecido azul florido",
                "total_vendido": 0.0,
                "qtd_vendas": 0,
                "estoque_atual": 0.0,
                "dias_sem_vender": "Nunca vendeu",
                "status_recomendacao": "CRÍTICO - Nunca vendeu"
            }
        ]

        setDados(retorno)

    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
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
                            <TableCell >{data.total_vendido}</TableCell>
                            <TableCell>{data.qtd_vendas}</TableCell>
                            <TableCell>{data.estoque_atual}</TableCell>
                            <TableCell>{data.dias_sem_vender}</TableCell>
                            <TableCell>{data.status_recomendacao}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}