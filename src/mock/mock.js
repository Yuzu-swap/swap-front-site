import { TradePool, Token, ChainId, StakePool } from '@liuxingfeiyu/zoo-sdk'


function getTradePool() {
  let tokenA = new Token(ChainId.ARBITRUM, "DF12793CA392ff748adF013D146f8dA73df6E304", 1, '', "ETH");
  let tokenB = new Token(ChainId.ARBITRUM, "DF12793CA392ff748adF013D146f8dA73df6E304", 1, '', "ETH");
  let yearReturn = 2.5;
  let myTradePoint = 0.49483;
  let myReward = 3829349;
  let pool = new TradePool(tokenA, tokenB, yearReturn, myTradePoint, myReward)
  return [pool, pool, pool];
}



function getStakePoolList() {
  let tokenA = new Token(ChainId.ARBITRUM, "DF12793CA392ff748adF013D146f8dA73df6E304", 1, '', "ETH");
  let tokenB = new Token(ChainId.ARBITRUM, "DF12793CA392ff748adF013D146f8dA73df6E304", 1, '', "ETH");
  let yearReturn = "10";
  let lpAddress = "DF12";
  let myBalance = 2.38;
  let myReward = 39489;
  let pool = new StakePool(tokenA, tokenB, lpAddress, yearReturn, myBalance, myReward);
  return [pool, pool, pool];
}

const PoolList = getTradePool();
const StakePoolList = getStakePoolList();
export default {
  PoolList,
  StakePoolList
}