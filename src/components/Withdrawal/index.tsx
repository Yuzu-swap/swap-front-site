import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import QuestionHelper from '../QuestionHelper'
import { Box } from 'rebass/styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'

export default function WithdrawalItem(props: any) {
  return (
    <div className="s-withdrawal-item">
      <div className="s-withdrawal-item-marks">
        <img src={EthereumLogo} alt="" className="s-withdrawal-item-mark s-withdrawal-item-icon" />
        <span className="s-withdrawal-item-mark">ZOO</span>
      </div>
      <a>0x25d2…0330(View on HECO).</a>
    </div>
  )
}