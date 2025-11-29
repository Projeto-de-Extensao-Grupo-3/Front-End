import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from "chart.js/auto";
import axios from 'axios';
import { Paper } from '@mui/material';


Chart.register(CategoryScale);
Chart.register(ChartDataLabels);

export function GraficoVendas(props) {

    const [labels, setLabels] = useState([]);
    const [dadosFaturamento, setDadosFaturamento] = useState([]);
    const [dadosCustos, setDadosCustos] = useState([]);

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Vendas (R$) e Crescimento (%) por mês ",
                data: dadosFaturamento
            }
        ]
    })

    const chamarApi = useEffect(() => {

        axios.get('/api/itens-estoque/evolucao-vendas', {
            params: props.filters
        }).then((response) => {
            if (response.status == 204) {
                setLabels([]);
                setDadosFaturamento([]);
                setDadosCustos([]);
                return;
            }
            let data = response.data;

            // labels
            let aux = [];
            data.forEach(dado => aux.push(dado['periodo']));
            setLabels(aux)


            // dadosFaturamento
            aux = [];
            data.forEach(dado => aux.push(dado['faturamento_bruto']))
            setDadosFaturamento(aux)

            // dadosCustos
            aux = []
            data.forEach(dado => aux.push(dado['custos']))
            setDadosCustos(aux)
        })
    }, [props.filters])

    const atualizarTabela = useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Faturamento total em R$",
                    data: dadosFaturamento
                },
                {
                    label: "Despesas em R$",
                    data: dadosCustos,
                }
            ]
        })
    }, [labels, dadosFaturamento])

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
                labels.length > 0
                    ? <Bar data={chartData} />
                    : <Paper sx={{ p: '40px' }} elevation={4}>Nenhum dado a ser exibido, tente mudar os filtros</Paper>
            }
        </div>
    )
}