import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./Pages/PaginaInicial/PaginaIncial";
import { Historico } from "./Pages/Historico/Historico";
import { Fornecedores } from "./Pages/Fornecedores/Fornecedores";
import { Perfil } from "./Pages/Perfil/Perfil";
import { Categorias } from "./Pages/Categorias/Categorias";
import { Caracteristicas } from "./Pages/Caracteristicas/Caracteristicas";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <PaginaInicial/>,
        errorElement: <div>Erro</div>
    },
    {
        path: "/historico",
        element: <Historico/>,
        errorElement: <div>Erro</div>
    },
    {
        path: "/fornecedores",
        element: <Fornecedores/>,
        errorElement: <div>Erro</div>
    },
     {
        path: "/perfil",
        element: <Perfil/>,
        errorElement: <div>Erro</div>
    },{
        path: "/categorias",
        element: <Categorias/>,
        errorElement: <div>Erro</div>
    },{
        path: "/caracteristicas",
        element: <Caracteristicas />,
        errorElement: <div>Erro</div>
    }
]);