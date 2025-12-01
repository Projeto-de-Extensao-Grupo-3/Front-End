import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, plugins, scales } from 'chart.js';
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from "./produtos.module.css"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { Paper } from '@mui/material';
import { api } from '../../provider/api'

Chart.register(CategoryScale);
Chart.register(ChartDataLabels);


export function GraficoCustos(props) {

    const [labels, setLabels] = useState([]);
    const [dadosCostura, setDadosCostura] = useState([]);
    const [dadosTecido, setDadosTecido] = useState([]);
    const [lucro, setLucro] = useState([]);
    const [max, setMax] = useState(60);

    const [isSplit, setIsSplit] = useState(true);
    const [first, setFirst] = useState(0);
    const [last, setLast] = useState(5); // 5 elementos [0,1,2,3,4] (splice exclui o 5)

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Margem de lucro por peça %",
                data: dadosCostura
            }
        ]
    })


    const handlePrevious = () => {
        if (first == 0) {
            return;
        }
        if (!isSplit) {
            console.log("poggers?")
            return;
        }
        setFirst(first - 5);
        setLast(last - 5);
    }

    const handleNext = () => {
        if (last >= dadosCostura.length) {
            return;
        }
        setFirst(first + 5);
        setLast(last + 5);
    }

    const handleSetSplit = () => {
        setIsSplit(!isSplit)
    }

    const chamarApi = useEffect(() => {
        // Apos chamada de api, logica permanece similar
        const retorno = [
            {
                "descricao": "Conjunto Gabi",
                "preco_venda": 75.00,
                "custo_tecido": 20.00,
                "custo_costura": 25.00
            },
            {
                "descricao": "Conjunto Pantalona",
                "preco_venda": 75.00,
                "custo_tecido": 20.00,
                "custo_costura": 25.00
            },
            {
                "descricao": "Conjunto Saia",
                "preco_venda": 49.00,
                "custo_tecido": 17.50,
                "custo_costura": 11.50
            },
            {
                "descricao": "Calça Jogger",
                "preco_venda": 35.00,
                "custo_tecido": 13.00,
                "custo_costura": 9.00
            },
            {
                "descricao": "Macacão Lívia",
                "preco_venda": 49.00,
                "custo_tecido": 23.50,
                "custo_costura": 7.50
            },
            {
                "descricao": "Calça Flare",
                "preco_venda": 35.00,
                "custo_tecido": 12.50,
                "custo_costura": 10.50
            },
            {
                "descricao": "Macacão Lívia",
                "preco_venda": 47.00,
                "custo_tecido": 26.50,
                "custo_costura": 9.50
            },
            {
                "descricao": "Blusa Mulet",
                "preco_venda": 27.00,
                "custo_tecido": 10.25,
                "custo_costura": 5.75
            },
            {
                "descricao": "Calça De Montaria Com Bolso",
                "preco_venda": 30.00,
                "custo_tecido": 10.50,
                "custo_costura": 5.50
            },
            {
                "descricao": "Shorts Moletinho",
                "preco_venda": 25.00,
                "custo_tecido": 10.00,
                "custo_costura": 4.00
            },
            {
                "descricao": "Camisa Over",
                "preco_venda": 25.00,
                "custo_tecido": 9.00,
                "custo_costura": 3.00
            },
            {
                "descricao": "Blusa Gola Boba",
                "preco_venda": 20.00,
                "custo_tecido": 7.50,
                "custo_costura": 2.50
            },
            {
                "descricao": "Blusa Regata Marrocos",
                "preco_venda": 20.00,
                "custo_tecido": 9.50,
                "custo_costura": 1.50
            },
            {
                "descricao": "Blusa Gola Quadrada Canelada",
                "preco_venda": 22.00,
                "custo_tecido": 8.75,
                "custo_costura": 1.25
            },
            {
                "descricao": "Blusa Gola V Canelada",
                "preco_venda": 22.00,
                "custo_tecido": 8.75,
                "custo_costura": 2.25
            }
        ]

        api.get("/lotes-item-estoque/peca-maior-mao-obra", {
            params: props.filters
        }).then((response) => {
            if (response.status == 204) {
                setLabels([]);
                setDadosCostura([]);
                setDadosTecido([]);
                setLucro([]);
                setMax(0);
                return;
            }
            let data = response.data;

            data.sort((a, b) => b.preco - a.preco)
            setMax(data[0].preco)

            // labels (nome das roupas)
            let aux = [];
            data.forEach(dado => aux.push(dado['descricao']));
            setLabels(aux)


            // dadosCostura
            aux = [];
            data.forEach(dado => aux.push(Number(dado['custoCostureira']).toFixed(1)))
            setDadosCostura(aux)

            // dadosTecido
            aux = [];
            data.forEach(dado => aux.push(Number(dado['custoTecidos'])).toFixed(1))
            setDadosTecido(aux)

            // lucro
            aux = [];
            data.forEach(dado => aux.push((Number(dado['preco'] - (dado['custoCostureira'] + dado['custoTecidos'])).toFixed(1))))
            setLucro(aux)
        })


    }, [props.filters])

    const atualizarTabela = useEffect(() => {
        if (isSplit) {
            setChartData({
                labels: labels.slice(first, last),
                datasets: [
                    {
                        label: "Custo de Mão de Obra (R$)",
                        data: dadosCostura.slice(first, last)
                    },
                    {
                        label: "Custo de Material (R$)",
                        data: dadosTecido.slice(first, last)
                    },
                    {
                        label: "Lucro (R$)",
                        data: lucro.slice(first, last)
                    }
                ]
            })
        } else {
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Custo de Mão de Obra (R$)",
                        data: dadosCostura
                    },
                    {
                        label: "Custo de Material (R$)",
                        data: dadosTecido
                    },
                    {
                        label: "Lucro (R$)",
                        data: lucro
                    }
                ]
            })  
        }
    }, [labels, dadosCostura, dadosTecido, lucro, first, last, isSplit])

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        // indexAxis: 'y'
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                max: max
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Composição de custos por Peça de roupa"
            }
        }
    }

    const styleButtons = {
        width: '50px',
        height: '50px',
        cursor: 'pointer'
    }

    return (
        <div className={styles.main}>
            <div className={styles.divButtons}>
                <IconButton onClick={() => handlePrevious()}>
                    <NavigateBeforeIcon sx={styleButtons} />
                </IconButton>
                <IconButton onClick={() => handleSetSplit()}>
                    {isSplit ? "5 por Vez" : "Todos"}
                </IconButton>
                <IconButton onClick={() => handleNext()}>
                    <NavigateNextIcon sx={styleButtons} />
                </IconButton>
            </div>
            <div className={styles.divGrafico}>
                {
                labels.length > 0 
                ? <Bar data={chartData} options={options} />
                : <Paper sx={{p: '40px'}} elevation={4}>Nenhum dado a ser exibido, tente mudar os filtros</Paper>
                }
            </div>
        </div>
    )
}