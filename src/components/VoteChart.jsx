// src/components/VoteChart.jsx
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

export default function VoteChart({ votes = {}, question }) {
  if (!question || !question.options || question.options.length === 0) {
    return <p className="text-gray-500 mt-4">No question provided.</p>;
  }

  // Normalize vote counts to include all options
  const optionCounts = question.options.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  Object.values(votes).forEach((vote) => {
    if (optionCounts.hasOwnProperty(vote)) {
      optionCounts[vote]++;
    }
  });

  const labels = question.options;
  const values = labels.map((opt) => optionCounts[opt]);

  const data = {
    labels,
    datasets: [
      {
        label: "Votes",
        data: values,
        borderWidth: 1,
        backgroundColor: "#3b82f6",
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

  const noVotesYet = Object.values(optionCounts).every((count) => count === 0);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {noVotesYet ? (
        <p className="text-gray-500 mt-4">No votes received yet.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
