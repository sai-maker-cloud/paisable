const express = require('express');
const router = express.Router();

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getChartData,
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');
// Route for getting all and adding a new transaction
router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/summary').get(protect, getTransactionSummary);
router.route('/charts').get(protect, getChartData);

// Route for updating and deleting a specific transaction
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;