import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, scales } from 'chart.js';
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from "./produtos.module.css"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';
import { maxHeight } from '@mui/system';


Chart.register(CategoryScale);
Chart.register(ChartDataLabels);


export function GraficoCustos() {

    const [labels, setLabels] = useState([]);
    const [dadosCostura, setDadosCostura] = useState([]);
    const [dadosTecido, setDadosTecido] = useState([]);
    const [lucro, setLucro] = useState([]);
    const [max, setMax] = useState(60);

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

        retorno.sort((a, b) => b.preco_venda - a.preco_venda)
        setMax(retorno[0].preco_venda)

        // labels (nome das roupas)
        let aux = [];
        retorno.forEach(dado => aux.push(dado['descricao']));
        setLabels(aux)


        // dadosCostura
        aux = [];
        retorno.forEach(dado => aux.push(dado['custo_costura']))
        setDadosCostura(aux)

        // dadosTecido
        aux = [];
        retorno.forEach(dado => aux.push(dado['custo_tecido']))
        setDadosTecido(aux)

        // lucro
        aux = [];
        retorno.forEach(dado => aux.push(dado['preco_venda'] - (dado['custo_costura'] + dado['custo_tecido'])))
        setLucro(aux)

    }, [])

    const atualizarTabela = useEffect(() => {
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
    }, [labels, dadosCostura, dadosTecido, lucro, first, last])

    const options = {
        maintainAspectRatio: true,
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
                    <NavigateBeforeIcon  sx={styleButtons}/>
                </IconButton>
                <IconButton onClick={() => handleNext()}>
                    <NavigateNextIcon sx={styleButtons}/>
                </IconButton>
            </div>
            <div className={styles.divGrafico}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    )
}