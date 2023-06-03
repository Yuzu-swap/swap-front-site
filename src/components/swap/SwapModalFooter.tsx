import { Fraction, Trade, TradeType } from '@liuxingfeiyu/zoo-sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  isLimitOrder = false,
  limitOutput = undefined
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  isLimitOrder ?: boolean
  limitOutput ?: Fraction | undefined
}) {
  const { chainId } = useActiveWeb3React()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)
  const { t } = useTranslation();

  const limitPrice : string = useMemo(
    ()=>{
      if(limitOutput){
        if(!showInverted){
          return limitOutput.divide(trade.inputAmount).toSignificant(6)
        }else{
          return trade.inputAmount.divide(limitOutput).toSignificant(6)
        }
      }
      return ''
    }
    ,[showInverted]
  )

  const limitOrderFee : string = useMemo(
    ()=>{
      if(limitOutput){
        return trade.inputAmount.multiply(new Fraction( '2' , '1000')).toSignificant(6)
      }
      return ''
    }
    ,[isLimitOrder]
  )

  return (
    <div style={{background:'#2C3035'}}>
      <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
        <AutoRow>
          <ButtonError
            onClick={onConfirm}
            disabled={disabledConfirm}
            error={ !isLimitOrder && severity > 2}
            style={{ margin: '10px 0 0 0' }}
            id="confirm-swap-or-send"
          >
            <Text fontSize={20} fontWeight={500}>
              {
               isLimitOrder? 'Create Order ':
              severity > 2 ? 'Swap Anyway' : 'Confirm Swap'
              }
            </Text>
          </ButtonError>

          {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </AutoRow>
      </div>
      <div style={{ padding: '10px 20px 20px 20px'}}>
        <AutoColumn gap="0px">
          <RowBetween align="center">
            <Text fontWeight={400} fontSize={14} color={theme.text2}>
              Price
            </Text>
            <Text
              fontWeight={500}
              fontSize={14}
              color={'rgba(255, 255, 255, 0.6)'}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                textAlign: 'right',
                paddingLeft: '10px'
              }}
            >
              { isLimitOrder? limitPrice : formatExecutionPrice(trade, showInverted, chainId)}
              <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                <Repeat size={14} />
              </StyledBalanceMaxMini>
            </Text>
          </RowBetween>
          {
            isLimitOrder? null:
            (
              <>
                <RowBetween>
                  <RowFixed>
                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                      {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
                    </TYPE.black>
                    <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14} color={'#FFF'}>
                      {trade.tradeType === TradeType.EXACT_INPUT
                        ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                        : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
                    </TYPE.black>
                    <TYPE.black fontSize={14} marginLeft={'4px'} color={'#FFF'}>
                      {trade.tradeType === TradeType.EXACT_INPUT
                        ? trade.outputAmount.currency.getSymbol(chainId)
                        : trade.inputAmount.currency.getSymbol(chainId)}
                    </TYPE.black>
                  </RowFixed>
                </RowBetween>
                <RowBetween>
                  <RowFixed>
                    <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
                      Price Impact
                    </TYPE.black>
                    <QuestionHelper text="The difference between the market price and your price due to trade size." />
                  </RowFixed>
                  <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>
              </>
            )
          }
          {
            isLimitOrder?
            <RowBetween>
              <RowFixed>
                <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                  LimitOrder Fee
                </TYPE.black>
                <QuestionHelper text={t('handingTip')} />
              </RowFixed>
              <TYPE.black fontSize={14} color={'#FFF'}>
                {limitOrderFee + ' ' + trade.inputAmount.currency.getSymbol(chainId)}
              </TYPE.black>
            </RowBetween>
            :
            <RowBetween>
              <RowFixed>
                <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                  Liquidity Provider Fee
                </TYPE.black>
                <QuestionHelper text={t('handingTip')} />
              </RowFixed>
              <TYPE.black fontSize={14} color={'#FFF'}>
                {realizedLPFee
                  ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.getSymbol(chainId)
                  : '-'}
              </TYPE.black>
            </RowBetween>
          }
          
        </AutoColumn>
      </div>
    </div>
  )
}
