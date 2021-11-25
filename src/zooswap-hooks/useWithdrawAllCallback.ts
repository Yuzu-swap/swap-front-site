import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useSwapMiningContract } from '../zooswap-hooks/useContract'
import { useActiveWeb3React } from '../hooks/index'
import { DefaultChainId, ZOO_SWAP_MINING_ADDRESS } from '../constants'



export function useWithdrawAllCallback(
): () => Promise<void> {

    const { chainId, account } = useActiveWeb3React()
    const swapMiningContract = useSwapMiningContract(ZOO_SWAP_MINING_ADDRESS[chainId?? DefaultChainId], true)
    const addTransaction = useTransactionAdder()


    const withdrawAll = useCallback(async (): Promise<void> => {

        if (!swapMiningContract) {
            console.error('swapMiningContract is null')
            return
        }
        const estimatedGas = await swapMiningContract.estimateGas.withdrawAll().catch(() => {
            return swapMiningContract?.estimateGas.withdrawAll()
        })


        return swapMiningContract.withdrawAll({
            gasLimit: calculateGasMargin(estimatedGas)
        })
            .then((response: TransactionResponse) => {
                addTransaction(response, {
                    summary: 'WithDrawAll: ' + " SwapMiningPool",
                })
            })
            .catch((error: Error) => {
                console.debug('Failed to approve token', error)
                throw error
            })
    }, [chainId, account, swapMiningContract, addTransaction])

    return withdrawAll
}

