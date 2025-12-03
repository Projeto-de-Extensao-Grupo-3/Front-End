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

// Chart.register(CategoryScale);
// Chart.register(ChartDataLabels);


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

        setFirst(0)
        setLast(5) // Reiniciando pagina ao filtrar

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