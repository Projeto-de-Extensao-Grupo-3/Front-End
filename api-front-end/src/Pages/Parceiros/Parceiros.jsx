import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa} from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from "./parceiros.module.css"
import axios from "axios";

export function Parceiros() {
    const [parceiro, setParceiro] = useState("costureira");
    const [pesquisa, setPesquisa] = useState("Buscar costureira");
    const [categoria, setCategoria] = useState("Nova Costureira");
    const [atualizarDados, setAtualizarDados] = useState("da costureira");
    const [data, setData] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const [dadosCadastro, setDadosCadastro] = useState([]);

    const listarParceiros = () => {
        axios.get(`http://localhost:8080/parceiros/listagem/${parceiro}`)
        .then(response => {
            setData(response.data.reverse());
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const buscarParceiro = (nome) => {
        axios.get(`http://localhost:8080/parceiros/${parceiro}/nome?nome=${nome}`)
        .then(response => {
            console.log(response.data);
            if (response.data.length === 0) {
                setData([])
                setLoadMsg("Nenhum dado encontrado");
            } else {
                console.log("Teste")
                setData(response.data.reverse());
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const atualizarParceiro = (dados) => {
        console.log(dados);
        axios.put(`http://localhost:8080/parceiros/${dados.id}`, 
            {
                "categoria": dados.categoria,
                "nome": dados.nome,
                "telefone": dados.telefone,
                "email": dados.email,
                "endereco": dados.endereco,
                "identificacao": dados.identificacao,
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

    const cadastrarParceiro = (dados) => {
        axios.post(`http://localhost:8080/parceiros`, 
            {
                "categoria": dados[1][1],
                "nome": dados[2][1],
                "telefone": dados[3][1],
                "email": dados[4][1],
                "endereco": dados[5][1],
                "identificacao": dados[6][1],
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
        console.log("listando")
        listarParceiros();
        console.log(data);
        setLoadMsg("Carregando dados...");
    }, [parceiro, operations]);

    const atualizarInfoTela = (tela) => {
        if (tela == "costureira") {
            setParceiro("costureira");
            setPesquisa("Buscar costureira");
            setCategoria("Nova Costureira");
            setAtualizarDados("da costureira");
        } else if (tela == "fornecedor") {
            setParceiro("fornecedor");
            setPesquisa("Buscar fornecedor");
            setCategoria("Novo Fornecedor");
            setAtualizarDados("do fornecedor");
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const updateDados = (lista, novoValor, key) => {
        console.log(lista);
        let copiaDados = lista;
        console.log(copiaDados);
        copiaDados[key] = novoValor;
        console.log(copiaDados);
        setDadosCadastro(copiaDados);
        setOperations(operations+1);
        console.log(dadosCadastro);
    };
    
    return(
        <div>
            <Navbar vazio={false} pageNumber={5}/>
            <div className={styles.main}>
                <Options item1={"Costureiras"} item2={"Fornecedores de Tecido"} opt1={"costureira"} opt2={"fornecedor"} acao={atualizarInfoTela}/>
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarParceiro} busca={pesquisa}/>
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarParceiro} id={''} categoria={parceiro} 
                        start_index={2} break_index={5}
                        campos={["Id", "Categoria", "Nome", "Telefone", "E-mail", "Endereço", "CPF/CNPJ"]}
                        vazio={[["", ""], ["", `${parceiro}`], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]}
                        children={
                            <Button variant="outlined" size="large" sx={
                                {p:"1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)"}
                            }>Cadastrar {categoria}</Button>
                        } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}
                        form={
                            <form onSubmit={(e) => {
                                          handleSubmit(e);
                                          props.func(dados); 
                                          handleClose();
                                        }} 
                            id="form-cadastro" style={{display:'flex', justifyContent:'space-evenly'}}>
                                <div>    
                                    <h2>Nome</h2>
                                    <TextField key="Nome" required={true} onChange={(e) => updateDados(index, e.target.value)} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>Telefone</h2>
                                    <TextField key="Telefone" required={true} onChange={(e) => updateDados(index, e.target.value)} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>E-mail</h2>
                                    <TextField key="E-mail" required={true} onChange={(e) => updateDados(index, e.target.value)} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                </div>
                                <div>
                                    <h2>Endereço</h2>
                                    <TextField key="Endereço" required={true} onChange={(e) => updateDados(index, e.target.value)} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>CPF/CNPJ</h2>
                                    <TextField key="CPF/CNPJ" required={true} onChange={(e) => updateDados(index, e.target.value)} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                </div>
                            </form>
                        }/>
                    </div>
                </div>
                    {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                        <BarraVisualizacao key={item.idParceiro}
                        children={
                        <>
                        <li>Nome: <br /> {item.nome} </li>
                        <hr />
                        <li>Telefone: <br /> {item.telefone} </li>
                        <hr />
                        <li>E-mail: <br /> {item.email} </li>
                        <hr />
                        </>}
                        start_index={2} break_index={5}
                        acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                        func={atualizarParceiro}
                        dados={dadosCadastro}
                        campos={["Id", "Categoria", "Nome", "Telefone", "E-mail", "Endereço", "CPF/CNPJ"]}
                        form={ <>
                                <div>    
                                    <h2>Nome</h2>
                                    <TextField key="nome" required={true} defaultValue={item.nome} onChange={(e) => updateDados(item, e.target.value, "nome")} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>Telefone</h2>
                                    <TextField key="telefone" required={true} defaultValue={item.telefone} onChange={(e) => updateDados(item, e.target.value, "telefone")} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>E-mail</h2>
                                    <TextField key="email" required={true} defaultValue={item.email} onChange={(e) => updateDados(item, e.target.value, "email")} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                </div>
                                <div>
                                    <h2>Endereço</h2>
                                    <TextField key="endereco" required={true} defaultValue={item.endereco} onChange={(e) => updateDados(item, e.target.value, "endereco")} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                    <h2>CPF/CNPJ</h2>
                                    <TextField key="identificacao" required={true} defaultValue={item.identificacao} onChange={(e) => updateDados(item, e.target.value, "identificacao")} 
                                    sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
                                </div>
                                </>
                        }
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