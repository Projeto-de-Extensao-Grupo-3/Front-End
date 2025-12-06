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
import { CriarNovaSenha } from "./Pages/RecuperacaoDeSenha/CriarNovaSenha.jsx";
import { ProtectedRoute } from "./components/protectRoute/ProtectRoute.jsx";
import { Erro } from "./Pages/Erro/Erro.jsx";
import { Lotes } from "./Pages/Lotes/Lotes.jsx";

export const routes = createBrowserRouter([

    // 🔓 Páginas livres (sem login)
    {
        path: "/",
        element: (
            <PaginaInicial />
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/esqueci-minha-senha",
        element: <EsqueciMinhaSenha />,
        errorElement: <div>Erro</div>
    },
    {
        path: "/criar-nova-senha",
        element: <CriarNovaSenha />,
        errorElement: <div>Erro</div>
    },
        // 🔒 Páginas bloqueadas
    {
        path: "/historico",
        element: (
            <ProtectedRoute>
                <Historico />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/estoque",
        element: (
            <ProtectedRoute>
                <Estoque />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/parceiros",
        element: (
            <ProtectedRoute>
                <Parceiros />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/perfil",
        element: (
            <ProtectedRoute>
                <Perfil />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/categorias",
        element: (
            <ProtectedRoute>
                <Categorias />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/caracteristicas",
        element: (
            <ProtectedRoute>
                <Caracteristicas />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/funcionarios",
        element: (
            <ProtectedRoute>
                <Funcionarios />
            </ProtectedRoute>
        ),
        errorElement: <div>Erro</div>
    },
    {
        path: "/prateleiras",
        element: (
            <ProtectedRoute>
                <Prateleiras />
            </ProtectedRoute>
        ),
        errorElement: <Erro />
    },
    {
        path: "/lotes",
        element: (
            <ProtectedRoute>
                <Lotes />
            </ProtectedRoute>
        ),
        errorElement: <Erro />
    }
]);
