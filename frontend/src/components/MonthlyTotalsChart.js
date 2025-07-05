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

function MonthlyTotalsChart({ transactions }) {
  // Group by month
  const grouped = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!grouped[key]) {
      grouped[key] = { income: 0, expenses: 0 };
    }
    if (t.amount > 0) {
      grouped[key].income += t.amount;
    } else {
      grouped[key].expenses += Math.abs(t.amount);
    }
  });

  const labels = Object.keys(grouped).sort();
  const incomeData = labels.map((key) => grouped[key].income);
  const expenseData = labels.map((key) => grouped[key].expenses);

  if (labels.length === 0) {
    return <p>No transactions to display.</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Monthly Income & Expenses</h5>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
}

export default MonthlyTotalsChart;
