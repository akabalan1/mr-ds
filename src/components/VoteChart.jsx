import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function VoteChart({ tally }) {
  if (!tally || Object.keys(tally).length === 0) {
    return <p className="text-gray-500 mt-4">No votes received yet.</p>;
  }

  const labels = Object.keys(tally);
  const values = Object.values(tally);

  const data = {
    labels,
    datasets: [
      {
        label: "Votes",
        data: values,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Bar data={data} options={options} />
    </div>
  );
}
