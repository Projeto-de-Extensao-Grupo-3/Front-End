import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import styles  from './botao.module.css'

export function Botao(props) {
    return (
        <Box className={styles.box}>
            <Button fullWidth size="large" variant={props.tipo}>{props.texto}</Button>
        </Box>
    );
}