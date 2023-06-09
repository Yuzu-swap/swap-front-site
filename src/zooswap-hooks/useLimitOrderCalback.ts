import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, WETH } from '@liuxingfeiyu/zoo-sdk'
import { useSwapMiningContract, useZooParkExtContract, useZooParkContract, useZooZapExtContract } from './useContract'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import { APIHost, DefaultChainId, AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS, LimitOrderList, ETHFakeAddress, limitOrderExpireTime } from "../constants/index"
import { usePairContract, useTokenContract , useXYuzuContract, useLimitOrderContract} from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ERC20_INTERFACE from 'constants/abis/erc20'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { wrappedCurrencyAmount } from '../utils/wrappedCurrency'
import { useBlockNumber } from 'state/application/hooks'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { Address } from 'cluster'
import { ethers } from 'ethers'

export function useLimitOrderCreateTaskCallback(
  inTokenAddress : string,
  outTokenAddress : string,
  inExactNum: JSBI,
  outNum: JSBI
){
  const { account, chainId }  = useActiveWeb3React()

  const contract = useLimitOrderContract(LimitOrderList[chainId ?? ChainId.OASISETH_MAIN])
  const addTransaction = useTransactionAdder()

  const createTask = useCallback(async (): Promise<string | undefined> => {
    
    if (!contract) {
        console.error('LimitOrder Contract is null')
        return undefined
      }
      const args = [ inTokenAddress, outTokenAddress, inExactNum.toString(), outNum.toString(), limitOrderExpireTime]
      let options : any = {}
      if(inTokenAddress == ETHFakeAddress){
          options.value = inExactNum.toString()
      }
  
      const estimatedGas = await contract.estimateGas.createTask( ...args, options ).catch(() => {
          return contract.estimateGas.createTask( ...args, options)
      })
      options.gasLimit = estimatedGas 

    return contract
      .createTask(... args, options )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Create LimitOrder'}
          )
        return response.hash
      }).catch((error: Error) => {
        console.debug('Failed to Create LimitOrder', error)
        throw error
      })
  }, [inTokenAddress, outTokenAddress, inExactNum, outNum, addTransaction, chainId])

  return createTask
}

export function useLimitOrderCancelTaskCallback(
    taskId: number
  ){
    const { account, chainId }  = useActiveWeb3React()
  
    const contract = useLimitOrderContract(LimitOrderList[chainId ?? ChainId.OASISETH_MAIN])
    const addTransaction = useTransactionAdder()
  
    const cancelTask = useCallback(async (): Promise<void> => {
      
      if (!contract) {
          console.error('LimitOrder Contract is null')
          return
        }
        const args = [ account, taskId ]
        let options : any = {}

        const estimatedGas = await contract.estimateGas.cancelTask( ...args, options ).catch(() => {
            return contract.estimateGas.cancelTask( ...args, options)
        })
        options.gasLimit = estimatedGas 
  
      return contract
        .cancelTask(... args, options )
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Cancel LimitOrder'}
            )
        }).catch((error: Error) => {
          console.debug('Failed to Create LimitOrder', error)
          throw error
        })
    }, [account, taskId, addTransaction, chainId])
  
    return cancelTask
  }