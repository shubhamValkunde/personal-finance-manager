const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  [
    check("title", "Title is required").not().isEmpty(),
    check("amount", "Amount must be a number").isNumeric(),
    check("category", "Category is required").not().isEmpty(),
  ],
  createTransaction
);

router.get("/", protect, getTransactions);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
