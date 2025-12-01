import { Paper } from "@mui/material"
import { useRouteError } from "react-router-dom"

export function Erro() {
    let error = useRouteError();
    console.log(error)
    return (
        <div style={{width: '100%', height: '100%'}}>
            <Paper width='400' height='300' elevation='10'>Ocorreu um erro!</Paper>
        </div>
    )
}