import React from 'react'
import SingleCurrenies from '../../components/SingleCurrencies'
import Sloganer from '../../components/Sloganer'
import Mock from 'mock/mock'
import { useMyAllStakePoolList } from 'data/ZooPark'
import { useTranslation } from 'react-i18next'
import {StakePool} from '@liuxingfeiyu/zoo-sdk'

export default function SingleCurrency() {
  // const [poolList] = useMyAllStakePoolList()
  const { t } = useTranslation();
  let poolList = [1,2];
  return (
    <>
      <Sloganer/>
      <div id="page-singlecurrency">
        <SingleCurrenies  rooms={poolList} />
      </div>
    </>
  )
}
