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
import { useTokenContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import fixFloat from 'utils/fixFloat'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { CHAIN_CONFIG } from 'components/Header'
import { ExternalLink } from '../../theme/components'
import { BLACKHOLE_ADDRESS } from '../../constants'
import { transToThousandth } from 'utils/fixFloat'
import pledgeTop from '../../assets/newUI/pledgeTop.png'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { useTotalSupply } from 'data/TotalSupply'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, Currency, WETH } from '@liuxingfeiyu/zoo-sdk'

export function Pledge(props: any){
  const zooPrice:any = useSelector<AppState>(state=>state.zoo.price) || 0
  const StarBlock = 57100
  const PeriodBlock = 5000000
  const blockNumber = useBlockNumber()
  const now = Math.floor((new Date()).valueOf()/1000)
  const [timestamp,setTimeStamp] = useState(now)
  const [lastBlockAt,setLastBlockAt] = useState(now)
  const yuzuToken = (AllDefaultChainTokens as any)[DefaultChainId].YUZU
  const yuzuTokenCon = useTokenContract(yuzuToken.address, false)
  const blackholeRe = useSingleCallResult(yuzuTokenCon, "balanceOf", [BLACKHOLE_ADDRESS]).result 
  const yuzuShow =  transToThousandth(fixFloat(tokenAmountForshow(blackholeRe ?? '0', yuzuToken.decimals), 3))



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
      <div className="s-pledge-item-in">
        <div className="s-pledge-item-numbers">
          <span>${zooPrice.toFixed(3)}</span>
          <span>${transToThousandth(autobuyCurr.toFixed(3))}</span>
          <span>${transToThousandth(tradeOneDay.toFixed(3))}</span>
          <span className="s-pledge-item-timer">
            <em>{day}</em>:
            <em>{hour}</em>:
            <em>{min}</em>:
            <em>{second}</em>
          </span>
        </div>
        <div className="s-pledge-item-title">
          <span>{t('homepageCurrentPrice')}</span>
          <span>{t('homepagetoBeRepurchasedAmount')} </span>
          <span>{t('homepage24Hours')} </span>
          <span  className="s-pledge-item-timer">{t('homepageHalvingCountdown')} </span>
        </div>
      </div>
    </div>
  )
}

export function PledgeDown(props: any){
  const zooPrice:any = useSelector<AppState>(state=>state.zoo.price) || 0
  const { account, chainId } = useActiveWeb3React()
  const tokenlist = useAllTokens()
  const yuzuToken : (Token | undefined) = useMemo(
    ()=>{
      let re = undefined
      for(let item of Object.values(tokenlist)){
          if(item.symbol == 'YUZU'){
              re = item
          }
      }
      return re
    }
    ,
    [tokenlist]
  )
  const { t } = useTranslation()
  const totalSupply = useTotalSupply(yuzuToken)
  const mintShow = transToThousandth(fixFloat(parseFloat(totalSupply?.toFixed(0) ?? '0'), 0))
  console.log("test zooprice", zooPrice, totalSupply?.toFixed(0, { groupSeparator: ',' }))

  const yuzuTokenCon = useTokenContract(yuzuToken?.address ?? '', false)
  const blackholeRe = useSingleCallResult(yuzuTokenCon, "balanceOf", [BLACKHOLE_ADDRESS]).result 
  const yuzuShow =  transToThousandth(fixFloat(tokenAmountForshow(blackholeRe ?? '0', yuzuToken?.decimals), 0))

  const cirnum = parseFloat(totalSupply?.toFixed(0) ?? '0') - tokenAmountForshow(blackholeRe ?? '0', yuzuToken?.decimals)
  const cirShow = transToThousandth(fixFloat( cirnum , 0))

  const capShow = transToThousandth(fixFloat(cirnum * zooPrice, 0))
  const rewardConfig = new AttenuationReward({ startBlock: 57100, zooPerBlock: JSBI.BigInt("50000000000000000000"), halfAttenuationCycle: 5000000 })
  const blockNumber = useBlockNumber()
  const rewardPerBlock = tokenAmountForshow(rewardConfig.getZooRewardBetween(blockNumber ?? 0, (blockNumber??0) + 1).toFixed(0),  yuzuToken?.decimals)

  const PinkSpan = styled.span`
    color:#ED4962;
    display : inline;
  `

  return (
    <div className="s-pledge-item">
      <div className="s-pledge-item-in">
        <div className="s-pledge-item-numbers">
          <span>${capShow}</span>
          <span>{mintShow}&nbsp;<PinkSpan>YUZU</PinkSpan> </span>
          <span
            style={{ cursor: "pointer"}}
            onClick={()=>{window.open((CHAIN_CONFIG as any)[DefaultChainId].blockExplorerUrl +'address/' +BLACKHOLE_ADDRESS + '/transactions'
                )}}
          >{yuzuShow}&nbsp;<PinkSpan>YUZU</PinkSpan> </span>
          <span> {cirShow}&nbsp;<PinkSpan>YUZU</PinkSpan> </span>
          <span> {rewardPerBlock}&nbsp;<PinkSpan>YUZU</PinkSpan> </span>
        </div>
        <div className="s-pledge-item-title">
          <span>Market Cap</span>
          <span>Total Minted </span>
          <span>Total Burned </span>
          <span>Circulating Supply </span>
          <span>New YUZU per Block</span>
        </div>
      </div>
    </div>
  )
}


export default function LiquidityPledge(props:any ){
  let [tradeOneDay,stakedTotal]  =  usePairStaticsInfo()
  stakedTotal = stakedTotal || 0;
  const { t } = useTranslation()

  const TopImg = styled.img`
    position : absolute;
    z-index: -1;
    width : 400px;
    margin-top: -200px;
    margin-left: 100px;
  `

  /*todo 参数传入*/
  return (
    <div className="s-liquidity-pledge">
      <TopImg src={pledgeTop}/>
      <div className="s-liquidity-rect"/>
      <div className="s-liquidity-title">{t('homepageCurrentLiquidityminingPool')} </div>
      <div className="s-liquidity-title1">{transToThousandth(stakedTotal.toFixed(3))} USDT</div>
      <Pledge />
      <div className="s-liquidity-title">YUZU Stats</div>
      <PledgeDown/>
    </div>
  )
}

