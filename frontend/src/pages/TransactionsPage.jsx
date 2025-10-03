import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import Spinner from '../components/Spinner';
import useCurrency from '../hooks/useCurrency';

const handleExportCSV = async () => {
  try {
    const res = await api.get('/transactions/export', {
      responseType: 'blob', // Important for file download
    });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paisable_transactions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export CSV", error);
    alert("Failed to export CSV. Please try again.");
  }
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { currency } = useCurrency();

  const fetchData = useCallback(async (search = searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (search) {
        params.append('search', search);
      }
      if (typeFilter !== 'all') {
        params.append('isIncome', typeFilter === 'income' ? 'true' : 'false');
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (dateFrom) {
        params.append('startDate', dateFrom);
      }
      if (dateTo) {
        params.append('endDate', dateTo);
      }

      const [transactionsRes, categoriesRes] = await Promise.all([
        api.get(`/transactions?${params.toString()}`),
        api.get('/transactions/categories')
      ]);
      setTransactions(transactionsRes.data.transactions);
      setTotalPages(transactionsRes.data.totalPages);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch transactions data", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, typeFilter, categoryFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setPage(1);
      fetchData(value);
    }, 300);

    setDebounceTimer(timer);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || dateFrom || dateTo;

  const handleOpenTransactionModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      if (id) await api.put(`/transactions/${id}`, formData);
      else await api.post('/transactions', formData);
      fetchData();
      handleCloseTransactionModal();
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  };

  const handleNewCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory].sort());
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"? All associated transactions will be moved to "Miscellaneous".`)) {
      try {
        await api.delete('/transactions/category', { data: { categoryToDelete } });
        fetchData();
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="flex gap-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Manage Categories
          </button>
          <button onClick={() => handleOpenTransactionModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Transaction
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Export all transactions to CSV"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search transactions by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Type and Category Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="date-from"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="date-to"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Active Filters and Clear Button */}
        {hasActiveFilters && (
          <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {typeFilter === 'income' ? 'Income' : 'Expense'}
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {categoryFilter}
                </span>
              )}
              {dateFrom && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  From: {new Date(dateFrom).toLocaleDateString()}
                </span>
              )}
              {dateTo && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  To: {new Date(dateTo).toLocaleDateString()}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-semibold ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.isIncome ? '+' : '-'}{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency.code,
                    }).format(tx.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.addedOn).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenTransactionModal(tx)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDeleteTransaction(tx._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        categories={categories}
        onNewCategory={handleNewCategory}
      />

      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        allCategories={categories}
        onDelete={handleDeleteCategory}
      />
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export {TransactionsPage,handleExportCSV};