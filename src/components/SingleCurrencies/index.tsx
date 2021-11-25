import React, { useContext, useMemo, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Link } from 'react-router-dom'

import { ButtonPrimaryNormal, ButtonSecondary } from '../Button'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import FantomLogo from '../../assets/images/fantom-logo.png'
import Trans from '../../assets/newUI/trans.png'
import { DefaultChainId, ZOO_PARK_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { STAKING_REWARDS_INTERFACE } from 'constants/abis/staking-rewards'
import { useMultipleContractSingleData } from 'state/multicall/hooks'
//import { ZERO } from '@liuxingfeiyu/zoo-sdk//constants'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useStakingContract } from 'hooks/useContract'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useZooParkCallback from 'zooswap-hooks/useZooPark'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool } from '@liuxingfeiyu/zoo-sdk'
import { useBlockNumber } from 'state/application/hooks'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import CurrencyLogo from 'components/CurrencyLogo'
import { useAllTokens } from 'hooks/Tokens'
import { useTranslation } from 'react-i18next'

const SingleCurrencyContainer = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  width: 300px !important;
`};
`
const SingleCurrencyHeader = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  display: block !important;
  flex: none !important;
`};
`
const SingleCurrencyHeaderDetails = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  margin-left: 22% !important;
`};
`
const SingleCurrencyHeaderDetail = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  width: 80% !important;
`};
`
const SingleCurrencyBodyDetail = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100% !important;
  flex: none !important;
`};
`
const SingleCurrencyBodyDetails = styled.div`
${({ theme }) => theme.mediaWidth.upToMedium`
  margin: 110px 0 0 0 !important;
`};
`


export function SingleCurrency({ pool, key }: any) {
  /*
    // 个人质押总额
    const myStaked = tokenAmountForshow(pool.myCurrentLp || 0)
    // 个人未领取奖励
    const myReward = tokenAmountForshow(pool.myReward || 0)
    // 个人lp 余额
    const myBalance = tokenAmountForshow(pool.myLpBalance || 0)
  
    const totalLp = tokenAmountForshow(pool.totalLp || 0)
  
  
  
    const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  `
    const blockNumber = useBlockNumber()
    const prices:any  =  useSelector<AppState>(state=>state.zoo.tokenPrices)
    const dayReturn = useMemo(()=>{
      const rewardPrice = prices["ZOO"] 
      const token0Price = prices[pool?.token0?.symbol||""] || 1
      const token1Price = prices[pool?.token1?.symbol||""] || 1
  
  
      return  rewardPrice? JSBI.toNumber(pool.getDayReturn(blockNumber??0,rewardPrice,token0Price*Math.pow(10,18-pool.token0.decimals),token1Price*Math.pow(10,18-pool.token1.decimals)))/10000:0
    },[blockNumber])
  
    const allTokens = useAllTokens()
    const [token0WithLogo,token1WithLogo] =useMemo( ()=>{
      return [ allTokens[pool.token0.address],allTokens[pool.token1.address]]
    },[pool.token0,pool.token1])
  
    const jumpUrl = `/add/${pool?.token0.address}/${pool?.token1.address}`
    const dayProduce = useMemo(()=>{
      //per block every 4s
      return  JSBI.toNumber(pool.rewardConfig.getZooRewardBetween(blockNumber??0,(blockNumber??0)+24*3600/4))*pool.rewardEffect/1e18/10000
    },[blockNumber])
  
    */
  const { t } = useTranslation();
  const ResponsiveButtonSecondary = styled(ButtonSecondary)`
`


  return (
    <SingleCurrencyContainer className="s-singlecurrency-item">
      <SingleCurrencyHeader className="s-singlecurrency-header">
        <div className="s-singlecurrency-header-logo">ZOO</div>
        <SingleCurrencyHeaderDetails className="s-singlecurrency-header-details">
          <SingleCurrencyHeaderDetail className="s-singlecurrency-header-detail">
            <span className="s-singlecurrency-header-detail-label">已奖励金额($) </span>
            <span className="s-singlecurrency-header-detail-content">5,210,180.23</span>
          </SingleCurrencyHeaderDetail>
          <div className="s-singlecurrency-header-detail">
            <span className="s-singlecurrency-header-detail-label">当日奖励金额($) </span>
            <span className="s-singlecurrency-header-detail-content">5,210,180.23</span>
          </div>
          <div className="s-singlecurrency-header-detail">
            <span className="s-singlecurrency-header-detail-label">当月累计奖励金额($) ≈ </span>
            <span className="s-singlecurrency-header-detail-content">5,210,180.23</span>
          </div>
        </SingleCurrencyHeaderDetails>
      </SingleCurrencyHeader>
      <div className="s-singlecurrency-body">
        <SingleCurrencyBodyDetails className="s-singlecurrency-body-details">
          <SingleCurrencyBodyDetail className="s-singlecurrency-body-detail">
            <span className="s-singlecurrency-body-detail-icon"></span>
            <span className="s-singlecurrency-body-detail-name">ZOO</span>
          </SingleCurrencyBodyDetail>

          <SingleCurrencyBodyDetail className="s-singlecurrency-body-detail">
            <span className="s-singlecurrency-body-detail-icon"></span>
            <span className="s-singlecurrency-body-detail-name">USDT</span>
            <span className="s-singlecurrency-body-detail-label">APY </span>
            <span className="s-singlecurrency-body-detail-content">73.4%</span>
          </SingleCurrencyBodyDetail>

          <SingleCurrencyBodyDetail className="s-singlecurrency-body-detail">
            <span className="s-singlecurrency-body-detail-label">TVL </span>
            <span className="s-singlecurrency-body-detail-content">5,210,180.23</span>
          </SingleCurrencyBodyDetail>

          <SingleCurrencyBodyDetail className="s-singlecurrency-body-detail">
            <span className="s-singlecurrency-body-detail-label">个人收益 </span>
            <span className="s-singlecurrency-body-detail-content">5,210,180.23</span>
          </SingleCurrencyBodyDetail>

          <SingleCurrencyBodyDetail className="s-singlecurrency-body-detail">
            <ResponsiveButtonSecondary as={Link} className="s-singlecurrency-body-button" to={`/singlecurrency/select/${0}`}>挖矿</ResponsiveButtonSecondary>
          </SingleCurrencyBodyDetail>
        </SingleCurrencyBodyDetails>
      </div>
      <div className="s-singlecurrency-rate">
        <span>4.39%</span>
      </div>
    </SingleCurrencyContainer>
  )
}


export default function SingleCurrenies({ rooms }: any) {

  const { chainId, account } = useActiveWeb3React()

  return (
    <div className="s-singlecurrency-list">
      {rooms.map((pool: any, i: number) => {
        return <SingleCurrency key={i} pool={pool} />
      })}
    </div>
  )
}

