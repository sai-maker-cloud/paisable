import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import TransactionModal from '../components/TransactionModal';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions?page=${page}&limit=10`);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      if (id) {
        // Update transaction
        await api.put(`/transactions/${id}`, formData);
      } else {
        // Add new transaction
        await api.post('/transactions', formData);
      }
      fetchTransactions(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Transaction
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
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
                    {tx.isIncome ? '+' : '-'}${tx.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.addedOn).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(tx)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination Controls */}
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
      />
    </Layout>
  );
};

export default TransactionsPage;