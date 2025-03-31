
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const VoteChart = ({ tally }) => {
  const labels = Object.keys(tally || {});
  const values = Object.values(tally || {});

  const data = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: values,
        backgroundColor: ['#e57373', '#ba68c8', '#64b5f6', '#ffd54f'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Vote Results' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default VoteChart;
