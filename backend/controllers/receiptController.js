const Receipt = require('../models/Receipt');

// @desc    Upload a receipt and extract data
// @route   POST /api/receipts/upload
// @access  Private
const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  // --- OCR SIMULATION ---
  // In a real application, you would send req.file.path to an OCR service.
  // Here, we just simulate the result.
  const simulatedOcrData = {
    amount: Math.floor(Math.random() * 100) + 1,
    category: 'Groceries',
    date: new Date(),
    merchant: 'Local Supermarket',
  };
  // --- END SIMULATION ---

  try {
    const newReceipt = new Receipt({
      user: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedData: simulatedOcrData,
    });

    const savedReceipt = await newReceipt.save();
    res.status(201).json(savedReceipt);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  uploadReceipt,
};