import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./Pages/PaginaInicial/PaginaIncial";
import { Historico } from "./Pages/Historico/Historico";
import { Parceiros } from "./Pages/Parceiros/Parceiros";
import { Perfil } from "./Pages/Perfil/Perfil";
import { Categorias } from "./Pages/Categorias/Categorias";
import { Caracteristicas } from "./Pages/Caracteristicas/Caracteristicas";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { Funcionarios } from "./Pages/Funcionarios/Funcionarios";
import { Estoque } from "./Pages/Estoque/Estoque";
import { Prateleiras } from "./Pages/Prateleiras/Prateleiras.jsx";
import { EsqueciMinhaSenha } from "./Pages/RecuperacaoDeSenha/EsqueciMinhaSenha.jsx";

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
        path: "/estoque",
        element: <Estoque/>,
        errorElement: <div>Erro</div>
    },
    {
        path: "/parceiros",
        element: <Parceiros/>,
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
    },{
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <div>Erro</div>
    },
    {
        path: "/funcionarios",
        element: <Funcionarios/>,
        errorElement: <div>Erro</div>
    },{
        path: "/prateleiras",
        element: <Prateleiras />,
        errorElement: <div>Erro </div>
    },{
        path: "/esqueci-minha-senha",
        element: <EsqueciMinhaSenha />,
        errorElement: <div>Erro </div>
    }
]);