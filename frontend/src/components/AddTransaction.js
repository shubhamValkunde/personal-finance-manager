import React, { useState } from "react";
import API from "../services/api";

function AddTransaction({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !amount || !category) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await API.post("/transactions", {
        title,
        amount: parseFloat(amount),
        category,
      });

      setTitle("");
      setAmount("");
      setCategory("");

      onAdd(res.data);
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? err.response.data.errors[0].msg
          : "Failed to add transaction."
      );
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Add Transaction</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Amount (use -ve for expenses)</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
