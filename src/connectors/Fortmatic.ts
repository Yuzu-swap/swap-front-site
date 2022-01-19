import { ChainId } from '@liuxingfeiyu/zoo-sdk'
import { FortmaticConnector as FortmaticConnectorCore } from '@web3-react/fortmatic-connector'

export const OVERLAY_READY = 'OVERLAY_READY'

type FormaticSupportedChains = Extract<ChainId, ChainId.MAINNET | ChainId.ROPSTEN | ChainId.RINKEBY | ChainId.KOVAN |ChainId.OKCHAIN_TEST | ChainId.OKCHAIN|ChainId.OASISETH_TEST|ChainId.OASISETH_MAIN >

const CHAIN_ID_NETWORK_ARGUMENT: { readonly [chainId in FormaticSupportedChains]: string | undefined } = {
  [ChainId.MAINNET]: undefined,
  [ChainId.ROPSTEN]: 'ropsten',
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.KOVAN]: 'kovan',
  [ChainId.OKCHAIN_TEST]: 'OKExChain Testnet',
  [ChainId.OKCHAIN]: 'OKChain',
  [ChainId.OASISETH_TEST]: 'Oasis test',
  [ChainId.OASISETH_MAIN]: 'Emerald mainnet',
}

export class FortmaticConnector extends FortmaticConnectorCore {
  async activate() {
    if (!this.fortmatic) {
      const { default: Fortmatic } = await import('fortmatic')

      const { apiKey, chainId } = this as any
      if (chainId in CHAIN_ID_NETWORK_ARGUMENT) {
        this.fortmatic = new Fortmatic(apiKey, CHAIN_ID_NETWORK_ARGUMENT[chainId as FormaticSupportedChains])
      } else {
        throw new Error(`Unsupported network ID: ${chainId}`)
      }
    }

    const provider = this.fortmatic.getProvider()

    const pollForOverlayReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if (provider.overlayReady) {
          clearInterval(interval)
          this.emit(OVERLAY_READY)
          resolve()
        }
      }, 200)
    })

    const [account] = await Promise.all([
      provider.enable().then((accounts: string[]) => accounts[0]),
      pollForOverlayReady
    ])

    return { provider: this.fortmatic.getProvider(), chainId: (this as any).chainId, account }
  }
}
