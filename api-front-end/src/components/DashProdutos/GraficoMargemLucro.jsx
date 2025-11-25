import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, plugins, scales } from 'chart.js';
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from "./produtos.module.css"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';

Chart.register(CategoryScale);
Chart.register(ChartDataLabels);


export function GraficoMargemLucro() {
    
    const [labels, setLabels] = useState([]);
    const [dados, setDados] = useState([]);

    const [isSplit, setIsSplit] = useState(true);
    const [first, setFirst] = useState(0);
    const [last, setLast] = useState(5); // 5 elementos [0,1,2,3,4] (splice exclui o 5)

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
            console.log("poggers?")
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
        // Apos chamada de api, logica permanece similar
        const retorno = [{
            "id_roupa": 1,
            "descricao": "Vestido azul florido",
            "margem_lucro_%": 21.59
        },
        {
            "id_roupa": 2,
            "descricao": "Camisa vermelha lisa",
            "margem_lucro_%": 22.49
        },
        {
            "id_roupa": 3,
            "descricao": "Bermuda cinza com listras vermelhas",
            "margem_lucro_%": 35.89
        }]

        // labels (nome das roupas)
        let aux = [];
        retorno.forEach(dado => aux.push(dado['descricao']));
        setLabels(aux)


        // dados
        aux = [];
        retorno.forEach(dado => aux.push(dado['margem_lucro_%']))
        setDados(aux)

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
    }, [labels, dados, isSplit])

    const options = {
        indexAxis: 'y',
        plugins : {
            title: {
                display: true,
                text: "Margem de lucro por peça"
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