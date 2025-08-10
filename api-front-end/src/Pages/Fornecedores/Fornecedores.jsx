import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { Navbar } from "../../components/Navbar/Navbar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from "./fornecedores.module.css"

// Ainda não tem interação, preciso validar a aparência com o Giorgio
export function Fornecedores() {
    
    return(
        <div>
            <Navbar vazio={false} pageNumber={4}/>
            <div className={styles.main}>
                <div className={styles.opcoes}>
                    <div className={styles.btn_selected}>Costureiras</div>
                    <div className={styles.btn}>Fornecedores de Tecido</div>
                </div>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <TextField fullWidth label="Buscar Costureira"/>
                    </div>
                    <Button variant="outlined" size="large" sx={
                        {p:"1rem 6rem 1rem 6rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                    }>Cadastrar Nova Costureira</Button>
                </div>
                <BarraVisualizacao />
                <BarraVisualizacao />
                <BarraVisualizacao />
            </div>
        </div>
    )
}