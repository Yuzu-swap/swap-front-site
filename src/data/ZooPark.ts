import { BigNumber } from '@ethersproject/bignumber'
import {ChainId, CurrencyAmount, JSBI, Token, TokenAmount ,StakePool, AttenuationReward, ZOO_PARK_ADDRESS,ZOO_PARK_EXT_ADDRESS} from '@liuxingfeiyu/zoo-sdk'
import { useSwapMiningContract,useZooParkExtContract, useZooParkContract } from '../zooswap-hooks/useContract'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import {APIHost, DefaultChainId,AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS} from "../constants/index"
import { usePairContract, useTokenContract } from 'hooks/useContract'
import ERC20_INTERFACE from 'constants/abis/erc20'
import { Interface } from '@ethersproject/abi'
import { abi as TokenWrapper_ABI} from '@liuxingfeiyu/zoo-core/deployments/oasistest/TokenWrapper.json'
import { useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'


export function useZooUsdtSwapPrice() :number {
  const contract = usePairContract(ZOO_USDT_SWAP_PAIR_ADDRESS[DefaultChainId])
  const result = useSingleCallResult(contract,"getReserves").result
  const yuzuToken = (<any>AllDefaultChainTokens)[DefaultChainId].YUZU
  const usdtToken = (<any>AllDefaultChainTokens)[DefaultChainId].USDT
  if(result&& result.reserve0 && result.reserve1){
    if(usdtToken.address.toLocaleLowerCase() < yuzuToken.address.toLocaleLowerCase() ){
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
      pendingZooParams.push([pids[i],account??""])
    }
  }
  const data = useSingleContractMultipleData(contract, 'pendingYuzu',pendingZooParams)
  return data.map((p, i) => {
    const amount = data[i]?.result?.[0] ?? "0"
    return JSBI.BigInt(amount)
  })
}
export function useMyPendingTokenListInParkExt(address: string|undefined,pids:number[]): JSBI[][] {
  const contract = useZooParkExtContract(address, false)
  const { account } = useActiveWeb3React()
  const pendingZooParams = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      pendingZooParams.push([pids[i],account??""])
    }
  }
//  (IERC20[] memory rewardTokens, uint256[] memory rewardAmounts)
  const data = useSingleContractMultipleData(contract, 'pendingTokens',pendingZooParams)
  return data.map((p, i) => {
    const amounts = data[i]?.result?.[1] ?? []
    return amounts.map((amount:any) => { return JSBI.BigInt(amount) })
  })
}

