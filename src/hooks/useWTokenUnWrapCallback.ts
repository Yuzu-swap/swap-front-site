import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from "@ethersproject/bignumber";
import { TransactionResponse } from '@ethersproject/providers'
import { Trade, TokenAmount, CurrencyAmount ,Currency,JSBI , Token} from '@liuxingfeiyu/zoo-sdk'
import { useCallback, useMemo } from 'react'
import { useTokenAllowance } from '../data/Allowances'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin, getRouterAddress } from '../utils'
import { useTokenContract , useTokenWrapper} from './useContract'
import { useActiveWeb3React } from './index'
import { Version } from './useToggledVersion'
import { DefaultChainId } from '../constants'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useWTokenUnWrapCallback(
  amount : JSBI,
  wtoken : Token | undefined
){
  const { account } = useActiveWeb3React()


  const tokenContract = useTokenWrapper(wtoken?.address)
  const addTransaction = useTransactionAdder()

  const unwrap = useCallback(async (): Promise<void> => {
    
    if(!wtoken){
      console.error('TokenWrapper is null')
      return
    }
    if (!tokenContract) {
      console.error('TokenWrapperContract is null')
      return
    }
    return tokenContract
      .unwrap( BigNumber.from(amount.toString())
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'UnWrap ' + wtoken.symbol}
          )
      }).catch((error: Error) => {
        console.debug('Failed to unwrap token', error)
        throw error
      })
  }, [amount, wtoken, tokenContract, addTransaction])

  return unwrap
}

