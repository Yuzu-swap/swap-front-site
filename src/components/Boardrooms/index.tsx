import React,{ useContext, useMemo, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { Link } from 'react-router-dom'

import { ButtonPrimaryNormal, ButtonSecondary } from '../../components/Button'

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
import {ChainId, CurrencyAmount, JSBI, Token, TokenAmount ,StakePool, ZERO} from '@liuxingfeiyu/zoo-sdk'
import { useBlockNumber } from 'state/application/hooks'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import CurrencyLogo from 'components/CurrencyLogo'
import { useAllTokens } from 'hooks/Tokens'
import { useTranslation } from 'react-i18next'
import fixFloat from 'utils/fixFloat'
import { Decimal } from "decimal.js"
import { UserRatioOfReward } from '../../constants'



export function BoardItem({pool,key,totalEffect,tvl}:{ pool: StakePool ,key:number ,totalEffect:number,tvl:number}) {
  // const { chainId, account } = useActiveWeb3React()
  // const deadline = useTransactionDeadline()
  // const stakingContract = useStakingContract(pool.lpAddress)
  // const [approval, approveCallback] = useApproveCallback(new TokenAmount(new Token(chainId ?? DefaultChainId, pool.lpAddress, 18), balance), ZOO_PARK_ADDRESS[chainId ?? DefaultChainId])
//  console.log('StakePoolStakePoolStakePool', pool);

  // 个人质押总额
  const myStaked = tokenAmountForshow(pool.myCurrentLp || 0)
  // 个人未领取奖励
  const myReward = tokenAmountForshow(pool.myReward || 0)
  // 个人lp 余额
  const myBalance = tokenAmountForshow(pool.myLpBalance || 0)

  const totalLp = tokenAmountForshow(pool.totalLp || 0)
  
  const totalLpInPark = tokenAmountForshow(pool.totalLpInPark || 0)

  const myRatio =   JSBI.greaterThan(pool.totalLpInPark,ZERO ) ?   (new Decimal(pool.myCurrentLp.toString())).div(new Decimal(pool.totalLpInPark.toString())).toNumber() :0



  const ResponsiveButtonSecondary = styled(ButtonSecondary)`
`

  const BoardRoomDetail = styled.div`
    display : flex;
    justify-content: space-between;
    height : 35px;
  `

  const blockNumber = useBlockNumber()
  const prices:any  =  useSelector<AppState>(state=>state.zoo.tokenPrices)
  const rewardPrice = prices["ZOO"] 
  const dayReturn = useMemo(()=>{
    const rewardPrice = prices["ZOO"] 
    const token0Price = prices[pool?.token0?.symbol||""] || 1
    const token1Price = prices[pool?.token1?.symbol||""] || 1


    return  rewardPrice? pool.getDayReturn(blockNumber??0,rewardPrice,token0Price*Math.pow(10,18-pool.token0.decimals),token1Price*Math.pow(10,18-pool.token1.decimals)).toNumber() /10000:0
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

  const prodPerBlock:number = useMemo(()=>  tokenAmountForshow(pool.rewardConfig.zooPerBlock) * pool.rewardEffect / totalEffect ,[blockNumber, pool])

  const Apr = (prodPerBlock * UserRatioOfReward * rewardPrice * 10 * 60 * 24 * 365 * 100) / tvl
  const { t } = useTranslation();
  return (
    <div className="s-boardroom-item">
      <div className="s-trading-item-trans">
      <CurrencyLogo currency={token0WithLogo} />
      <Link to={jumpUrl}>
        <img src={ Trans } alt="" className="s-trading-trans" />
        <CurrencyLogo currency={token1WithLogo}  /><br/>
        { <h2>{pool.token0.symbol}{'-'}{pool.token1.symbol}</h2> }
      </Link>
      </div>

      <div className="s-boardroom-item-details">
        <div className="s-boardroom-detail">
          {/* <p>{pool.lpAddress}</p> */}
          <BoardRoomDetail>
            <p>{t('productionperblock')}:</p> 
            <p>{ fixFloat(prodPerBlock * UserRatioOfReward, 1)} YUZU</p>
          </BoardRoomDetail>
          <BoardRoomDetail>
            <p>{t('totalLp')}:</p>
            <p>{ fixFloat(tvl, 4)} USDT</p>
          </BoardRoomDetail>
          <BoardRoomDetail>
            <p>{t('myStaked')}:</p> 
            <p>{ fixFloat(myRatio * 100, 2)}%</p>
          </BoardRoomDetail>
          <BoardRoomDetail>
            <p>{t('myReward')}:</p> 
            <p>{ fixFloat(myReward, 4)} YUZU</p>
          </BoardRoomDetail>          
        </div>
        <div className="s-boardroom-apy">
          <span>APR</span>
          <span>{fixFloat(Apr, 3)}%</span>
        </div>
        <ResponsiveButtonSecondary  className="s-boardroom-select" as={Link} padding="6px 18px" to={`/liquiditymining/select/${pool.pid}`}>
        {t('select')}
        </ResponsiveButtonSecondary>
                
        {/* <div className="s-boardroom-select" onClick={onWithdraw}>withdraw</div> */}
        {/* <div className="s-boardroom-select" onClick={onHarvest}>harvest</div> */}
      </div>
    </div>
  )
}


export default function Boardroom({rooms,statics}:{rooms: StakePool[],statics:any}) {

  const { chainId, account } = useActiveWeb3React()
  
  let totalEffect = 0
  for(let i = 0; i < rooms.length; i++){
    totalEffect += rooms[i].rewardEffect
  }
  return (
    <div className="s-trading-list">
       {rooms.map((pool: StakePool, i: number) => {
        return <BoardItem key={i} pool={pool} totalEffect={totalEffect} tvl={ (statics && statics.tvls&&statics.tvls[i])||0}/>
      })}
    </div>
  )
}

