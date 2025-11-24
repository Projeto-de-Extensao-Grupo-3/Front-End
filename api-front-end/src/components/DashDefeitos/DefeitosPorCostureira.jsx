import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

export function DefeitosPorCostureira() {

    const [labels, setLabels] = useState();
    const [dados, setDados] = useState();

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Defeitos por costureira",
                data: dados
            }
        ]
    })

    const chamarApi = useEffect(() => {
        // Apos chamada de api, logica permanece similar
        const retorno = [{
            "costureira": "Maria",
            "qtd_defeitos": 9,
            "qtd_total_entregas": 102
        },
        {
            "costureira": "Rosanjela",
            "qtd_defeitos": 20,
            "qtd_total_entregas": 153
        },
        {
            "costureira": "Soeli",
            "qtd_defeitos": 1,
            "qtd_total_entregas": 84
        }]

        // labels
        let aux = [];
        retorno.forEach(dado => aux.push(dado['costureira']));
        setLabels(aux)


        // dados
        aux = [];
        retorno.forEach(dado => aux.push(dado['qtd_defeitos'] / dado['qtd_total_entregas'] * 100))
        setDados(aux)

    }, [])

    const atualizarTabela = useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Taxa de defeitos por costureira",
                    data: dados
                }
            ]
        })
    }, [labels, dados])

    return (
        <Bar data={chartData} />
    )
}