import styles from "./pageselector.module.css"; 

export function PageSelector(props) {


    return (
        <div className={styles.card} style={{backgroundColor : props.ativo ? '#2D2D33' : '#EDFFFA', color : !props.ativo ? '#2D2D33' : '#EDFFFA'}}>
            {props.nomePagina}
        </div>
    )
}