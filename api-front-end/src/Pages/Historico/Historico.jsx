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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const theme = createTheme(
    ptBR
)

export function Historico() {

    const [ItensSelecionados, SetItensSelecionados] = useState(2)

    const handleItensSelecionados = (e) => {
        SetItensSelecionados(e.target.value)
        console.log(ItensSelecionados)
    }

    useEffect(() => {
        document.title = "Histórico"
    })

    return (
        <div>
             <Navbar vazio = {false} pageNumber = {0}/>
             <div className={styles.main}>
                <div className={styles.barraFiltros}>
                    <div className={styles.bigBoxData}>
                        <LocalizationProvider 
                            localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
                            dateAdapter={AdapterDayjs} 
                            adapterLocale="en-gb"
                            >
                            <DemoContainer components={['DatePicker']}>
                                <div className={styles.boxData}>
                                    <DatePicker className={styles.data} label="Início" />   
                                    <DatePicker className={styles.data} label="Fim" />
                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className={styles.boxSelectItens}>
                        <InputLabel>
                            <Select value={ItensSelecionados} onChange={handleItensSelecionados}>
                                <MenuItem value={0}>Tecidos</MenuItem>
                                <MenuItem value={1}>Produtos</MenuItem>
                                <MenuItem selected value={2}>Ambos</MenuItem>
                            </Select>
                        </InputLabel>
                    </div>
                </div>
            </div>
        </div>
    )
}