import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { useTranslation } from 'react-i18next'

export default function Liquidity1stAdd(){
  const { t } = useTranslation()
  return (
    <div className="s-liquidity-1stadd">
      <h2>{t('firstLiquidity')}</h2>
      <p>{t('firstLiquidityTips')}</p>
    </div>
  )
}

