import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";
import axios from 'axios';

Chart.register(CategoryScale);

export function DefeitosPorCostureira() {

    const [labels, setLabels] = useState();
    const [dados, setDados] = useState();

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Defeitos por costureira %",
                data: dados
            }
        ]
    })

    const chamarApi = useEffect(() => {

        axios.get("/api/saidas-estoque/taxa-defeito-costura")
            .then((response) => {
                let data = response.data;

                let aux = [];
                data.forEach(dado => aux.push(dado['nomeCostureira']));
                setLabels(aux)
        
        
                // dados
                aux = [];
                data.forEach(dado => aux.push((dado['qtdDefeito'] / dado['totalPeças'] * 100).toFixed(1)))
                setDados(aux)
            })
    }, [])

    const atualizarTabela = useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Taxa de defeitos por costureira %",
                    data: dados
                }
            ]
        })
    }, [labels, dados])

    const options = {
        scales: {
            y: {
                max: 100
            }
        },
        plugins : {
            title: {
                display: true,
                text: "Taxa de defeitos por costureira"
            }
        }
    }

    return (
        <Bar data={chartData} options={options}/>
    )
}