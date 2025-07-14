import { Navbar } from "../Navbar/Navbar"
import styles from "./pagina-inicial.module.css"
import { CaixaTexto } from "../MaterialUI/caixaTexto/caixaTexto"
import { Botao } from "../MaterialUI/botao/botao"

export function PaginaInicial(){
    return(
        <div className={styles.base}>
            <Navbar/>
            <div className={styles.content}>
                <div className={styles.box}>
                    <span className={styles.indicator}>Insira seu dados para entrar no sistema</span>
                    <CaixaTexto texto={"Cpf"}/>
                    <CaixaTexto texto={"Senha"} tipo={"password"}/>
                    <div className={styles.divBotao}>
                        <Botao tipo="contained" texto="Entrar"></Botao>
                    </div>
                    <div className={styles.divBotao}>
                        <Botao tipo="contained" texto="Registro Rápido"></Botao>
                    </div>
                    <div className={styles.divBotao}>
                        <Botao tipo="text" texto="Como entrar?"></Botao>
                    </div>
                </div>
            </div>
        </div>
    )
}