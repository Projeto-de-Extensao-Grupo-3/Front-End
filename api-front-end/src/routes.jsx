import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./components/PaginaInicial/PaginaIncial";
import { Movimentacao } from "./components/MovimentacaoEstoque/Movimentacao";

export const routes = createBrowserRouter([
    {
        path: "",
        element: <PaginaInicial/>,
        errorElement: <div>Erro</div>
    },
    {
        path: "/historco",
        element: <Movimentacao/>,
        errorElement: <div>Erraaaaao</div>
    }
]);