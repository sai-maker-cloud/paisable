import React, { useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const ReceiptsPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiptResult, setReceiptResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReceiptResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);
    
    try {
      setUploading(true);
      setError('');
      const response = await api.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReceiptResult(response.data);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Receipt</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Select a receipt file (JPG, PNG, PDF)</label>
            <input 
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".jpeg,.jpg,.png,.pdf"
            />
            <button 
              type="submit" 
              disabled={uploading}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {uploading ? 'Uploading...' : 'Extract Data'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        </div>

        {/* OCR Result */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Extracted Data</h2>
          {receiptResult ? (
            <div>
              <p><strong>Merchant:</strong> {receiptResult.extractedData.merchant}</p>
              <p><strong>Amount:</strong> ${receiptResult.extractedData.amount.toFixed(2)}</p>
              <p><strong>Category:</strong> {receiptResult.extractedData.category}</p>
              <p><strong>Date:</strong> {new Date(receiptResult.extractedData.date).toLocaleDateString()}</p>
              <img src={`http://localhost:5001${receiptResult.fileUrl}`} alt="Uploaded Receipt" className="mt-4 rounded-lg max-w-full h-auto" />
              {/* Here you could add a button to "Create Transaction from Receipt" */}
            </div>
          ) : (
            <p className="text-gray-500">Upload a receipt to see the extracted data here.</p>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ReceiptsPage;