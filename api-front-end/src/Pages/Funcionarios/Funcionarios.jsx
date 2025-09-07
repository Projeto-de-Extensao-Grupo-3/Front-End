import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import Button from '@mui/material/Button';
import styles from "../Parceiros/parceiros.module.css"
import axios from "axios";

export function Funcionarios() {
    const [data, setData] = useState([]);
    const [permissoes, setPermissoes] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const listarFuncionarios = () => {
        axios.get(`http://localhost:8080/funcionarios`)
        .then(response => {
            console.log(response.data);
            setData(response.data.reverse());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const listarPermissoes = () => {
        axios.get(`http://localhost:8080/permissoes`)
        .then(response => {
            console.log(response.data);
            // Remover id apenas para teste, necessário adição de id em DTO do back-end
            let listaPermissoes = response.data.map((permissao) => permissao.descricao);
            // for (let i = 0; i < response.data.length; i++) {
            //     listaPermissoes.push(response.data[i].descricao);
            // }
            setPermissoes(listaPermissoes);
            // setPermissoes(response.data.reverse());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const buscarFuncionario = (nome) => {
        axios.get(`http://localhost:8080/funcionarios/busca?nome=${nome}`)
        .then(response => {
            console.log(response.data);
            if (response.data.length === 0) {
                setData([])
                setLoadMsg("Nenhum dado encontrado");
            } else {
                setData(response.data.reverse());
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const cadastrarFuncionario = (dados) => {
        axios.post(`http://localhost:8080/funcionarios`, 
            {
                "nome": dados[2][1],
                "cpf": dados[3],
                "telefone": dados[4][1],
                "email": dados[5][1],
                "senha": dados[6][1]
            }
        )
        .then(response => {
            console.log(response.data);
            setOperations(operations+1);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const atualizarFuncionario = (dados) => {
        axios.put(`http://localhost:8080/funcionarios/${dados[0][1]}`, 
            {
                "nome": dados[2][1],
                "cpf": dados[3],
                "telefone": dados[4][1],
                "email": dados[5][1],
                "senha": dados[6][1]
            }
        )
        .then(response => {
            console.log(response.data);
            setOperations(operations+1);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        listarFuncionarios();
        listarPermissoes();
        setLoadMsg("Carregando dados...");
    }, [operations]);

    return(
        <div>
            <Navbar vazio={false} pageNumber={4}/>
            <div className={styles.main}>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarFuncionario} busca={"Buscar funcionário"}/>
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarFuncionario} id={''} categoria={"funcionário"} 
                        start_index={1} break_index={4}
                        campos={["Id", "Nome", "CPF", "Telefone", "E-mail", "Senha"]}
                        vazio={[["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]}
                        children={
                            <Button variant="outlined" size="large" sx={
                                {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                            }>Cadastrar funcionário</Button>
                        } action={`Cadastrar funcionário`} message={"Confirmar cadastro"}/>
                    </div>
                </div>
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                        <BarraVisualizacao key={item.idFuncionario} start_index={1} break_index={4}
                        children={
                        <>
                        <li>Nome: <br /> {item.nome} </li>
                        <hr />
                        <li>Telefone: <br /> {item.telefone} </li>
                        <hr />
                        <li>E-mail: <br /> {item.email} </li>
                        <hr />
                        </>}
                        acao={`Atualizar dados do funcionário`} confirm={"Confirmar alterações"}
                        lista={permissoes}
                        func={atualizarFuncionario}
                        dados={Object.entries(item)}
                        campos={["Id", "Nome", "CPF", "Telefone", "E-mail", "Permissões"]}
                        />
                        ))}
                    </div>
                    ) : (
                    <p>{loadMsg}</p>
                    )}
            </div>
        </div>
    )
}