import React from 'react';

const ManageCategoriesModal = ({ isOpen, onClose, allCategories, onDelete }) => {
  // Pre-defined categories that should not be deleted
  const defaultCategories = [
    'Food', 'Shopping', 'Bills', 'Subscriptions', 'Transportation', 
    'Salary', 'Entertainment', 'Groceries', 'Miscellaneous'
  ];
  
  // Filter out the default categories to get the user-defined list
  const userDefinedCategories = allCategories.filter(cat => !defaultCategories.includes(cat));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Manage Custom Categories</h2>
        
        {userDefinedCategories.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {userDefinedCategories.map(category => (
              <li key={category} className="py-3 flex justify-between items-center">
                <span className="text-gray-800">{category}</span>
                <button 
                  onClick={() => onDelete(category)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">You haven't added any custom categories yet.</p>
        )}
        
        <div className="flex justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;