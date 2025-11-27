import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from "chart.js/auto";
import axios from 'axios';

Chart.register(CategoryScale);
Chart.register(ChartDataLabels);

export function GraficoVendas(props) {

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

        axios.get('/api/itens-estoque/evolucao-vendas', {
            params: props.filters
        }).then((response) => {
            let data = response.data;

            // labels
            let aux = [];
            data.forEach(dado => aux.push(dado['mes_atual']));
            setLabels(aux)


            // dadosBarra
            aux = [];
            data.forEach(dado => aux.push(dado['totalVendasAtual']))
            setDadosBarra(aux)

            // dadosLinha
            aux = []
            data.forEach(dado => aux.push(dado['crescimentoPercentual']))
            setDadosLinha(aux)
        })
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