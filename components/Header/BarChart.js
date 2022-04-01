import { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function BarChart({ statisticsState }) {
  const { guesses } = statisticsState;
  const guessValues = [
    guesses[1],
    guesses[2],
    guesses[3],
    guesses[4],
    guesses[5],
    guesses[6],
  ];
  const { averageGuesses } = statisticsState;
  const labels = ['1', '2', '3', '4', '5', '6'];
  const root = window.document.documentElement;
  const secondaryColor = root.style.getPropertyValue('--color-secondary');
  const successColor = root.style.getPropertyValue('--color-success');
  const backgroundColors = Array(6).fill(secondaryColor);
  backgroundColors[averageGuesses - 1] = successColor;

  const options = {
    responsive: true,
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            let { label } = context.dataset;
            const index = context.dataIndex;
            if (index === averageGuesses - 1) {
              label = [`${label} : ${context.parsed.y}`, '', ' (average)'];
            } else {
              label += `: ${context.parsed.y}`;
            }
            return label;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: ' Number of times',
        data: guessValues,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export default memo(BarChart);
