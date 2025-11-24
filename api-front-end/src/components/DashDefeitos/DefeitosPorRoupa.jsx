import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

export function DefeitosPorRoupa() {

    const [labels, setLabels] = useState();
    const [dados, setDados] = useState();
    const [colors, setColors] = useState();

    // Source - https://stackoverflow.com/a
    // Posted by serdarsen, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-11-24, License - CC BY-SA 4.0

    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

    const [chartData, setChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Defeitos por produto",
                data: dados,
                backgroundColor: colors
            }
        ]
    })

    const chamarApi = useEffect(() => {
        // Apos chamada de api, logica permanece similar
        const retorno = [{
            "produto": "Vestido azul florido",
            "qtd_defeitos": 9,
        },{
            "produto": "Camisa vermelha lisa",
            "qtd_defeitos": 7,
        },{
            "produto": "Bermuda cinza com listras vermelhas",
            "qtd_defeitos": 12,
        },{
            "produto": "Vestido azul e preto",
            "qtd_defeitos": 1,
        },{
            "produto": "Vestido branco e dourado",
            "qtd_defeitos": 2,
        },{
            "produto": "Camiseta Estampa Florida",
            "qtd_defeitos": 4,
        },{
            "produto": "Camiseta Branca sem Estampa",
            "qtd_defeitos": 5,
        },{
            "produto": "Jeans Rasgado",
            "qtd_defeitos": 22,
        },{
            "produto": "Jeans Baggy",
            "qtd_defeitos": 12,
        },{
            "produto": "Saia Pregas bege",
            "qtd_defeitos": 19,
        },]

        // labels
        let aux = [];
        retorno.forEach(dado => aux.push(dado['produto']));
        console.log(aux)
        setLabels(aux)

        aux = [];
        for (let i = 0; i < retorno.length; i++) {

            aux.push(randomRGB());
        }
        setColors(aux)


        // dados
        aux = [];
        retorno.forEach(dado => aux.push(dado['qtd_defeitos']))
        setDados(aux)

    }, [])

    const atualizarTabela = useEffect(() => {
        console.log(colors)
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Taxa de defeitos por costureira",
                    data: dados,
                    backgroundColor: colors
                }
            ]
        })
    }, [labels, dados])

    return (
        <Pie data={chartData} />
    )
}