import styles from "./filtro.module.css"

export function Filtro() {
    return(
        <div>
            <div className={styles.filtroContent}>
                <h1>Filtrar</h1>
                <h2>Todos</h2>
                <h3 className={styles.noBold}>Janela dos registros:</h3>
                <div className={styles.janelaRegistros}>
                    <div>
                        <label htmlFor="inicio">Início</label>
                        <input className={styles.inputData} type="date" name="inicio" id="inicio" />
                    </div>
                    <div>
                        <label htmlFor="fim">Fim</label>
                        <input className={styles.inputData} type="date" name="fim" id="fim" />
                    </div>
                </div>

                <h2>Gráfico de Barras</h2>
                <h3 className={styles.noBold}>Mostrar: 7 roupas</h3>

                <div>
                    <label className={styles.labelData}>Mostrar:</label>
                    <select className={styles.inputData} name="mostrar" id="mostrar">
                        <option value="7">Mais Vendidos</option>
                    </select>
                </div>

                <h2>Gráfico de Linhas</h2>
                <div>
                    <label className={styles.labelData}>Considerar:</label>
                    <select className={styles.inputData} name="mostrar" id="mostrar">
                        <option value="7">Todas as Roupas</option>
                    </select>
                </div>
            </div>
        </div>
    )
}