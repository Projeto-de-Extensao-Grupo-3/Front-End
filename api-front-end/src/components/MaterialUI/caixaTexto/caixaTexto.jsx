import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import styles  from './caixa-texto.module.css'


export function CaixaTexto(props) {
    return (
        <Box className={styles.box}>
            <TextField fullWidth label={props.texto} variant='outlined' type={props.tipo}/>
        </Box>
    )
}