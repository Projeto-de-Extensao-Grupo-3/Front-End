import { Navbar } from "../../components/Navbar/Navbar"
import styles from './lotes.module.css'
import { api } from '../../provider/api'

// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from "dayjs";

export function Lotes() {

    const [lotes, setLotes] = useState([])

    const obterDados = useEffect(() => {
        api.get('/lotes/lotesDetalhados').then((response) => {
            console.log("DADOS: ", response.data)
            if (response.status == 204) {
                setLotes([]);
                return;
            }
            setLotes(response.data);
        })
    }, [])

    return (
        <div>
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main}>
                <div className={styles.Accordion}>
                    <h2>Lotes</h2>
                    <br />
                    {
                        lotes.map((lote) => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel1-content"
                                    id="absu"
                                >
                                    Lote: {lote.idLote} | Motivo: {lote.motivo} | Data: {dayjs.tz(lote.dtLote, 'America/Sao_Paulo').format('HH:mm:ss DD/MM/YY')}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Imagem</TableCell>
                                                    <TableCell align="right">Item</TableCell>
                                                    <TableCell align="right">Quantidade de Entrada</TableCell>
                                                    <TableCell align="right">Quantidade que Saiu</TableCell>
                                                    <TableCell align="right">Quantidade Atual</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {lote.itens.map((item) => (
                                                    <TableRow key={item.nomeItem}>
                                                        <TableCell><img src="item.url" style={{height: '24px'}}/></TableCell>
                                                        <TableCell align="right">{item.nomeItem}</TableCell>
                                                        <TableCell align="right">{item.qtdEntrada}</TableCell>
                                                        <TableCell align="right">{item.qtdSaida}</TableCell>
                                                        <TableCell align="right">{item.qtdEntrada - item.qtdSaida}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}