import React, { useState, useEffect } from 'react';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, categories = [], onNewCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    addedOn: new Date().toISOString().split('T')[0],
    isIncome: false,
  });
  
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name,
        category: transaction.category,
        cost: transaction.cost,
        addedOn: new Date(transaction.addedOn).toISOString().split('T')[0],
        isIncome: transaction.isIncome,
      });
    } else {
      setFormData({
        name: '',
        category: categories[0] || '',
        cost: '',
        addedOn: new Date().toISOString().split('T')[0],
        isIncome: false,
      });
    }
    setError(''); 
  }, [transaction, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle the "Add New" option for category
    if (name === 'category' && value === '__add_new__') {
      const newCategory = window.prompt("Enter new category name:");
      if (newCategory) {
        onNewCategory(newCategory);
        setFormData(prev => ({ ...prev, category: newCategory }));
      }
      return;
    }
    
    // Clear error when user makes changes
    if (error) setError('');
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const numericCost = parseFloat(formData.cost);
    
    if (isNaN(numericCost) || numericCost <= 0) {
      setError('Cost must be a positive number');
      return;
    }
    
    
    const submissionData = {
      ...formData,
      cost: numericCost
    };
    
    try {
      await onSubmit(submissionData, transaction?._id);
      setError(''); 
    } catch (err) {
      
      setError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{transaction ? 'Edit' : 'Add'} Transaction</h2>
        
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              <option value="__add_new__" className="font-bold text-blue-600">-- Add New Category --</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input 
              type="number" 
              name="cost" 
              value={formData.cost} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              min="0.01"  
              step="0.01" 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input 
              type="date" 
              name="addedOn" 
              value={formData.addedOn} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="isIncome" 
                checked={formData.isIncome} 
                onChange={handleChange} 
                className="mr-2" 
              />
              <span>Is this an income?</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
             type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;