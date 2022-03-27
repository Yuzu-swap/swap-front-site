import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, WETH } from '@liuxingfeiyu/zoo-sdk'
import { useSwapMiningContract, useZooParkExtContract, useZooParkContract, useZooZapExtContract } from './useContract'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import { APIHost, DefaultChainId, AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS } from "../constants/index"
import { usePairContract, useTokenContract , useXYuzuContract} from 'hooks/useContract'
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

export function useXYuzuStakeCallback(
  address : string,
  amount : JSBI,
  cid : number
){
  const { account } = useActiveWeb3React()


  const tokenContract = useXYuzuContract(address)
  const addTransaction = useTransactionAdder()

  const stake = useCallback(async (): Promise<void> => {
    
    if (!tokenContract) {
      console.error('XYUZUContract is null')
      return
    }
    return tokenContract
      .stake( BigNumber.from(amount.toString()), cid
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Xyuzu Stake'}
          )
      }).catch((error: Error) => {
        console.debug('Failed to Stake Xyuzu', error)
        throw error
      })
  }, [amount, address, tokenContract, addTransaction, cid])

  return stake
}

export function useXYuzuCallback(
  address : string,
  oid : number
){
  const { account } = useActiveWeb3React()


  const tokenContract = useXYuzuContract(address)
  const addTransaction = useTransactionAdder()

  const unstake = useCallback(async (): Promise<void> => {
    
    if (!tokenContract) {
      console.error('XYUZUContract is null')
      return
    }
    return tokenContract
      .unstake( oid
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Xyuzu UnStake'}
          )
      }).catch((error: Error) => {
        console.debug('Failed to UnStake Xyuzu', error)
        throw error
      })
  }, [ address, tokenContract, addTransaction, oid])

  const withdraw = useCallback(async (): Promise<void> => {
    
    if (!tokenContract) {
      console.error('XYUZUContract is null')
      return
    }
    return tokenContract
      .withdraw( oid
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Xyuzu WithDraw'}
          )
      }).catch((error: Error) => {
        console.debug('Failed to Stake Xyuzu', error)
        throw error
      })
  }, [address, tokenContract, addTransaction])

  return [unstake, withdraw]
}