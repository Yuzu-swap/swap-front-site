import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@liuxingfeiyu/zoo-sdk'
import { DefaultChainId } from '../constants'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  let nativeToken = Currency.getNativeCurrency(chainId)
  return chainId && currency === nativeToken ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  let nativeToken = Currency.getNativeCurrency(DefaultChainId)
  if (token.equals(WETH[token.chainId])) return nativeToken
  return token
}
