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
import { useMyAllStakePoolList } from 'data/ZooPark'
import { useTranslation } from 'react-i18next'

export default function BoradRoom() {
  const [poolList,statics] = useMyAllStakePoolList()
  const { t } = useTranslation();


  return (
    <>
      <Sloganer/>
      <div id="page-boardroom">
        <div className="s-banner-button s-banner-button-boardroom">{t('CurrentLiquidityPledge')} ${ statics.totalVolume?statics.totalVolume.toFixed(3):null}</div>
        <Boardrooms  rooms={poolList} statics={statics} />
      </div>
    </>
  )
}
