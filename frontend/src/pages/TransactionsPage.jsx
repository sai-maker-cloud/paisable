import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import Spinner from '../components/Spinner';
import useCurrency from '../hooks/useCurrency';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { currency } = useCurrency();

  // Filter states
  const [filters, setFilters] = useState({
    isIncome: '', 
    category: '',
    startDate: '',
    endDate: ''
  });
  
  // Debounce timer for filter changes
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchData = useCallback(async (currentPage = page, currentFilters = filters) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      // Add filter parameters if they exist
      if (currentFilters.isIncome !== '') {
        params.append('isIncome', currentFilters.isIncome);
      }
      
      if (currentFilters.category) {
        params.append('category', currentFilters.category);
      }
      
      if (currentFilters.startDate) {
        params.append('startDate', currentFilters.startDate);
      }
      
      if (currentFilters.endDate) {
        params.append('endDate', currentFilters.endDate);
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
  }, [page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes with debouncing
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    
    const timer = setTimeout(() => {
      setPage(1); 
      fetchData(1, newFilters);
    }, 300); 

    setDebounceTimer(timer);
  };

  
  const clearFilters = () => {
    const clearedFilters = {
      isIncome: '',
      category: '',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
    setPage(1);
    fetchData(1, clearedFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData(newPage, filters);
  };

  
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

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

  // Check if any filters are active
  const hasActiveFilters = filters.isIncome !== '' || filters.category !== '' || filters.startDate !== '' || filters.endDate !== '';

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
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              id="type-filter"
              value={filters.isIncome}
              onChange={(e) => handleFilterChange('isIncome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Transactions</option>
              <option value="true">Income Only</option>
              <option value="false">Expenses Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Actions and Summary */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-sm text-gray-600">
            {hasActiveFilters && (
              <>
                Filtered results
                {filters.isIncome !== '' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.isIncome === 'true' ? 'Income' : 'Expenses'}
                  </span>
                )}
                {filters.category && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filters.category}
                  </span>
                )}
                {filters.startDate && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    From: {new Date(filters.startDate).toLocaleDateString()}
                  </span>
                )}
                {filters.endDate && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    To: {new Date(filters.endDate).toLocaleDateString()}
                  </span>
                )}
              </>
            )}
          </div>
          
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
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
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{tx.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.isIncome ? '+' : '-'}{new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: currency.code,
                        }).format(tx.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(tx.addedOn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleOpenTransactionModal(tx)} 
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(tx._id)} 
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg mb-2">No transactions found</p>
                        <p className="text-sm">
                          {hasActiveFilters 
                            ? "Try adjusting your filters or " 
                            : "Get started by "
                          }
                          <button 
                            onClick={hasActiveFilters ? clearFilters : () => handleOpenTransactionModal()} 
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {hasActiveFilters ? "clearing filters" : "adding a transaction"}
                          </button>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={() => handlePageChange(Math.max(page - 1, 1))} 
                disabled={page === 1} 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors duration-200"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                
                {/* Page number indicators for smaller page counts */}
                {totalPages <= 7 && (
                  <div className="flex space-x-1 ml-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 text-sm rounded ${
                          page === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors duration-200`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))} 
                disabled={page === totalPages} 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

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

export default TransactionsPage;