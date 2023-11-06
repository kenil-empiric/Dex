const Web3 = require('web3');

const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'; // Replace with your token's address
const providerUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'; // Replace with your Infura project ID

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

async function getTokenPrice() {
  try {
    // Uniswap
    const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap Router V2 address
    const uniswapRouterABI = require('./uniswapRouterABI.json'); // You need the actual ABI file

    const uniswapRouter = new web3.eth.Contract(uniswapRouterABI, uniswapRouterAddress);
    const uniswapPrice = await uniswapRouter.methods.getAmountsOut(web3.utils.toWei('1'), [tokenAddress]).call();

    // SushiSwap
    const sushiSwapRouterAddress = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'; // SushiSwap Router V2 address
    const sushiSwapRouterABI = require('./sushiSwapRouterABI.json'); // You need the actual ABI file

    const sushiSwapRouter = new web3.eth.Contract(sushiSwapRouterABI, sushiSwapRouterAddress);
    const sushiSwapPrice = await sushiSwapRouter.methods.getAmountsOut(web3.utils.toWei('1'), [tokenAddress]).call();

    console.log('Uniswap Price:', web3.utils.fromWei(uniswapPrice[1])); // Output the price
    console.log('SushiSwap Price:', web3.utils.fromWei(sushiSwapPrice[1])); // Output the price
  } catch (error) {
    console.error('Error:', error);
  }
}

getTokenPrice();
