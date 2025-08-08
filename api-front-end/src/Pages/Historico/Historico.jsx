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

const theme = createTheme(
    ptBR
)

export function Historico() {

    const [ItemSelecionado, SetItemSelecionado] = useState(2)

    // 30 dias atrás
    const [DtInicio, SetDtInicio] = useState(dayjs().subtract(30, 'days'))
    // Hoje
    const [DtFim, SetDtFim] = useState(dayjs())

    const [BoolMostrarEntrada, SetBoolMostrarEntrada] = useState(true)

    // console.log(DtInicio)

    const handleItemSelecionado = (e) => {
        SetItemSelecionado(e.target.value)
    }

    useEffect(() => {
        document.title = "Histórico"
    })

    return (
        <div>
            <Navbar vazio={false} pageNumber={0} />
            <div className={styles.main}>
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
                    <div className={styles.boxSelectItens}>
                        <Select value={ItemSelecionado} onChange={handleItemSelecionado}>
                            <MenuItem value={0}>Tecidos</MenuItem>
                            <MenuItem value={1}>Produtos</MenuItem>
                            <MenuItem selected value={2}>Ambos</MenuItem>
                        </Select>
                    </div>
                    <div className={styles.boxSelectCamposFiltros}>
                        <FormControl fullWidth>
                            <InputLabel id="label-main-slct">Filtrar por campo</InputLabel>
                                <Select labelId="label-main-slct" label="Filtrar por Campo" value={""}>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-item-slct">Item</InputLabel>
                                            <Select value={""} className={styles.selectCampo} labelId="label-item-slct" label="Item">
                                                {/* Aqui posteriormente terá uma lógica para os filtros. Agora está estático para propósito de demonstração e desenvolvimento */}
                                                <MenuItem value={0}>Algodão azul</MenuItem>
                                                <MenuItem value={1}>Jeans marrom</MenuItem>
                                                <MenuItem value={2}>Cropped Rosa Salmão</MenuItem>
                                            </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-tipo-slct">Tipo</InputLabel>
                                            <Select value={""} className={styles.selectCampo} labelId="label-tipo-slct" label="Tipo">
                                                <MenuItem value={0}>Entrada</MenuItem>
                                                <MenuItem value={1}>Saída</MenuItem>
                                            </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-destino-slct">Destino</InputLabel>
                                            <Select value={""} className={styles.selectCampo} labelId="label-destino-slct" label="Destino">
                                            </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-responsavel-slct">Responsável</InputLabel>
                                            <Select value={""} className={styles.selectCampo} labelId="label-responsavel-slct" label="Responsável">
                                            </Select>
                                    </FormControl>
                                </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
        </div>
    )
}