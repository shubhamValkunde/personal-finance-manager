import React, { useEffect, useState } from "react";
import API from "../services/api";
import AddTransaction from "../components/AddTransaction";
import EditTransactionModal from "../components/EditTransactionModal";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const handleEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleUpdate = (updatedTx) => {
    setTransactions(
      transactions.map((tx) => (tx._id === updatedTx._id ? updatedTx : tx))
    );
  };

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
      <AddTransaction onAdd={handleAdd} />

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
            {transactions.map((tx) => (
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
