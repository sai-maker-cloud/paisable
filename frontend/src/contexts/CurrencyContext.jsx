import React, { createContext, useState, useEffect } from 'react';
import { supportedCurrencies } from '../config/currencies';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(supportedCurrencies[0]);

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