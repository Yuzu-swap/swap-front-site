import { Currency, ETHER, Token } from '@liuxingfeiyu/zoo-sdk'
import { DefaultChainId } from '../constants'

export function currencyId(currency: Currency): string {

  let nativeToken = Currency.getNativeCurrency(DefaultChainId)

  if (currency === nativeToken) return nativeToken.getSymbol(DefaultChainId)??""
  if (currency === ETHER) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
