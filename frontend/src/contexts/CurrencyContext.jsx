import React, { createContext, useState, useEffect } from 'react';

export const supportedCurrencies = [
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
];

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(supportedCurrencies[0]); // Default to USD

  // Load saved currency from localStorage on initial load
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem('currencyCode');
    if (savedCurrencyCode) {
      const savedCurrency = supportedCurrencies.find(c => c.code === savedCurrencyCode);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    }
  }, []);

  const changeCurrency = (currencyCode) => {
    const newCurrency = supportedCurrencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('currencyCode', newCurrency.code);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, supportedCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;