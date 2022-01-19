import { Currency, ETHER, Token, ChainId } from '@liuxingfeiyu/zoo-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import BinanceCoinLogo from '../../assets/images/binance-coin-logo.png'
import FantomLogo from '../../assets/images/fantom-logo.png'
import MaticLogo from '../../assets/images/matic-logo.png'
import xDaiLogo from '../../assets/images/xdai-logo.png'
import MoonbeamLogo from '../../assets/images/moonbeam-logo.png'
import AvalancheLogo from '../../assets/images/avalanche-logo.png'
import HecoLogo from '../../assets/images/heco-logo.png'
import OKTLogo from '../../assets/images/okt.png'
import ROPSTENETHlogo from '../../assets/tokenlogo/0xf72C1522a1d430464f194295bC3EF0f2F479459D/logo.png'
import OasisRoseToken from '../../assets/tokenlogo/0x1f31fd0aD229937cF4b188ab6899D8d8Bd27579B/logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { useActiveWeb3React } from '../../hooks'
import YUZULogo from '../../assets/tokenlogo/0x1fb9F58AFe55b0c5AEF738c60594A54B38E31Dfc/logo.png'

const getTokenLogoURL = (address: string) =>
  `./${address}/logo.png`

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

const logo: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBASE]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.FUJI]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.OKCHAIN]: OKTLogo,
  [ChainId.OKCHAIN_TEST]: OKTLogo,
  [ChainId.ROPSTEN]: ROPSTENETHlogo,
  [ChainId.OASISETH_TEST]: OasisRoseToken,
  [ChainId.OASISETH_MAIN]: OasisRoseToken,
}

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [getTokenLogoURL(currency.address), ...uriLocations]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  let nativeToken = Currency.getNativeCurrency(chainId)
  if (currency === nativeToken && chainId) {
    return <StyledNativeCurrencyLogo src={logo[chainId]} size={size} style={style} />
  }
  if(currency?.symbol === "YUZU"){
    return <StyledNativeCurrencyLogo size={size} src={YUZULogo} style={style}/>
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