export function useMyCurrentLpListInPark(address: string|undefined,pids:number[]): JSBI[] {
  const contract = useZooParkContract(address, false)
  const { account } = useActiveWeb3React()
  const params = []
  if(account){
    for (let i = 0; i < pids.length; i++) {
      params.push([pids[i],account??""])
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

export function useWTokenBalanceList(tokenaddrs:string[]): JSBI[] {
  const { account } = useActiveWeb3React()
  const accountArg = useMemo(() => [account ?? undefined], [account])
  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(tokenaddrs, new Interface(TokenWrapper_ABI), 'balanceOf', accountArg)

  return balances.map((p, i) => {
    const amount = balances[i]?.result?.[0] ?? "0"
    return JSBI.BigInt(amount)
  })
}


export function  useMyAllStakePoolList() :[StakePool[],any, boolean] {
  const [parkList,setParkList] = useState<any[]>([])
  const [poolIds,setPoolIds] = useState<number[]>([])
  const [statics,setStatics] = useState<{totalVolume:number,tvls:any}>({totalVolume:0,tvls :[]})
  const blockNumber = useBlockNumber()
  const [maintainFlag, setMaintainFlag] = useState<boolean>(false)
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
         setMaintainFlag(zooParkList?.maintain?.flag ?? false)

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
      console.log("test park", park)
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

    
    return [poolList,statics, maintainFlag]
}

export class TokenReward  {
  public readonly token!: Token
  public readonly rewardContractAddr!: String
  public readonly PerblockReward!: JSBI
  public readonly RewardEndAt!: Number
  public readonly MyPendingAmount: JSBI
  public readonly wrapped!: boolean
  public readonly ifo: Ifo
  constructor(data: Partial<TokenReward>){
      Object.assign(this, data);
  }
}

export class Ifo{
  public readonly desc : String
  public readonly title : String
  public readonly link : String
  constructor(data: Partial<Ifo>){
    Object.assign(this, data);
}
}


export class ZooParkExt extends StakePool{
  public readonly tokenRewards: TokenReward[]|undefined

  constructor(data: Partial<ZooParkExt>) {
    super(data)
    this.tokenRewards = data?.tokenRewards
  }
}


export function  useMyAllYuzuParkExtList() :[ZooParkExt[],any] {
  const [parkExtList,setParkExtList] = useState<any[]>([])
  const [poolIds,setPoolIds] = useState<number[]>([])
  const [statics,setStatics] = useState<{totalVolume:number,tvls:any}>({totalVolume:0,tvls :[]})
  const blockNumber = useBlockNumber()
  const { account, chainId } = useActiveWeb3React()
  // init fetch inteval
  useEffect(()=>{
    const queryFunc = async () => {
      if(blockNumber&& blockNumber > 0){
        const zooParkExtList = await(await fetch(APIHost + "/zooparkexts")).json();
        console.log('zooParkExtList', zooParkExtList);
        const poolIds = zooParkExtList.data.map((p:{_id:number})=>p._id)
        // tododo, 待处理 fix
         setPoolIds(poolIds)
         setParkExtList(zooParkExtList.data)


         setStatics({totalVolume:zooParkExtList.totalVolume, tvls: zooParkExtList.statics.tvl })
      }
    }
    queryFunc()
    const timer = setTimeout(queryFunc, 3000)
    return () => {
      clearTimeout(timer)
    }
  } ,[blockNumber])
  const lpaddress:string[] = useMemo( ()=> parkExtList.map( (p,e)=>p.lpAddress )  ,[parkExtList])
  const myRewards = useMyPendingZooListInPark(ZOO_PARK_EXT_ADDRESS[chainId?? DefaultChainId],poolIds)
  const myCurrentLps = useMyCurrentLpListInPark(ZOO_PARK_EXT_ADDRESS[chainId?? DefaultChainId],poolIds)
  const myBalances = useMyLpBalanceListInPark(ZOO_PARK_EXT_ADDRESS[chainId?? DefaultChainId],lpaddress)
  const myPendingRewards = useMyPendingTokenListInParkExt(ZOO_PARK_EXT_ADDRESS[chainId?? DefaultChainId],poolIds)

//  console.log("lpaddress is ", lpaddress, " balance is ", myBalances)
  const poolList = useMemo(() => {
    return parkExtList.map((park, i) => {
      const tokenRewards:TokenReward[] = []
      for(let rindex:number =0; rindex< park.tokenRewards.length;rindex ++){
        const tr = park.tokenRewards[rindex]
        let ifo = undefined
        if(tr.ifo){
          ifo = new Ifo(
            {
              desc : tr.ifo.desc,
              title : tr.ifo.title,
              link : tr.ifo.link
            }
          )
        }
        tokenRewards.push(new TokenReward({
          token: new Token((chainId ?? DefaultChainId), tr.tokenAddr, tr.tokenDecimals, tr.tokenSymbol, tr.token),
          rewardContractAddr: tr.rewardContractAddr,
          PerblockReward: tr.PerblockReward,
          RewardEndAt: tr.RewardEndAt,
          MyPendingAmount: (myPendingRewards[i] && myPendingRewards[i][rindex]) || JSBI.BigInt(0),
          wrapped: tr.wrapped,
          ifo: ifo
        }))
      }
      let t = new ZooParkExt({
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
        tokenRewards : tokenRewards,
      })


      return t
    })
  }, [myBalances, parkExtList])

    
 return [poolList,statics]
}