import React, { useState, useEffect } from 'react';
import { deposit, withdraw, buy, sell, getBalance, getCurrencyBalance, resetBalances, initBlockchain, account, web3 } from '../utils/blockchain';

const WalletActions = ({ rates }) => {
  const [balance, setBalance] = useState(0);
  const [currencyBalances, setCurrencyBalances] = useState({});
  const [ethAmount, setEthAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [currencyAmount, setCurrencyAmount] = useState(0);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        await initBlockchain();
        const balance = await getBalance();
        setBalance(balance);
        const currencyBalances = {};
        for (const curr of Object.keys(rates)) {
          const balance = await getCurrencyBalance(curr);
          currencyBalances[curr] = balance;
        }
        setCurrencyBalances(currencyBalances);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      }
    };

    loadBlockchainData();
  }, [rates]);

  const handleDeposit = async () => {
    try {
      await deposit(ethAmount);
      const balance = await getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error depositing ETH:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw(ethAmount);
      const balance = await getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error withdrawing ETH:', error);
    }
  };

  const handleBuy = async () => {
    try {
      const ethAmountConverted = currencyAmount / rates[currency];
      const scaledRate = Math.round(rates[currency] * 100000); // Scale the rate
      await buy(currency, ethAmountConverted, scaledRate);
      const balance = await getBalance();
      setBalance(balance);
      const newCurrencyBalance = await getCurrencyBalance(currency);
      setCurrencyBalances(prevBalances => ({ ...prevBalances, [currency]: newCurrencyBalance }));
    } catch (error) {
      console.error('Error buying currency:', error);
    }
  };

  const handleSell = async () => {
    try {
      const scaledRate = Math.round(rates[currency] * 100000); // Scale the rate

      await sell(currency, currencyAmount*10000000000, scaledRate);
      const balance = await getBalance();
      setBalance(balance);
      const newCurrencyBalance = await getCurrencyBalance(currency);
      setCurrencyBalances(prevBalances => ({ ...prevBalances, [currency]: newCurrencyBalance }));
    } catch (error) {
      console.error('Error selling currency:', error);
    }
  };

  const handleReset = async () => {
    try {
      await resetBalances();
      const balance = await getBalance();
      setBalance(balance);
      const currencyBalances = {};
      for (const curr of Object.keys(rates)) {
        currencyBalances[curr] = 0;
      }
      setCurrencyBalances(currencyBalances);
    } catch (error) {
      console.error('Error resetting balances:', error);
    }
  };

  return (
    <div>
      <h2>Wallet Actions</h2>
      <p>Account: {account}</p>
      <p>Balance: {parseFloat(balance).toFixed(5)} ETH</p>
      <div>
        <input
          type="number"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
      <div>
        <input
          type="number"
          value={currencyAmount}
          onChange={(e) => setCurrencyAmount(e.target.value)}
          placeholder={`Amount in ${currency}`}
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CNY">CNY</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
        </select>
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>
      <h2>Currency Balances</h2>
      <div>
        {Object.keys(currencyBalances).map(curr => (
          <p key={curr}>{(parseFloat(currencyBalances[curr]) / 10000000000).toFixed(2)} {curr}</p>
        ))}
      </div>
      <button onClick={handleReset}>Reset Balances</button>
    </div>
  );
};

export default WalletActions;
