import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

export function GraficoMargemLucro() {
    
    const [labels, setLabels] = useState();
    const [dados, setDados] = useState();

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Margem de lucro por peça",
                data: dados
            }
        ]
    })

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
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Margem de lucro por peça",
                    data: dados
                }
            ]
        })
    }, [labels, dados])

    return (
        <Bar data={chartData} />
    )
}