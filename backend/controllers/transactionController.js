const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");

// Create a transaction
exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, amount, category, date } = req.body;

  try {
    const transaction = new Transaction({
      user: req.user,
      title,
      amount,
      category,
      date,
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
