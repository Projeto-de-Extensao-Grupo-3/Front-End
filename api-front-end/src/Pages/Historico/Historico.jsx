import { useEffect, useState } from "react"
import { Navbar } from "../../components/Navbar/Navbar"
import styles from "./historico.module.css"

// código baseado de: https://mui.com/x/react-date-pickers/date-picker/
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Limpar localização após conversa com duarte
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ptBR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/en-gb';

// Select baseado em: https://mui.com/material-ui/react-select/
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";

import Button from '@mui/material/Button';
import { Height } from "@mui/icons-material";

const theme = createTheme(
    ptBR
)

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

    const [displayBarraFiltros, SetDisplayBarraFiltros] = useState("flex")

    const handleDisplayBarraFiltros = () => {
        if (displayBarraFiltros == "flex") {
            SetDisplayBarraFiltros
        }
    }

    return (
        <div>
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main} style={{display:displayBarraFiltros}}>
                <div className={styles.barraFiltros}>
                    <div className={styles.bigBoxData}>
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
                    <Button onClick={()=> handleDisplayBarraFiltros()} variant="contained">Ver Filtros</Button>
                </div>
            </div>
        </div>
    )
}