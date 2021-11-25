import { BigNumber } from '@ethersproject/bignumber'
import {ChainId, CurrencyAmount, JSBI, Token, TokenAmount ,StakePool, AttenuationReward, ZOO_PARK_ADDRESS} from '@liuxingfeiyu/zoo-sdk'
import { useSwapMiningContract, useZooParkContract } from '../zooswap-hooks/useContract'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import {APIHost, DefaultChainId,AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS} from "../constants/index"
import { usePairContract, useTokenContract } from 'hooks/useContract'
import ERC20_INTERFACE from 'constants/abis/erc20'
import { useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'


export function useZooUsdtSwapPrice() :number {
  const contract = usePairContract(ZOO_USDT_SWAP_PAIR_ADDRESS[DefaultChainId])
  const result = useSingleCallResult(contract,"getReserves").result
  const yuzuToken = AllDefaultChainTokens[DefaultChainId].YUZU
  const usdtToken = AllDefaultChainTokens[DefaultChainId].USDT
  if(result&& result.reserve0 && result.reserve1){
    if(usdtToken.address < yuzuToken.address ){
      return result.reserve0 /result.reserve1 * Math.pow( 10,yuzuToken.decimals-usdtToken.decimals ) ?? 1
    }else{
      return result.reserve1 /result.reserve0 * Math.pow( 10,yuzuToken.decimals-usdtToken.decimals ) ?? 1
    }

  }else{
    return 1
  }

}
export function useMyPendingZooListInPark(address: string|undefined,pids:number[]): JSBI[] {
  const contract = useZooParkContract(address, false)
  const { account } = useActiveWeb3React()
  const pendingZooParams = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      pendingZooParams.push([i,account??""])
    }
  }
  const data = useSingleContractMultipleData(contract, 'pendingYuzu',pendingZooParams)
  return data.map((p, i) => {
    const amount = data[i]?.result?.[0] ?? "0"
    return JSBI.BigInt(amount)
  })
}
export function useMyCurrentLpListInPark(address: string|undefined,pids:number[]): JSBI[] {
  const contract = useZooParkContract(address, false)
  const { account } = useActiveWeb3React()
  const params = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      params.push([i,account??""])
    }
  }
  const data = useSingleContractMultipleData(contract, 'userInfo',params)
  return data.map((p, i) => {
    const amount = data[i]?.result?.amount ?? "0"
    return JSBI.BigInt(amount)
  })
}
export function useMyLpBalanceListInPark(address: string|undefined,lpaddrs:string[]): JSBI[] {
  const { account } = useActiveWeb3React()
  const accountArg = useMemo(() => [account ?? undefined], [account])
  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(lpaddrs, ERC20_INTERFACE, 'balanceOf', accountArg)

  return balances.map((p, i) => {
    const amount = balances[i]?.result?.[0] ?? "0"
    return JSBI.BigInt(amount)
  })
}


export function  useMyAllStakePoolList() :[StakePool[],any] {
  const [parkList,setParkList] = useState<any[]>([])
  const [poolIds,setPoolIds] = useState<number[]>([])
  const [statics,setStatics] = useState<{totalVolume:number,tvls:any}>({totalVolume:0,tvls :[]})
  const blockNumber = useBlockNumber()
  const { account, chainId } = useActiveWeb3React()
  // init fetch inteval
  useEffect(()=>{
    const queryFunc = async () => {
      if(blockNumber&& blockNumber > 0){
        const zooParkList = await(await fetch(APIHost + "/zooparks")).json();
        console.log('zooParkList', zooParkList);
        const poolIds = zooParkList.data.map((p:{_id:number})=>p._id)
        // tododo, 待处理 fix
         setPoolIds(poolIds)
         setParkList(zooParkList.data)

         setStatics({totalVolume:zooParkList.totalVolume, tvls: zooParkList.statics.tvl })
      }
    }
    queryFunc()
    const timer = setTimeout(queryFunc, 1000)
    return () => {
      clearTimeout(timer)
    }
  } ,[blockNumber])
  const lpaddress:string[] = useMemo( ()=> parkList.map( (p,e)=>p.lpAddress )  ,[parkList])
  const myRewards = useMyPendingZooListInPark(ZOO_PARK_ADDRESS[chainId?? DefaultChainId],poolIds)
  const myCurrentLps = useMyCurrentLpListInPark(ZOO_PARK_ADDRESS[chainId?? DefaultChainId],poolIds)
  const myBalances = useMyLpBalanceListInPark(ZOO_PARK_ADDRESS[chainId?? DefaultChainId],lpaddress)

//  console.log("lpaddress is ", lpaddress, " balance is ", myBalances)
  const poolList = useMemo(() => {
    return parkList.map((park, i) => {
      let t = new StakePool({
        token0: new Token((chainId ?? DefaultChainId), park.token0Addr, park.token0Decimals, park.token0Symbol, park.token0),
        token1: new Token((chainId ?? DefaultChainId), park.token1Addr, park.token1Decimals, park.token1Symbol, park.token1),
        token0Balance: JSBI.BigInt(park.token0Balance),
        token1Balance: JSBI.BigInt(park.token1Balance),
        lpAddress: park.lpAddress,
        totalLp: JSBI.BigInt(park.totalLp),
        totalLpInPark: JSBI.BigInt(park.totalLpInPark),
        rewardEffect: park.rewardEffect,
        lastRewardBlock: park.lastRewardBlock,
        rewardConfig: new AttenuationReward({ startBlock: park.startBlock, zooPerBlock: JSBI.BigInt(park.perBlockReward), halfAttenuationCycle: park.halfCycleBlock }),
        myLpBalance: myBalances[i]||JSBI.BigInt(0),
        myCurrentLp: myCurrentLps[i]||JSBI.BigInt(0),
        myReward: myRewards[i]||JSBI.BigInt(0),
        pid: park._id,
      })
      return t
    })
  }, [myBalances, parkList])

    
    return [poolList,statics]
}

