import React, { useMemo } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import FantomLogo from '../../assets/images/fantom-logo.png'
import Trans from '../../assets/newUI/trans.png'
import { CurrencyAmount, JSBI, Token, Trade ,TradePool, ZERO} from '@liuxingfeiyu/zoo-sdk'
import { useBlockNumber } from 'state/application/hooks'
import { math } from 'polished'
import { tokenAmountForshow } from 'utils/ZoosSwap'
import { Link } from 'react-router-dom'
import CurrencyLogo from 'components/CurrencyLogo'
import { useAllTokens } from 'hooks/Tokens'

import TradingGroupModal from '../../components/TradingGroupModal'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useTradingGroupModal } from '../../state/application/hooks'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import fixFloat , {transToThousandth} from 'utils/fixFloat'
import { UserRatioOfReward } from '../../constants'
import { Decimal } from "decimal.js"


let targetPool:TradePool;
export function TradingItem({pool,index,statics,totalEffect}:{ pool: TradePool,statics:any, totalEffect:number ,index:number}){

  const { t } = useTranslation();
//  console.log('TradingItemTradingItemTradingItem', pool, "statics ",statics);
  const getTokenPair  = (token0:Token,token1:Token) => {
    return token0.getSymbol() + " — " + token1.getSymbol()
  }
  const blockNumber = useBlockNumber() || 0 
  // 日收益率
  const dayReturn:number = useMemo(()=>{
    return pool.getDayReturn(blockNumber??0,1,1).toNumber ()/10000 * 100
  },[blockNumber])
  // 年收益率
  const yearReturn =  dayReturn * 365
  // 交易总额 
  const targetSymbol = pool.isToken0Archor? pool.token0.symbol : pool.token1.symbol
  const targetDecimal = pool.isToken0Archor? pool.token0.decimals : pool.token1.decimals
  //TODO: 待实现
  const totalTradeVolume:number = useMemo(()=> {
    return statics?.poolSwapVolumeList?.[pool.pid]??0 
  },[blockNumber, pool])
  //当前交易额
  const currentTradeVolume:number = useMemo(()=> tokenAmountForshow(pool.totalLp,targetDecimal)  ,[blockNumber, pool])
  //已分配奖励：
  const currentTotalReward:number = useMemo(()=>{return  tokenAmountForshow(JSBI.BigInt( statics?.withdrawedAmount?.[pool.pid]??0 ))  },[blockNumber, pool])
  // 个人交易总额
  const myCurrentTradeVolume:number = useMemo(()=> {return statics?.currentVolumes?.[index]??0} ,[blockNumber, pool])
  // 个人当前奖励
  const myCurrentReward:number = useMemo(()=>  tokenAmountForshow(pool.myReward) ,[blockNumber, pool])
  //每块产量
  const prodPerBlock:number = useMemo(()=>  tokenAmountForshow(pool.rewardConfig.getZooRewardBetween(blockNumber, blockNumber+1)) * pool.rewardEffect / totalEffect ,[blockNumber, pool])

  const myRatio = JSBI.greaterThan(pool.totalLp,ZERO ) ?   (new Decimal(pool.myCurrentLp.toString())).div(new Decimal(pool.totalLp.toString())).toNumber() :0

  const allTokens = useAllTokens()

  const toggleTradingGroupModal = useTradingGroupModal()
  

  const linkTo = (e:any) => {
    e.preventDefault();
    toggleTradingGroupModal()
    targetPool = pool;
  }

  const [token0WithLogo,token1WithLogo] =useMemo( ()=>{
    return [ allTokens[pool.token0.address],allTokens[pool.token1.address]]
  },[pool.token0,pool.token1])
  
  return (
    <div className="s-trading-item">
      <div className="s-trading-item-percent">
      </div> 
      <div className="s-trading-item-trans">
      <Link to={''} onClick={linkTo}>
        <CurrencyLogo currency={token0WithLogo} />
        <img src={ Trans } alt="" className="s-trading-trans" />
        <CurrencyLogo currency={token1WithLogo}  /><br/>
        <div className="s-trading-item-h">
        { getTokenPair(pool.token0,pool.token1) }
        </div>
        <h2></h2>
      </Link>
      </div>
      <div className="s-trading-item-details">
        {/*
        <div className="s-trading-item-detail">
          <label>{t('dayReturn')}<QuestionHelper text={t('dayReturnTip')}/>：</label>
          <em>{fixFloat(dayReturn, 4)}%</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{t('yearReturn')}<QuestionHelper text={t('yearReturnTip')}/>：</label>
          <em>{fixFloat(yearReturn, 4)}%</em>
        </div>*/
        }
        <div className="s-trading-item-detail">
          <label>{t('productionperblock')}:</label>
          <em>{fixFloat(prodPerBlock * UserRatioOfReward, 2)} YUZU</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{t('totalTradeVolume')}<QuestionHelper text={t('totalTradeVolumeTip')} />：</label>
          <em>${transToThousandth(fixFloat(totalTradeVolume, 3))}</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{t('myCurrentTradeVolume')}<QuestionHelper text={t('myCurrentTradeVolumeTip')} />：</label>
          <em>{fixFloat(myCurrentTradeVolume * myRatio, 4)} USDT</em>
        </div>
        <div className="s-trading-item-detail">
          <label>{t('myCurrentReward')}<QuestionHelper text={t('myCurrentRewardTip')} />：</label>
          <em>{fixFloat(myCurrentReward, 4)} YUZU</em>
        </div>
      </div>
      
    </div>
  )
}


export default function TradingList({poolList,statics}:{poolList:TradePool[],statics:any}){
  /*todo 参数传入*/
  const showTradingGroupModal = useModalOpen(ApplicationModal.TRADING_GROUP)
  const history = useHistory()
  const handleCurrencySelect = () => {
    const jumpUrl = `/swap/${targetPool.token0.address}/${targetPool.token1.address}`
    history.push(jumpUrl)
  }

  let totalEffect = 0;
  for(let i = 0; i< poolList.length; i++){
    totalEffect+= poolList[i].rewardEffect
  }
  console.log("tradepool", poolList)
  return (
    <div className="s-trading-list">
      {poolList.map((pool, i) => {
        return <TradingItem index={i} key={i} pool={pool} statics={statics} totalEffect={totalEffect}/>
      })}
      <TradingGroupModal isOpen={showTradingGroupModal} handleCurrencySelect={handleCurrencySelect}/>
    </div>
  )
}

