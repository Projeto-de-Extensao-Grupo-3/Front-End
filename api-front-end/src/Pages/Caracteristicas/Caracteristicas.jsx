import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor";
import { Paper } from '@mui/material';
import styles from "./caracteristicas.module.css"
import axios from 'axios';
import { useEffect } from 'react';

export function Caracteristicas() {

    const resposta = [
  {
    "id": 1,
    "nome": "Tecido"
  },
  {
    "id": 2,
    "nome": "Roupa"
  },
  {
    "id": 3,
    "nome": "Nylon"
  },
  {
    "id": 4,
    "nome": "Poliéster"
  },
  {
    "id": 5,
    "nome": "Algodão"
  }]

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <Seletor esquerda="Categorias" direita="Características" escolhido={2} paginaUm="/categorias" paginaDois="/caracteristicas" />
            <div className={styles.main}>
                <div className={styles.listCategorias}>
                    <Paper >
                        <List>{resposta.map((categoria)=>
                            <ListItem>
                                {categoria.nome}
                            </ListItem>
                        )}</List>
                    </Paper>
                </div>
                                <div className={styles.listCategorias}>
                    <Paper >
                        <List>{resposta.map((categoria)=>
                            <ListItem>
                                {categoria.nome}
                            </ListItem>
                        )}</List>
                    </Paper>
                </div>
            </div>
        </div>
    )
}