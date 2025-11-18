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
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

export function Estoque() {

    /*============================= Variáveis ============================*/

    // Tipo de item em estoque (Roupa ou Tecido)
    const [itemEstoque, setItemEstoque] = useState("Roupa");
    const [pesquisa, setPesquisa] = useState("Buscar roupa");
    const [categoria, setCategoria] = useState("Nova roupa");
    const [atualizarDados, setAtualizarDados] = useState("da roupa");

    // Mensagem de carregamento enquanto dados não são carregados
    const [loadMsg, setLoadMsg] = useState("Carregando dados...");

    // Variáveis para dados
    const [data, setData] = useState([]); // Dados dos itens em estoque obtidos na listagem

    const [caracteristicas, setCaracteristicas] = useState([]); // Lista de todas as características disponíveis
    const [caracteristicasAtualizacao, setCaracteristicasAtualizacao] = useState([""]); // Características selecionadas para atualização ou cadastro

    const [categorias, setCategorias] = useState([]); // Lista de todas as categorias disponíveis
    const [categoriaAtualizacao, setCategoriaAtualizacao] = useState(""); // Categoria selecionada para atualização
    const [categoriaCadastro, setCategoriaCadastro] = useState(""); // Categoria selecionada para cadastro

    const [prateleiras, setPrateleiras] = useState([]); // Lista de todas as prateleiras disponíveis
    const [prateleiraAtualizacao, setPrateleiraAtualizacao] = useState(""); // Prateleira selecionada para atualização
    const [prateleiraCadastro, setPrateleiraCadastro] = useState(""); // Prateleira selecionada para cadastro

    const [notificarAtualizacao, setNotificarAtualizacao] = useState(""); // Notificar selecionada para atualização

    const [dadosAtualizacao, setDadosAtualizacao] = useState([]); // Dados dos itens em estoque para atualização
    const [dadosCadastro, setDadosCadastro] = useState({}); // Dados do item em estoque para cadastro

    const [imagem, setImagem] = useState([]); // Imagem (arquivo) selecionada para upload
    const [imagePreview, setImagePreview] = useState(null); // Preview da imagem selecionada

    const [tecidos, setTecidos] = useState([]); // Lista de tecidos (apenas para roupas)

    // Controla refresh da página a cada operação
    const [operations, setOperations] = useState(0);

    // Variáveis para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    // Variável para responsividade
    const matches = useMediaQuery('(min-width:600px)');

    // Armazena a imagem cadastrada (id e url retornados pelo endpoint de cadastro de imagem)
    let imagemCadastro;

    /*=====================================================================*/


    /*======================== Funções de requisição ======================*/

    const listarItensEstoque = () => {
        axios.get(`/api/itens-estoque/categorias?tipo=${itemEstoque}`)
            .then(response => {
                console.log(response.data);
                setData(response.data);
                if (dadosAtualizacao.length === 0) setDadosAtualizacao(response.data); // Inicializa os dados de atualização com os dados obtidos na listagem
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const listarTecidos = () => { // Apesar de já estar listando ItemEstoque,é necessário listar tecidos para serem relacionados com roupa
        axios.get(`/api/itens-estoque/categorias?tipo=Tecido`)
            .then(response => {
                console.log(response.data);
                setTecidos(response.data);
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
                    return { ["idCategoria"]: id, ...rest }; // Renomeia 'id' para 'idCategoria'
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
        const date = new Date().toISOString();
        const cleanDate = date.replace(/[-:.]/g, "").replace("Z", "");
        const result = `${categoriaCadastro}_${cleanDate}`;
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
                cadastrarImagem(urlImagem); // Chama a função de cadastro da imagem utilizando URL gerada após o upload
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Erro ao realizar upload da imagem:', error);
                setAlertType("error");
                setAlertTitle("Erro ao cadastrar dados!");
                setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            });
    }

    const atualizarImagemS3 = (urlImagemCadastrada) => {
        const nomeImagem = urlImagemCadastrada.match("(?<=com/).*$")[0]; // Extrai o nome da imagem da URL
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
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
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
                cadastrarItemEstoque(); // Chama a função de cadastro do item em estoque após o cadastro da imagem (dependência do id da imagem cadastrada)
            })
            .catch(error => {
                console.error('Erro ao realizar cadastro da imagem:', error);
                setAlertType("error");
                setAlertTitle("Erro ao realizar cadastro!");
                setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            });
    }

    const atualizarItemEstoque = (dados) => {
        if (imagem.length != 0) atualizarImagemS3(dados.imagem.url);
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dados.caracteristicas : caracteristicasAtualizacao // Mantém as características atuais se nenhuma nova for selecionada
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids }) // Extrai apenas os ids das características selecionadas
        console.log(`{
                "descricao": ${dados.descricao}
                "complemento": ${dados.complemento}
                "peso": ${dados.peso}
                "qtdMinimo": ${dados.qtdMinimo}
                "qtdArmazenado": ${dados.qtdArmazenado}
                "notificar": ${dados.notificar}
                "categoria":
                    "idCategoria": ${dados.categoria.idCategoria}
                }
                "caracteristicas": ${caracteristicasIds}
                "plateleira":
                    "idPrateleira": ${dados.prateleira.idPrateleira}
                }
                "preco": ${dados.preco}
                "imagem":
                    "idImagem": ${dados.imagem.id}
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
                    "idPrateleira": dados.prateleira.idPrateleira
                },
                "preco": dados.preco,
                "imagem": {
                    "idImagem": dados.imagem.id,
                    "url": dados.imagem.url
                }
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Dados atualizados com sucesso!");
                setAlertMessage(`Os dados ${atualizarDados} foram atualizados com sucesso.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao atualizar dados!");
                setAlertMessage(`Ocorreu um erro ao atualizar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setDadosAtualizacao([]);
                setOperations(operations + 1);
            });
    }

    const cadastrarItemEstoque = () => {
        const categoriaCadastrar = categorias.filter(categoria => categoria.nome == categoriaCadastro); // Obtém a categoria selecionada para cadastro
        const prateleiraCadastrar = prateleiras.filter(prateleira => prateleira.codigo == prateleiraCadastro); // Obtém a prateleira selecionada para cadastro
        const caracteristicasCadastro = caracteristicasAtualizacao[0] === "" ? dadosCadastro.caracteristicas : caracteristicasAtualizacao // Mantém as características atuais se nenhuma nova for selecionada
        const caracteristicasIds = caracteristicasCadastro.map(item => { const { nome, ...ids } = item; return ids }) // Extrai apenas os ids das características selecionadas
        console.log(`{
                "descricao": ${dadosCadastro.descricao}
                "complemento": ${dadosCadastro.complemento}
                "peso": ${dadosCadastro.peso}
                "qtdMinimo": ${dadosCadastro.qtdMinimo}
                "qtdArmazenado": ${0.0}
                "notificar": ${dadosCadastro.notificar}
                "categoria":
                    "idCategoria": ${categoriaCadastrar[0].id}
                }
                "caracteristicas": ${caracteristicasIds}
                "plateleira":
                    "idPrateleira": ${prateleiraCadastrar[0].id}
                }
                "preco": ${dadosCadastro.preco}
                "imagem":
                    "idImagem": ${imagemCadastro.id}
                    "url": ${imagemCadastro.url}
                }
            }`)
        axios.post(`/api/itens-estoque`,
            {
                "descricao": dadosCadastro.descricao,
                "complemento": dadosCadastro.complemento,
                "peso": dadosCadastro.peso,
                "qtdMinimo": dadosCadastro.qtdMinimo,
                "qtdArmazenado": 0.0,
                "notificar": dadosCadastro.notificar,
                "categoria": {
                    "idCategoria": categoriaCadastrar[0].id
                },
                "caracteristicas": caracteristicasIds,
                "plateleira": {
                    "idPrateleira": prateleiraCadastrar[0].id
                },
                "preco": dadosCadastro.preco,
                "imagem": {
                    "idImagem": imagemCadastro.id,
                    "url": imagemCadastro.url
                }
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Cadastro realizado com sucesso!");
                setAlertMessage(`Os dados ${atualizarDados} foram cadastrados com sucesso.`);
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (error.response.status === 409) {
                    setAlertType("warning");
                    setAlertTitle("Cadastro já existente!");
                    setAlertMessage(`Já existe um mesmo cadastro com a descrição informada.`);
                } else {
                    setAlertType("error");
                    setAlertTitle("Erro ao realizar cadastro!");
                    setAlertMessage(`Ocorreu um erro ao cadastrar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                }
                setAlertOpen(true);
                setDadosCadastro([]);
                setOperations(operations + 1);
            });
    }

    const deletarItemEstoque = (dados) => { // Função de remoção lógica do item em estoque
        axios.put(`/api/itens-estoque/${dados.idItemEstoque}`,
            {
                "descricao": dados.descricao,
                "complemento": null,
                "peso": null,
                "qtdMinimo": null,
                "qtdArmazenado": null,
                "notificar": null,
                "categoria": null,
                "caracteristicas": null,
                "plateleira": null,
                "preco": null,
                "imagem": null
            }
        )
            .then(response => {
                console.log(response.data);
                setAlertType("success");
                setAlertTitle("Remoção bem sucedida!");
                setAlertMessage(`Os dados ${atualizarDados} foram apagados com sucesso.`);
                setAlertOpen(true);
                setOperations(operations + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setAlertType("error");
                setAlertTitle("Erro ao apagar dados!");
                setAlertMessage(`Ocorreu um erro ao apagar as informações ${atualizarDados}. Entre em contato com o suporte.`);
                setAlertOpen(true);
                setOperations(operations + 1);
            });
    }

    /*=====================================================================*/


    /*============================ Funções gerais =========================*/

    // Carrega os dados iniciais
    useEffect(() => {
        listarItensEstoque();
        listarTecidos();
        listarPrateleiras();
        listarCaracteristicas();
        listarCategorias();
        setLoadMsg("Carregando dados...");
    }, [itemEstoque, operations]);

    // Atualiza informações da tela conforme o tipo de item de estoque selecionado
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

    // Seta os atributos do parceiro para cadastro
    const setAtribute = (valor, key) => {
        let copiaDados = Object.keys(dadosCadastro).length == 0 ? {} : dadosCadastro; // Verifica se o objeto está vazio
        copiaDados[key] = valor;
        setDadosCadastro(copiaDados);
        console.log(dadosCadastro);
    }

    // Seta os dados do parceiro para atualização
    const updateDados = (item, novoValor, key) => {
        let index = dadosAtualizacao.findIndex(dado => dado.idItemEstoque === item.idItemEstoque) // Busca o item por ID na lista de itens em "dadosAtualizacao"
        let copiaDados = dadosAtualizacao;
        copiaDados[index][key] = novoValor; // Atualiza o atributo com base no index do parceiro e na chave do atributo
        setDadosAtualizacao(copiaDados);
    };

    // Controla mudança na seleção de categoria para atualização
    const handleCategoriaChange = (item, e, key) => {
        setCategoriaAtualizacao(e.target.value);
        updateDados(item, categorias.filter(categoria => categoria.nome == e.target.value), key) // Atualiza o dado com o objeto completo da categoria selecionada
    };

    // Controla mudança na seleção de categoria para cadastro
    const handleCategoriaCadastroChange = (e) => {
        setCategoriaCadastro(e.target.value);
    };

    // Controla mudança na seleção de prateleira para cadastro
    const handlePrateleiraCadastroChange = (e) => {
        setPrateleiraCadastro(e.target.value);
    };

    // Controla mudança na seleção de prateleira para atualização
    const handlePrateleiraChange = (item, e, key) => {
        setPrateleiraAtualizacao(e.target.value);
        updateDados(item, prateleiras.filter(prateleira => prateleira.codigo == e.target.value), key) // Atualiza o dado com o objeto completo da prateleira selecionada
    };

    // Controla mudança na seleção de notificar para atualização
    const handleNotificarChange = (item, e, key) => {
        setNotificarAtualizacao(e.target.value);
    };

    // Limpa os campos do formulário de cadastro
    const limparCampos = () => {
        setImagem([]); // Limpa o arquivo de imagem selecionado
        setDadosCadastro({}); // Limpa os dados de cadastro
        setCategoriaCadastro(""); // Limpa a categoria selecionada para cadastro
        setCaracteristicasAtualizacao([]); // Limpa as características selecionadas para cadastro/atualização
        setPrateleiraCadastro(""); // Limpa a prateleira selecionada para cadastro
        setImagePreview(""); // Limpa o preview da imagem
    }

    // Controla o upload da imagem e cria o preview
    const handleImageUpload = (e) => {
        console.log(imagem)
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        console.log(file.name);
        setImagem(file);
        console.log(imagem)
    }

    // Fecha o alerta (sucesso, erro, aviso) automaticamente após 10 segundos
    useEffect(() => {
        if (alertOpen) {
            console.log("ALERT OPENED");
            const timer = setTimeout(() => {
                setAlertOpen(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [alertOpen]);

    /*=====================================================================*/

    return (
        <div>
            <Navbar vazio={false} pageNumber={1} />
            <div className={styles.main}>
                <Options opt1={"Roupa"} opt2={"Tecido"} acao={atualizarInfoTela} />
                <div className={styles.barra_gerenciamento}>
                    <div className={styles.barra_pesquisa}>
                        <BarraPesquisa func={buscarItemEstoque} busca={pesquisa} width='90%' />
                    </div>
                    <div>
                        <JanelaCadastro func={uploadImagemS3}
                            limparCampos={limparCampos}
                            dados={dadosCadastro}
                            children={
                                <Button className={styles.btnCadastro} variant="contained" size="large"
                                    sx={{
                                        p: "1rem 2rem 1rem 2rem", color: "rgba(255, 255, 255, 1)", marginTop: matches ? '0' : '20px'
                                    }}>Cadastrar {categoria}</Button>
                            } action={`Cadastrar ${categoria}`} message={"Confirmar cadastro"}
                            form={
                                <>
                                    <div>
                                        <h3>Descrição</h3>
                                        <TextField size='small' key="descricao" required={true} onChange={(e) => setAtribute(e.target.value, "descricao")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Complemento</h3>
                                        <TextField size='small' key="complemento" required={true} onChange={(e) => setAtribute(e.target.value, "complemento")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Peso</h3>
                                        <TextField size='small' key="peso" required={true} onChange={(e) => setAtribute(e.target.value, "peso")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Qtd. mínimo</h3>
                                        <TextField size='small' key="qtdMinimo" required={true} onChange={(e) => setAtribute(Number(e.target.value), "qtdMinimo")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        {itemEstoque === "Roupa" ? (
                                            <>
                                                <h3>Receber notificações de saída do estoque?</h3>
                                                <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
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
                                        {itemEstoque === "Roupa" ? (
                                            <>
                                                <h3>Selecionar tecidos da roupa</h3>
                                                <SelectOptions lista={tecidos}
                                                    chave={"descricao"}
                                                    id={"id"}
                                                    dados={tecidos.map((item) => item.descricao)}>
                                                </SelectOptions>
                                            </>
                                        ) : <></>}
                                    </div>
                                    <div>
                                        <h3>Categoria</h3>
                                        <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
                                            labelId="select-categoria"
                                            id="select-categoria"
                                            value={categoriaCadastro}
                                            onChange={(e) => handleCategoriaCadastroChange(e)}
                                            label="Age">
                                            {categorias.map(categoria => (
                                                <MenuItem key={categoria.id} value={categoria.nome}>{categoria.nome}</MenuItem>
                                            ))}
                                        </Select>
                                        <h3>Características</h3>
                                        <SelectOptions lista={caracteristicas}
                                            chave={"nome"}
                                            id={"id"}
                                            dados={caracteristicasAtualizacao.map((item) => item.caracteristica)}
                                            func={setCaracteristicasAtualizacao}>
                                        </SelectOptions>
                                        <h3>Prateleira</h3>
                                        <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
                                            labelId="select-prateleira"
                                            id="select-prateleira"
                                            value={prateleiraCadastro}
                                            onChange={(e) => handlePrateleiraCadastroChange(e)}
                                            label="Age">
                                            {prateleiras.map(prateleira => (
                                                <MenuItem key={prateleira.id} value={prateleira.codigo}>{prateleira.codigo}</MenuItem>
                                            ))}
                                        </Select>
                                        <h3>Preço</h3>
                                        <TextField size='small' key="preco" required={true} onChange={(e) => setAtribute(Number(e.target.value), "preco")}
                                            sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                        <h3>Imagem</h3>
                                        <Button variant="contained" component="label">
                                            Carregar Imagem <input onChange={handleImageUpload} type='file' accept=".png, .jpg, .jpeg, .svg" hidden />
                                        </Button>
                                        <br />
                                        <img style={{ width: matches ? "10em" : "4rem" }} src={imagePreview} alt="" />
                                    </div>
                                </>
                            } />
                    </div>
                </div>
                <AlertDialog alertType={alertType} alertTitle={alertTitle} alertMessage={alertMessage} state={alertOpen} />
                {data.length > 0 ? (
                    <div className={styles.lista_parceiros}>
                        {data.map(item => (
                            <BarraVisualizacao key={item.idItemEstoque}
                                children={
                                    <>
                                        <li className={styles.liImagem}>Imagem: <br /> <img src={item.imagem.url} className={styles.imagemItem} style={{ height: matches ? "6rem" : "4rem" }} /> </li>
                                        <hr />
                                        <li className={styles.liTextoLargo}>Descrição: <br /> {item.descricao} </li>
                                        <hr />
                                        <li className={styles.liTextoLargo}>Quantidade em estoque: <br /> {item.qtdArmazenado} </li>
                                        <hr />
                                    </>}
                                limparCampos={limparCampos}
                                acao={`Atualizar dados ${atualizarDados}`} confirm={"Confirmar alterações"}
                                func={atualizarItemEstoque}
                                dadoTitle={atualizarDados}
                                deleteFunc={() => deletarItemEstoque(item)}
                                dados={dadosAtualizacao[dadosAtualizacao.findIndex(dado => dado.idItemEstoque === item.idItemEstoque)]}
                                form={
                                    <>
                                        <div>
                                            <h3>Descrição</h3>
                                            <TextField size='small' key="descricao" required={true} defaultValue={item.descricao} onChange={(e) => updateDados(item, e.target.value, "descricao")}
                                                sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                            <h3>Complemento</h3>
                                            <TextField size='small' key="complemento" required={true} defaultValue={item.complemento} onChange={(e) => updateDados(item, e.target.value, "complemento")}
                                                sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                            <h3>Peso</h3>
                                            <TextField size='small' key="peso" required={true} defaultValue={item.peso} onChange={(e) => updateDados(item, e.target.value, "peso")}
                                                sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                            <h3>Qtd. mínimo</h3>
                                            <TextField size='small' key="qtdMinimo" required={true} defaultValue={item.qtdMinimo} onChange={(e) => updateDados(item, Number(e.target.value), "qtdMinimo")}
                                                sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                            {itemEstoque === "Roupa" ? (
                                                <>
                                                    <h3>Receber notificações de saída do estoque?</h3>
                                                    <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
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
                                            {itemEstoque === "Roupa" ? (
                                            <>
                                                <h3>Selecionar tecidos da roupa</h3>
                                                <SelectOptions lista={tecidos}
                                                    chave={"descricao"}
                                                    id={"id"}
                                                    dados={tecidos.map((item) => item.descricao)}>
                                                </SelectOptions>
                                            </>
                                        ) : <></>}
                                        </div>
                                        <div>
                                            <h3>Categoria</h3>
                                            <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
                                                labelId="select-categoria"
                                                id="select-categoria"
                                                value={categoriaAtualizacao != "" ? categoriaAtualizacao : item.categoria.nome}
                                                onChange={(e) => handleCategoriaChange(item, e, "categoria")}
                                            >
                                                {categorias.map(categoria => (
                                                    <MenuItem key={categoria.id} value={categoria.nome}>{categoria.nome}</MenuItem>
                                                ))}

                                            </Select>
                                            <h3>Características</h3>
                                            <SelectOptions lista={caracteristicas}
                                                chave={"nome"}
                                                id={"id"}
                                                dados={item.caracteristicas.map((dado) => dado.nome)}
                                                func={setCaracteristicasAtualizacao}>
                                            </SelectOptions>
                                            <h3>Prateleira</h3>
                                            <Select size='small' fullWidth sx={{ width: '35vw', marginBottom: '2rem' }}
                                                labelId="select-prateleira"
                                                id="select-prateleira"
                                                value={prateleiraAtualizacao != "" ? prateleiraAtualizacao : item.prateleira.codigo}
                                                onChange={(e) => handlePrateleiraChange(item, e, "prateleira")}
                                            >
                                                {prateleiras.map(prateleira => (
                                                    <MenuItem key={prateleira.id} value={prateleira.codigo}>{prateleira.codigo}</MenuItem>
                                                ))}
                                            </Select>
                                            <h3>Preço</h3>
                                            <TextField size='small' key="preco" required={true} defaultValue={item.preco} onChange={(e) => updateDados(item, Number(e.target.value), "preco")}
                                                sx={{ width: '35vw', marginBottom: '2rem' }} id="outlined-basic" variant="outlined" />
                                            <h3>Imagem</h3>
                                            <Button variant="contained" component="label">
                                                Carregar Imagem <input onChange={handleImageUpload} type='file' accept=".png, .jpg, .jpeg, .svg" hidden />
                                            </Button>
                                            <br />
                                            <img style={{ width: matches ? "10rem" : "4rem" }} src={imagePreview === "" ? item.imagem.url : imagePreview} alt="" />
                                        </div>
                                    </>
                                }
                                info={
                                    <>
                                        <div>
                                            <h3>Descrição:</h3>
                                            <p key="descricao" style={{ width: '100%', marginBottom: '2rem' }}>{item.descricao}</p>
                                            <h3>Complemento:</h3>
                                            <p key="complemento" style={{ width: '100%', marginBottom: '2rem' }}>{item.complemento}</p>
                                            <h3>Peso:</h3>
                                            <p key="peso" style={{ width: '100%', marginBottom: '2rem' }}>{item.peso}</p>
                                            <h3>Qtd. mínimo:</h3>
                                            <p key="qtdMinimo" style={{ width: '100%', marginBottom: '2rem' }}>{item.qtdMinimo}</p>
                                            <h3>Qtd. Armazenado:</h3>
                                            <p key="qtdArmazenado" style={{ width: '100%', marginBottom: '2rem' }}>{item.qtdArmazenado}</p>
                                            {itemEstoque === "Roupa" ? (<>
                                                <h3>Receber notificações</h3>
                                                <p style={{ width: '100%', marginBottom: '2rem' }}>{item.notificar === 0 ? "Não" : "Sim"}</p> 
                                                <h3>Tecidos:</h3>
                                                {item.confeccaoRoupa.map((dado) => <p>{dado.tecido.descricao}</p>)}
                                            </>) : null}
                                        </div>
                                        <div>
                                            <h3>Categoria:</h3>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.categoria.nome}</p>
                                            <h3>Características:</h3>
                                            {item.caracteristicas.map((dado) => <p>{dado.nome}</p>)}
                                            <h3 style={{ marginTop: '2rem' }}>Prateleira</h3>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.prateleira.codigo}</p>
                                            <h3>Preço:</h3>
                                            <p style={{ width: '100%', marginBottom: '2rem' }}>{item.preco}</p>
                                            <h3>Imagem:</h3>
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