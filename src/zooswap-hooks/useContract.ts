import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import { useMemo } from 'react'
import SUSHI_ABI from '../constants/sushiAbis/sushi.json'
import MASTERCHEF_ABI from '../constants/sushiAbis/masterchef.json'
import FACTORY_ABI from '../constants/sushiAbis/factory.json'
import ROUTER_ABI from '../constants/sushiAbis/router.json'
import BAR_ABI from '../constants/sushiAbis/bar.json'
import MAKER_ABI from '../constants/sushiAbis/maker.json'
import TIMELOCK_ABI from '../constants/sushiAbis/timelock.json'
import BENTOBOX_ABI from '../constants/sushiAbis/bentobox.json'
import BASEINFO_ABI from '../constants/sushiAbis/baseInfo.json'
import USERINFO_ABI from '../constants/sushiAbis/userInfo.json'
import MAKERINFO_ABI from '../constants/sushiAbis/makerInfo.json'
import DASHBOARD_ABI from '../constants/sushiAbis/dashboard.json'
import DASHBOARD2_ABI from '../constants/sushiAbis/dashboard2.json'
import PENDING_ABI from '../constants/sushiAbis/pending.json'
import BENTOHELPER_ABI from '../constants/sushiAbis/bentoHelper.json'

import SAAVE_ABI from '../constants/sushiAbis/saave.json'
import { abi as STAKE_MINING_ABI } from '@liuxingfeiyu/zoo-core/deployments/ropsten/YuzuPark.json'
import { abi as SWAP_MINING_ABI } from  '@liuxingfeiyu/zoo-core/deployments/ropsten/YuzuSwapMining.json'

import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from '../hooks/index'

// Factory address already in SDK
import {
  FACTORY_ADDRESS,
  SUSHI_ADDRESS,
  MASTERCHEF_ADDRESS,
  BAR_ADDRESS,
  MAKER_ADDRESS,
  TIMELOCK_ADDRESS,
  ROUTER_ADDRESS
} from '@liuxingfeiyu/zoo-sdk'

// returns null on errors
export function useContract(
  address: string | undefined | false,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUSHI_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible)
}

export function useSwapMiningContract(swapMiningAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(swapMiningAddress, SWAP_MINING_ABI, withSignerIfPossible)
}
export function useZooParkContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKE_MINING_ABI, withSignerIfPossible)
}
