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


export class SingleOrder  {
    public readonly userAddress!: string
    public readonly orderId!: number
    public readonly inToken!: string
    public readonly outToken!: string
    public readonly inNum!: string
    public readonly outNum!: string
    public readonly outRealNum!: string
    public readonly status!: number
    public readonly deadline!: number
    public readonly createHash!: string
    public readonly execHash!: string
    public readonly cancelHash!: string
    constructor(data: Partial<SingleOrder>){
        Object.assign(this, data);
    }
  }

export function useLimitOrdersData(){
    const blockNumber = useBlockNumber()
    const { account, chainId } = useActiveWeb3React()
    const [data , SetData] = useState<any[]>()
    useEffect(()=>{
        const queryFunc = async () => {
          if(blockNumber&& blockNumber > 0){
            const limitOrders = await(await fetch(APIHost + "/getordersbyuser/" + account)).json();
            //const limitOrders = await(await fetch( "http://43.154.22.163:8080/api/getordersbyuser/" + account)).json();
            // tododo, 待处理 fix
            if(limitOrders && limitOrders.data){
                SetData(limitOrders.data)
            }
          }
        }
        queryFunc()
        const timer = setTimeout(queryFunc, 3000)
        return () => {
          clearTimeout(timer)
        }
    } ,[blockNumber])

    const limitOrders = useMemo(
        ()=>{
            return data?.map((order)=>{
                let t = new SingleOrder({
                    userAddress: order.useraddress,
                    orderId: order.orderid,
                    inToken: order.intoken,
                    outToken: order.outtoken,
                    inNum: order.inexcatnum,
                    outNum: order.outminnum,
                    outRealNum: order.outrealnum,
                    status: order.status,
                    deadline: order.deadline,
                    createHash: order.createhash,
                    execHash: order.exechash,
                    cancelHash: order.cancelhash
                    }
                )
                return t
            })

        },
        [blockNumber, data]
    )
    return  limitOrders
}