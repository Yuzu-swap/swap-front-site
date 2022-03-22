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


export class XyuzuConf  {
    public readonly id!: number
    public readonly ratio!: number
    public readonly blockCount!: number
    constructor(data: Partial<XyuzuConf>){
        Object.assign(this, data);
    }
  }

export function useXYuzuConfig(){
    const blockNumber = useBlockNumber()
    const [data , SetData] = useState<any[]>()
    useEffect(()=>{
        const queryFunc = async () => {
          if(blockNumber&& blockNumber > 0){
            const yuzustakeConfs = await(await fetch(APIHost + "/yuzustake/configs")).json();
            // tododo, 待处理 fix
            SetData(yuzustakeConfs.data)
          }
        }
        queryFunc()
        const timer = setTimeout(queryFunc, 3000)
        return () => {
          clearTimeout(timer)
        }
    } ,[blockNumber])

    const xyuzuConfs = useMemo(
        ()=>{
            return data?.map((conf)=>{
                let t = new XyuzuConf({
                    id : conf._id,
                    ratio : conf.ratioBase10000/10000,
                    blockCount :conf.blockCount
                    }
                )
                return t
            })

        },
        [blockNumber, data]
    )

    return xyuzuConfs?.sort(function(a, b){return a.id as number - (b.id as number) })
}

export class XyuzuOrder  {
    public readonly id!: number
    public readonly amount!: number
    public readonly xamount!: number
    public readonly stakeAt!: number
    public readonly stakeEnd!: number
    public readonly unstakeAt!: number
    public readonly unstakeEnd!: number
    public readonly withdrawAt!: number
    public readonly unstakeHash!: string
    public readonly withdrawHash!: string
    constructor(data: Partial<XyuzuOrder>){
        Object.assign(this, data);
    }
  }

export function useXYuzuOrders(){
    const blockNumber = useBlockNumber()
    const { account, chainId } = useActiveWeb3React()
    const [data , SetData] = useState<any[]>()
    useEffect(()=>{
        const queryFunc = async () => {
          if(blockNumber&& blockNumber > 0){
            const yuzustakeOrders = await(await fetch(APIHost + "/yuzustake/orders?address=" + account)).json();
            console.log("111111111", yuzustakeOrders)
            // tododo, 待处理 fix
            SetData(yuzustakeOrders.data)
          }
        }
        queryFunc()
        const timer = setTimeout(queryFunc, 3000)
        return () => {
          clearTimeout(timer)
        }
    } ,[blockNumber])

    const xyuzuOrders = useMemo(
        ()=>{
            return data?.map((order)=>{
                let t = new XyuzuOrder({
                    id : order._id,
                    amount : order.depositAmount,
                    xamount : order.mintAmount,
                    stakeAt : order.stakedAt,
                    stakeEnd : order.stakeEndBlockNumber,
                    unstakeAt : order.unstakedAt,
                    unstakeEnd : order.unstakedEndBlockNumber,
                    withdrawAt : order.withdrawAt,
                    unstakeHash : order.unstakedHash,
                    withdrawHash : order.withdrawHash
                    }
                )
                return t
            })

        },
        [blockNumber, data]
    )
    return  xyuzuOrders
}