import { useNavigate } from "react-router-dom"
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Tabs } from '@mui/material';
import * as React from 'react';

export function Seletor(props) {

    // Variáveis necessárias:
    // escolhido = int (1 ou 2), escolhe qual lado será preenchido
    // paginaUm = caminho para redirecionar esquerda
    // paginaDois = caminho para redirecionar direita
    // esquerda = Nome exibido no lado esquerdo
    // direita = Nome exibido no lado direito

    const navigate = useNavigate();

    const [value, setValue] = React.useState(props.valor);



    const handleChange = (event, newValue) => {

        if (newValue == props.paginaUm) {
            setValue(props.paginaUm)
            setTimeout(()=>{ navigate(props.rotaPaginaUm)}, 300)
            // navigate(props.rotaPaginaUm)
            return null
        } else {
            setValue(props.paginaDois)
            setTimeout(()=> navigate(props.rotaPaginaDois), 300)
            // navigate(props.rotaPaginaDois)
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} variant='fullWidth'
                    sx={{ ".Mui-selected": { color: 'white !important', backgroundColor: '#2D2D33' } }}>
                    <Tab sx={{ height: '5rem', fontSize: '1.2em' }} label={props.paginaUm} value={props.paginaUm} />
                    <Tab sx={{ height: '5rem', fontSize: '1.2em' }} label={props.paginaDois} value={props.paginaDois} />
                </Tabs>
            </Box>
        </Box>
    )
}