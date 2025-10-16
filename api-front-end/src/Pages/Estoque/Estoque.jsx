import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import { SelectOptions } from '../../components/SelectOptions/SelectOptions';
import Button from '@mui/material/Button';
import styles from "../Parceiros/parceiros.module.css"
import axios from "axios";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export function Estoque() {
    const [itemEstoque, setItemEstoque] = useState("Roupa");
    const [pesquisa, setPesquisa] = useState("Buscar roupa");
    const [categoria, setCategoria] = useState("Nova roupa");
    const [atualizarDados, setAtualizarDados] = useState("da roupa");
    const [data, setData] = useState([]);
    const [operations, setOperations] = useState(0);
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    const [caracteristicas, setCaracteristicas] = useState([]);
    const [caracteristicasAtualizacao, setCaracteristicasAtualizacao] = useState([""]);

    const [categorias, setCategorias] = useState([]);
    const [categoriaAtualizacao, setCategoriaAtualizacao] = useState("");
    const [categoriaCadastro, setCategoriaCadastro] = useState("");

    const [dadosAtualizacao, setDadosAtualizacao] = useState([]);
    const [dadosCadastro, setDadosCadastro] = useState({});

    const listarItensEstoque = () => {
        axios.get(`http://localhost:8080/itens-estoque/categorias?tipo=${itemEstoque}`)
            .then(response => {
                //console.log(response.data);
                setData(response.data.reverse());
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data.reverse());
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarCaracteristicas = () => {
        axios.get(`http://localhost:8080/categorias/tipo/Característica`)
            .then(response => {
                const listaCaracteristicas = response.data;
                setCaracteristicas(listaCaracteristicas.map(caracteristica => {
                    const { id, ...rest } = caracteristica;
                    return { ["idCategoria"]: id, ...rest };
                }));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarCategorias = () => {
        axios.get(`http://localhost:8080/categorias/tipo/${itemEstoque}`)
            .then(response => {
                console.log(response.data);
                setCategorias(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const buscarItemEstoque = (descricao) => {
        if (descricao == "") {
            listarItensEstoque();
        } else {
            axios.get(`http://localhost:8080/itens-estoque/filtros?descricao=${descricao}`)
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
    }

    const atualizarItemEstoque = (dados) => {
        const categoriaCadastrar = categorias.filter(categoria => categoria.nome == dados.subcategoria[0].nome);
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dados.caracteristicas : caracteristicasAtualizacao
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids })
        console.log(`{
                "descricao": "${dados.descricao}",
                "complemento": "${dados.complemento}",
                "peso": ${dados.peso},
                "qtdMinimo": ${dados.qtdMinimo},
                "qtdArmazenado": ${dados.qtdArmazenado},
                "categoria": {
                    "idCategoria": ${categoriaCadastrar[0].idCategoria}
                },
                "caracteristicas": ${JSON.stringify(caracteristicasIds)},
                "plateleira": {
                    "idPrateleira": ${dados.prateleira}
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": 1,
                    "url": "https://cdn.awsli.com.br/600x700/143/143951/produto/32328172/7fa3e6d61c.jpg"
                }
            }`)
        axios.put(`http://localhost:8080/itens-estoque/${dados.idItemEstoque}`,
            {
                "descricao": dados.descricao,
                "complemento": dados.complemento,
                "peso": dados.peso,
                "qtdMinimo": dados.qtdMinimo,
                "qtdArmazenado": dados.qtdArmazenado,
                "categoria": {
                    "idCategoria": categoriaCadastro[0].id
                },
                "caracteristicas": caracteristicasIds,
                "plateleira": {
                    "idPrateleira": dados.prateleira
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": 1,
                    "url": "https://cdn.awsli.com.br/600x700/143/143951/produto/32328172/7fa3e6d61c.jpg"
                }
            }
        )
            .then(response => {
                console.log(response.data);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const cadastrarItemEstoque = (dados) => {
        const categoriaCadastrar = categorias.filter(categoria => categoria.nome == categoriaCadastro);
        console.log(categoriaCadastrar)
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dados.caracteristicas : caracteristicasAtualizacao
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids })
        console.log(`{
                "descricao": "${dados.descricao}",
                "complemento": "${dados.complemento}",
                "peso": ${dados.peso},
                "qtdMinimo": ${dados.qtdMinimo},
                "qtdArmazenado": ${dados.qtdArmazenado},
                "categoria": {
                    "idCategoria": ${categoriaCadastrar[0].id}
                },
                "caracteristicas": ${JSON.stringify(caracteristicasIds)},
                "plateleira": {
                    "idPrateleira": ${dados.prateleira}
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": 1,
                    "url": "https://cdn.awsli.com.br/600x700/143/143951/produto/32328172/7fa3e6d61c.jpg"
                }
            }`)
        axios.post(`http://localhost:8080/itens-estoque`,
            {
                "descricao": dados.descricao,
                "complemento": dados.complemento,
                "peso": dados.peso,
                "qtdMinimo": dados.qtdMinimo,
                "qtdArmazenado": dados.qtdArmazenado,
                "categoria": {
                    "idCategoria": categoriaCadastrar[0].id
                },
                "caracteristicas": caracteristicasIds,
                "plateleira": {
                    "idPrateleira": dados.prateleira
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": 1,
                    "url": "https://cdn.awsli.com.br/600x700/143/143951/produto/32328172/7fa3e6d61c.jpg"
                }
            }
        )
            .then(response => {
                console.log(response.data);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        listarItensEstoque();
        listarCaracteristicas();
        listarCategorias();
        setLoadMsg("Carregando dados...");
    }, [itemEstoque, operations]);

    const atualizarInfoTela = (tela) => {
        if (tela == "Roupa") {
            setItemEstoque("Roupa");
            setPesquisa("Buscar roupa");
            setCategoria("Nova roupa");
            setAtualizarDados("da roupa");
        } else if (tela == "Tecido") {
            setItemEstoque("Tecido");
            setPesquisa("Buscar tecido");
            setCategoria("Novo tecido");
            setAtualizarDados("do tecido");
        }
    }

    const setAtribute = (valor, key) => {
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro;
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        setOperations(operations + 1);
        console.log(dadosCadastro);
    }

    const updateDados = (item, novoValor, key) => {
        let index = dadosAtualizacao.findIndex(dado => dado.idItemEstoque === item.idItemEstoque)
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor;
        setDadosAtualizacao(copiaDados);
        setOperations(operations + 1);
    };

    const handleCategoriaChange = (item, e, key) => {
        setCategoriaAtualizacao(e.target.value);
        updateDados(item, categorias.filter(categoria => categoria.nome == e.target.value), key)
    };

    const handleCategoriaCadastroChange = (e) => {
        setCategoriaCadastro(e.target.value);
    };

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <div className={styles.main}>
                <Options opt1={"Roupa"} opt2={"Tecido"} acao={atualizarInfoTela} />
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarItemEstoque} busca={pesquisa} />
                    </div>
                    <div>
                        <JanelaCadastro func={cadastrarItemEstoque}
                        dados={dadosCadastro}
                            children={
                                <Button variant="outlined" size="large" sx={
                                    { p: "1rem 3rem 1rem 3rem", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)" }
                                }>Cadastrar {categoria}</Button>
                            } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}
                            form={
                                <>
                                    <div>
                                        <h2>Descrição</h2>
                                        <TextField key="descricao" required={true} onChange={(e) => setAtribute(e.target.value, "descricao")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Complemento</h2>
                                        <TextField key="complemento" required={true} onChange={(e) => setAtribute(e.target.value, "complemento")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Peso</h2>
                                        <TextField key="peso" required={true} onChange={(e) => setAtribute(e.target.value, "peso")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Qtd. mínimo</h2>
                                        <TextField key="qtdMinimo" required={true} onChange={(e) => setAtribute(Number(e.target.value), "qtdMinimo")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Qtd. Armazenado</h2>
                                        <TextField key="qtdArmazenado" required={true} onChange={(e) => setAtribute(Number(e.target.value), "qtdArmazenado")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                    <div>
                                        <h2>Categoria</h2>
                                        <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                            labelId="select-categoria"
                                            id="select-categoria"
                                            value={categoriaCadastro}
                                            onChange={(e) => handleCategoriaCadastroChange(e)}
                                            label="Age">
                                            {categorias.map(categoria => (
                                                <MenuItem key={categoria.id} value={categoria.nome}>{categoria.nome}</MenuItem>
                                            ))}
                                        </Select>
                                        <h2>Características</h2>
                                        <SelectOptions lista={caracteristicas}
                                            chave={"nome"}
                                            id={"id"}
                                            dados={caracteristicasAtualizacao.map((item) => item.caracteristica)}
                                            func={setCaracteristicasAtualizacao}>
                                        </SelectOptions>
                                        <h2>Prateleira</h2>
                                        <TextField key="prateleira" required={true} onChange={(e) => setAtribute(Number(e.target.value), "prateleira")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Preço</h2>
                                        <TextField key="preco" required={true} onChange={(e) => setAtribute(Number(e.target.value), "preco")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Imagem</h2>
                                        <TextField key="imagem" required={true} onChange={(e) => setAtribute(e.target.value, "imagem")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                    </div>
                                </>
                            } />
                    </div>
                </div>
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                            <BarraVisualizacao key={item.idItemEstoque}
                                children={
                                    <>
                                        <li>Imagem: <br /> <img src={item.imagem.url} style={{ height: "6rem" }} /> </li>
                                        <hr />
                                        <li>Descrição: <br /> {item.descricao} </li>
                                        <hr />
                                        <li>Quantidade em estoque: <br /> {item.qtdArmazenado} </li>
                                        <hr />
                                    </>}
                                acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                                func={atualizarItemEstoque}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.idItemEstoque === item.idItemEstoque)]}
                                form={
                                    <>
                                        <div>
                                            <h2>Descrição</h2>
                                            <TextField key="descricao" required={true} defaultValue={item.descricao} onChange={(e) => updateDados(item, e.target.value, "descricao")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Complemento</h2>
                                            <TextField key="complemento" required={true} defaultValue={item.complemento} onChange={(e) => updateDados(item, e.target.value, "complemento")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Peso</h2>
                                            <TextField key="peso" required={true} defaultValue={item.peso} onChange={(e) => updateDados(item, e.target.value, "peso")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Qtd. mínimo</h2>
                                            <TextField key="qtdMinimo" required={true} defaultValue={item.qtdMinimo} onChange={(e) => updateDados(item, Number(e.target.value), "qtdMinimo")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Qtd. Armazenado</h2>
                                            <TextField key="qtdArmazenado" required={true} defaultValue={item.qtdArmazenado} onChange={(e) => updateDados(item, Number(e.target.value), "qtdArmazenado")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        </div>
                                        <div>
                                            <h2>Categoria</h2>
                                            <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                                labelId="select-categoria"
                                                id="select-categoria"
                                                value={categoriaAtualizacao != "" ? categoriaAtualizacao : item.subcategoria.nome}
                                                onChange={(e) => handleCategoriaChange(item, e, "subcategoria")}
                                                label="Age"
                                            >
                                                {categorias.map(categoria => (
                                                    <MenuItem key={categoria.id} value={categoria.nome}>{categoria.nome}</MenuItem>
                                                ))}

                                            </Select>
                                            <h2>Características</h2>
                                            <SelectOptions lista={caracteristicas}
                                                chave={"nome"}
                                                id={"id"}
                                                dados={item.caracteristicas.map((dado) => dado.nome)}
                                                func={setCaracteristicasAtualizacao}>
                                            </SelectOptions>
                                            <h2>Prateleira</h2>
                                            <TextField key="prateleira" required={true} defaultValue={item.prateleira} onChange={(e) => updateDados(item, Number(e.target.value), "prateleira")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Preço</h2>
                                            <TextField key="preco" required={true} defaultValue={item.preco} onChange={(e) => updateDados(item, Number(e.target.value), "preco")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Imagem</h2>
                                            <TextField key="imagem" required={true} defaultValue={item.imagem.url} onChange={(e) => updateDados(item, e.target.value, "imagem")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
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