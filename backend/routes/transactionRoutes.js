const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');

// Route for getting all and adding a new transaction
router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

// Route for updating and deleting a specific transaction
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;