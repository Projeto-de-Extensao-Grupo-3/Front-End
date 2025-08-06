import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./components/PaginaInicial/PaginaIncial";
import { Historico } from "./components/Historico/Historico";

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
    }
]);