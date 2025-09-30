const express = require('express');
const router = express.Router();
const { createRecurringTransaction, getRecurringTransactions, deleteRecurringTransaction } = require('../controllers/recurringTransactionController');

const { protect } = require('../middleware/authMiddleware');

// router.route('/api/recurring').post(protect, createRecurringTransaction);
// router.post('/create', protect, createRecurringTransaction);
router.route('/create').post(protect, createRecurringTransaction);
router.route('/').get(protect, getRecurringTransactions);
router.route('/:id').delete(protect, deleteRecurringTransaction);


module.exports = router;