import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./caracteristicas.module.css"
import axios from 'axios';
import { useEffect, useState } from 'react';
import api from "../../provider/api"

export function Caracteristicas() {

  const [dadosTecido, setDadosTecido] = useState()
  const [dadosRoupa, setDadosRoupa] = useState()

    useEffect(() => {
        api.get("/categorias/tipo/tecido").then(
            response => {
                setDadosTecido(response.data)
            })

        api.get("/categorias/tipo/roupa").then(
            response => {
                setDadosRoupa(response.data)
            })
    // O Array vazio faz o useEffect ativas apenas ao renderizar pela primeira vez 
    }, [])

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <Seletor esquerda="Categorias" direita="Características" escolhido={2} paginaUm="/categorias" paginaDois="/caracteristicas" />
            <div className={styles.main}>
                <div className={styles.listCategorias}>
                    <Paper >
                        <List>
                            <ListItem key={0}>Roupas</ListItem>
                            {dadosRoupa.map((categoria)=>
                            <ListItem key={categoria.id}>
                                {categoria.nome}
                            </ListItem>
                        )}</List>
                    </Paper>
                </div>
                                <div className={styles.listCategorias}>
                    <Paper >
                        <List>{dadosTecido.map((categoria)=>
                            <ListItem key={categoria.id}>
                                {categoria.nome}
                            </ListItem>
                        )}</List>
                    </Paper>
                </div>
            </div>
        </div>
    )
}