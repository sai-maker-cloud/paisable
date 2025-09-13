import React from 'react';
import Layout from '../components/Layout';

// A reusable card component for the dashboard
const SummaryCard = ({ title, value, bgColor }) => (
  <div className={`rounded-lg shadow-md p-6 ${bgColor}`}>
    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-black">${value}</p>
  </div>
);

const DashboardPage = () => {
  // We'll replace this with real data from the API later
  const summaryData = {
    income: 4500.00,
    expense: 1250.50,
    balance: 3249.50,
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" value={summaryData.income.toFixed(2)} bgColor="bg-green-200" />
        <SummaryCard title="Total Expense" value={summaryData.expense.toFixed(2)} bgColor="bg-red-200" />
        <SummaryCard title="Current Balance" value={summaryData.balance.toFixed(2)} bgColor="bg-blue-200" />
      </div>

      {/* Charts Section - Placeholder */}
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