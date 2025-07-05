import React, { useState, useEffect } from "react";
import API from "../services/api";

function EditTransactionModal({ transaction, onClose, onUpdate }) {
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

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !amount || !category) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await API.put(`/transactions/${transaction._id}`, {
        title,
        amount: parseFloat(amount),
        category,
      });

      onUpdate(res.data);
      onClose();
    } catch (err) {
      setError("Failed to update transaction.");
    }
  };

  if (!transaction) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Transaction</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;
