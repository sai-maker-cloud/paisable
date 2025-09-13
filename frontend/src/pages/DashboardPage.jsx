import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import CategoryPieChart from '../components/CategoryPieChart';
import ExpensesBarChart from '../components/ExpensesBarChart';
import TransactionModal from '../components/TransactionModal';

// A reusable card component for the dashboard summary
const SummaryCard = ({ title, value, bgColor, loading }) => (
  <div className={`rounded-lg shadow-md p-6 ${bgColor}`}>
    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    {loading ? (
      <div className="mt-2 h-8 bg-gray-300 rounded animate-pulse"></div>
    ) : (
      <p className="mt-2 text-3xl font-bold text-black">${value}</p>
    )}
  </div>
);

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, chartRes] = await Promise.all([
        api.get('/transactions/summary'),
        api.get('/transactions/charts')
      ]);
      setSummaryData(summaryRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Simplified modal handler functions
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      await api.post('/transactions', formData);
      fetchData(); // Refresh all dashboard data
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <button 
          onClick={handleOpenModal} 
          className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          + Add Transaction
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Income" 
          value={summaryData.totalIncome?.toFixed(2) || '0.00'} 
          bgColor="bg-green-200"
          loading={loading} 
        />
        <SummaryCard 
          title="Total Expense" 
          value={summaryData.totalExpenses?.toFixed(2) || '0.00'} 
          bgColor="bg-red-200" 
          loading={loading}
        />
        <SummaryCard 
          title="Current Balance" 
          value={summaryData.balance?.toFixed(2) || '0.00'} 
          bgColor="bg-blue-200" 
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded"><p>Loading Chart...</p></div>
          ) : chartData?.expensesByCategory.length > 0 ? (
            <CategoryPieChart data={chartData.expensesByCategory} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded"><p>No expense data to display.</p></div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Spending</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded"><p>Loading Chart...</p></div>
          ) : chartData?.expensesOverTime.length > 0 ? (
            <ExpensesBarChart data={chartData.expensesOverTime} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded"><p>No recent expense data to display.</p></div>
          )}
        </div>
      </div>
      
      {/* Transaction Modal (no default type prop needed) */}
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </Layout>
  );
};

export default DashboardPage;