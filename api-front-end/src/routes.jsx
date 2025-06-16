import { createBrowserRouter } from "react-router-dom";
import { PaginaInicial } from "./components/PaginaInicial/PaginaIncial";

export const routes = createBrowserRouter([
    {
        path: "/index",
        element: <PaginaInicial/>,
        errorElement: <div>Erro</div>
    }
]);