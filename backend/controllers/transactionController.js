const IncomeExpense = require('../models/IncomeExpense');

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
// @desc    Add a new transaction
const addTransaction = async (req, res) => {
  const { name, category, cost, addedOn, isIncome } = req.body;

  try {
    // Convert and validate cost
    const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    
    if (isNaN(numericCost) || numericCost <= 0) {
      return res.status(400).json({ message: 'Cost must be a positive number' });
    }

    const transaction = new IncomeExpense({
      user: req.user.id,
      name,
      category,
      cost: numericCost, // Use the converted number
      addedOn,
      isIncome,
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all transactions for a user with enhanced filtering and pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { isIncome, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit))); 

    const filter = { user: req.user.id, isDeleted: false };
    
    // Filter by income/expense type
    if (isIncome !== undefined && isIncome !== '') {
      filter.isIncome = isIncome === 'true';
    }
    
    // Filter by category
    if (category && category !== '') {
      filter.category = category;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filter.addedOn = {};
      
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter.addedOn.$gte = start;
        }
      }
      
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter.addedOn.$lte = end;
        }
      }
    }
    
    // Execute query with pagination
    const [transactions, totalCount] = await Promise.all([
      IncomeExpense.find(filter)
        .sort({ addedOn: -1, createdAt: -1 }) // Sort by date descending, then by creation time
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum)
        .lean(), 
      IncomeExpense.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      transactions,
      totalPages,
      currentPage: pageNum,
      totalTransactions: totalCount,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await IncomeExpense.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction belongs to the user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { name, category, cost, addedOn, isIncome } = req.body;
    
    // Validate cost if provided
    if (cost !== undefined) {
     
     const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost;
     
     // Check if it's a valid positive number
     if (isNaN(numericCost) || numericCost <= 0) {
       return res.status(400).json({ message: 'Cost must be a positive number' });
     }
     
     transaction.cost = numericCost;
   }

    // Validate date if provided
    if (addedOn !== undefined) {
      const date = new Date(addedOn);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
    }

    transaction.name = name || transaction.name;
    transaction.category = category || transaction.category;
    transaction.cost = cost || transaction.cost;
    transaction.addedOn = addedOn || transaction.addedOn;
    transaction.isIncome = (isIncome !== undefined) ? isIncome : transaction.isIncome;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a transaction (soft delete)
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await IncomeExpense.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    transaction.isDeleted = true;
    await transaction.save();
    
    res.json({ message: 'Transaction removed successfully' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get transaction summary for a user with optional date filtering
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    
    const filter = { user: req.user._id, isDeleted: false };
    
    // Add date filtering if provided
    if (startDate || endDate) {
      filter.addedOn = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter.addedOn.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter.addedOn.$lte = end;
        }
      }
    }

    const summary = await IncomeExpense.aggregate([
      { $match: filter },
      { $group: { _id: '$isIncome', total: { $sum: '$cost' } } },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    summary.forEach(group => {
      if (group._id === true) {
        totalIncome = group.total;
      } else {
        totalExpenses = group.total;
      }
    });
    
    const balance = totalIncome - totalExpenses;
    
    
    const recentTransactions = await IncomeExpense.find(filter)
      .sort({ addedOn: -1 })
      .limit(5);

    res.json({ totalIncome, totalExpenses, balance, recentTransactions });
  } catch (error) {
    console.error('Error in getTransactionSummary:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get data for charts with optional date filtering
// @route   GET /api/transactions/charts
// @access  Private
const getChartData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no dates provided
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.addedOn = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          dateFilter.addedOn.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          dateFilter.addedOn.$lte = end;
        }
      }
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.addedOn = { $gte: thirtyDaysAgo };
    }

    const baseFilter = { user: userId, isDeleted: false, ...dateFilter };

    // Data for Expenses by Category (Pie Chart)
    const expensesByCategory = await IncomeExpense.aggregate([
      { $match: { ...baseFilter, isIncome: false } },
      { $group: { _id: '$category', total: { $sum: '$cost' } } },
      { $project: { name: '$_id', total: 1, _id: 0 } },
      { $sort: { total: -1 } }
    ]);

    // Data for Expenses Over Time (Bar Chart)
    const expensesOverTime = await IncomeExpense.aggregate([
      { $match: { ...baseFilter, isIncome: false } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$addedOn" } }, 
          total: { $sum: '$cost' } 
        } 
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, _id: 0 } }
    ]);
    
    // Data for Income Over Time (Bar Chart)
    const incomeOverTime = await IncomeExpense.aggregate([
      { $match: { ...baseFilter, isIncome: true } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$addedOn" } }, 
          total: { $sum: '$cost' } 
        } 
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, _id: 0 } }
    ]);
    
    res.json({ expensesByCategory, expensesOverTime, incomeOverTime });
  } catch (error) {
    console.error('Error in getChartData:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all unique categories for a user
// @route   GET /api/transactions/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    // Define default categories
    const defaultCategories = [
      'Food',
      'Shopping',
      'Bills',
      'Subscriptions',
      'Transportation',
      'Salary',
      'Entertainment',
      'Groceries',
      'Miscellaneous'
    ];
    
    // Get user's custom categories from the database
    const userCategories = await IncomeExpense.distinct('category', { 
      user: req.user._id,
      isDeleted: false 
    });
    
    // Combine, de-duplicate, and sort the lists
    const combinedCategories = [...new Set([...defaultCategories, ...userCategories])];
    combinedCategories.sort();
    
    res.json(combinedCategories);
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a user-defined category
// @route   DELETE /api/transactions/category
// @access  Private
const deleteCategory = async (req, res) => {
  const { categoryToDelete } = req.body;

  if (!categoryToDelete) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Re-assign all transactions with this category to 'Miscellaneous'
    const result = await IncomeExpense.updateMany(
      { user: req.user._id, category: categoryToDelete, isDeleted: false },
      { $set: { category: 'Miscellaneous' } }
    );

    res.json({ 
      message: `Category '${categoryToDelete}' deleted successfully. ${result.modifiedCount} transactions moved to 'Miscellaneous'.` 
    });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get transaction statistics with filtering support
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res) => {
  try {
    const { isIncome, category, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id, isDeleted: false };
    
    // Add filters
    if (isIncome !== undefined && isIncome !== '') {
      filter.isIncome = isIncome === 'true';
    }
    
    if (category && category !== '') {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.addedOn = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter.addedOn.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter.addedOn.$lte = end;
        }
      }
    }

    // Aggregate statistics
    const stats = await IncomeExpense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$isIncome', true] }, '$cost', 0]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$isIncome', false] }, '$cost', 0]
            }
          },
          incomeCount: {
            $sum: {
              $cond: [{ $eq: ['$isIncome', true] }, 1, 0]
            }
          },
          expenseCount: {
            $sum: {
              $cond: [{ $eq: ['$isIncome', false] }, 1, 0]
            }
          },
          averageTransaction: { $avg: '$cost' },
          maxTransaction: { $max: '$cost' },
          minTransaction: { $min: '$cost' }
        }
      }
    ]);

    const result = stats[0] || {
      totalTransactions: 0,
      totalIncome: 0,
      totalExpenses: 0,
      incomeCount: 0,
      expenseCount: 0,
      averageTransaction: 0,
      maxTransaction: 0,
      minTransaction: 0
    };

    // Calculate additional metrics
    result.netIncome = result.totalIncome - result.totalExpenses;
    result.savingsRate = result.totalIncome > 0 ? ((result.netIncome / result.totalIncome) * 100) : 0;

    res.json({
      success: true,
      stats: result,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
        hasDateFilter: !!(startDate || endDate)
      }
    });

  } catch (error) {
    console.error('Error in getTransactionStats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getChartData,
  getCategories,
  deleteCategory,
  getTransactionStats, 
};