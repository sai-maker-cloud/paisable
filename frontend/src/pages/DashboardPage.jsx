import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.get('/transactions/summary');
        setSummaryData(response.data);
      } catch (error) {
        console.error("Failed to fetch summary data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Income" 
          value={summaryData.totalIncome.toFixed(2)} 
          bgColor="bg-green-200"
          loading={loading} 
        />
        <SummaryCard 
          title="Total Expense" 
          value={summaryData.totalExpenses.toFixed(2)} 
          bgColor="bg-red-200" 
          loading={loading}
        />
        <SummaryCard 
          title="Current Balance" 
          value={summaryData.balance.toFixed(2)} 
          bgColor="bg-blue-200" 
          loading={loading}
        />
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Spending Analysis</h2>
        <div className="mt-4 h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">Charts will be displayed here</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;