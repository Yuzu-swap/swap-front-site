import React, { useEffect, useMemo, useState } from 'react'
import Boardrooms from '../../components/Boardrooms'
import BoardroomSelected from '../../components/Boardrooms/select'
import Sloganer from '../../components/Sloganer'
import Mock from 'mock/mock'
import { Text } from 'rebass'
import { APIHost, DefaultChainId, ZOO_PARK_ADDRESS } from '../../constants'
import { useBlockNumber } from 'state/application/hooks'
import { TradePool, Token, JSBI, AttenuationReward, StakePool, ZERO } from '@liuxingfeiyu/zoo-sdk'
import { useActiveWeb3React } from 'hooks'
import { useMyPendingZooListInPark, useMyCurrentLpListInPark, useMyLpBalanceListInPark } from 'data/ZooPark'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { updateZooPrice, updateZooStatePools } from 'state/zoo/reducer'
import { useMyAllStakePoolList,useMyAllYuzuParkExtList } from 'data/ZooPark'
import { useTranslation } from 'react-i18next'
import { transToThousandth } from 'utils/fixFloat'

export default function BoradRoom() {
  const [poolList,statics, maintainFlag] = useMyAllStakePoolList()
  const [poolExtList,extStatics] = useMyAllYuzuParkExtList()
  const tvl = useMemo(()=>{
      let re = 0
      if(statics.totalVolume){
        re += statics.totalVolume
        //console.log("statics is  ", statics.totalVolume.toFixed(3))
      }
      if(extStatics.totalVolume){
        re += extStatics.totalVolume
        //console.log("extStatics is  ", extStatics.totalVolume.toFixed(3))
      }
      return re.toFixed(3)
  },[statics, extStatics]
  )

  console.log("poolExtList is  ",poolExtList)
  const { t } = useTranslation();


  return (
    <>
      <div id="page-homepage">
        <Sloganer/>
      </div>
      <div id="page-boardroom">
        {maintainFlag ? 
        <h1 className="s-banner-coming">YuzuSwap is updating the smart contract, the update will be done in a couple of hours.</h1>
        :
          <><div className="s-banner-button s-banner-button-boardroom">{t('CurrentLiquidityPledge')} ${ transToThousandth(tvl)}</div>
          <Boardrooms  rooms={poolList} statics={statics} extrooms={poolExtList} extstatics={extStatics} /></>
        }
      </div>
    </>
  )
}
