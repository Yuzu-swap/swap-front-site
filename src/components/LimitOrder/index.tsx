import { Currency, Fraction, JSBI, Pair, Percent, Trade } from '@liuxingfeiyu/zoo-sdk'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'
import LORefreshPng from '../../assets/newUI/limitOrderRefresh.png'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'

const OLUnit = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const OLUnitUp = styled.div`
    background: #1F2125;
    color: #6C7284;
    font-size: 28px
    padding: 10px 20px 10px 20px;
`

const OLUnitDown = styled.div`
    background: RGBA(32, 36, 42, 0.4);
    color: #FFFFFF;
    font-size: 28px
    padding: 10px 30px 10px 30px;
`

export function SingleOrder({data}:{data?: any} ){
    return(
        <>
        <div className='s-limitorder-card'>
            <OLUnit>
                <OLUnitUp>
                    Created
                </OLUnitUp>
                <OLUnitDown>
                    456
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Symbol
                </OLUnitUp>
                <OLUnitDown>
                    456
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Input
                </OLUnitUp>
                <OLUnitDown>
                    456
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Price
                </OLUnitUp>
                <OLUnitDown>
                    456
                </OLUnitDown>
            </OLUnit>
            <OLUnit>
                <OLUnitUp>
                    Total
                </OLUnitUp>
                <OLUnitDown>
                    456
                </OLUnitDown>
            </OLUnit>
        </div>
        </>
    )
}