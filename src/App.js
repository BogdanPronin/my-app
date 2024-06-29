import React, { useState, useEffect } from 'react';
import ExchangeRates from './components/ExchangeRates';
import WalletActions from './components/WalletActions';
import axios from 'axios';

const App = () => {
  const [rates, setRates] = useState({});

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,GBP');
        setRates(response.data);
        console.log('Exchange rates loaded:', response.data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    loadExchangeRates();
  }, []);

  return (
    <div>
      <h1>Trading System</h1>
      <ExchangeRates rates={rates} />
      <WalletActions rates={rates} />
    </div>
  );
};

export default App;
