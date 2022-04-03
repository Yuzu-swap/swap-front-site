import { Currency, CurrencyAmount, Fraction, Percent } from '@liuxingfeiyu/zoo-sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { chainId } = useActiveWeb3React()
  return (
    <div style={{background:'#2C3035', borderTop:'1px solid rgba(255, 255, 255, 0.2)', padding: ' 20px'}}>
      <RowBetween>
        <TYPE.darkWhite>{currencies[Field.CURRENCY_A]?.getSymbol(chainId)} Deposited</TYPE.darkWhite>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TYPE.white>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.white>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.darkWhite>{currencies[Field.CURRENCY_B]?.getSymbol(chainId)} Deposited</TYPE.darkWhite>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TYPE.white>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.white>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.darkWhite>Rates</TYPE.darkWhite>
        <TYPE.white>
          {`1 ${currencies[Field.CURRENCY_A]?.getSymbol(chainId)} = ${price?.toSignificant(4)} ${currencies[
            Field.CURRENCY_B
          ]?.getSymbol(chainId)}`}
        </TYPE.white>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TYPE.white>
          {`1 ${currencies[Field.CURRENCY_B]?.getSymbol(chainId)} = ${price?.invert().toSignificant(4)} ${currencies[
            Field.CURRENCY_A
          ]?.getSymbol(chainId)}`}
        </TYPE.white>
      </RowBetween>
      <RowBetween>
        <TYPE.darkWhite>Share of Pool:</TYPE.darkWhite>
        <TYPE.white>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.white>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
        </Text>
      </ButtonPrimary>
    </div>
  )
}
