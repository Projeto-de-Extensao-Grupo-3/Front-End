import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./Pages/PaginaInicial/PaginaIncial";
import { Historico } from "./Pages/Historico/Historico";
import { Fornecedores } from "./Pages/Fornecedores/Fornecedores";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <PaginaInicial/>,
        errorElement: <div>Erro</div>
    },
    {
        path: "/historico",
        element: <Historico/>,
        errorElement: <div>Erraaaaao</div>
    },
    {
        path: "/fornecedores",
        element: <Fornecedores/>,
        errorElement: <div>Erro</div>
    }
]);