import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SpendingChart({ transactions }) {
  // Filter only expenses
  const expenses = transactions.filter((t) => t.amount < 0);

  // Group by category
  const totalsByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(totalsByCategory),
    datasets: [
      {
        data: Object.values(totalsByCategory),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
          "#c9cbcf",
          "#84ff63",
        ],
      },
    ],
  };

  if (expenses.length === 0) {
    return <p>No expenses to display.</p>;
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Expenses by Category</h5>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;
