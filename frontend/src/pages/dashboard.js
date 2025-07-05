import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        setError("Failed to load transactions. Please log in again.");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Your Transactions</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.title}</td>
                <td>{tx.amount}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
