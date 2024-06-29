import Web3 from 'web3';
import TestWallet from '../abis/TestWallet.json';

let web3;
let wallet;
let account;

const initBlockchain = async () => {
  web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];

  const networkId = await web3.eth.net.getId();
  const walletData = TestWallet.networks[networkId];
  if (walletData) {
    wallet = new web3.eth.Contract(TestWallet.abi, walletData.address);
  } else {
    throw new Error('Wallet contract not deployed to detected network.');
  }
};

const getBalance = async () => {
  const balance = await wallet.methods.balance().call();
  return web3.utils.fromWei(balance.toString(), 'ether');
};

const getCurrencyBalance = async (currency) => {
  const balance = await wallet.methods.getCurrencyBalance(currency).call();
  return balance ; // Scale down for display
};

const deposit = async (amount) => {
  await wallet.methods.deposit().send({ from: account, value: web3.utils.toWei(amount.toString(), 'ether') });
};

const withdraw = async (amount) => {
  await wallet.methods.withdraw(web3.utils.toWei(amount.toString(), 'ether')).send({ from: account });
};

const buy = async (currency, ethAmount, currencyRate) => {
  console.log(`Buying ${currency} with ${ethAmount} ETH at rate ${currencyRate}`);
  const ethAmountInWei = web3.utils.toWei(ethAmount.toString(), 'ether');
  const scaledRate = Math.round(currencyRate * 100000); // Scale the rate
  await wallet.methods.buy(currency, ethAmountInWei, scaledRate).send({ from: account, value: ethAmountInWei });
};

const sell = async (currency, currencyAmount, currencyRate) => {
  console.log(`Selling ${currencyAmount} ${currency} at rate ${currencyRate}`);
  const scaledRate = Math.round(currencyRate * 100000); // Scale the rate
  await wallet.methods.sell(currency, currencyAmount, scaledRate).send({ from: account });
};

const resetBalances = async () => {
  await wallet.methods.resetBalances().send({ from: account });
};

export { initBlockchain, getBalance, getCurrencyBalance, deposit, withdraw, buy, sell, resetBalances, account, web3 };
