import React, { useEffect, useState } from "react";
import API from "../services/api";
import AddTransaction from "../components/AddTransaction";
import EditTransactionModal from "../components/EditTransactionModal";
import SpendingChart from "../components/SpendingChart";
import MonthlyTotalsChart from "../components/MonthlyTotalsChart";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const filteredTransactions = selectedCategory
    ? transactions.filter((tx) => tx.category === selectedCategory)
    : transactions;

  const [editingTransaction, setEditingTransaction] = useState(null);
  const handleEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleUpdate = (updatedTx) => {
    setTransactions(
      transactions.map((tx) => (tx._id === updatedTx._id ? updatedTx : tx))
    );
  };

  const categories = [
    "Food",
    "Salary",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Utilities",
    "Other",
  ];

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expenses;

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

  const handleAdd = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Your Transactions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Income</h5>
              <p className="card-text">₹{income.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Expenses</h5>
              <p className="card-text">₹{expenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Balance</h5>
              <p className="card-text">₹{balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <AddTransaction onAdd={handleAdd} />
      <div className="mb-3">
        <label>Filter by Category</label>
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <SpendingChart transactions={transactions} />

      <MonthlyTotalsChart transactions={transactions} />

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.title}</td>
                <td>{tx.amount}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(tx)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(tx._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default Dashboard;
