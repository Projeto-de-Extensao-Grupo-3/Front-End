import { Navbar } from "../../components/Navbar/Navbar"
import { Seletor } from "../../components/SeletorSubpagina/Seletor"

export function Categorias() {

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <Seletor esquerda="Categorias" direita="Características" escolhido={1} paginaUm = "/categorias" paginaDois = "/caracteristicas"/>
        </div>
    )
}