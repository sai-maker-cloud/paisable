const express = require('express');
const router = express.Router();

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getChartData,
  getExpenseCategories,
  getIncomeCategories,
  deleteCategory,
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');
// Route for getting all and adding a new transaction
router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/summary').get(protect, getTransactionSummary);
router.route('/charts').get(protect, getChartData);
router.route('/categories/expense').get(protect, getExpenseCategories);
router.route('/categories/income').get(protect,getIncomeCategories);
router.route('/category').delete(protect, deleteCategory); 

// Route for updating and deleting a specific transaction
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;