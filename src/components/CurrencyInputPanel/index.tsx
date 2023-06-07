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
import { tryParseAmount } from 'state/swap/hooks'
import fixFloat from 'utils/fixFloat'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  background: #F5F5F5;
  border-radius: 8px;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background: ${({ selected, theme }) => (selected ? theme.bg7 : 'linear-gradient(177deg, #ED4962 0%, #F98F81 100%)')};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0rem 0 0rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: #F5F5F5;
  z-index: 1;
`

const Container = styled.div<{
  hideInput: boolean
  cornerRadiusTopNone?: boolean
  cornerRadiusBottomNone?: boolean
  containerBackground?: string
}>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '6px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 6px 6px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '6px 6px 0 0'};
  background-color: ${({ theme }) => theme.bg1};
  background-color: ${({ containerBackground }) => containerBackground};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  font-size: 0.8rem;

  width: 44px;
  height: 24px;
  background:  ${({ theme }) => theme.bg7};
  border-radius: 4px;
  border: 1px solid #ED4962;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
  containerBackground?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  cornerRadiusBottomNone,
  cornerRadiusTopNone,
  containerBackground
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container
        hideInput={hideInput}
        cornerRadiusBottomNone={cornerRadiusBottomNone}
        cornerRadiusTopNone={cornerRadiusTopNone}
        containerBackground={containerBackground}
      >
        {!hideInput && (
          <LabelRow style={{marginBottom:'12px'}}>
            <RowBetween>
              <TYPE.body color= 'rgba(255, 255, 255, 0.6)' fontWeight={500} fontSize={16}>
                {label}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color='rgba(255, 255, 255, 0.6)'
                  fontWeight={500}
                  fontSize={16}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? <span>{(customBalanceText ?? 'Balance:')} &nbsp; <span style={{color:'#FFFFFF'}}> {selectedCurrencyBalance?.toSignificant(6)}</span></span>
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== t('to') && (
                <StyledBalanceMax onClick={onMax}>Max</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.getSymbol(chainId)) || t('selectToken') || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}


const LimitInputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.4rem 0.4rem 0.4rem 1rem' : '0.4rem 0.4rem 0.4rem 1rem')};
  background: #F5F5F5;
  border-radius: 8px;
  border: 0px solid transparent;
`



interface CurrencyInputPanelWithPriceProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  priceCurrency?: Currency | null
  onPriceInput?: (value: string) => void,
  ifBuy?: boolean | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  trade?: Trade | null
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
  containerBackground?: string
  isInput: boolean
}

export function CurrencyInputPanelWithPrice({
  value,
  onUserInput,
  onPriceInput,
  onMax,
  
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  ifBuy,
  priceCurrency,
  trade,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  isInput,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  cornerRadiusBottomNone,
  cornerRadiusTopNone,
  containerBackground
}: CurrencyInputPanelWithPriceProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const [price, SetPrice] = useState<string>('')

  const [slippage, _] = useUserSlippageTolerance()

  const realPrice : string = useMemo(
    ()=>{
      if(trade){
        if(ifBuy){
          return new Fraction(JSBI.BigInt(1),JSBI.BigInt(1)).divide(trade.executionPrice.raw).toSignificant(6)
        }
        else{
          return  trade.executionPrice.toSignificant(6)
        }
        //let out = trade.minimumAmountOut(new Percent( JSBI.BigInt(slippage), BIPS_BASE))
      }

      return ''
    },[trade, slippage, ifBuy]
  )

  useEffect(
    ()=>{
      SetPrice(realPrice)
      onPriceInput&&onPriceInput(realPrice)
    },[ifBuy]
  )

  const aboveInfo : string = useMemo(
    ()=>{
      if(!isInput){
        let test = 0
      }
      let outputAmount = tryParseAmount(value, trade?.outputAmount.currency)
      if(!isInput && outputAmount && trade){
        if(outputAmount.greaterThan(trade.executionPrice)){
          const outputFraction : Fraction = new Fraction(outputAmount.numerator, outputAmount.denominator)
          const bigger =  ((outputFraction).subtract(trade.executionPrice as Fraction)).divide(trade.executionPrice as Fraction).toFixed(4)
          const floatNum = fixFloat(parseFloat(bigger) * 100, 2);
          if(parseFloat(bigger) != 0){
            return "+" + floatNum + '% above market'
          }
        }
        
      }
      return ''
    },
    [value, trade, isInput]
  )

  

  //const [price, SetPirce]

  return (
    <InputPanel id={id}>
      <Container
        hideInput={hideInput}
        cornerRadiusBottomNone={cornerRadiusBottomNone}
        cornerRadiusTopNone={cornerRadiusTopNone}
        containerBackground={containerBackground}
      >
        {!hideInput && (
          <LabelRow style={{marginBottom:'12px'}}>
            <RowBetween>
              <TYPE.body color= 'rgba(255, 255, 255, 0.6)' fontWeight={500} fontSize={16}>
                {label}
                <TYPE.body color= '#87F8A5' fontWeight={500} fontSize={14}>
                 {aboveInfo}
                </TYPE.body>
              </TYPE.body>
              
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color='rgba(255, 255, 255, 0.6)'
                  fontWeight={500}
                  fontSize={16}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? <span>{(customBalanceText ?? 'Balance:')} <span style={{color:'#FFFFFF'}}> {selectedCurrencyBalance?.toSignificant(6)}</span></span>
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <LimitInputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== t('to') && (
                <StyledBalanceMax onClick={onMax}>Max</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.getSymbol(chainId)) || t('selectToken') || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </LimitInputRow>
        {
          isInput &&(
            <LimitInputRow style={isInput ? { padding: '0', borderBottomLeftRadius: '10px', borderTopLeftRadius:'10px', marginTop: '10px', justifyContent:'space-between' } : {}} selected={false}>
              <div className='s-limitorder-fresh-price'
                onClick={
                  ()=>{
                    SetPrice(realPrice)
                    onPriceInput&&onPriceInput(realPrice)
                  }
                }
              >
                {"price"}&nbsp;
                <img className='s-limitorder-fresh-button' src={LORefreshPng}/>
              </div>
              <NumericalInput
                style={{ display: 'inline', width: '100%', textAlign: 'right'  }}
                value={price}
                onUserInput={val => {
                  onPriceInput&&onPriceInput(val)
                  SetPrice(val)
                }}
              />
              {/* <TYPE.body
                  color='#171717'
                  fontWeight={500}
                  fontSize={20}
                  style={{ display: 'inline', width: '100%', textAlign: 'right'  }}
                >
                  { realPrice}
              </TYPE.body> */}
              <TYPE.body
                  color='#171717'
                  fontWeight={500}
                  fontSize={20}
                  style={{ display: 'inline', marginRight: '10px', marginLeft:' 10px', width: 'fit-content', minWidth: 'unset'  }}
                >
                { ifBuy?
                  currency?.getSymbol()
                  :
                  priceCurrency && priceCurrency.getSymbol()}
              </TYPE.body>
            </LimitInputRow>
          )  
        }
       

      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
