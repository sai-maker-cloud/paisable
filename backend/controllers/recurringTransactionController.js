const RecurringTransaction = require('../models/RecurringTransactions');

const createRecurringTransaction = async (req, res) => {
    const { name, category, amount, isIncome, frequency, startDate } = req.body;

    try {
        const recurringTransaction = new RecurringTransaction({
            user: req.user.id,
            name, category, amount, isIncome, frequency, startDate
        })

        const createdRecurringTransaction = await recurringTransaction.save();
        res.status(201).json(createdRecurringTransaction);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }

}

const getRecurringTransactions = async (req, res) => {
    const transactions = await RecurringTransaction.find({ user: req.user._id });
    res.json(transactions);
};


const updateRecurringTransaction = async (req, res) => {
    const updated = await RecurringTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

const deleteRecurringTransaction = async (req, res) => {
    await RecurringTransaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
};

module.exports = { createRecurringTransaction, deleteRecurringTransaction, getRecurringTransactions }