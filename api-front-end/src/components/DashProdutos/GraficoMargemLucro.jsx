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
Chart.register(CategoryScale);
Chart.register(ChartDataLabels);


export function GraficoMargemLucro() {
    
    const [labels, setLabels] = useState([]);
    const [dados, setDados] = useState([]);

    const [isSplit, setIsSplit] = useState(true);
    const [first, setFirst] = useState(0);
    const [last, setLast] = useState(5); // 5 elementos [0,1,2,3,4] (splice exclui o 5)
    const [max, setMax] = useState(100)

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Margem de lucro por peça %",
                data: dados
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
        if (last >= dados.length) {
            return;
        }
        setFirst(first + 5);
        setLast(last + 5);
    }

    const handleSetSplit = () => {
        setIsSplit(!isSplit)
    }

    

    const chamarApi = useEffect(() => {
        axios.get("/api/lotes-item-estoque/margem-lucro-produtos")
            .then((response) => {
                // labels (nome das roupas)                
                let data = response.data;
                data.sort((a, b) => b.margemLucro - a.margemLucro) // ordenando por ordem lucro desc
                setMax(data[0].margemLucro + 10)

                let aux = [];
                data.forEach(dado => aux.push(dado['nomeProduto']));
                setLabels(aux)
        
        
                // dados
                aux = [];
                data.forEach(dado => aux.push(dado['margemLucro']))
                setDados(aux)
            }).catch((error) => {
                console.error("Falha ao obter os dados de margem de lucro:" + error)
            })
    }, [])

    const atualizarTabela = useEffect(()=> {
        if (isSplit) {
            setChartData({
                labels: labels.slice(first, last),
                datasets: [
                    {
                        label: "Margem de lucro por peça %",
                        data: dados.slice(first, last)
                    }
                ]
            })
        } else {
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Margem de lucro por peça %",
                        data: dados
                    }
                ]
            })
        }
    }, [labels, dados, isSplit, first, last])

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        plugins : {
            title: {
                display: true,
                text: "Margem de lucro por peça"
            }
        },
        scales: {
            x: {
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
                <IconButton onClick={() => handleSetSplit()}>
                    {isSplit ? "5 por Vez" : "Todos"}
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