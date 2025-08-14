import { useEffect, useState } from "react"
import styles from "./seletor.module.css"
import { useNavigate } from "react-router-dom"


export function Seletor(props) {

    // Variáveis necessárias:
    // escolhido = int (1 ou 2), escolhe qual lado será preenchido
    // paginaUm = caminho para redirecionar esquerda
    // paginaDois = caminho para redirecionar direita
    // esquerda = Nome exibido no lado esquerdo
    // direita = Nome exibido no lado direito

    const navigate = useNavigate();
    
    const [estiloUm, SetEstiloUm] = useState(styles.vazio)
    const [estiloDois, SetEstiloDois] = useState(styles.vazio)

    const handlePagina = (pagina) => {
        navigate(pagina)
    }

    useEffect(() =>{
        if (props.escolhido == 1) {
            SetEstiloUm(styles.cheio)
        } else if (props.escolhido == 2) {
            SetEstiloDois(styles.cheio)
    }})

    
    return (
        <div className={styles.container}>
            <div className={estiloUm} onClick={() => handlePagina(props.paginaUm)}>{props.esquerda}</div>    
            <div className={estiloDois} onClick={() => handlePagina(props.paginaDois)}>{props.direita}</div>    
        </div>
    )
}