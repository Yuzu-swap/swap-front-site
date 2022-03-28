import { ChainId, TokenAmount, Currency, JSBI, TradePool } from '@liuxingfeiyu/zoo-sdk'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'

import styled from 'styled-components'

// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'

import { YellowCard } from '../Card'
import { Moon, Sun } from 'react-feather'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup, useBlockNumber } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import usePrevious from '../../hooks/usePrevious'
import '../../assets/o.css';
import { ButtonSecondary } from '../Button'
import { useWithdrawalRewardModal, useModalOpen } from '../../state/application/hooks'
import WithdrawalRewardModal from '../WithdrawalModal'
import { ApplicationModal } from '../../state/application/actions'
import { DefaultChainId, ZOO_SWAP_MINING_ADDRESS } from '../../constants'
import { useWithdrawAllCallback } from 'zooswap-hooks/useWithdrawAllCallback'
import { useMyAllStakePoolList } from 'data/ZooPark'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { useTranslation } from 'react-i18next'
import { transToThousandth } from 'utils/fixFloat'

const Web3Withdrawal = styled(ButtonSecondary)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.white};
  border: none;
  font-weight: 500;
  width: 168px;
  &:hover, &:focus{
    border:none;
    opacity: 1;
  }
`

export default function Header({statics,poolList}:{poolList:TradePool[],statics:any}) {
  const { account, chainId } = useActiveWeb3React()
  const showVoteModal = useModalOpen(ApplicationModal.WITHDRAWAL_REWARD)
  const toggleWithdrawalRewardModal = useWithdrawalRewardModal()
  const blockNumber = useBlockNumber()

  const myReward = useMemo( ()=> {
    let total = JSBI.BigInt(0)
    poolList.forEach(pool=>{
      total = JSBI.add(total,pool.myReward)
    })
    return total

  },[poolList])

  const withdrawAll = useWithdrawAllCallback()
  const { t } = useTranslation();
  //<Web3Withdrawal onClick={toggleWithdrawalRewardModal}>
  return (
    <div className="s-banner s-tradingmining-banner" style={{color : '#FFFFFF'}}>
      <p className="s-tradingmining-text">{t('totalTransactionAmount')}：${transToThousandth(statics.totalSwapVolume?.toFixed(3)) }</p>
      <p className="s-tradingmining-text">{t('currentIndividualWithdrawableRewards')}：{ transToThousandth(tokenAmountForshow(myReward).toFixed(3))} YUZU</p>
      <Web3Withdrawal onClick={withdrawAll}>
        <Text>{t('withdrawalRewards')}</Text>
      </Web3Withdrawal>
      <WithdrawalRewardModal isOpen={showVoteModal}/>
    </div>
  )
}
