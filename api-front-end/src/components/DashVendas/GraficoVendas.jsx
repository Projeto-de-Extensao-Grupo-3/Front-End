import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from "chart.js/auto";

Chart.register(CategoryScale);
// Chart.register(ChartDataLabels);

export function GraficoVendas() {

    const [labels, setLabels] = useState();
    const [dadosBarra, setDadosBarra] = useState();
    const [dadosLinha, setDadosLinha] = useState();

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Vendas (R$) e Crescimento (%) por mês ",
                data: dadosBarra
            }
        ]
    })

    const chamarApi = useEffect(() => {
        // Apos chamada de api, logica permanece similar
        const retorno = [
            {
                "mes_atual": "2025-03",
                "total_vendas_atual": 8.00,
                "crescimento_percentual": null
            },
            {
                "mes_atual": "2025-04",
                "total_vendas_atual": 14.00,
                "crescimento_percentual": 75.00
            },
            {
                "mes_atual": "2025-05",
                "total_vendas_atual": 21.00,
                "crescimento_percentual": 50.00
            },
            {
                "mes_atual": "2025-06",
                "total_vendas_atual": 27.00,
                "crescimento_percentual": 28.57
            },
            {
                "mes_atual": "2025-07",
                "total_vendas_atual": 33.00,
                "crescimento_percentual": 22.22
            },
            {
                "mes_atual": "2025-08",
                "total_vendas_atual": 39.00,
                "crescimento_percentual": 18.18
            },
            {
                "mes_atual": "2025-09",
                "total_vendas_atual": 45.00,
                "crescimento_percentual": 15.38
            },
            {
                "mes_atual": "2025-10",
                "total_vendas_atual": 78.00,
                "crescimento_percentual": 73.33
            }]

        // labels
        let aux = [];
        retorno.forEach(dado => aux.push(dado['mes_atual']));
        setLabels(aux)


        // dadosBarra
        aux = [];
        retorno.forEach(dado => aux.push(dado['total_vendas_atual']))
        setDadosBarra(aux)

        // dadosLinha
        aux = []
        retorno.forEach(dado => aux.push(dado['crescimento_percentual']))
        setDadosLinha(aux)

    }, [])

    const atualizarTabela = useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Vendas por mês (Quantidade de transações)",
                    data: dadosBarra
                }, 
                {
                    label: "Crescimento por mês (%)",
                    data: dadosLinha,
                }
            ]
        })
    }, [labels, dadosBarra])

    return (
        <Bar data={chartData} />
    )
}