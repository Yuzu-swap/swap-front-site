import { useCallback } from 'react'
import { useSwapMiningContract, useZooParkContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { ZOO_SWAP_MINING_ADDRESS, DefaultChainId, ZOO_PARK_ADDRESS , ZOO_PARK_EXT_ADDRESS} from '../constants'
import { useActiveWeb3React } from 'hooks'
import { calculateGasMargin } from 'utils'



export default function useZooParkCallback(isExt:boolean = false): {withdraw: (pid:number,amount:string,callback?:any)=> Promise<void>,deposit:(pid:number,amount:string,callback?:any)=>Promise<void>} {
      const { chainId, account } = useActiveWeb3React()
      const ParkAdderss = isExt? ZOO_PARK_EXT_ADDRESS[chainId?? DefaultChainId] : ZOO_PARK_ADDRESS[chainId?? DefaultChainId]
      const zooParkContract = useZooParkContract(ParkAdderss, true)
      const addTransaction = useTransactionAdder()
  
  
      const withdraw = useCallback(async (pid:number,amount:string,callback?:any): Promise<void> => {
          if(!zooParkContract){
            return 
          } 
          const estimatedGas = await zooParkContract.estimateGas.withdraw(pid,amount).catch(() => {
              return zooParkContract?.estimateGas.withdraw(pid,amount)
          })
          return zooParkContract?.withdraw(pid,amount,{
              gasLimit: calculateGasMargin(estimatedGas )
          }).then((response: TransactionResponse) => {
                  addTransaction(response, {
                      summary: 'withdraw: ' + " YuzuPark",
                  })
              })
              .then(callback)
              .catch((error: Error) => {
                  console.debug('Failed to approve token', error)
                  throw error
              })
      }, [chainId, account, zooParkContract, addTransaction])


      const deposit = useCallback(async (pid:number,amount:string,callback?:any): Promise<void> => {
        if(!zooParkContract){
          return 
        } 
        console.log("pid is ",pid ," amount is ",amount)
        const estimatedGas = await zooParkContract.estimateGas.deposit(pid,amount).catch(() => {
            return zooParkContract?.estimateGas.deposit(pid,amount)
        })
        return zooParkContract?.deposit(pid,amount,{
            gasLimit: calculateGasMargin(estimatedGas )
        }).then((response: TransactionResponse) => {
                addTransaction(response, {
                    summary: 'deposit: ' + " YuzuPark",
                })
            })
            .then(callback)
            .catch((error: Error) => {
                console.debug('Failed to approve token', error)
                throw error
            })
    }, [chainId, account, zooParkContract, addTransaction])

    return {withdraw,deposit}
  }
  

