import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'


import binance from '../../assets/newUI/Binance.png'
import bitkeep from '../../assets/newUI/BitKeep.png'
import coinGecko from '../../assets/newUI/CoinGecko.png'
import coinMarketCap from '../../assets/newUI/CoinMarketCap.png'
import huoBiEC from '../../assets/newUI/HuoBiEC.png'
import huoBiWallet from '../../assets/newUI/HuoBiWallet.png'
import metaMask from '../../assets/newUI/MetaMask.png'
import tokenPocket from '../../assets/newUI/TokenPocket.png'
import { useTranslation } from 'react-i18next'

export default function Partners(props: any){
  const { t } = useTranslation();
  /*todo 参数传入*/
  return (
    <div className="s-parters">
      <h2>{t('partnerName')}</h2>
      <img src={ coinMarketCap } />
      <img src={ coinGecko } />
      <img src={ huoBiEC } />
      <img src={ binance } />
      <img src={ metaMask } />
      <img src={ tokenPocket } />
      <img src={ huoBiWallet } />
      <img src={ bitkeep } />
    </div>
  )
}

