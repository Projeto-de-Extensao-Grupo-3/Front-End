import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";
import axios from 'axios';
import { Paper } from '@mui/material';

Chart.register(CategoryScale);

export function DefeitosPorCostureira(props) {

    const [labels, setLabels] = useState([]);
    const [total, setTotal] = useState([]);
    const [defeitos, setDefeitos] = useState([]);

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Defeitos por costureira (unidades)",
                data: defeitos
            },
            {
                label: "Total de peças (unidades)",
                data: total
            }
        ]
    })

    const chamarApi = useEffect(() => {

        axios.get("/api/saidas-estoque/taxa-defeito-costura", {
            params: props.filters
        }).then((response) => {
            console.log(response.data)
            if (response.status == 204) {
                setLabels(0);
                return;
            }
            let data = response.data;

            let aux = [];
            data.forEach(dado => aux.push(dado['nomeCostureira']));
            setLabels(aux)

            aux = [];
            data.forEach(dado => aux.push(dado['qtdDefeito']));
            setDefeitos(aux)

            aux = [];
            data.forEach(dado => aux.push(dado['totalPeças']));
            setTotal(aux)
        })
    }, [props.filters])

    const atualizarTabela = useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Total de peças (unidades)",
                    data: total
                } ,
                {
                    label: "Total de defeitos (unidades)",
                    data: defeitos
                }
            ]
        })
    }, [labels])

    const options = {
        plugins: {
            title: {
                display: true,
                text: "Taxa de defeitos por costureira"
            }
        }
    }

    return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {
            labels.length > 0
                ? <Bar data={chartData} options={options} />
                : <Paper sx={{ p: '40px' }} elevation={4}>Nenhum dado a ser exibido, tente mudar os filtros</Paper>
        }
    </div>
    )
}