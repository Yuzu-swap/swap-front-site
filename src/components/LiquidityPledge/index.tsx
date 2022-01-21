import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'
import { useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { useBlockNumber } from 'state/application/hooks'
import { math } from 'polished'
import { APIHost , DefaultChainId , AllDefaultChainTokens} from '../../constants'
import { usePairStaticsInfo } from 'data/Pairs'
import { useTranslation } from 'react-i18next'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useBlackHoleContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import fixFloat from 'utils/fixFloat'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { CHAIN_CONFIG } from 'components/Header'
import { ExternalLink } from '../../theme/components'
import { BLACKHOLE_ADDRESS } from '../../constants'

export function Pledge(props: any){
  const zooPrice:any = useSelector<AppState>(state=>state.zoo.price) || 0
  const StarBlock = 57100
  const PeriodBlock = 5000000
  const blockNumber = useBlockNumber()
  const now = Math.floor((new Date()).valueOf()/1000)
  const [timestamp,setTimeStamp] = useState(now)
  const [lastBlockAt,setLastBlockAt] = useState(now)
  const yuzuToken = (AllDefaultChainTokens as any)[DefaultChainId].YUZU
  const BlackHole = useBlackHoleContract()
  const blackholeRe = useSingleCallResult(BlackHole, "balanceOf", yuzuToken.address).result 
  const yuzuShow =  fixFloat(tokenAmountForshow(blackholeRe ?? '0', yuzuToken.decimals), 3)  



  useEffect(()=> {
    setLastBlockAt(Math.floor((new Date()).valueOf()/1000) )
   
  },[blockNumber])

  const [day,hour,min,second] = useMemo(()=>{
    let nextBlockTime= 0
    let day,hour,min,second
    if (blockNumber&& blockNumber>0) {
      nextBlockTime = (PeriodBlock - (blockNumber?? 0- StarBlock )% PeriodBlock)*6
      nextBlockTime -= (timestamp-lastBlockAt)
      day = Math.floor(nextBlockTime/86400)
      hour = Math.floor((nextBlockTime-day*86400)/ 3600)
      min = Math.floor((nextBlockTime-day*86400-hour*3600)/60)
      second = nextBlockTime%60
    }
    return [day,hour,min,second]
  },[lastBlockAt,timestamp])

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setTimeStamp(Math.floor((new Date()).valueOf()/1000))
    },1000)
    return () =>{
      clearTimeout(timer)
    }
  },[timestamp])

 let [tradeOneDay,undefined,autobuyCurr,autobuyTotal]  =  usePairStaticsInfo()
  tradeOneDay = tradeOneDay ||0;

 const { t } = useTranslation()

  return (
    <div className="s-pledge-item">
        <div className="s-pledge-item-title">
          <span>{t('homepageCurrentPrice')}</span>
          <span>{t('homepagetoBeRepurchasedAmount')} </span>
          <span>{t('homepage24Hours')} </span>
          <span>{t('homepageRepurchasedAmount')} </span>
          <span  className="s-pledge-item-timer">{t('homepageHalvingCountdown')} </span>
        </div>
        <div className="s-pledge-item-numbers">
          <span>${zooPrice.toFixed(3)}</span>
          <span>${autobuyCurr.toFixed(3)}</span>
          <span>${tradeOneDay.toFixed(3)}</span>
          <span 
          style={{ cursor: "pointer"}}
          onClick={()=>{window.open((CHAIN_CONFIG as any)[DefaultChainId].blockExplorerUrl + BLACKHOLE_ADDRESS)}}>
            {yuzuShow} YUZU</span>
          <span className="s-pledge-item-timer">
            <em>{day}</em>:
            <em>{hour}</em>:
            <em>{min}</em>:
            <em>{second}</em>
          </span>
        </div>
    </div>
  )
}


export default function LiquidityPledge(props:any ){
  let [tradeOneDay,stakedTotal]  =  usePairStaticsInfo()
  stakedTotal = stakedTotal || 0;
  const { t } = useTranslation()
  /*todo 参数传入*/
  return (
    <div className="s-liquidity-pledge">
      <div className="s-liquidity-rect"/>
      <div className="s-liquidity-title">{t('homepageCurrentLiquidityminingPool')} </div>
      <div className="s-liquidity-title1">{stakedTotal.toFixed(3)} USDT</div>
      <Pledge />
    </div>
  )
}

