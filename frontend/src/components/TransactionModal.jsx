import React, { useState, useEffect } from 'react';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, defaultIsIncome = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    addedOn: new Date().toISOString().split('T')[0],
    isIncome: defaultIsIncome,
  });

  useEffect(() => {
    if (transaction) {
      // Logic for editing an existing transaction
      setFormData({
        name: transaction.name,
        category: transaction.category,
        cost: transaction.cost,
        addedOn: new Date(transaction.addedOn).toISOString().split('T')[0],
        isIncome: transaction.isIncome,
      });
    } else {
      // Reset to default for a new transaction, using the new prop
      setFormData({
        name: '',
        category: '',
        cost: '',
        addedOn: new Date().toISOString().split('T')[0],
        isIncome: defaultIsIncome, // Use the prop here
      });
    }
  }, [transaction, isOpen, defaultIsIncome]); // Add prop to dependency array

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, transaction?._id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{transaction ? 'Edit' : 'Add'} Transaction</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input type="date" name="addedOn" value={formData.addedOn} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="isIncome" checked={formData.isIncome} onChange={handleChange} className="mr-2" />
              <span>Is this an income?</span>
            </label>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;