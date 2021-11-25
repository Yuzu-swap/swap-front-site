import { BigNumber } from '@ethersproject/bignumber'
import {AttenuationReward, ChainId, CurrencyAmount, JSBI, StakePool, Token, TokenAmount ,TradePool, ZOO_SWAP_MINING_ADDRESS} from '@liuxingfeiyu/zoo-sdk'
import { useSwapMiningContract } from '../zooswap-hooks/useContract'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import {APIHost, DefaultChainId, OKCHAIN_TEST, ZOO_PARK_ADDRESS} from "../constants/index"
import { useState, useEffect, useMemo } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { useMyPendingZooListInPark, useMyCurrentLpListInPark, useMyLpBalanceListInPark } from './ZooPark'

export function useTradePoolList(address?: string): TradePool[] {
  /*
  const contract = useSwapMiningContract(address, false)
  const { account } = useActiveWeb3React()

  const swapMining:[Token,Token][] = [
    [OKCHAIN_TEST.ZOO,OKCHAIN_TEST.WOKT],
    [OKCHAIN_TEST.WOKT,OKCHAIN_TEST.USDT],
    [OKCHAIN_TEST.ZOO,OKCHAIN_TEST.USDT],
  ]

  const ZERO = JSBI.BigInt(0)
  const myPoolParams = []
  for (let i = 0; i < 3; i++) {
    myPoolParams.push([i,  account ?? undefined  ])
  }

  const data = useSingleContractMultipleData(contract, 'pendingYuzu',myPoolParams)

  return data.map((p, i) => {
    const amount = data[i]?.result?.[0] ?? "0"
    return new TradePool(swapMining[i][0],swapMining[i][1] ,1000, new TokenAmount(OKCHAIN_TEST.ZOO,amount),0)
  })
*/
  return []

}

export function useMyPendingZooInZooSwapMiningPools(address: string|undefined,pids:number[]): TokenAmount[] {
  const { account } = useActiveWeb3React()
  const contract = useSwapMiningContract(address, false)
  const myPoolParams = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      myPoolParams.push([pids[i],  account ?? undefined  ])
    }
  }
  const data = useSingleContractMultipleData(contract, 'pendingYuzu',myPoolParams)
  return data.map((p, i) => {
    const amount = data[i]?.result?.[0] ?? "0"
    return new TokenAmount(OKCHAIN_TEST.ZOO,amount)
  })
}

export function useMyCurrentLpInZooSwapMiningPools(address: string|undefined,pids:number[]): JSBI[] {
  const { account } = useActiveWeb3React()
  const contract = useSwapMiningContract(address, false)
  const myPoolParams = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      myPoolParams.push([pids[i],  account ?? undefined  ])
    }
  }
  const data = useSingleContractMultipleData(contract, 'userInfo',myPoolParams)
  return data.map((p, i) => {
    const amount = data[i]?.result?.amount ?? "0"
    return JSBI.BigInt(amount)
  })
}

export function useMyAllPendingZoo(address?: string): TokenAmount{
  const contract = useSwapMiningContract(address, false)
  const { account } = useActiveWeb3React()

  const data = useSingleCallResult(contract, 'pendingYuzuAll',[account ?? undefined],NEVER_RELOAD)
  return new TokenAmount(OKCHAIN_TEST.ZOO,data.result?.[0]??0)
}




export function  useMyAllSwapMiningPoolList() :[TradePool[],any]{
  const [parkList,setParkList] = useState<any[]>([])
  const [poolIds,setPoolIds] = useState<number[]>([])
  const [statics,setStatics] = useState({poolSwapVolumeList:{},withdrawedAmount:{},totalSwapVolume:0})

  const { account, chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()

  const myBalances = useMyPendingZooInZooSwapMiningPools(ZOO_SWAP_MINING_ADDRESS[chainId?? DefaultChainId],poolIds)
  const myCurrentLps = useMyCurrentLpInZooSwapMiningPools(ZOO_SWAP_MINING_ADDRESS[chainId?? DefaultChainId],poolIds)

  // init fetch inteval
  useEffect(()=>{
    const queryFunc = async () => {
      if(blockNumber&& blockNumber > 0){
        const zooParkList = await(await fetch(APIHost + "/zooswapminigs")).json();
        console.log('zooParkList', zooParkList);
        const poolIds = zooParkList.data.map((p:{_id:number})=>p._id)
        // tododo, 待处理 fix
         setPoolIds(poolIds)
         setParkList(zooParkList.data)
         setStatics({poolSwapVolumeList:zooParkList.statics.poolSwapVolumeList ,withdrawedAmount: zooParkList.statics.withdrawedAmount,totalSwapVolume: zooParkList.statics.totalSwapVolume})
      }
    }
    const timer = setTimeout(queryFunc, 1000)
    queryFunc()
    return () => {
      clearTimeout(timer)
    }
  } ,[blockNumber])
  const poolList = useMemo(()=>{
    return parkList.map( (park,i)=>{
      let t = new TradePool({
        token0: new Token((chainId?? DefaultChainId),park.token0Addr,park.token0Decimals,park.token0Symbol,park.token0),
        token1: new Token((chainId?? DefaultChainId),park.token1Addr,park.token1Decimals,park.token1Symbol,park.token1),
        isToken0Archor : park.token0 == park.archorToken ,
        totalLp : JSBI.BigInt(park.totalLp),
        accZooPerShare: park.accZooPerShare,
        rewardEffect : park.rewardEffect,
        lastRewardBlock : park.lastRewardBlock,
        rewardConfig : new AttenuationReward({ startBlock:park.startBlock,zooPerBlock:JSBI.BigInt(park.perBlockReward),halfAttenuationCycle:park.halfCycleBlock} ),
        myReward :JSBI.BigInt((myBalances[i] || {}).raw || 0),
//        myReward :JSBI.BigInt(0),
        myCurrentLp :myCurrentLps[i]||JSBI.BigInt(0),
        currentTradePoint:0,
        pid: park._id,
      })

      return t
    })
  },[myBalances,parkList])

    
  return [poolList,statics]
}