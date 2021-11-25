import React,{ useContext, useMemo, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Link } from 'react-router-dom'

import { ButtonPrimaryNormal, ButtonSecondary } from '../../components/Button'

import { DefaultChainId, ZOO_PARK_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { STAKING_REWARDS_INTERFACE } from 'constants/abis/staking-rewards'
import { useMultipleContractSingleData } from 'state/multicall/hooks'
//import { ZERO } from '@liuxingfeiyu/zoo-sdk//constants'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useStakingContract } from 'hooks/useContract'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useZooParkCallback from 'zooswap-hooks/useZooPark'
import {ChainId, CurrencyAmount, JSBI, Token, TokenAmount ,StakePool, ZERO} from '@liuxingfeiyu/zoo-sdk'
import { useBlockNumber } from 'state/application/hooks'
import { tokenAmountForshow,numberToString } from 'utils/ZoosSwap'
import { useTranslation } from 'react-i18next'





export default function BoardroomLP({zoopark}:{zoopark :StakePool}  ) {
  const { t } = useTranslation();
  const onAdd = async () => {
    // await deposit(index, "0")
  }

  console.log("zoopark.myLpBalance ", zoopark.myLpBalance.toString(10))
  const poolShareRatio = JSBI.greaterThan(zoopark.totalLp,ZERO)?  JSBI.toNumber(JSBI.divide(JSBI.multiply(zoopark.myLpBalance,JSBI.BigInt(100)),zoopark.totalLp)) :  0
  const ResponsiveButtonSecondary = styled(ButtonSecondary)`
`

  const jumpUrl = `/add/${zoopark.token0.address}/${zoopark.token1.address}`
  return (
    <div className="s-boardroom-lp">
      <div className="s-trading-item-details">
        <h2>{zoopark.token0.symbol}/{zoopark.token1.symbol}</h2>
        <div className="s-trading-item-detail">
          <label>{t('myLpBalance')}: </label>
          <em>{numberToString(JSBI.toNumber(zoopark.myLpBalance)/1e18)}</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{zoopark.token0.symbol} ：</label>
          <em>{tokenAmountForshow(zoopark.token0Balance,zoopark.token0.decimals)*poolShareRatio}</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{zoopark.token1.symbol}：</label>
          <em>{tokenAmountForshow(zoopark.token1Balance,zoopark.token1.decimals)*poolShareRatio} </em>
        </div>
        <div className="s-trading-item-detail">
          <label>{t('poolTokenPercentage')}:</label>
          <em>{(poolShareRatio) .toFixed(2)} % </em>
        </div>
      </div>   
      <ResponsiveButtonSecondary  className="s-boardroom-select" as={Link} padding="6px 18px" to={jumpUrl}>
      {t('add')}
      </ResponsiveButtonSecondary>
    </div>
  )
}
