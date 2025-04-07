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
    return <p style={{ color: "#888", marginTop: "1rem" }}>No question provided.</p>;
  }

  // Include all options with default count of 0
  const optionCounts = question.options.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  // Tally received votes
  // Tally received votes (handle arrays and individual values safely)
Object.entries(votes).forEach(([player, vote]) => {
  if (Array.isArray(vote)) {
    vote.forEach((v) => {
      if (optionCounts.hasOwnProperty(v)) optionCounts[v]++;
    });
  } else if (optionCounts.hasOwnProperty(vote)) {
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
        backgroundColor: labels.map((opt) => {
  if (question.correctAnswer && opt === question.correctAnswer) {
    return "#10b981"; // green
  }
  return "#3b82f6"; // default blue
}),

        borderRadius: 4,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  const noVotesYet = Object.values(optionCounts).every((count) => count === 0);

  return (
    <div style={{ maxWidth: "700px", height: "300px", margin: "1rem auto" }}>
      {noVotesYet ? (
        <p style={{ color: "#888" }}>No votes received yet.</p>
      ) : (
        <Bar data={data} options={chartOptions} />
      )}
    </div>
  );
}
