import * as React from "react";
import styles from "./filtro.module.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

export function Filtro() {
    // Responsividade: usa Box do MUI para adaptar o layout
    return (
        <Box sx={{
            width: { xs: '100%', sm: 320 },
            minWidth: 0,
            p: 2,
            borderRight: { sm: '1px solid #000000a2' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: '#fff',
        }}>
            <h1>Filtrar</h1>
            <h2>Todos</h2>
            <h3 className={styles.noBold}>Janela dos registros:</h3>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                width: '100%',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            }}>
                <TextField
                    label="Início"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ flex: 1, minWidth: 0 }}
                />
                <TextField
                    label="Fim"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Box>

            <h2>Gráfico de Barras</h2>
            <h3 className={styles.noBold}>Mostrar: 7 roupas</h3>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel id="mostrar-label">Mostrar</InputLabel>
                <Select
                    labelId="mostrar-label"
                    id="mostrar"
                    label="Mostrar"
                    defaultValue={"7"}
                >
                    <MenuItem value={"7"}>Mais Vendidos</MenuItem>
                </Select>
            </FormControl>

            <h2>Gráfico de Linhas</h2>
            <FormControl fullWidth size="small">
                <InputLabel id="considerar-label">Considerar</InputLabel>
                <Select
                    labelId="considerar-label"
                    id="considerar"
                    label="Considerar"
                    defaultValue={"7"}
                >
                    <MenuItem value={"7"}>Todas as Roupas</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}