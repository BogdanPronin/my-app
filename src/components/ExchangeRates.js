import React from 'react';

const ExchangeRates = ({ rates }) => {
  return (
    <div>
      <h2>Exchange Rates</h2>
      {Object.keys(rates).length > 0 ? (
        <div>
          <p>1 ETH = {parseFloat(rates['USD']).toFixed(2)} USD</p>
          <p>1 ETH = {parseFloat(rates['EUR']).toFixed(2)} EUR</p>
          <p>1 ETH = {parseFloat(rates['CNY']).toFixed(2)} CNY</p>
          <p>1 ETH = {parseFloat(rates['JPY']).toFixed(2)} JPY</p>
          <p>1 ETH = {parseFloat(rates['GBP']).toFixed(2)} GBP</p>
        </div>
      ) : (
        <p>Loading exchange rates...</p>
      )}
    </div>
  );
};

export default ExchangeRates;
