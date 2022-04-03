import { Currency, Percent, Price } from '@liuxingfeiyu/zoo-sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.white>{price?.toSignificant(6) ?? '-'}</TYPE.white>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_B]?.getSymbol(chainId)} per {currencies[Field.CURRENCY_A]?.getSymbol(chainId)}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.white>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.white>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_A]?.getSymbol(chainId)} per {currencies[Field.CURRENCY_B]?.getSymbol(chainId)}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.white>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TYPE.white>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
