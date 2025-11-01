import { useState, useEffect } from 'react';
import { BarraVisualizacao } from "../../components/BarraVisualizacao/BarraVizualizacao";
import { BarraPesquisa } from "../../components/BarraPesquisa/BarraPesquisa";
import { Navbar } from "../../components/Navbar/Navbar";
import { JanelaCadastro } from "../../components/JanelaCadastro/JanelaCadastro";
import { Options } from "../../components/Options/Options";
import { SelectOptions } from '../../components/SelectOptions/SelectOptions';
import Button from '@mui/material/Button';
import styles from "../Parceiros/parceiros.module.css"
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

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

    const [prateleiras, setPrateleiras] = useState([]);
    const [prateleiraAtualizacao, setPrateleiraAtualizacao] = useState("");
    const [prateleiraCadastro, setPrateleiraCadastro] = useState("");

    const [notificarAtualizacao, setNotificarAtualizacao] = useState("");

    const [dadosAtualizacao, setDadosAtualizacao] = useState([]);
    const [dadosCadastro, setDadosCadastro] = useState({});

    const [imagem, setImagem] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    let imagemCadastro;

    const listarItensEstoque = () => {
        axios.get(`/api/itens-estoque/categorias?tipo=${itemEstoque}`)
            .then(response => {
                console.log(response.data);
                setData(response.data);
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarCaracteristicas = () => {
        axios.get(`/api/categorias/tipo/Característica`)
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

    const listarPrateleiras = () => {
        axios.get(`/api/prateleiras`)
            .then(response => {
                console.log(response.data);
                setPrateleiras(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarCategorias = () => {
        axios.get(`/api/categorias/tipo/${itemEstoque}`)
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
            axios.get(`/api/itens-estoque/${itemEstoque}/filtros?descricao=${descricao}`)
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

    function gerarNomeImagem() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 32; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const uploadImagemS3 = () => {
        let urlImagem;
        const nomeImagem = gerarNomeImagem();
        axios.post(`/api/s3/upload/${nomeImagem}.jpg`, imagem, {
            headers: {
                'Content-Type': imagem.type,
            },
        })
            .then(response => {
                urlImagem = response.data;
                console.log(urlImagem);
                cadastrarImagem(urlImagem);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Erro ao realizar upload da imagem:', error);
            });
    }

    const atualizarImagemS3 = (urlImagemCadastrada) => {
        const nomeImagem = urlImagemCadastrada.match("(?<=com/).*$")[0];
        console.log(nomeImagem)
        axios.post(`/api/s3/upload/${nomeImagem}`, imagem, {
            headers: {
                'Content-Type': imagem.type,
            },
        })
            .then(response => {
                const urlImagem = response.data;
                console.log(urlImagem);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Erro ao realizar atualização da imagem:', error);
            });
    }

    const cadastrarImagem = (urlImagem) => {
        axios.post('/api/imagens',
            {
                "url": urlImagem
            }
        )
            .then(response => {
                console.log(response.data);
                imagemCadastro = response.data;
                console.log(imagemCadastro);
                cadastrarItemEstoque();
            })
            .catch(error => {
                console.error('Erro ao realizar cadastro da imagem:', error);
            });
    }

    const atualizarItemEstoque = (dados) => {
        console.log(dados)
        console.log(dadosAtualizacao)
        atualizarImagemS3(dados.imagem.url)
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dados.caracteristicas : caracteristicasAtualizacao
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids })
        console.log(`{
                "descricao": "${dados.descricao}",
                "complemento": "${dados.complemento}",
                "peso": ${dados.peso},
                "qtdMinimo": ${dados.qtdMinimo},
                "qtdArmazenado": ${dados.qtdArmazenado},
                "notificar": ${dados.notificar},
                "categoria": {
                    "idCategoria": ${dados.categoria.idCategoria}
                },
                "caracteristicas": ${JSON.stringify(caracteristicasIds)},
                "plateleira": {
                    "idPrateleira": ${dados.prateleira}
                },
                "preco": ${dados.preco},
                "imagem": {
                    "idImagem": ${dados.imagem.id},
                    "url": ${dados.imagem.url}
                }
            }`)
        axios.put(`/api/itens-estoque/${dados.idItemEstoque}`,
            {
                "descricao": dados.descricao,
                "complemento": dados.complemento,
                "peso": dados.peso,
                "qtdMinimo": dados.qtdMinimo,
                "qtdArmazenado": dados.qtdArmazenado,
                "notificar": dados.notificar,
                "categoria": {
                    "idCategoria": dados.categoria.idCategoria
                },
                "caracteristicas": caracteristicasIds,
                "plateleira": {
                    "idPrateleira": dados.prateleira
                },
                "preco": dados.preco,
                "imagem": {
                    "idImagem": dados.imagem.id,
                    "url": dados.imagem.url
                }
            }
        )
            .then(response => {
                setDadosAtualizacao([]);
                console.log(response.data);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const cadastrarItemEstoque = () => {
        const categoriaCadastrar = categorias.filter(categoria => categoria.nome == categoriaCadastro);
        console.log(categoriaCadastrar)
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dadosCadastro.caracteristicas : caracteristicasAtualizacao
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids })

        console.log(`{
                "descricao": "${dadosCadastro.descricao}",
                "complemento": "${dadosCadastro.complemento}",
                "peso": ${dadosCadastro.peso},
                "qtdMinimo": ${dadosCadastro.qtdMinimo},
                "qtdArmazenado": ${dadosCadastro.qtdArmazenado},
                "notificar": ${dadosCadastro.notificar},
                "categoria": {
                    "idCategoria": ${categoriaCadastrar[0].id}
                },
                "caracteristicas": ${JSON.stringify(caracteristicasIds)},
                "plateleira": {
                    "idPrateleira": ${dadosCadastro.prateleira}
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": ${imagemCadastro.id},
                    "url":${imagemCadastro.url}
                }
            }`)
        axios.post(`/api/itens-estoque`,
            {
                "descricao": dadosCadastro.descricao,
                "complemento": dadosCadastro.complemento,
                "peso": dadosCadastro.peso,
                "qtdMinimo": dadosCadastro.qtdMinimo,
                "qtdArmazenado": dadosCadastro.qtdArmazenado,
                "notificar": dadosCadastro.notificar,
                "categoria": {
                    "idCategoria": categoriaCadastrar[0].id
                },
                "caracteristicas": caracteristicasIds,
                "plateleira": {
                    "idPrateleira": dadosCadastro.prateleira
                },
                "preco": 0.00,
                "imagem": {
                    "idImagem": imagemCadastro.id,
                    "url": imagemCadastro.url
                }
            }
        )
            .then(response => {
                setDadosAtualizacao([]);
                console.log(response.data);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        listarItensEstoque();
        listarPrateleiras();
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
        console.log(dadosAtualizacao)
        setDadosAtualizacao(copiaDados);
        console.log(dadosAtualizacao)
        setOperations(operations + 1);
    };

    const handleCategoriaChange = (item, e, key) => {
        setCategoriaAtualizacao(e.target.value);
        updateDados(item, categorias.filter(categoria => categoria.nome == e.target.value), key)
    };

    const handleCategoriaCadastroChange = (e) => {
        setCategoriaCadastro(e.target.value);
    };

    const handlePrateleiraCadastroChange = (e) => {
        setPrateleiraCadastro(e.target.value);
    };

    const handlePrateleiraChange = (item, e, key) => {
        setPrateleiraAtualizacao(e.target.value);
        updateDados(item, prateleiras.filter(prateleira => prateleira.codigo == e.target.value), key)
    };

    const handleNotificarChange = (item, e, key) => {
        setNotificarAtualizacao(e.target.value);
        //updateDados(item, e.target.value, key)
    };

    const limparCampos = () => {
        setImagePreview("");
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        console.log(file.name);
        setImagem(file);
        console.log(imagem)
    }

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
                        <JanelaCadastro func={uploadImagemS3}
                            limparCampos={limparCampos}
                            dados={dadosCadastro}
                            children={
                                <Button variant="outlined" size="large" sx={
                                    { p: "1rem 3vw 1rem 3vw", color: "rgba(0, 0, 0, 1)", borderColor: "rgba(0, 0, 0, 1)" }
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
                                        {itemEstoque === "Roupa" ? (
                                            <>
                                                <h2>Receber notificações</h2>
                                                <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                                    labelId="select-notificar"
                                                    id="select-notificar"
                                                    value={dadosCadastro.notificar === undefined ? "" : dadosCadastro.notificar}
                                                    onChange={(e) => setAtribute(e.target.value, "notificar")}
                                                >
                                                    <MenuItem key={"true"} value={true}>Sim</MenuItem>
                                                    <MenuItem key={"false"} value={false}>Não</MenuItem>
                                                </Select>
                                            </>
                                        ) : <></>
                                        }
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
                                        <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                            labelId="select-prateleira"
                                            id="select-prateleira"
                                            value={prateleiraCadastro}
                                            onChange={(e) => handlePrateleiraCadastroChange(e)}
                                            label="Age">
                                            {prateleiras.map(prateleira => (
                                                <MenuItem key={prateleira.id} value={prateleira.codigo}>{prateleira.codigo}</MenuItem>
                                            ))}
                                        </Select>
                                        <h2>Preço</h2>
                                        <TextField key="preco" required={true} onChange={(e) => setAtribute(Number(e.target.value), "preco")}
                                            sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                        <h2>Imagem</h2>
                                        <Button variant="contained" component="label">
                                            Carregar Imagem <input onChange={handleImageUpload} type='file' accept=".png, .jpg, .jpeg, .svg" hidden />
                                        </Button>
                                        <br />
                                        <img style={{ width: "10em" }} src={imagePreview} alt="" />
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
                                            {itemEstoque === "Roupa" ? (
                                                <>
                                                    <h2>Receber notificações</h2>
                                                    <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                                        labelId="select-notificar"
                                                        id="select-notificar"
                                                        value={notificarAtualizacao === "" ? item.notificar : notificarAtualizacao}
                                                        onChange={(e) => handleNotificarChange(item, e, "notificar")}
                                                    >
                                                        <MenuItem key={"true"} value={true}>Sim</MenuItem>
                                                        <MenuItem key={"false"} value={false}>Não</MenuItem>
                                                    </Select>
                                                </>
                                            ) : <></>
                                            }
                                        </div>
                                        <div>
                                            <h2>Categoria</h2>
                                            <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                                labelId="select-categoria"
                                                id="select-categoria"
                                                value={categoriaAtualizacao != "" ? categoriaAtualizacao : item.categoria.nome}
                                                onChange={(e) => handleCategoriaChange(item, e, "categoria")}
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
                                            <Select fullWidth sx={{ width: '35vw', marginBottom: '3rem' }}
                                                labelId="select-prateleira"
                                                id="select-prateleira"
                                                value={prateleiraAtualizacao != "" ? prateleiraAtualizacao : item.prateleira.codigo}
                                                onChange={(e) => handlePrateleiraChange(item, e, "prateleira")}
                                            >
                                                {prateleiras.map(prateleira => (
                                                    <MenuItem key={prateleira.id} value={prateleira.codigo}>{prateleira.codigo}</MenuItem>
                                                ))}
                                            </Select>
                                            <h2>Preço</h2>
                                            <TextField key="preco" required={true} defaultValue={item.preco} onChange={(e) => updateDados(item, Number(e.target.value), "preco")}
                                                sx={{ width: '35vw', marginBottom: '3rem' }} id="outlined-basic" variant="outlined" />
                                            <h2>Imagem</h2>
                                            <Button variant="contained" component="label">
                                                Carregar Imagem <input onChange={handleImageUpload} type='file' accept=".png, .jpg, .jpeg, .svg" hidden />
                                            </Button>
                                            <br />
                                            <img style={{ width: "10rem" }} src={imagePreview === "" ? item.imagem.url : imagePreview} alt="" />
                                        </div>
                                    </>
                                }
                                info={
                                    <>
                                        <div>
                                            <h2>Descrição:</h2>
                                            <p key="descricao" style={{ width: '100%', marginBottom: '2rem' }}>{item.descricao}</p>
                                            <h2>Complemento:</h2>
                                            <p key="complemento" style={{ width: '100%', marginBottom: '2rem' }}>{item.complemento}</p>
                                            <h2>Peso:</h2>
                                            <p key="peso" style={{ width: '100%', marginBottom: '2rem' }}>{item.peso}</p>
                                            <h2>Qtd. mínimo:</h2>
                                            <p key="qtdMinimo" style={{ width: '100%', marginBottom: '2rem' }}>{item.qtdMinimo}</p>
                                            <h2>Qtd. Armazenado:</h2>
                                            <p key="qtdArmazenado" style={{ width: '100%', marginBottom: '2rem' }}>{item.qtdArmazenado}</p>
                                            {itemEstoque === "Roupa" ? (<>
                                                <h2>Receber notificações</h2>
                                                <p style={{ width: '100%', marginBottom: '2rem' }}>{item.notificar === 0 ? "Não" : "Sim"}</p> </>) : null}
                                        </div>
                                        <div>
                                            <h2>Categoria:</h2>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.categoria.nome}</p>
                                            <h2>Características:</h2>
                                            {item.caracteristicas.map((dado) => <p>{dado.nome}</p>)}
                                            <h2 style={{ marginTop: '2rem' }}>Prateleira</h2>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.prateleira.codigo}</p>
                                            <h2>Preço:</h2>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.preco}</p>
                                            <h2>Imagem:</h2>
                                            <img src={item.imagem.url} style={{ height: "8rem" }} />
                                        </div>
                                    </>
                                }
                                title={`Informações ${atualizarDados}`}
                                altura={"60vh"}
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